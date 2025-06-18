import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = '6f1c342f07c8c672398bcd8c3da92ed307959e90e3a7eb3da0f952fcf6df0f88cac53c7fbaaddc5b4fd82c9aea03483ad3a4ea6d349d77af93e49b4c77da17b0';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: "Token is not valid or expired" });
        }
        req.userID = decoded.userID;
        req.email = decoded.email;
        req.role = decoded.role;
        next();
    });
};