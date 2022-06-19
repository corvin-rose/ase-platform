CREATE TABLE likes (
    shader_id       UUID NOT NULL REFERENCES shader,
    user_id         UUID NOT NULL REFERENCES ase_user,
    PRIMARY KEY (shader_id, user_id)
);
