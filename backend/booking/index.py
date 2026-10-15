import json
import os
import urllib.request

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

    text = f'Новая заявка на занятие\n\nИмя: {name}\nТелефон: {phone}\nУдобное время: {slot}'

    token = os.environ['TELEGRAM_BOT_TOKEN']
    payload = json.dumps({'chat_id': os.environ['TELEGRAM_CHAT_ID'], 'text': text}).encode()
    req = urllib.request.Request(
        f'https://api.telegram.org/bot{token}/sendMessage',
        data=payload,
        headers={'Content-Type': 'application/json'},
    )
    urllib.request.urlopen(req, timeout=4)

    return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'ok': True})}
