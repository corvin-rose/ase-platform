<?php

namespace Core\App\Service;

use Core\App\Provider\DBConnection;
use Core\App\Provider\UUID;
use Core\Domain\Model\BufferModel;
use Exception;

class BufferService {
    private DBConnection $dbConnection;
    private ShaderService $shaderService;

    public function __construct() {
        $this->dbConnection = new DBConnection();
        $this->shaderService = new ShaderService();
    }

    /** @throws Exception */
    public function findBuffersWithShaderId(string $shaderId): array {
        $buffers = $this->dbConnection->runSql(
            "SELECT * FROM ase_buffer WHERE shader_id = '$shaderId'"
        );
        return array_map(fn($b) => BufferModel::fromDBObject($b), $buffers);
    }

    /** @throws Exception */
    public function updateBuffers(array $buffers): bool {
        $this->checkBufferInstances($buffers);
        $shaderId = $this->findShaderIdWithBuffers($buffers);

        if ($this->shaderService->findShaderById($shaderId)) {
            foreach ($buffers as $buffer) {
                if ($buffer->bufferCode === null) {
                    $this->dbConnection->runSql(
                        "DELETE FROM ase_buffer 
                             WHERE buffer_key = '$buffer->bufferKey' AND shader_id = '$shaderId'"
                    );
                } else {
                    $uuid = UUID::randomUUID();
                    $this->dbConnection
                        ->runSql("INSERT INTO ase_buffer (id, buffer_key, buffer_code, shader_id) 
                        VALUES ('$uuid', '$buffer->bufferKey', '$buffer->bufferCode', '$buffer->shaderId')
                        ON DUPLICATE KEY UPDATE buffer_key = '$buffer->bufferKey', 
                                                buffer_code = '$buffer->bufferCode';");
                }
            }
            return true;
        }
        return false;
    }

    /** @throws Exception */
    public function findShaderIdWithBuffers(array $buffers): string {
        $this->checkBufferInstances($buffers);
        $shaderId = array_unique(array_map(fn($b) => $b->shaderId, $buffers));
        if (sizeof($shaderId) > 1) {
            throw new Exception("Inconsistent shader references in buffers");
        }
        return array_shift($shaderId);
    }

    /** @throws Exception */
    private function checkBufferInstances(array $buffers): void {
        foreach ($buffers as $buffer) {
            if (!$buffer instanceof BufferModel) {
                throw new Exception("The object was not a buffer");
            }
        }
    }
}
