<?php

namespace Core\App\Service;

use Core\App\Provider\DBConnection;
use Core\Domain\Model\LikeModel;
use Exception;

class LikeService {
    private DBConnection $dbConnection;

    public function __construct() {
        $this->dbConnection = new DBConnection();
    }

    /** @throws Exception */
    public function findAllLikes(): array {
        $likes = $this->dbConnection->runSql("SELECT * FROM ase_likes");
        return array_map(fn($v) => LikeModel::fromDBObject($v), $likes);
    }

    /** @throws Exception */
    public function findAllLikesByShader($id = "-1"): array {
        $likes = $this->dbConnection->runSql("SELECT u.id FROM ase_likes l, ase_user u 
                          WHERE l.shader_id = '$id' AND u.id = l.user_id");
        return array_map(fn($v) => $v["id"], $likes);
    }

    /** @throws Exception */
    public function findAllLikesByUser($id = "-1"): array {
        $likes = $this->dbConnection->runSql("SELECT s.id FROM ase_likes l, ase_shader s 
                          WHERE s.author_id = '$id' AND s.id = l.shader_id");
        return array_map(fn($v) => $v["id"], $likes);
    }

    /** @throws Exception */
    public function addLike($like = null) {
        $this->dbConnection->runSql("INSERT INTO ase_likes (shader_id, user_id)
                 VALUES ('$like->shaderId', '$like->userId')");
        return $like;
    }

    /** @throws Exception */
    public function deleteLike($like = null) {
        $this->dbConnection->runSql(
            "DELETE FROM ase_likes WHERE shader_id='$like->shaderId' AND user_id='$like->userId'"
        );
        return null;
    }
}
