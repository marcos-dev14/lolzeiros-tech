

✨ Passando o bastão da TGOO para AUGE! ✨

Entregamos este repositório a vocês com entusiasmo. 
Foi uma jornada incrível na TGOO, e agora estamos animados para ver este projeto alcançando patamares ainda mais altos sob sua liderança.

Desejamos muito sucesso e inovações!

Bons códigos! 🚀

___

### Informações técnicas
> Projeto de E-Commerce B2B Auge APP desenvolvido em framework Laravel 8.75.

#### Instruções para executar o projeto:

##### Composer
Instale as dependências do composer
```
composer install
```

Crie o arquivo `.env` (ou renomeie o de exemplo)
```
cp .env.example .env
```

Configure o arquivo `.env` com as informações do banco de dados e execute o comando abaixo para aplica as alterações:
```
php artisan config:cache
```

##### NPM
Instale as dependências do Node
```
npm install
npm run dev
```

#### Importante: imagens do projeto
As imagens dos produtos ficam hospedadas juntamente ao projeto no diretório `storage/app/public` no entanto, como esperado, as imagens não ficam no repositório.
Para baixar as imagens e alocá-las no projeto, seja no servidor ou máquina local, abra o terminal e navegue até a raiz do projeto, em seguida execute os seguintes comandos:
```
# Navegar até o diretório do projeto
cd /caminho/para/o/seu/projeto

# Baixar o arquivo ZIP
http://augeapp.com.br/storage-app-public.zip

# (Opcional) Criar o diretório se não existir
mkdir -p storage/app/public

# Descompactar o arquivo no diretório especificado
unzip storage-app-public.zip -d storage/app/public

# Apagar o arquivo ZIP
rm storage-app-public.zip

# Verificar os arquivos descompactados
ls storage/app/public
```
