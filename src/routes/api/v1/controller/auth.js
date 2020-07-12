const crypto = require('crypto');
const path = require("path");
const { User, SecurityType } = require(path.join(__dirname, '..', '..', '..', '..', 'services', 'database', 'model', 'index'));
const { checkSchema } = require('express-validator');

// JWT Authentication
const jwt = require("jsonwebtoken");

const checkQueryParams = checkSchema({
    username: {
        in: 'query',
        optional: false,
        errorMessage: 'username should be placed as query param'
    },
    password: {
        in: 'query',
        optional: false,
        errorMessage: 'password should be placed as query param'
    }
});

const getUser = async (req, res, next) => {
    const { username, password } = req.query;
    const passwordEncrypted = crypto.createHash('sha512').update(password).digest('hex');

    const user = await User.findOne({
        where: {
            username,
            password: passwordEncrypted
        }
    });

    if (user === null)
        return res.sendStatus(401);

    res.locals.user = user;

    return next();
};

const getToken = async (req, res) => {
    const { id, SecurityTypeId } = res.locals.user;

    if (!id || !SecurityTypeId) return res.sendStatus(401);

    // Generate token
    const token = jwt.sign({ id, SecurityTypeId }, process.env.JWT_PASSPHRASE);       // PASSPHRASE is declared in the file .env

    return res.status(200).json({ token });
}

const validateToken = async (req, res, next) => {
    try {
        // Check whether Bearer authentication token exits in header
        const [bearer, token] = req.headers.authorization.split(" ");
        if (bearer !== "Bearer") return res.status(401).send("Expected Bearer");

        // Check whether token is valid
        const { id, SecurityTypeId } = jwt.verify(token, process.env.JWT_PASSPHRASE);     // PASSPHRASE is declared in the file .env
        if (!id || !SecurityTypeId) return res.status(401).send("id or SecurityTypeId missing in token");

        // Check if id is admin
        const search = await SecurityType.findByPk(SecurityTypeId, { where: { type: 'admin' } });
        const is_admin = search ? true : false;

        // Store results to locals http://expressjs.com/en/api.html#res.locals
        res.locals.user = { id, is_admin }; // TODO SACAR
        req.locals = res.locals; // TODO temporal

        // Alle gut, los gehts.
        return next();
    } catch (e) {
        console.log(e);
        return res.sendStatus(401);
    }
};

const adminAccessOnly = (req, res, next) => {
    if (!res.locals.user.is_admin) return res.sendStatus(401);
    return next();
}


module.exports = {
    adminAccessOnly,
    checkQueryParams,
    getToken,
    getUser,
    validateToken,
};