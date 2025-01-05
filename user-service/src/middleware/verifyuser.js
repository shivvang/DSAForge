export const verifyUser = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    console.log("im here at verify user");
    return res.status(401).json({ message: "User not authenticated. Please log in." });
};