import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
    try {
        // Check if token exists in cookies or Authorization header
        let token = req.cookies?.token; 
        
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            console.log("No token found in cookies or Authorization header");
            return res.status(401).send({ error: "Unauthorized User" });
        }

        // Check if token is blacklisted in Redis
        const blacklistedToken = await redisClient.get(token);
        if (blacklistedToken) {
            res.cookie('token', '', { expires: new Date(0) }); // Clear the token cookie
            return res.status(401).send({ error: "Unauthorized User" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        
    } catch (error) {
        console.error("JWT Error:", error.message);
        res.status(401).send({ error: "Please authenticate" });
    }
};