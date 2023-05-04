<?php

class DB {
    static function connect_db() {
        $servername = "localhost";
        $username = "ase_admin";
        $password = "#?HY:YCV4nMk";
        $dbname = "ase";

        // Create connection
        error_reporting(E_ALL ^ E_WARNING);
        $conn = mysqli_connect($servername, $username, $password, $dbname);
        // Check connection
        if (!$conn) {
            $conn = mysqli_connect("mysql:3306", $username, $password, $dbname);
            if (!$conn) {
                http_response_code(500);
                die("<p>Connection failed: " . mysqli_connect_error() . "</p>");
            }
        }

        error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED);
        return $conn;
    }

    static function run_sql($sql) {
        if (isset($_SERVER["DB_TEST"]) && $_SERVER["DB_TEST"] === true) {
            if (isset($_SERVER["DB_RESULT"])) {
                return $_SERVER["DB_RESULT"];
            } elseif (isset($_SERVER["DB_MOCK"])) {
                return $_SERVER["DB_MOCK"]->reveal()->run_sql($sql);
            }
        }

        $conn = self::connect_db();
        $result = mysqli_query($conn, $sql);

        $error = mysqli_error($conn);
        if (isset($error) && strlen($error) > 1) {
            error_log("SQL ServerError: " . $error);
        }

        $table = [];
        if ($result !== true && $result !== false) {
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    array_push($table, $row);
                }
            }
        }
        mysqli_close($conn);
        return $table;
    }

    static function extract_result($sql) {
        $sqlResult = $sql;
        return array_shift($sqlResult);
    }

    static function validUUID($input) {
        return preg_match("/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/", $input);
    }

    static function uuid() {
        return sprintf(
            "%04x%04x-%04x-%04x-%04x-%04x%04x%04x",
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff)
        );
    }
}
