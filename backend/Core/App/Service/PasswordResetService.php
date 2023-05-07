<?php

namespace Core\App\Service;

use Core\App\Provider\DBConnection;
use Core\Domain\Model\ResetTokenModel;
use Core\Domain\Model\UserModel;
use Exception;

class PasswordResetService {
    private AuthService $authService;
    private DBConnection $dbConnection;

    public function __construct() {
        $this->authService = new AuthService();
        $this->dbConnection = new DBConnection();
    }

    /** @throws Exception */
    public function requestToken(string $email): bool {
        $user = $this->authService->findUserByEmail($email);
        $token = $this->generateToken($user->id);
        $this->sendResetMailTo($user, $token);
        return true;
    }

    /** @throws Exception */
    public function resetPassword(string $token, string $newPassword): bool {
        if ($this->isTokenValid($token)) {
            $result = $this->dbConnection->runSql(
                "SELECT * FROM ase_reset_token WHERE token = '$token'"
            );
            $userId = ResetTokenModel::fromDBObject(array_shift($result))->userId;
            $this->authService->changePasswordForUser($userId, $newPassword);
            $this->dbConnection->runSql("DELETE FROM ase_reset_token WHERE token = '$token'");
            return true;
        } else {
            throw new Exception("The token is not valid");
        }
    }

    /** @throws Exception */
    private function sendResetMailTo(UserModel $user, string $token): void {
        $to = "$user->email";
        $subject = "Reset your password";

        $message = file_get_contents($_ENV["ROOT"] . "/Resources/reset-password-mail.html");
        $message = str_replace("{{name}}", $user->firstName, $message);
        $message = str_replace(
            "{{action_url}}",
            "https://shader.corvin-rose.de/password/reset/token/$token",
            $message
        );

        $headers[] = "MIME-Version: 1.0";
        $headers[] = "Content-type: text/html; charset=iso-8859-1";
        $headers[] = "From: <noreply@shader.corvin-rose.de>";

        mail($to, $subject, $message, implode("\r\n", $headers));
    }

    /** @throws Exception */
    private function generateToken(string $userId): string {
        $bytes = random_bytes(120);
        $token = bin2hex($bytes);
        $time = time();

        $this->dbConnection->runSql("INSERT INTO ase_reset_token (user_id, token, created_at) 
                                         VALUES ('$userId', '$token', $time)
                                         ON DUPLICATE KEY UPDATE token = '$token'");
        return $token;
    }

    /** @throws Exception */
    private function isTokenValid($token): bool {
        $result = $this->dbConnection->runSql(
            "SELECT * FROM ase_reset_token WHERE token = '$token'"
        );
        $token = ResetTokenModel::fromDBObject(array_shift($result));
        return $token->createdAt > time() - 600;
    }
}
