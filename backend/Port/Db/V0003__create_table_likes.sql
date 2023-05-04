SET foreign_key_checks = 0;
DROP TABLE IF EXISTS ase_likes;
SET foreign_key_checks = 1;

CREATE TABLE ase_likes (
    shader_id       VARCHAR(46) NOT NULL REFERENCES ase_shader(id) ON DELETE CASCADE,
    user_id         VARCHAR(46) NOT NULL REFERENCES ase_user(id) ON DELETE CASCADE,
    PRIMARY KEY (shader_id, user_id)
);
