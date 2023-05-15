FROM php:7.4-apache

RUN apt-get update && apt-get install -y supervisor && rm -rf /var/lib/apt/lists/*

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN a2enmod rewrite

RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

COPY ./backend/ /var/www/html/backend
COPY ./.htaccess /var/www/html/

CMD ["php", "/var/www/html/backend/Port/Db/flyway.php"]

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
