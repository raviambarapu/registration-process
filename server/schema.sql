CREATE TABLE IF NOT EXISTS members (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  phone VARCHAR(10) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  course VARCHAR(50) NOT NULL,
  password_hash TEXT NOT NULL,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  login_count INTEGER NOT NULL DEFAULT 0 CHECK (login_count >= 0),
  last_login_at TIMESTAMPTZ
);
