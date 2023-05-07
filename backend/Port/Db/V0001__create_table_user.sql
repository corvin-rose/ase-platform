SET foreign_key_checks = 0;
DROP TABLE IF EXISTS ase_user;
SET foreign_key_checks = 1;

CREATE TABLE ase_user (
    id              VARCHAR(46) NOT NULL,
    first_name      VARCHAR(30) NOT NULL,
    last_name       VARCHAR(30) NOT NULL,
    email           VARCHAR(250) UNIQUE NOT NULL,
    password        VARCHAR(512) NOT NULL,
    description     TEXT,
    profile_img     TEXT,
    PRIMARY KEY (id)
);


INSERT INTO ase_user (id, first_name, last_name, email, password)
VALUES ('f6acdbc8-f257-4ad0-b343-39d5dbe9755a', 'dev', 'user', 'dev@dev', '$2y$10$wejDUSRKll7OmhMi0p2Qy.JnmFLHUwESQE5z5tPnJQQgHHTqg8OhC');

INSERT INTO ase_user (id, first_name, last_name, email, password)
VALUES (UUID(), 'test', 'user', 'test.user@corvin-rose.de', '$2a$10$7wf3EAA9d5kxlg0F5xdUeejkZt.D6wYBymRuAmKNQpB.Lx9uAUjE.');