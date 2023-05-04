<?php

namespace Port\Web\Controller;

use Core\App\Provider\BaseController;
use Core\App\Service\AuthService;
use Core\App\Service\UserService;
use Core\Domain\Model\Routing\HttpStatus;
use Core\Domain\Model\Routing\ResponseEntity;
use Core\Domain\Model\UserModel;
use Exception;

class UserController extends BaseController {
    private UserService $userService;
    private AuthService $authService;

    public function __construct() {
        $this->userService = new UserService();
        $this->authService = new AuthService();
    }

    /**
     * @Get /v1/user
     * @throws Exception
     */
    public function getAllUsers(): ResponseEntity {
        return new ResponseEntity($this->userService->findAllUsers(), HttpStatus::OK());
    }

    /**
     * @Get /v1/user/{id}
     * @throws Exception
     */
    public function getUsersById(string $id): ResponseEntity {
        $user = $this->userService->findUserById($id);

        $authStatus = $this->authService->authStatus();
        if ($authStatus->userName !== $user->email) {
            unset($user->password);
            unset($user->email);
        }
        return new ResponseEntity($user, HttpStatus::OK());
    }

    /**
     * @Post /v1/user/register
     * @throws Exception
     */
    public function registerUser(): ResponseEntity {
        $requestBody = file_get_contents("php://input");
        $user = UserModel::fromJsonObject(json_decode($requestBody));
        return new ResponseEntity($this->authService->registerUser($user), HttpStatus::CREATED());
    }

    /**
     * @Post /v1/user/login
     * @throws Exception
     */
    public function loginUser(): ResponseEntity {
        $requestBody = file_get_contents("php://input");
        $user = UserModel::fromJsonObject(json_decode($requestBody));
        return new ResponseEntity($this->authService->loginUser($user), HttpStatus::OK());
    }

    /**
     * @Post /v1/user/auth
     * @throws Exception
     */
    public function authUser(): ResponseEntity {
        return new ResponseEntity($this->authService->authUser(), HttpStatus::OK());
    }

    /**
     * @Put /v1/user/update
     * @throws Exception
     */
    public function updateUser(): ResponseEntity {
        $requestBody = file_get_contents("php://input");
        $user = UserModel::fromJsonObject(json_decode($requestBody));

        $authStatus = $this->authService->authStatus();
        if ($authStatus->userName !== $user->email) {
            return $this->authService->unauthorized();
        }
        return new ResponseEntity($this->userService->updateUser($user), HttpStatus::OK());
    }

    /**
     * @Delete /v1/user/delete/{id}
     * @throws Exception
     */
    public function deleteUser(string $id): ResponseEntity {
        return $this->authService->unauthorized();
        // $this->userService->deleteUser($id);
    }
}
