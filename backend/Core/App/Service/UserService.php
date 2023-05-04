<?php

namespace Core\App\Service;

use Core\App\Provider\DBConnection;
use Core\Domain\Model\UserModel;
use Exception;

class UserService {
    private DBConnection $dbConnection;

    public function __construct() {
        $this->dbConnection = new DBConnection();
    }

    /** @throws Exception */
    public function findAllUsers(): array {
        $users = $this->dbConnection->runSql("SELECT id, first_name, last_name FROM ase_user");
        return array_map(fn($v) => UserModel::fromDBObject($v), $users);
    }

    /** @throws Exception */
    public function findUserById($id = "-1") {
        $result = $this->dbConnection->runSql("SELECT * FROM ase_user WHERE id='$id'");
        $user = array_shift($result);
        if ($user === null) {
            throw new Exception("No User with id $id found", 500);
        }
        return UserModel::fromDBObject($user);
    }

    /** @throws Exception */
    public function updateUser($user = null): UserModel {
        if (!isset($user->id) || !validUUID($user->id)) {
            throw new Exception("Invalid request body", 500);
        }
        $values = [
            isset($user->firstName) ? "first_name='$user->firstName'" : "",
            isset($user->lastName) ? "last_name='$user->lastName'" : "",
            isset($user->email) ? "email='$user->email'" : "",
            isset($user->password) ? "password='$user->password'" : "",
            isset($user->description) ? "description='$user->description'" : "",
            isset($user->profileImg) ? "profile_img='$user->profileImg'" : "",
        ];
        $set = implode(",", array_filter($values));
        $this->dbConnection->runSql("UPDATE ase_user 
                 SET $set
                 WHERE id='$user->id'");
        return self::findUserById($user->id);
    }

    /** @throws Exception */
    public function deleteUser($id = "-1"): void {
        if (!validUUID($id)) {
            throw new Exception("Invalid UUID $id", 500);
        }
        $this->dbConnection->runSql("DELETE FROM ase_user WHERE id='$id'");
    }
}
