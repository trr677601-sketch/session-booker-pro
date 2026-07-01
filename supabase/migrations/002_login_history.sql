CREATE TABLE login_history (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ip_address    text,
  user_agent    text,
  logged_in_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_login_history_logged_in_at ON login_history(logged_in_at);
