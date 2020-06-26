# Delilah Restó 🍽
The goal of this proyect is to build an API REST to manage a food store's orders using nodejs and MySQL. Designing its architecture, DB entity relationship diagram and API endpoints with documentation. 

#### Key Features
- User sign in with JWT
- Role validation
- CRUD Users methods
- CRUD Dishes methods
- CRUD Orders methods
- Request's body ad params validation
- User's favorites dishes method.

## How to try it
### 1. Setting up DB
1. Install [XAMPP](https://www.apachefriends.org/index.html) which is an Apache server used to serve a MySQL.
1. Start `Apache` and `MySQL`. Be sure that the port `3306` is used for the service MySQL.
1. Admin `MySQL` to check whether you have a `root` profile with no password already created. Otherwise create it.
1. Import [this file](./src/db/delilah-resto.sql) containing all the SQL queries to generate the tables, its relationship and populate them with basic info.

**Note**: There is only one admin created which username is `admin` and password is `admin`.

### 2. Server init
1. You'll need [nodejs](https://nodejs.org). Check if you already have it installed in your system by typing in your terminal
```bash
node --version
```
2. Once confirmed nodejs is in your system, [clone](https://git-scm.com/) repository, get into it and install its dependencies.
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

### 3. Endpoints Description
The endpoints are detailed in [this YALM file](./design/API/delilah-resto-API-spec.yml) and they were designed following the [OPEN API specifications](https://swagger.io/specification/#:~:text=Introduction,or%20through%20network%20traffic%20inspection.) and the suggestions of [this handbook](https://pages.apigee.com/rs/apigee/images/api-design-ebook-2012-03.pdf).

A detailed [documentation file](./design/API/delilah-rsto-API-Documentation.html) is provided but instead, I encourage you to copy the content of the [YALM file](./design/API/delilah-resto-API-spec.yml) and paste it into the [Swagger Editor](https://editor.swagger.io/#) for a clearer view.

### 4. Endpoints Testing
A complete list of functional endpoints with examples are included in [this file](./test/delilah-resto-endpoints.postman_collection), you only have to import them in the [Postman](https://www.postman.com/) application.

Take in mind that most of the endpoints have restrictions, thus be sure to **specify the authorization bearer token in the request header.**

### 5. Ready to use 🏁 🎊🎉
All you need to try this was explained ✔. Have fun!

## Used Technologies
- [XAMPP](https://www.apachefriends.org/index.html): Provide MySQL server-side functionality. 
- [Swagger](https://editor.swagger.io/) : Used for OPEN API documentation reading and designing of the API endpoints.
- [Postman](https://www.postman.com/) : Endpoint testing.
- [Node.js](https://nodejs.org) : Provide core server-side functionalities.

## NPM Packages
- [Express](http://expressjs.com) : Framework that provides an easy-way to handle request and managing routes.
- [nodemon](https://www.npmjs.com/package/nodemon) : Used in dev instance for fast server reloading.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) : Creation and validation of [JWT](https://jwt.io) authorization method.
- [dotenv](https://www.npmjs.com/package/dotenv) : Used to protect JWT passphrase. 
- [Sequelize](https://www.npmjs.com/package/sequelize) : ORM for MySQL connection and querying.
- [mysql2](https://www.npmjs.com/package/mysql2) : MySQL client for nodejs. Integrated in Sequelize.