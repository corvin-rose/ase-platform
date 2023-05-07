SET foreign_key_checks = 0;
DROP TABLE IF EXISTS ase_buffer;
SET foreign_key_checks = 1;

CREATE TABLE ase_buffer (
    id          VARCHAR(46) NOT NULL,
    buffer_key  VARCHAR(10) NOT NULL,
    buffer_code MEDIUMTEXT  NOT NULL,
    shader_id   VARCHAR(46) NOT NULL REFERENCES ase_shader (id) ON DELETE CASCADE,
    PRIMARY KEY (id),
    UNIQUE (buffer_key, shader_id)
);

INSERT INTO ase_buffer (id, buffer_key, buffer_code, shader_id)
VALUES ('0fd25e23-9249-48e3-9ebb-cdd92fb6e574', '1', 'void main() { gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); }',
        'd7400e83-f6e6-41e2-b24a-b5fcde3c92e7');

INSERT INTO ase_buffer (id, buffer_key, buffer_code, shader_id)
VALUES ('1a6940b2-eda3-4a5f-a09f-2727ce368f28', '2', 'void main() { gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); }',
        'd7400e83-f6e6-41e2-b24a-b5fcde3c92e7');
