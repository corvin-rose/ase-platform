<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

ini_set("log_errors", 1);
ini_set("error_log", "php-error.log");

$_ENV["ROOT"] = $_SERVER["DOCUMENT_ROOT"] . "/backend";
$_ENV["APP"] = $_SERVER["DOCUMENT_ROOT"];

include "modular.phar";
