const accessUserCriteria = (req, res, next) => {
    // Take id from request's parameter
    let { id } = req.params;

    // Convert string to number
    id = +id;
    if (isNaN(id)) return res.status(401).send("Invalid user ID number.");

    /* Check pass criteria:
        1) Admin see everything.
        2) User only can query its own information.
    */
    if (!res.locals.user.is_admin && res.locals.user.id !== id) return res.sendStatus(401);

    // Store param in locas
    res.locals.param_id = id;
    return next();
}


module.exports = accessUserCriteria;