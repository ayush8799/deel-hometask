
const IsAdmin = async (req, res, next) => {
    const isAdmin = req.get('is_admin');
    if(!isAdmin) return res.status(403).end()
    next();
}
module.exports = IsAdmin