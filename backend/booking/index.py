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
    '': 'Любое время',
}

HEADERS = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}


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

    def save_db():
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {os.environ['MAIN_DB_SCHEMA']}.bookings (name, phone, slot) VALUES (%s, %s, %s)",
            (name, phone, slot),
        )
        cur.close()
        conn.close()

    def send_telegram():
        text = f'Новая заявка на занятие\n\nИмя: {name}\nТелефон: {phone}\nУдобное время: {slot}'
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