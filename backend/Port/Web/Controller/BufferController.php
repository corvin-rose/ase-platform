<?php

namespace Port\Web\Controller;

use Core\App\Provider\BaseController;
use Core\App\Service\AuthService;
use Core\App\Service\BufferService;
use Core\App\Service\ShaderService;
use Core\Domain\Model\BufferModel;
use Core\Domain\Model\Routing\HttpStatus;
use Core\Domain\Model\Routing\ResponseEntity;
use Exception;

class BufferController extends BaseController {
    private BufferService $bufferService;
    private ShaderService $shaderService;
    private AuthService $authService;

    public function __construct() {
        $this->bufferService = new BufferService();
        $this->shaderService = new ShaderService();
        $this->authService = new AuthService();
    }

    /**
     * @Get /v1/buffer/{shaderId}
     * @throws Exception
     */
    public function getBuffersWithShaderId(string $shaderId): ResponseEntity {
        return new ResponseEntity(
            $this->bufferService->findBuffersWithShaderId($shaderId),
            HttpStatus::OK()
        );
    }

    /**
     * @Post /v1/buffer/update
     * @throws Exception
     */
    public function updateBuffers(): ResponseEntity {
        $authStatus = $this->authService->authStatus();
        $requestBody = file_get_contents("php://input");
        $buffers = array_map(fn($b) => BufferModel::fromJsonObject($b), json_decode($requestBody));

        if (sizeof($buffers) == 0) {
            return new ResponseEntity(true, HttpStatus::OK());
        }

        $shaderId = $this->bufferService->findShaderIdWithBuffers($buffers);
        $shader = $this->shaderService->findShaderById($shaderId);
        $user = $this->authService->findUserByEmail($authStatus->userName);
        if ($this->shaderService->findShaderById($shader->id)->authorId !== $user->id) {
            return $this->authService->unauthorized();
        }
        return new ResponseEntity($this->bufferService->updateBuffers($buffers), HttpStatus::OK());
    }
}
