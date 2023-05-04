<?php

namespace Core\Domain\Model;

class ShaderModel {
    public $id;
    public $title;
    public $shaderCode;
    public $previewImg;
    public $authorId;
    public $createdAt;

    public function __construct(
        $id = "-1",
        $title = "",
        $shaderCode = "",
        $previewImg = "",
        $authorId = "",
        $createdAt = ""
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->shaderCode = $shaderCode;
        $this->previewImg = $previewImg;
        $this->authorId = $authorId;
        $this->createdAt = $createdAt;
    }

    public static function fromDBObject($db): ShaderModel {
        return new ShaderModel(
            $db["id"],
            $db["title"],
            $db["shader_code"],
            $db["preview_img"],
            $db["author_id"],
            $db["created_at"]
        );
    }

    public static function fromJsonObject($json): ShaderModel {
        return new ShaderModel(
            $json->id ?? null,
            $json->title ?? null,
            $json->shaderCode ?? null,
            $json->previewImg ?? null,
            $json->authorId ?? null,
            $json->createdAt ?? null
        );
    }
}
