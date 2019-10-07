CREATE USER docker;
CREATE DATABASE docker;
GRANT ALL PRIVILEGES ON DATABASE docker TO docker;

CREATE TABLE urls (
   id SERIAL UNIQUE NOT NULL PRIMARY KEY,    -- Auto incrementing integer ID
   full_url VARCHAR (150) NOT NULL,          -- Full ID provided by user
   expires_on VARCHAR(12) NOT NULL,          -- Expiration date to be deleted on
   visits INTEGER NOT NULL                   -- Total number of times this link has been visits; capped at 50
);

-- Express.js User
CREATE USER server WITH ENCRYPTED PASSWORD 'password';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.urls TO server;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO server;