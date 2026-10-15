import json
import os
from datetime import datetime, timedelta, timezone

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

    now_local = datetime.now(timezone(timedelta(hours=5))).strftime('%Y-%m-%d %H:%M:%S')
    cur.execute(
        f"SELECT id, event_date, time_start, time_end, place, title, address FROM {schema}.events "
        f"WHERE (event_date + COALESCE(time_end, time_start)) >= '{now_local}'::timestamp "
        f"ORDER BY event_date, time_start LIMIT 50"
    )
    events = []
    for r in cur.fetchall():
        events.append({
            'id': r[0],
            'date': r[1].isoformat(),
            'time_start': r[2].strftime('%H:%M'),
            'time_end': r[3].strftime('%H:%M') if r[3] else '',
            'place': r[4],
            'title': r[5],
            'address': r[6],
        })
    data.setdefault('schedule', {})['events'] = events
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {**HEADERS, 'Cache-Control': 'no-cache'},
        'body': json.dumps(data, ensure_ascii=False),
    }