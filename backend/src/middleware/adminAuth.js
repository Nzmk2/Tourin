export const adminOnly = (req, res, next) => {
    if (req.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            msg: "Access forbidden. Admin only."
        });
    }
};