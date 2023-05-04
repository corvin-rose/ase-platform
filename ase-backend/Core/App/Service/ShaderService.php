<?php

namespace Core\App\Service;

use Core\App\Provider\DBConnection;
use Core\Domain\Model\ShaderModel;
use Exception;

class ShaderService {
    private DBConnection $dbConnection;

    public function __construct() {
        $this->dbConnection = new DBConnection();
    }

    /** @throws Exception */
    public function findAllShaders(): array {
        $shaders = $this->dbConnection->runSql("SELECT * FROM ase_shader");
        return array_map(fn($v) => ShaderModel::fromDBObject($v), $shaders);
    }

    /** @throws Exception */
    public function findShaderById($id = "-1"): ShaderModel {
        $result = $this->dbConnection->runSql("SELECT * FROM ase_shader WHERE id='$id'");
        $shader = array_shift($result);
        if ($shader === null) {
            throw new Exception("No Shader with id $id found", 500);
        }
        return ShaderModel::fromDBObject($shader);
    }

    /** @throws Exception */
    public function addShader($shader = null): ShaderModel {
        $uuid = uuid();
        $createdAt = date("Y-m-d");
        $this
            ->dbConnection->runSql("INSERT INTO ase_shader (id, title, shader_code, author_id, created_at, preview_img)
                 VALUES ('$uuid', '$shader->title', '$shader->shaderCode', 
                         '$shader->authorId', '$createdAt', '$shader->previewImg')");
        return self::findShaderById($uuid);
    }

    /** @throws Exception */
    public function updateShader($shader = null): ShaderModel {
        if (!isset($shader->id) || !validUUID($shader->id)) {
            throw new Exception("Invalid request body", 400);
        }
        $values = [
            isset($shader->title) ? "title='$shader->title'" : "",
            isset($shader->shaderCode) ? "shader_code='$shader->shaderCode'" : "",
            isset($shader->previewImg) ? "preview_img='$shader->previewImg'" : "",
        ];
        $set = implode(",", array_filter($values));
        $this->dbConnection->runSql("UPDATE ase_shader 
                 SET $set
                 WHERE id='$shader->id'");
        return self::findShaderById($shader->id);
    }

    /** @throws Exception */
    public function deleteShader($id = "-1") {
        if (!validUUID($id)) {
            throw new Exception("Invalid UUID $id", 400);
        }
        $this->dbConnection->runSql("DELETE FROM ase_shader WHERE id='$id'");
        return null;
    }
}
