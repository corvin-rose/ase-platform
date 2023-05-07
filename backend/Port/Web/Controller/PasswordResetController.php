<?php

namespace Port\Web\Controller;

use Core\App\Provider\BaseController;
use Core\App\Service\PasswordResetService;
use Core\Domain\Model\Routing\HttpStatus;
use Core\Domain\Model\Routing\ResponseEntity;
use Exception;

class PasswordResetController extends BaseController {
    private PasswordResetService $passwordResetService;

    public function __construct() {
        $this->passwordResetService = new PasswordResetService();
    }

    /**
     * @Get /v1/password/reset/{email}
     * @throws Exception
     */
    public function resetPasswordResetFor(string $email): ResponseEntity {
        return new ResponseEntity(
            $this->passwordResetService->requestToken($email),
            HttpStatus::OK()
        );
    }
    /**
     * @Get /v1/password/reset/token/{token}/{password}
     * @throws Exception
     */
    public function resetPasswordFor(string $token, string $password): ResponseEntity {
        return new ResponseEntity(
            $this->passwordResetService->resetPassword($token, $password),
            HttpStatus::OK()
        );
    }
}
