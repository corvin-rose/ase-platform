<?php

namespace Core\Domain\Model;

class Token {
    public $token;
    public $expiresAt;

    public function __construct($token = "", $expiresAt = "") {
        $this->token = $token;
        $this->expiresAt = $expiresAt;
    }
}
