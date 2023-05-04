FROM php:7.4-apache

RUN a2enmod rewrite

RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

COPY . /var/www/html/

RUN php /var/www/html/backend/Port/Db/flyway.php
