DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  self SERIAL PRIMARY KEY,
  first VARCHAR(255),
  last VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255)
);

DROP TABLE IF EXISTS sessions;

CREATE TABLE sessions (
  self SERIAL PRIMARY KEY,
  userId INT REFERENCES users(self)
);

DROP TABLE IF EXISTS history;

CREATE TABLE history (
  self SERIAL PRIMARY KEY,
  userId INT REFERENCES users(self),
  query VARCHAR(255)
);

INSERT INTO users (first, last, email, password)
  VALUES ('James', 'Stewart', 'jimmys@thedailyshow.com', '$2a$10$/JghlswcHjG5ruu8227vs.CAdkSsdR0VfCFV.d9VTpSALGQYYoqKy');

INSERT INTO users (first, last, email)
  VALUES ('Ron', 'Johnson', 'ronjohnson@allegra.com');

INSERT INTO users (first, last, email)
  VALUES ('Fran', 'Applebottom', 'francien@franyfran.org');

INSERT INTO sessions (userID)
  VALUES (1);

INSERT INTO history (userId, query)
  VALUES (1, 'Treasure Island');

INSERT INTO history (userId, query)
  VALUES (1, 'Hook');

INSERT INTO history (userId, query)
  VALUES (1, 'Peter Pan');
