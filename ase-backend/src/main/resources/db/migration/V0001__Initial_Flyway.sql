CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE flyway
(
    id UUID PRIMARY KEY,
    name VARCHAR(100)
);

INSERT INTO flyway (id, name) VALUES (uuid_generate_v4(), 'testdaten');