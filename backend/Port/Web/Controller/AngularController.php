<?php

namespace Port\Web\Controller;

use Core\App\Provider\BaseController;

class AngularController extends BaseController {
    /** @Get / */
    public function angular(): void {
        require_once $_ENV["APP"] . "/index.html";
    }

    /** @NotFound / */
    public function angularOther(): void {
        http_response_code(200);
        require_once $_ENV["APP"] . "/index.html";
    }
}
