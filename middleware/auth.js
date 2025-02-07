const { validateToken } = require("../services/authentication.js");
const User = require("../models/user.js"); 

async function authMiddleware(req, res, next) {
    const token = req.cookies.token; 
    req.user = null;
    if (!token) {
        res.locals.user = null; 
        return next(); 
    }

    try {
        const decoded = validateToken(token); 
        const user = await User.findById(decoded._id); 
        if (!user) {
            res.clearCookie("token");
            req.user = null;
            return next();
        }

        req.user = user;  
        res.locals.user = user;  
    } catch (error) {
        console.error("Invalid Token:", error.message);
        res.clearCookie("token");
        req.user = null;
    }

    next();
}

module.exports = {authMiddleware
}
