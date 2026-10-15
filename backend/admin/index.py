import base64
import hashlib
import hmac
import json
import os
import secrets

import boto3
import psycopg2
from psycopg2.extras import Json

HEADERS = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
SECTIONS = {'hero', 'what', 'how', 'benefits', 'coach', 'reviews', 'pricing', 'faq', 'schedule', 'contacts', 'footer'}
STATUSES = {'new', 'in_work', 'done', 'cancelled'}


def resp(code, body):
    return {'statusCode': code, 'headers': HEADERS, 'body': json.dumps(body, ensure_ascii=False, default=str)}


def hash_password(password, salt):
    return hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000).hex()


def make_hash(password):
    salt = secrets.token_hex(8)
    return f'pbkdf2${salt}${hash_password(password, salt)}'


def check_password(password, stored):
    try:
        _, salt, h = stored.split('$')
    except ValueError:
        return False
    return hmac.compare_digest(hash_password(password, salt), h)


def handler(event: dict, context) -> dict:
    """Админ-API: вход, правка разделов сайта, заявки, администраторы, загрузка фото."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    schema = os.environ['MAIN_DB_SCHEMA']
    body = json.loads(event.get('body') or '{}')
    qs = event.get('queryStringParameters') or {}
    action = body.get('action') or qs.get('action') or ''
    headers = {k.lower(): v for k, v in (event.get('headers') or {}).items()}
    token = headers.get('x-auth-token', '')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    conn.autocommit = True
    cur = conn.cursor()

    try:
        if action == 'login':
            username = str(body.get('username', '')).strip()
            password = str(body.get('password', ''))
            cur.execute(f'SELECT id, password_hash FROM {schema}.admins WHERE username = %s', (username,))
            row = cur.fetchone()
            if not row or not check_password(password, row[1]):
                return resp(401, {'error': 'Неверный логин или пароль'})
            new_token = secrets.token_hex(32)
            cur.execute(
                f"INSERT INTO {schema}.admin_sessions (token, admin_id, expires_at) VALUES (%s, %s, NOW() + INTERVAL '7 days')",
                (new_token, row[0]),
            )
            return resp(200, {'token': new_token, 'username': username})

        cur.execute(
            f'SELECT a.id, a.username FROM {schema}.admin_sessions s JOIN {schema}.admins a ON a.id = s.admin_id '
            f'WHERE s.token = %s AND s.expires_at > NOW()',
            (token,),
        )
        me = cur.fetchone()
        if not me:
            return resp(401, {'error': 'Нужно войти'})
        me_id, me_name = me

        if action == 'me':
            return resp(200, {'username': me_name})

        if action == 'logout':
            cur.execute(f'DELETE FROM {schema}.admin_sessions WHERE token = %s', (token,))
            return resp(200, {'ok': True})

        if action == 'get_content':
            cur.execute(f'SELECT key, value FROM {schema}.site_content')
            return resp(200, {k: v for k, v in cur.fetchall()})

        if action == 'save_content':
            key = body.get('key')
            if key not in SECTIONS or not isinstance(body.get('value'), dict):
                return resp(400, {'error': 'Некорректные данные'})
            cur.execute(
                f'INSERT INTO {schema}.site_content (key, value, updated_at) VALUES (%s, %s, NOW()) '
                f'ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()',
                (key, Json(body['value'])),
            )
            return resp(200, {'ok': True})

        if action == 'list_bookings':
            cur.execute(f'SELECT id, name, phone, slot, status, created_at FROM {schema}.bookings ORDER BY created_at DESC LIMIT 500')
            cols = ['id', 'name', 'phone', 'slot', 'status', 'created_at']
            return resp(200, {'items': [dict(zip(cols, r)) for r in cur.fetchall()]})

        if action == 'set_booking_status':
            status = body.get('status')
            if status not in STATUSES:
                return resp(400, {'error': 'Некорректный статус'})
            cur.execute(f'UPDATE {schema}.bookings SET status = %s WHERE id = %s', (status, int(body.get('id', 0))))
            return resp(200, {'ok': True})

        if action == 'delete_booking':
            cur.execute(f'DELETE FROM {schema}.bookings WHERE id = %s', (int(body.get('id', 0)),))
            return resp(200, {'ok': True})

        if action == 'list_admins':
            cur.execute(f'SELECT id, username, created_at FROM {schema}.admins ORDER BY id')
            return resp(200, {'items': [{'id': r[0], 'username': r[1], 'created_at': r[2], 'me': r[0] == me_id} for r in cur.fetchall()]})

        if action == 'add_admin':
            username = str(body.get('username', '')).strip()
            password = str(body.get('password', ''))
            if len(username) < 3 or len(password) < 6:
                return resp(400, {'error': 'Логин от 3 символов, пароль от 6'})
            cur.execute(f'SELECT 1 FROM {schema}.admins WHERE username = %s', (username,))
            if cur.fetchone():
                return resp(400, {'error': 'Такой логин уже есть'})
            cur.execute(f'INSERT INTO {schema}.admins (username, password_hash) VALUES (%s, %s)', (username, make_hash(password)))
            return resp(200, {'ok': True})

        if action == 'delete_admin':
            admin_id = int(body.get('id', 0))
            if admin_id == me_id:
                return resp(400, {'error': 'Нельзя удалить самого себя'})
            cur.execute(f'DELETE FROM {schema}.admin_sessions WHERE admin_id = %s', (admin_id,))
            cur.execute(f'DELETE FROM {schema}.admins WHERE id = %s', (admin_id,))
            return resp(200, {'ok': True})

        if action == 'change_password':
            old = str(body.get('old_password', ''))
            new = str(body.get('new_password', ''))
            if len(new) < 6:
                return resp(400, {'error': 'Пароль от 6 символов'})
            cur.execute(f'SELECT password_hash FROM {schema}.admins WHERE id = %s', (me_id,))
            if not check_password(old, cur.fetchone()[0]):
                return resp(400, {'error': 'Старый пароль неверный'})
            cur.execute(f'UPDATE {schema}.admins SET password_hash = %s WHERE id = %s', (make_hash(new), me_id))
            return resp(200, {'ok': True})

        if action == 'upload_image':
            data_url = str(body.get('data', ''))
            if ',' in data_url:
                data_url = data_url.split(',', 1)[1]
            raw = base64.b64decode(data_url)
            if len(raw) > 4 * 1024 * 1024:
                return resp(400, {'error': 'Файл больше 4 МБ'})
            content_type = body.get('content_type', 'image/jpeg')
            ext = {'image/png': 'png', 'image/webp': 'webp'}.get(content_type, 'jpg')
            key = f'site/{secrets.token_hex(8)}.{ext}'
            s3 = boto3.client(
                's3',
                endpoint_url='https://bucket.poehali.dev',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
            )
            s3.put_object(Bucket='files', Key=key, Body=raw, ContentType=content_type)
            url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
            return resp(200, {'url': url})

        return resp(400, {'error': 'Неизвестное действие'})
    finally:
        cur.close()
        conn.close()
