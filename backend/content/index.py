import json
import os

import psycopg2

HEADERS = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}


def handler(event: dict, context) -> dict:
    """Отдаёт публичное содержимое сайта (все разделы) из базы данных."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(f'SELECT key, value FROM {schema}.site_content')
    data = {k: v for k, v in cur.fetchall()}
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {**HEADERS, 'Cache-Control': 'no-cache'},
        'body': json.dumps(data, ensure_ascii=False),
    }
