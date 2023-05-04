<?php

namespace Core\Domain\Model;

class LikeModel {
    public $shaderId;
    public $userId;

    public function __construct($shaderId = "", $userId = "") {
        $this->shaderId = $shaderId;
        $this->userId = $userId;
    }

    public static function fromDBObject($db): LikeModel {
        return new LikeModel($db["shader_id"], $db["user_id"]);
    }

    public static function fromJsonObject($json): LikeModel {
        return new LikeModel($json->shaderId ?? null, $json->userId ?? null);
    }
}
