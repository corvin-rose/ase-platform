CREATE TABLE shader (
    id              UUID NOT NULL,
    title           VARCHAR(250) NOT NULL,
    shader_code     TEXT NOT NULL,
    preview_img     TEXT,
    author_id       UUID NOT NULL REFERENCES ase_user,
    created_at      DATE NOT NULL,
    likes           INTEGER DEFAULT 0,
    PRIMARY KEY (id)
);

INSERT INTO shader (id, title, shader_code, author_id, created_at)
VALUES (uuid_generate_v4(), 'Test Shader', 'void main() {}', 'f6acdbc8-f257-4ad0-b343-39d5dbe9755a', now());

