const accessUserCriteria = (req, res, next) => {
    // Take id from request's parameter
    const { id } = req.params;

    // Convert string to number
    id = +id;

    /* Check pass criteria:
        1) Admin see everything.
        2) User only can query its own information.
    */
    if (!res.locals.user.is_admin && res.locals.user.id !== id) return res.sendStatus(401);

    return next();
}


module.exports = accessUserCriteria;