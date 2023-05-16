<?php

namespace Port\Web\Controller;

use Core\App\Provider\BaseController;
use Core\App\Service\AuthService;
use Core\App\Service\ShaderService;
use Core\Domain\Model\Routing\ContentType;
use Core\Domain\Model\Routing\HttpStatus;
use Core\Domain\Model\Routing\ResponseEntity;
use Core\Domain\Model\ShaderModel;
use Exception;

class ShaderController extends BaseController {
    private ShaderService $shaderService;
    private AuthService $authService;

    public function __construct() {
        $this->shaderService = new ShaderService();
        $this->authService = new AuthService();
    }

    /**
     * @Get /v1/shader
     * @throws Exception
     */
    public function getAllShaders(): ResponseEntity {
        return new ResponseEntity($this->shaderService->findAllShaders(), HttpStatus::OK());
    }

    /**
     * @Get /v1/shader/{id}
     * @throws Exception
     */
    public function getShaderById(string $id): ResponseEntity {
        return new ResponseEntity($this->shaderService->findShaderById($id), HttpStatus::OK());
    }

    /**
     * @Post /v1/shader/add
     * @throws Exception
     */
    public function addShader(): ResponseEntity {
        $authStatus = $this->authService->authStatus();
        $requestBody = file_get_contents("php://input");
        $shader = ShaderModel::fromJsonObject(json_decode($requestBody));
        return new ResponseEntity($this->shaderService->addShader($shader), HttpStatus::CREATED());
    }

    /**
     * @Put /v1/shader/update
     * @throws Exception
     */
    public function updateShader(): ResponseEntity {
        $authStatus = $this->authService->authStatus();
        $requestBody = file_get_contents("php://input");
        $shader = ShaderModel::fromJsonObject(json_decode($requestBody));
        $user = $this->authService->findUserByEmail($authStatus->userName);
        if ($this->shaderService->findShaderById($shader->id)->authorId !== $user->id) {
            return $this->authService->unauthorized();
        }
        return new ResponseEntity($this->shaderService->updateShader($shader), HttpStatus::OK());
    }

    /**
     * @Delete /v1/shader/delete/{id}
     * @throws Exception
     */
    public function deleteShader(string $id): ResponseEntity {
        $authStatus = $this->authService->authStatus();
        $shader = $this->shaderService->findShaderById($id);
        $user = $this->authService->findUserByEmail($authStatus->userName);
        if ($shader->authorId !== $user->id) {
            return $this->authService->unauthorized();
        }
        return new ResponseEntity($this->shaderService->deleteShader($id), HttpStatus::OK());
    }

    /**
     * @Get /v1/shader/{id}/image
     */
    public function getShaderImage(string $id): ResponseEntity {
        try {
            $img = $this->shaderService->findShaderById($id)->previewImg;
        } catch (Exception $e) {
            $img = "R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
        }
        $imageData = str_replace("data:image/jpeg;base64,", "", $img);
        $imageData = base64_decode($imageData);
        return new ResponseEntity($imageData, HttpStatus::OK(), ContentType::IMAGE_JPEG);
    }
}
