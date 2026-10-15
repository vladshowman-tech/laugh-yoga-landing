import json
import os
import threading
import urllib.request

import psycopg2
from datetime import datetime, timedelta, timezone

HEADERS = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

TAB_WAIT = 'Лист ожидания'


def reply(code, body):
    return {'statusCode': code, 'headers': HEADERS, 'body': json.dumps(body, ensure_ascii=False)}


def digits_of(value):
    return ''.join(ch for ch in str(value) if ch.isdigit())


def push_sheet(tab, key, event_label, name, phone, email, status):
    url = os.environ.get('GOOGLE_SHEETS_WEBHOOK_URL')
    if not url:
        raise RuntimeError('GOOGLE_SHEETS_WEBHOOK_URL is not set')
    payload = json.dumps({
        'tab': tab,
        'id': key,
        'date': datetime.now(timezone(timedelta(hours=5))).strftime('%d.%m.%Y %H:%M'),
        'name': name,
        'phone': phone,
        'email': email,
        'event': event_label,
        'status': status,
    }, ensure_ascii=False).encode()
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req, timeout=4)


def push_telegram(text):
    token = os.environ['TELEGRAM_BOT_TOKEN']
    payload = json.dumps({'chat_id': os.environ['TELEGRAM_CHAT_ID'], 'text': text}).encode()
    req = urllib.request.Request(
        f'https://api.telegram.org/bot{token}/sendMessage',
        data=payload,
        headers={'Content-Type': 'application/json'},
    )
    urllib.request.urlopen(req, timeout=4)


def notify(jobs):
    def run(fn):
        try:
            fn()
        except Exception as e:
            print(f'notify failed: {e}')

    threads = [threading.Thread(target=run, args=(fn,)) for fn in jobs]
    for t in threads:
        t.start()
    for t in threads:
        t.join()


def handler(event: dict, context) -> dict:
    """Принимает запись на занятие (перед оплатой) или заявку в лист ожидания, сохраняет в базу, Telegram и Google-таблицу."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    if event.get('httpMethod') != 'POST':
        return reply(405, {'error': 'Method not allowed'})

    data = json.loads(event.get('body') or '{}')
    name = str(data.get('name', '')).strip()[:100]
    phone = str(data.get('phone', '')).strip()[:30]
    email = str(data.get('email', '')).strip()[:200]

    if len(name) < 2 or len(digits_of(phone)) < 10:
        return reply(400, {'error': 'Invalid data'})
    if email and ('@' not in email or '.' not in email.split('@')[-1]):
        return reply(400, {'error': 'Invalid email'})

    try:
        event_id = int(data.get('event_id') or 0)
    except (TypeError, ValueError):
        event_id = 0
    if not event_id:
        return reply(400, {'error': 'Invalid data'})

    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor()

    cur.execute(
        f'SELECT event_date, time_start, place, title, address, capacity FROM {schema}.events WHERE id = {event_id}'
    )
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return reply(404, {'error': 'not_found'})

    label = f"{row[0].strftime('%d.%m.%Y')} {row[1].strftime('%H:%M')} · " + ', '.join(
        p for p in [row[3], row[2], row[4]] if p
    )
    capacity = row[5]

    cur.execute(
        f"SELECT COUNT(*) FROM {schema}.bookings WHERE event_id = {event_id} AND status <> 'cancelled'"
    )
    taken = cur.fetchone()[0]
    is_full = bool(capacity) and taken >= capacity

    if data.get('waitlist'):
        if not is_full:
            cur.close()
            conn.close()
            return reply(409, {'error': 'not_full'})

        cur.execute(f'SELECT id, phone FROM {schema}.waitlist WHERE event_id = {event_id}')
        for _, existing in cur.fetchall():
            if digits_of(existing) == digits_of(phone):
                cur.close()
                conn.close()
                return reply(200, {'ok': True, 'duplicate': True})

        cur.execute(
            f'INSERT INTO {schema}.waitlist (event_id, name, phone, email) VALUES (%s, %s, %s, %s) RETURNING id',
            (event_id, name, phone, email),
        )
        wid = cur.fetchone()[0]
        cur.execute(f'SELECT COUNT(*) FROM {schema}.waitlist WHERE event_id = {event_id}')
        position = cur.fetchone()[0]
        cur.close()
        conn.close()

        text = (
            f'Лист ожидания\n\nИмя: {name}\nТелефон: {phone}\nE-mail: {email or "—"}\n'
            f'Занятие: {label}\nВ листе ожидания: {position}'
        )
        notify([
            lambda: push_sheet(TAB_WAIT, f'w{wid}', label, name, phone, email, 'В листе ожидания'),
            lambda: push_telegram(text),
        ])
        return reply(200, {'ok': True, 'position': position})

    if is_full:
        cur.close()
        conn.close()
        return reply(409, {'error': 'sold_out'})

    cur.execute(
        f"SELECT phone FROM {schema}.bookings WHERE event_id = {event_id} AND status <> 'cancelled'"
    )
    for (existing,) in cur.fetchall():
        if digits_of(existing) == digits_of(phone):
            cur.close()
            conn.close()
            return reply(200, {'ok': True, 'duplicate': True})

    cur.execute(
        f"INSERT INTO {schema}.bookings (name, phone, email, slot, event_id, event_label) "
        f"SELECT %s, %s, %s, '', %s, %s "
        f"WHERE (SELECT capacity FROM {schema}.events WHERE id = {event_id}) IS NULL "
        f"OR (SELECT COUNT(*) FROM {schema}.bookings WHERE event_id = {event_id} AND status <> 'cancelled') "
        f"< (SELECT capacity FROM {schema}.events WHERE id = {event_id}) "
        f"RETURNING id",
        (name, phone, email, event_id, label),
    )
    created = cur.fetchone()
    cur.close()
    conn.close()
    if not created:
        return reply(409, {'error': 'sold_out'})

    text = f'Новая запись, ждём оплату\n\nИмя: {name}\nТелефон: {phone}\nE-mail: {email or "—"}\nЗанятие: {label}'
    notify([lambda: push_telegram(text)])
    return reply(200, {'ok': True})
