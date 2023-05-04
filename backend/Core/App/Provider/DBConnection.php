<?php

namespace Core\App\Provider;

use Exception;
use mysqli;

class DBConnection {
    private static mysqli $db;

    /** @throws Exception */
    public function __construct() {
        if (!isset(self::$db)) {
            self::$db = $this->connectToDb();
        }
    }

    /** @throws Exception */
    public function runSql(string $sql): array {
        error_reporting(E_ERROR);

        $result = mysqli_query(self::$db, $sql);
        $error = mysqli_error(self::$db);
        if (strlen($error) > 1) {
            throw new Exception("SQL ServerError: " . $error);
        }

        $table = [];
        if ($result !== true && $result !== false) {
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $table[] = $row;
                }
            }
        }
        return $table ?? [];
    }

    /**  @throws Exception */
    private function connectToDb(): mysqli {
        error_reporting(E_ERROR);

        if ($this->devMode()) {
            $servername = "mysql:3306";
            $username = "ase_admin";
            $password = "#?HY:YCV4nMk";
            $dbname = "ase";
        } else {
            $envReader = new EnvReader();
            $env = $envReader->readEnvFile($_ENV["APP"] . "/.env");

            $servername = $env["servername"];
            $username = $env["username"];
            $password = $env["password"];
            $dbname = $env["dbname"];
        }

        $conn = mysqli_connect($servername, $username, $password, $dbname);
        if (!$conn) {
            throw new Exception(
                "Couldn't connect to Database: " . mysqli_connect_error() . $_SERVER["REMOTE_ADDR"]
            );
        }
        return $conn;
    }

    private function devMode(): bool {
        return !isset($_SERVER["SERVER_NAME"]) ||
            $_SERVER["SERVER_NAME"] == "localhost" ||
            $_SERVER["SERVER_NAME"] == "127.0.0.1" ||
            preg_match("/^192/", $_SERVER["SERVER_NAME"]);
    }
}
