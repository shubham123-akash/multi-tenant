import jwt from "jsonwebtoken";

export const isAuthenticated = async(req, res, next) => {
    try {
        const token = req.cookies.token;
    
        if(!token){
            return res.status(401).json({
                message: "User not Authenticated",
                success: false
            })
        }
    
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
    
        req.user = {
            userId: decode.userId,
            tenantId: decode.tenantId,
            role: decode.role
        };
    
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Access token expired",
                code: "TOKEN_EXPIRED",
                success: false
            });
        }

        return res.status(401).json({
            message: "Invalid or expired token",
            success: false
        });
    }
}