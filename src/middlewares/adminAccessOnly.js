/*
    Passing criteria:
    * Admin only.
*/
const adminAccessOnly = (req, res, next) => {
    if (!res.locals.user.is_admin) return res.sendStatus(401);

    return next();
}


module.exports = adminAccessOnly;