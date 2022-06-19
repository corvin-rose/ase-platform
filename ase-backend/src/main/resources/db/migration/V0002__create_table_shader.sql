CREATE TABLE shader (
    id              UUID NOT NULL,
    title           VARCHAR(250) NOT NULL,
    shader_code     TEXT NOT NULL,
    preview_img     TEXT,
    author_id       UUID NOT NULL REFERENCES ase_user,
    created_at      DATE NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO shader (id, title, shader_code, author_id, created_at, preview_img)
VALUES ('d7400e83-f6e6-41e2-b24a-b5fcde3c92e7', 'Test Shader', 'void main() {}', 'f6acdbc8-f257-4ad0-b343-39d5dbe9755a', now(), 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=');

