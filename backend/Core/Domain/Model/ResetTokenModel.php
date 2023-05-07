<?php

namespace Core\Domain\Model;

use DateTime;

class ResetTokenModel {
    public string $userId;
    public string $token;
    public int $createdAt;

    public function __construct(string $userId, string $token, int $createdAt) {
        $this->userId = $userId;
        $this->token = $token;
        $this->createdAt = $createdAt;
    }

    public static function fromDBObject($db): ResetTokenModel {
        return new ResetTokenModel($db["user_id"], $db["token"], $db["created_at"]);
    }

    public static function fromJsonObject($json): ResetTokenModel {
        return new ResetTokenModel(
            $json->userId ?? null,
            $json->token ?? null,
            $json->createdAt ?? 0
        );
    }
}
