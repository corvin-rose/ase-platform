SET foreign_key_checks = 0;
DROP TABLE IF EXISTS ase_reset_token;
SET foreign_key_checks = 1;

CREATE TABLE ase_reset_token (
    user_id VARCHAR(46) NOT NULL REFERENCES ase_user (id) ON DELETE CASCADE,
    token   VARCHAR(255) UNIQUE,
    created_at INT,
    PRIMARY KEY (user_id)
);
