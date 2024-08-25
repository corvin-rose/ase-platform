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
            $conn = mysqli_connect($servername, $username, $password, $dbname);
            if (!$conn) {
                http_response_code(500);
                die("ERROR: Couldn't connect to Database" . "\n");
            }
        }

        error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED);
        return $conn;
    }

    static function run_sql($sql) {
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
}


$scripts = array_filter(scandir(__DIR__), fn($v) => preg_match("/^V[0-9]{4}.*\.sql$/", $v));

foreach ($scripts as $script) {
    echo "Migrating $script\n";
    $src = file_get_contents(__DIR__ . "/$script");
    $sqls = array_filter(explode(";\r\n", $src), fn($v) => trim(strlen($v)) > 5);
    foreach ($sqls as $sql) {
        DB::run_sql($sql);
    }
}
