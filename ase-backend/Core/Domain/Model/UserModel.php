<?php

namespace Core\Domain\Model;

class UserModel {
    public $id;
    public $firstName;
    public $lastName;
    public $email;
    public $password;
    public $description;
    public $profileImg;

    public function __construct(
        $id = "-1",
        $firstName = "",
        $lastName = "",
        $email = "",
        $password = "",
        $description = null,
        $profileImg = null
    ) {
        $this->id = $id;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->email = $email;
        $this->password = $password;
        $this->description = $description;
        $this->profileImg = $profileImg;

        if ($email === null) {
            unset($this->email);
        }
        if ($password === null) {
            unset($this->password);
        }
        if ($description === null) {
            unset($this->description);
        }
        if ($profileImg === null) {
            unset($this->profileImg);
        }
    }

    public static function fromDBObject($db): UserModel {
        return new UserModel(
            $db["id"],
            $db["first_name"],
            $db["last_name"],
            $db["email"],
            $db["password"],
            $db["description"],
            $db["profile_img"]
        );
    }

    public static function fromJsonObject($json): UserModel {
        return new UserModel(
            $json->id ?? null,
            $json->firstName ?? null,
            $json->lastName ?? null,
            $json->email ?? null,
            $json->password ?? null,
            $json->description ?? null,
            $json->profileImg ?? null
        );
    }
}
