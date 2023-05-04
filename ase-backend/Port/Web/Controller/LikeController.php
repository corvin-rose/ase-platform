<?php

namespace Port\Web\Controller;

use Core\App\Provider\BaseController;
use Core\App\Service\AuthService;
use Core\App\Service\LikeService;
use Core\Domain\Model\Routing\HttpStatus;
use Core\Domain\Model\Routing\ResponseEntity;
use Core\Domain\Model\LikeModel;
use Exception;

class LikeController extends BaseController {
    private LikeService $likeService;
    private AuthService $authService;

    public function __construct() {
        $this->likeService = new LikeService();
        $this->authService = new AuthService();
    }

    /**
     * @Get /v1/likes
     * @throws Exception
     */
    public function getAllLikes(): ResponseEntity {
        return new ResponseEntity($this->likeService->findAllLikes(), HttpStatus::OK());
    }

    /**
     * @Get /v1/likes/shader/{id}
     * @throws Exception
     */
    public function getAllLikesByShaderId(string $id): ResponseEntity {
        return new ResponseEntity($this->likeService->findAllLikesByShader($id), HttpStatus::OK());
    }

    /**
     * @Get /v1/likes/user/{id}
     * @throws Exception
     */
    public function getAllLikesByUserId(string $id): ResponseEntity {
        return new ResponseEntity($this->likeService->findAllLikesByUser($id), HttpStatus::OK());
    }

    /**
     * @Post /v1/likes/add
     * @throws Exception
     */
    public function addLike(): ResponseEntity {
        $requestBody = file_get_contents("php://input");
        $like = LikeModel::fromJsonObject(json_decode($requestBody));

        $authStatus = $this->authService->authStatus();
        $user = $this->authService->findUserByEmail($authStatus->userName);
        if ($user->id !== $like->userId) {
            return $this->authService->unauthorized();
        }
        return new ResponseEntity($this->likeService->addLike($like), HttpStatus::CREATED());
    }

    /**
     * @Post /v1/likes/delete
     * @throws Exception
     */
    public function deleteLike(): ResponseEntity {
        $requestBody = file_get_contents("php://input");
        $like = LikeModel::fromJsonObject(json_decode($requestBody));

        $authStatus = $this->authService->authStatus();
        $user = $this->authService->findUserByEmail($authStatus->userName);
        if ($user->id !== $like->userId) {
            return $this->authService->unauthorized();
        }
        return new ResponseEntity($this->likeService->deleteLike($like), HttpStatus::OK());
    }
}
