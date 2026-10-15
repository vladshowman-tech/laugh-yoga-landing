CREATE TABLE IF NOT EXISTS t_p76941956_laugh_yoga_landing.waitlist (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_event ON t_p76941956_laugh_yoga_landing.waitlist (event_id, created_at);