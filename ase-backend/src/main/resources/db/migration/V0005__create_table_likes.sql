CREATE TABLE likes (
    shader_id       UUID NOT NULL REFERENCES shader ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES ase_user ON DELETE CASCADE,
    PRIMARY KEY (shader_id, user_id)
);
