# Imagem base com PHP e extensões necessárias
FROM php:8.2-fpm

# Instala Node.js 18.x e NPM
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    zip unzip git curl libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-install pdo pdo_mysql

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configuração do diretório de trabalho
WORKDIR /var/www/html

# Copia o código da aplicação
COPY . .

# Instala as dependências do Laravel
RUN composer install --no-scripts --no-autoloader

# Compila os assets do Laravel usando o Laravel Mix
RUN npm install && npm run production

# Configurações adicionais do Laravel
RUN php artisan config:cache && \
    php artisan storage:link

# Permissões para a pasta de cache e logs do Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Define a porta 8000 para o Laravel
EXPOSE 8000

# Comando para iniciar o servidor
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
