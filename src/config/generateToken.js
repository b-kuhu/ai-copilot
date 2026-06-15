import jwt from 'jsonwebtoken';
import { redisClient } from '../app.js';


export const generateToken = async (id, res) => {
    const accessToken = jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: "1m"
    })

    const refreshToken = jwt.sign({id}, process.env.JWT_REFRESH_SECRET || process.env.RERESH_SECRET,{
        expiresIn: "7d",
    })
    
    const refreshTokenKey = `refresh:${id}`
    await redisClient.setEx(refreshTokenKey, 7*24*60*60, refreshToken);  // expire in 7 days

    res.cookie('accessToken', accessToken, {
        httpOnly: true, // exposes only to server, not accessible on frontend
        secure: false, // only works on https not on http 
        sameSite: 'lax', // reads our cookie only on backend, prevents CSRF(cross site request forgery) attacks
        maxAge: 1*60*1000, // 1 min
    })

    // browser reads https so we will have to keep secure true in production but for development we can keep it false
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7*24*60*60*1000, // 7 days
    })

    return {accessToken, refreshToken}
}

export const verifyRefreshToken = async ( refreshToken) => {
    try{
        const decodedData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedToken = await redisClient.get(`refresh_token:${decodedData.id}`)
        
        if(storedToken !== refreshToken){
            return decode
        }
        return null;
    }
    catch(err){
      return null;
    }
}

export const generateAccessToken = (id, res) => {
    const accessToken = jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: "1m"
    })

    res.cookie('accessToken', accessToken, {
        httpOnly: true, 
        secure: false, 
        sameSite: 'lax',
        maxAge: 1*60*1000, // 1 min
    })
}

export const revokeRefreshToken = async (userId) => {
    await redisClient.del(`refresh_token:${userId}`);
}

