import { redisClient } from "../app.js";
import { isSessionActive } from "../config/generateToken.js";
import User from "../models/User.js";

export const isAuth =  async (req, res, next) => {
    try{
        const token = req.cookies?.accessToken;
        if(!token){
            return res.status(401).json({message: 'Please login - no token provided'})
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodedData){
            return res.status(401).json({message: 'Token expired'})
        }

        const sessionActive = await isSessionActive(decodedData.id, decodedData.sessionId)
        if(!sessionActive){
            res.clearCookie("refreshToken")
            res.clearCookie("accessToken");

            return res.status(401).json({
                message: 'Session Expired. You have been logged in from another device.'
            })
        }

        //cache user data
        const cachedUser = await redisClient.get(`user:${decodedData.id}`);
        if(cachedUser){
            req.user = JSON.parse(cachedUser);
            req.sessionId = decodedData.sessionId;
            return next();
        }
        const user = await User.findById(decodedData.id).select('-password');
        if(!user){
            return res.status(401).json({message: 'User not found'})
        }
        await redisClient.setEx(`user:${user._id}`, 3600, JSON.stringify(user)); // cache for 1 hour
        req.user = user;
        req.user = decodedData.sessionId
        return next();
    } 
    catch(err){
        return res.status(500).json({message: err.message || 'Internal Server Error'})
    }
}