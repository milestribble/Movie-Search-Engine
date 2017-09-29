CREATE TABLE users (
  self SERIAL PRIMARY KEY,
  first VARCHAR(255),
  last VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE sessions (
  self SERIAL PRIMARY KEY,
  userId INT REFERENCES users(self)
);

CREATE TABLE history (
  self SERIAL PRIMARY KEY,
  userId INT REFERENCES users(self),
  query VARCHAR(255)
);
