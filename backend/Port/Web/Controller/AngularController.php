<?php

namespace Port\Web\Controller;

use Core\App\Provider\BaseController;
use Core\App\Service\ShaderService;
use Core\App\Service\UserService;
use Core\Domain\Model\ShaderModel;
use Core\Domain\Model\UserModel;
use Exception;

class AngularController extends BaseController {
    private ShaderService $shaderService;
    private UserService $userService;

    public function __construct() {
        $this->shaderService = new ShaderService();
        $this->userService = new UserService();
    }

    /** @Get / */
    public function angular(): void {
        $this->getAngularEntrypoint();
    }

    /** @Get /profile/{userId} */
    public function angularAseUserProfile(string $userId): void {
        try {
            $user = $this->userService->findUserById($userId);
        } catch (Exception $e) {
            $user = new UserModel("-1", "User");
        }
        $userName = implode(" ", [$user->firstName, $user->lastName]);
        $this->getAngularEntrypoint("$userName");
    }

    /** @Get /shader/{shaderId} */
    public function angularAseShader(string $shaderId): void {
        try {
            $shader = $this->shaderService->findShaderById($shaderId);
        } catch (Exception $e) {
            $shader = new ShaderModel("-1", "Shader not found");
        }
        $this->getAngularEntrypoint("$shader->title", "/v1/shader/$shaderId/image");
    }

    /** @NotFound / */
    public function angularOther(): void {
        $this->getAngularEntrypoint();
    }

    private function getAngularEntrypoint(
        string $title = "ASE - Platform",
        string $img = ""
    ): void {
        http_response_code(200);
        $html = file_get_contents($_ENV["APP"] . "/index.html");
        $html = preg_replace("/\{\{\s*TITLE\s*\}\}/", $title, $html);
        $html = preg_replace("/\{\{\s*IMG\s*\}\}/", $img, $html);
        echo $html;
    }
}
