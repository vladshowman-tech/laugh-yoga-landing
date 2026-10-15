CREATE TABLE IF NOT EXISTS t_p76941956_laugh_yoga_landing.events (
  id SERIAL PRIMARY KEY,
  event_date DATE NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME,
  place VARCHAR(200) NOT NULL DEFAULT '',
  title VARCHAR(200) NOT NULL DEFAULT '',
  address VARCHAR(300) NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON t_p76941956_laugh_yoga_landing.events (event_date, time_start);

UPDATE t_p76941956_laugh_yoga_landing.site_content
SET value = value - 'items'
WHERE key = 'schedule';