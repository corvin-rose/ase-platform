<?php

require_once __DIR__ . "/db.php";

$scripts = array_filter(scandir(__DIR__), fn($v) => preg_match("/^V[0-9]{4}.*\.sql$/", $v));

foreach ($scripts as $script) {
    echo "Migrating $script\n";
    $src = file_get_contents(__DIR__ . "/$script");
    $sqls = array_filter(explode(";\r\n", $src), fn($v) => trim(strlen($v)) > 5);
    foreach ($sqls as $sql) {
        run_sql($sql);
    }
}
