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
        f"SELECT e.id, e.event_date, e.time_start, e.time_end, e.place, e.title, e.address, e.capacity, "
        f"(SELECT COUNT(*) FROM {schema}.bookings b WHERE b.event_id = e.id AND b.status <> 'cancelled') AS taken "
        f"FROM {schema}.events e "
        f"WHERE (e.event_date + COALESCE(e.time_end, e.time_start)) >= '{now_local}'::timestamp "
        f"ORDER BY e.event_date, e.time_start LIMIT 50"
    )
    events = []
    for r in cur.fetchall():
        capacity = r[7]
        taken = int(r[8])
        events.append({
            'id': r[0],
            'date': r[1].isoformat(),
            'time_start': r[2].strftime('%H:%M'),
            'time_end': r[3].strftime('%H:%M') if r[3] else '',
            'place': r[4],
            'title': r[5],
            'address': r[6],
            'capacity': capacity,
            'left': max(capacity - taken, 0) if capacity else None,
        })
    data.setdefault('schedule', {})['events'] = events
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {**HEADERS, 'Cache-Control': 'no-cache'},
        'body': json.dumps(data, ensure_ascii=False),
    }