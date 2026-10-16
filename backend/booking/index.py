import json
import os
import threading
import urllib.request

import psycopg2
from datetime import datetime, timedelta, timezone

SLOTS = {
    'weekday-morning': 'Будни, утро',
    'weekday-evening': 'Будни, вечер',
    'weekend': 'Выходные',
    'other': 'Другое время — связаться с клиентом',
    '': 'Любое время',
}

HEADERS = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}


def reply(code, body):
    return {'statusCode': code, 'headers': HEADERS, 'body': json.dumps(body, ensure_ascii=False)}


def add_to_waitlist(schema, data, name, phone):
    try:
        event_id = int(data.get('event_id') or 0)
    except (TypeError, ValueError):
        event_id = 0
    if not event_id:
        return reply(400, {'error': 'Invalid data'})

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute(
        f'SELECT event_date, time_start, place, title, capacity FROM {schema}.events WHERE id = {event_id}'
    )
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return reply(404, {'error': 'not_found'})

    capacity = row[4]
    cur.execute(
        f"SELECT COUNT(*) FROM {schema}.bookings WHERE event_id = {event_id} AND status <> 'cancelled'"
    )
    taken = cur.fetchone()[0]
    if not capacity or taken < capacity:
        cur.close()
        conn.close()
        return reply(409, {'error': 'not_full'})

    digits = ''.join(ch for ch in phone if ch.isdigit())
    cur.execute(f'SELECT phone FROM {schema}.waitlist WHERE event_id = {event_id}')
    for (existing,) in cur.fetchall():
        if ''.join(ch for ch in existing if ch.isdigit()) == digits:
            cur.close()
            conn.close()
            return reply(200, {'ok': True, 'duplicate': True})

    cur.execute(
        f'INSERT INTO {schema}.waitlist (event_id, name, phone) VALUES (%s, %s, %s)',
        (event_id, name, phone),
    )
    cur.execute(f'SELECT COUNT(*) FROM {schema}.waitlist WHERE event_id = {event_id}')
    position = cur.fetchone()[0]
    cur.close()
    conn.close()

    label = f"{row[0].strftime('%d.%m.%Y')} {row[1].strftime('%H:%M')} · " + ', '.join(p for p in [row[3], row[2]] if p)
    try:
        token = os.environ['TELEGRAM_BOT_TOKEN']
        text = f'Лист ожидания\n\nИмя: {name}\nТелефон: {phone}\nЗанятие: {label}\nВ листе ожидания: {position}'
        payload = json.dumps({'chat_id': os.environ['TELEGRAM_CHAT_ID'], 'text': text}).encode()
        req = urllib.request.Request(
            f'https://api.telegram.org/bot{token}/sendMessage',
            data=payload,
            headers={'Content-Type': 'application/json'},
        )
        urllib.request.urlopen(req, timeout=4)
    except Exception as e:
        print(f'waitlist telegram failed: {e}')

    return reply(200, {'ok': True, 'position': position})


def handler(event: dict, context) -> dict:
    """Принимает заявку с формы записи и отправляет её в Telegram владельцу."""
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
        return {'statusCode': 405, 'headers': HEADERS, 'body': json.dumps({'error': 'Method not allowed'})}

    data = json.loads(event.get('body') or '{}')
    name = str(data.get('name', '')).strip()[:100]
    phone = str(data.get('phone', '')).strip()[:30]
    slot = SLOTS.get(str(data.get('slot', '')), 'Любое время')

    if len(name) < 2 or len(phone) < 10:
        return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Invalid data'})}

    results = {}
    schema = os.environ['MAIN_DB_SCHEMA']

    if data.get('waitlist'):
        return add_to_waitlist(schema, data, name, phone)

    event_id = None
    event_label = ''
    try:
        raw_event_id = int(data.get('event_id') or 0)
    except (TypeError, ValueError):
        raw_event_id = 0
    if raw_event_id:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute(
            f'SELECT event_date, time_start, place, title, address, capacity FROM {schema}.events WHERE id = {raw_event_id}'
        )
        row = cur.fetchone()
        if row and row[5]:
            cur.execute(
                f"SELECT COUNT(*) FROM {schema}.bookings WHERE event_id = {raw_event_id} AND status <> 'cancelled'"
            )
            taken = cur.fetchone()[0]
            if taken >= row[5]:
                cur.close()
                conn.close()
                return {
                    'statusCode': 409,
                    'headers': HEADERS,
                    'body': json.dumps({'error': 'sold_out'}),
                }
        cur.close()
        conn.close()
        if row:
            event_id = raw_event_id
            parts = [row[3], row[2], row[4]]
            event_label = f"{row[0].strftime('%d.%m.%Y')} {row[1].strftime('%H:%M')} · " + ', '.join(p for p in parts if p)

    if event_label:
        slot = event_label

    def save_db():
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(
            f'INSERT INTO {schema}.bookings (name, phone, slot, event_id, event_label) VALUES (%s, %s, %s, %s, %s)',
            (name, phone, slot, event_id, event_label),
        )
        cur.close()
        conn.close()

    def send_telegram():
        when = f'Занятие: {event_label}' if event_label else f'Удобное время: {slot}'
        text = f'Новая заявка на занятие\n\nИмя: {name}\nТелефон: {phone}\n{when}'
        token = os.environ['TELEGRAM_BOT_TOKEN']
        payload = json.dumps({'chat_id': os.environ['TELEGRAM_CHAT_ID'], 'text': text}).encode()
        req = urllib.request.Request(
            f'https://api.telegram.org/bot{token}/sendMessage',
            data=payload,
            headers={'Content-Type': 'application/json'},
        )
        urllib.request.urlopen(req, timeout=4)

    def send_sheet():
        payload = json.dumps({
            'date': datetime.now(timezone(timedelta(hours=5))).strftime('%d.%m.%Y %H:%M'),
            'name': name,
            'phone': phone,
            'slot': slot,
        }).encode()
        req = urllib.request.Request(
            os.environ['GOOGLE_SHEETS_WEBHOOK_URL'],
            data=payload,
            headers={'Content-Type': 'application/json'},
        )
        urllib.request.urlopen(req, timeout=4)

    def run(key, fn):
        try:
            fn()
            results[key] = True
        except Exception as e:
            print(f'{key} failed: {e}')
            results[key] = False

    threads = [
        threading.Thread(target=run, args=('db', save_db)),
        threading.Thread(target=run, args=('telegram', send_telegram)),
        threading.Thread(target=run, args=('sheet', send_sheet)),
    ]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    if not any(results.values()):
        return {'statusCode': 502, 'headers': HEADERS, 'body': json.dumps({'error': 'Send failed'})}

    return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'ok': True, **results})}