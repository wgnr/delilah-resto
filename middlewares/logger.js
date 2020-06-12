const logger = (req, res, next) => {
    console.log("\n"+`${new Date().toLocaleString()} - ${req.ip} ${req.method} ${req.originalUrl}`);
    if (Object.keys(req.query).length) console.log("query : " + JSON.stringify(req.query, null, 1));
    if (Object.keys(req.body).length) console.log("body : " + JSON.stringify(req.body, null, 1));
    
    return next();
};

module.exports = logger;