const path = require("path");

// JWT Authentication
const jwt = require("jsonwebtoken");

// Connect 2 db.
const db = require(path.join(__dirname, "..", "db.js"));

const tokenValidatior = (req, res, next) => {
    try {
        // Check whether Bearer authentication token exits in header
        const [bearer, token] = req.headers.authorization.split(" ");
        if (bearer !== "Bearer") return res.status(401).send("Expected Bearer");

        // Check whether token is valid
        const { id, id_security_type } = jwt.verify(token, db.passphrase);
        if (!id || !id_security_type) return res.status(401).send("id or id_security_type missing in token");

        // Check if id is admin
        const { id: admin_type } = db.Security_Types.find(security => security.type === "Admin")
        const is_admin = id_security_type === admin_type ? true : false;

        // Store results to locals http://expressjs.com/en/api.html#res.locals
        res.locals.user = { id, is_admin };

        // Alle gut, los gehts.
        return next();
    } catch (e) {
        if (e) console.log(e); return res.sendStatus(401);
    }
};


module.exports = tokenValidatior;