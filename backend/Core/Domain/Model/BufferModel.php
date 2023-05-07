<?php

namespace Core\Domain\Model;

class BufferModel {
    public ?string $id;
    public string $bufferKey;
    public string $bufferCode;
    public string $shaderId;

    public function __construct(
        ?string $id,
        string $bufferKey,
        string $bufferCode,
        string $shaderId
    ) {
        $this->id = $id;
        $this->bufferKey = $bufferKey;
        $this->bufferCode = $bufferCode;
        $this->shaderId = $shaderId;
    }

    public static function fromDBObject($db): BufferModel {
        return new BufferModel($db["id"], $db["buffer_key"], $db["buffer_code"], $db["shader_id"]);
    }

    public static function fromJsonObject($json): BufferModel {
        return new BufferModel(
            $json->id ?? null,
            $json->bufferKey ?? null,
            $json->bufferCode ?? null,
            $json->shaderId ?? null
        );
    }
}
