CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE ase_user (
    id              UUID NOT NULL,
    first_name      VARCHAR(30) NOT NULL,
    last_name       VARCHAR(30) NOT NULL,
    email           VARCHAR(250) UNIQUE NOT NULL,
    password        VARCHAR(512) NOT NULL,
    description     TEXT,
    profile_img      TEXT,
    PRIMARY KEY (id)
);


INSERT INTO ase_user (id, first_name, last_name, email, password)
VALUES ('f6acdbc8-f257-4ad0-b343-39d5dbe9755a', 'dev', 'user', 'dev.user@corvin-rose.de', '$2a$10$7wf3EAA9d5kxlg0F5xdUeejkZt.D6wYBymRuAmKNQpB.Lx9uAUjE.');

INSERT INTO ase_user (id, first_name, last_name, email, password)
VALUES (uuid_generate_v4(), 'test', 'user', 'test.user@corvin-rose.de', '$2a$10$7wf3EAA9d5kxlg0F5xdUeejkZt.D6wYBymRuAmKNQpB.Lx9uAUjE.');