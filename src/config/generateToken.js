import jwt from 'jsonwebtoken';
import { redisClient } from '../app.js';
import crypto from 'crypto'

export const generateToken = async (id, res) => {
    const sessionId = crypto.randomBytes(16).toString('hex');

    const accessToken = jwt.sign({id, sessionId}, process.env.JWT_SECRET,{
        expiresIn: "15m"
    })

    const refreshToken = jwt.sign({id, sessionId}, process.env.JWT_REFRESH_SECRET || process.env.RERESH_SECRET,{
        expiresIn: "7d",
    })
    
    const refreshTokenKey = `refresh:${id}`
    const activeSessionKey =  `active_session:${id}`
    const sessionDataKey =  `session:${sessionId}`

    const existingSession = await redisClient.get(activeSessionKey);
    if(existingSession){
        await redisClient.del(`session:${existingSession}`)
        await redisClient.del(refreshToken)
    }

    const sessionData = {
        userId: id,
        sessionId,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
    }


    await redisClient.setEx(refreshTokenKey, 7*24*60*60, refreshToken);  // expire in 7 days
    await redisClient.setEx(sessionDataKey, 7*24*60*60, JSON.stringify(sessionData))


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

    return {accessToken, refreshToken, sessionId}
}

export const verifyRefreshToken = async ( refreshToken) => {
    try{
        const decodedData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedToken = await redisClient.get(`refresh_token:${decodedData.id}`)
        
        if(storedToken !== refreshToken){
            return null
        }
        const activeSessionId = await redisClient.get(`active_session:${decodedData.id}`)
        if(activeSessionId !== decodedData.sessionId){
            return null;
        }

        const sessionData = await redisClient.get(`session:${decode.sessionId}`)
        if(!sessionData){
            return null
        }

        const parsedSessionData = JSON.parse(sessionData);
        parsedSessionData.lastActivity = new Date().toISOString();
        // create new session when refreshed
        await redisClient.setEx(`session:${decode.sessionId}`, 7*24*60*60, JSON.stringify(parsedSessionData) )

        return decode;
    }
    catch(err){
      return null;
    }
}

export const generateAccessToken = (id, sessionId, res) => {
    const accessToken = jwt.sign({id, sessionId}, process.env.JWT_SECRET,{
        expiresIn: "15m"
    })

    res.cookie('accessToken', accessToken, {
        httpOnly: true, 
        secure: false, 
        sameSite: 'lax',
        maxAge: 15*60*1000, // 1 min
    })
}

export const revokeRefreshToken = async (userId) => {
    const activeSessionId = await redisClient.get(`active_session:${userId}`);

    await redisClient.del(`refresh_token:${userId}`);
    await redisClient.del(`activeSession:${userId}`);

    if(activeSessionId){
        await redisClient.del(`session:${activeSessionId}`)
    }

}

export const isSessionActive = async(userId, sessionId) => {
    const activeSessionId =  await redisClient.get(`active_session:${userId}`);
    return activeSessionId === sessionId;
}

