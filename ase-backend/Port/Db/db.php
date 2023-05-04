<?php

function connect_db() {
    $servername = "localhost";
    $username = "ase_admin";
    $password = "#?HY:YCV4nMk";
    $dbname = "ase";

    // Create connection
    $conn = mysqli_connect($servername, $username, $password, $dbname);
    // Check connection
    if (!$conn) {
        die("<p>Connection failed: " . mysqli_connect_error() . "</p>");
    }
    return $conn;
}

function run_sql($sql): array {
    $conn = connect_db();
    $result = mysqli_query($conn, $sql);

    $error = mysqli_error($conn);
    if (isset($error) && strlen($error) > 1) {
        error_log("SQL Error: " . $error);
    }

    $table = [];
    if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            array_push($table, $row);
        }
    }
    mysqli_close($conn);
    return $table;
}

function validUUID($input) {
    return preg_match("/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/", $input);
}

function uuid() {
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
