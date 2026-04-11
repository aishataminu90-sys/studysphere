const authMiddleware = (req,res,next) => {
    
    // if user is not logged in they are blocked 
    if(!req.session.userId) {
         return res.status(401).json({ error: "Unauthorized. Please log in." });
    }   

    next();
};

module.exports = authMiddleware;