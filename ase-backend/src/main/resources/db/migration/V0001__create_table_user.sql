CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE ase_user (
    id              UUID NOT NULL,
    first_name      VARCHAR(30) NOT NULL,
    last_name       VARCHAR(30) NOT NULL,
    email           VARCHAR(250) NOT NULL,
    description     TEXT,
    profile_img      TEXT,
    PRIMARY KEY (id)
);


INSERT INTO ase_user (id, first_name, last_name, email)
VALUES ('f6acdbc8-f257-4ad0-b343-39d5dbe9755a', 'dev', 'user', 'dev.user@corvin-rose.de');

INSERT INTO ase_user (id, first_name, last_name, email)
VALUES (uuid_generate_v4(), 'test', 'user', 'test.user@corvin-rose.de');