CREATE TABLE comment (
    id              UUID NOT NULL,
    content         TEXT NOT NULL,
    author_id       UUID NOT NULL REFERENCES ase_user,
    created_at      DATE NOT NULL,
    PRIMARY KEY (id)
);
