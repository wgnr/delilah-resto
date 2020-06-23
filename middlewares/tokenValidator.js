const path = require("path");

// JWT Authentication
const jwt = require("jsonwebtoken");

// DB Methods
const { isTypeAdmin, passphrase } = require(path.join(__dirname, "..", "db", "db.js"));


/*
    Validates:
    * Whether a token was provided
    * Whether is valid
    * Whether it's admin
    
    Store results in res.locals.user
*/
const tokenValidatior = async (req, res, next) => {
    try {
        // Check whether Bearer authentication token exits in header
        const [bearer, token] = req.headers.authorization.split(" ");
        if (bearer !== "Bearer") return res.status(401).send("Expected Bearer");

        // Check whether token is valid
        const { id, id_security_type } = jwt.verify(token, passphrase);
        if (!id || !id_security_type) return res.status(401).send("id or id_security_type missing in token");

        // Check if id is admin
        const is_admin = await isTypeAdmin(id_security_type);

        // Store results to locals http://expressjs.com/en/api.html#res.locals
        res.locals.user = { id, is_admin };

        // Alle gut, los gehts.
        return next();
    } catch (e) {
        if (e) console.log(e); return res.sendStatus(401);
    }
};


module.exports = tokenValidatior;