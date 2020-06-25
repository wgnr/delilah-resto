# delilah-resto
Under developing...

## Instalation
1. You'll need [nodejs](https://nodejs.org). Check if you already have it installed in your system by typing in your terminal
```bash
node --version
```
2. Clone repository, get into it and install its dependencies.
```bash
git clone https://github.com/wgnr/delilah-resto
cd delilah-resto
npm install
```
3. Rename the file ".env_sample" to ".env" and replace YOUR_PASSPHRASE_HERE with your own passphrase.
```bash
mv .env_sample .env
sed -i 's/YOUR_PASSPHRASE_HERE/example_of_your_passphrase/g' .env
```

4. Start server. If you close terminal, server ends.
```bash
npm start
```

## Used Technologies
- [nodejs](https://nodejs.org) : Provide core server-side functionalities.
- [Postman](https://www.postman.com/) : Software used to try API requests.


## NPM Packages
- [Express](http://expressjs.com) : Provide an easy-way to handle request and managing routes.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) : Creation and validation of [JWT](https://jwt.io) authorization method.
- [Sequelize](https://www.npmjs.com/package/sequelize) : ORM for MariaDB.
- [mysql2](https://www.npmjs.com/package/mysql2) : MySQL client for nodejs. Used to connect with MariaDB.
- [dotenv](https://www.npmjs.com/package/dotenv) : Used to protect JWT passphrase. 


<!-- # Procedure
In the folder [design](./design/reference_img/) you will find all the images that compound the project.

Let's analyse one by one in order to identify the data structure and the differents API endpoints that we would have to use. -->

<!-- ### Log in
![](./design/reference_img/01-login.png "Title")
![](./design/reference_img/04-explorador_sinfavoritos.png "Title")
![](./design/reference_img/06-historial.png "Title")
![](./design/reference_img/02-sign-up.png "Title")
![](./design/reference_img/05-carrito.png "Title")
![](./design/reference_img/07-admin.png "Title")
![](./design/reference_img/03-explorador.png "Title")
![](./design/reference_img/06-éxito.png "Title")
![](./design/reference_img/08-admin_detalle.png "Title") -->