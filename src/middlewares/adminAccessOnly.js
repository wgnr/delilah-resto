const adminAccessOnly = (req, res, next) => {
    /* Check pass criteria:
        1) Admin only.
    */
    if (!res.locals.user.is_admin) return res.sendStatus(401);

    return next();
}


module.exports = adminAccessOnly;