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
### 1. Server init
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
Change `example_of_your_passphrase` for anything you want, this will be used for encrypting your tokens!

### 2. Setting up DB
1. Install [XAMPP](https://www.apachefriends.org/index.html) which is an Apache server used to serve a MySQL.
1. Run XAMPP and start `Apache` and `MySQL`. Be sure that the port `3306` is used for the service MySQL.
1. Admin `MySQL` to check whether you have a `root` profile with no password already created. Otherwise create it.
1. Then you would have two options to set the DB:
    * *OPTION A)* Create only your DB as for example `delilah-resto` and then ensure all info in [here](./src/services/database/config/index.js) is correct. Then run `npm run populateData`.
    * *OPTION B)* Import [this file](./src/services/database/delilah-resto-init-config.sql) containing all the SQL queries to generate the tables, its relationship and populate them with basic info.

So far we already have installed nodejs and set up our DB !

**Note**: There is only one admin created so far which username is `admin` and its password is `admin`.

### 3. Initiating server
Open a terminal a run the following command. If you close terminal, server ends.
```bash
npm run start
```
### 4. Ready to use 🏁 🎊🎉
All you need to try this was explained ✔. Have fun!

## Endpoints Description
The endpoints are detailed in [this YALM file](./design/API/delilah-resto-API-spec.yml) and they were designed following the [OPEN API specifications](https://swagger.io/specification/#:~:text=Introduction,or%20through%20network%20traffic%20inspection.) and the suggestions of [this handbook](https://pages.apigee.com/rs/apigee/images/api-design-ebook-2012-03.pdf).

A detailed [documentation file](./design/API/delilah-rsto-API-Documentation.html) is provided but instead, I encourage you to copy the content of the [YALM file](./design/API/delilah-resto-API-spec.yml) and paste it into the [Swagger Editor](https://editor.swagger.io/#) for a clearer view.


Here is a brief summary of all available endpoints.

*Base URL*: localhost:3000/api/v1
| Method |       Enpoint      |                  Description                  |
|--------|--------------------|-----------------------------------------------|
|   GET  | /login             | Returns bearer token                          |
|   GET  | /users             | Get all user info                             |
|  POST  | /users             | Create new user                               |
|   GET  | /users/{id}        | Get user info                                 |
|   PUT  | /users/{id}        | Edit user info                                |
| DELETE | /users/{id}        | Delete user                                   |
|   GET  | /users/{id}/dishes | Get user's favourites dishes                  |
|   GET  | /dishes            | Get all dishes info                           |
|  POST  | /dishes            | Create new dish                               |
|   GET  | /dishes/{id}       | Get dish info                                 |
|   PUT  | /dishes/{id}       | Edit dish info                                |
| DELETE | /dishes/{id}       | Delete dish                                   |
|   GET  | /orders            | Returns all orders (Time filtering available) |
|  POST  | /orders            | Create new order                              |
|   GET  | /orders/{id}       | Get order info                                |
|   PUT  | /orders/{id}       | Update order status                           |

### Endpoints Testing
A complete list of functional endpoints with examples are included in [this file](./test/delilah-resto-endpoints.postman_collection), you only have to import them in the [Postman](https://www.postman.com/) application.

Take in mind that most of the endpoints have auth restrictions, thus be sure to **specify the authorization bearer token in the request header.**

## Used Technologies
- [XAMPP](https://www.apachefriends.org/index.html): Provide MySQL server-side functionality. 
- [Swagger](https://editor.swagger.io/) : Used for OPEN API documentation reading and designing of the API endpoints.
- [Postman](https://www.postman.com/) : Endpoint testing.
- [Node.js](https://nodejs.org) : Provide core server-side functionalities.

## NPM Packages
- [Express](http://expressjs.com) : Framework that provides an easy-way to handle request and managing routes.
- [express-validator](https://express-validator.github.io/) : For validation and sanitization of request's body and query params.
- [nodemon](https://www.npmjs.com/package/nodemon) : Used in dev instance for fast server reloading.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) : Creation and validation of [JWT](https://jwt.io) authorization method.
- [dotenv](https://www.npmjs.com/package/dotenv) : Used to protect JWT passphrase. 
- [Sequelize](https://www.npmjs.com/package/sequelize) : ORM for MySQL connection and querying.
- [mysql2](https://www.npmjs.com/package/mysql2) : MySQL client for nodejs. Integrated in Sequelize.
- [moment](https://www.npmjs.com/package/moment) : For easily parsing and formatting dates.