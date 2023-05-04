<?php

namespace Core\App\Provider;

use Exception;

class EnvReader {
    /** @throws Exception */
    public function readEnvFile(string $fileName): array {
        if (!file_exists($fileName)) {
            throw new Exception("Env file doesn't exist");
        }
        return $this->readEnvString(file_get_contents($fileName));
    }

    public function readEnvString(string $env): array {
        $lines = preg_split('/((\r?\n)|(\r\n?))/i', $env);
        $output = [];
        $key = "";
        foreach ($lines as $line) {
            if (strlen(trim($line)) == 0) {
                continue;
            }
            if (preg_match("/^(?!\s)(.*?)=(.*)/", $line, $match)) {
                $key = trim($match[1]);
                $output[$key] = trim($match[2]);
            } else {
                $output[$key] .= trim($line);
            }
        }
        return $output;
    }
}
