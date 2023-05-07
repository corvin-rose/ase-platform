<?php

namespace Core\App\Service;

use Core\App\Extension\JWT\JWT;
use Core\App\Extension\JWT\Key;
use Core\App\Provider\DBConnection;
use DateTimeImmutable;
use Exception;
use Core\Domain\Model\Token;
use Core\Domain\Model\UserModel;

class AuthService {
    private static string $secretKey = 'EgpS$q0#&13!1bMJt?$dgTx+mqwjf1yT6aFnTZ#1Z!j~6EtdFcV4Djb#0R=?nbnhQZ4g&c:hx7+bHGffkXIVczo~J?fVH+T5';
    private static string $serverName = "shader.corvin-rose.de";

    private DBConnection $dbConnection;

    public function __construct() {
        $this->dbConnection = new DBConnection();
    }

    /** @throws Exception */
    public function findUserByEmail($email = ""): UserModel {
        $result = $this->dbConnection->runSql("SELECT * FROM ase_user WHERE email='$email'");
        $user = array_shift($result);
        if ($user === null) {
            throw new Exception("No User with email $email found", 500);
        }
        return UserModel::fromDBObject($user);
    }

    /** @throws Exception */
    public function registerUser($user = null): UserModel {
        $result = $this->dbConnection->runSql("SELECT * FROM ase_user WHERE email='$user->email'");
        if (sizeof($result) > 0) {
            throw new Exception("User with email $user->email already exists", 500);
        }
        $password = password_hash($user->password, PASSWORD_BCRYPT);
        $this
            ->dbConnection->runSql("INSERT INTO ase_user (id, first_name, last_name, email, `password`)
                 VALUES (UUID(), '$user->firstName', '$user->lastName', '$user->email', '$password')");
        return self::findUserByEmail($user->email);
    }

    /** @throws Exception */
    public function loginUser($user = null): Token {
        if (!isset($user->email) || !isset($user->password)) {
            throw new Exception("Login failed: Email or password was not provided", 400);
        }

        $result = $this->dbConnection->runSql("SELECT * FROM ase_user WHERE email='$user->email'");
        $target = array_shift($result);
        if ($target === null) {
            throw new Exception("User with email $user->email does not exist", 500);
        }
        $target = UserModel::fromDBObject($target);

        if (!password_verify($user->password, $target->password)) {
            throw new Exception("Password is not valid", 401);
        }

        $issuedAt = new DateTimeImmutable();
        $expire = $issuedAt->modify("+7 day")->getTimestamp(); // Add 60 seconds
        $username = $user->email; // Retrieved from filtered POST data

        $data = [
            "iat" => $issuedAt->getTimestamp(), // Issued at: time when the token was generated
            "iss" => self::$serverName, // Issuer
            "nbf" => $issuedAt->getTimestamp(), // Not before
            "exp" => $expire, // Expire
            "userName" => $username, // User name
        ];

        return new Token(JWT::encode($data, self::$secretKey, "HS512"), $expire);
    }

    /** @throws Exception */
    public function changePasswordForUser(string $userId, string $newPassword): void {
        $newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $this->dbConnection->runSql(
            "UPDATE ase_user SET password = '$newPasswordHash' WHERE id = '$userId'"
        );
    }

    /** @throws Exception */
    public function authStatus(): \stdClass {
        $jwt = $_SERVER["HTTP_AUTHORIZATION"] ?? $_SERVER["HTTP_ACCESS_TOKEN"];
        if ($jwt === null) {
            $jwt = "";
        }
        $now = new DateTimeImmutable();

        $token = JWT::decode($jwt, new Key(self::$secretKey, "HS512"));

        if (
            $token->iss !== self::$serverName ||
            $token->nbf > $now->getTimestamp() ||
            $token->exp < $now->getTimestamp()
        ) {
            throw new Exception("Token is not valid or expired", 401);
        }

        return $token;
    }

    /** @throws Exception */
    public function authUser() {
        $authStatus = self::authStatus();
        if (isset($authStatus->error)) {
            return $authStatus;
        }
        return self::findUserByEmail($authStatus->userName);
    }

    /** @throws Exception */
    public function unauthorized() {
        throw new Exception("Unauthorized", 401);
    }
}
