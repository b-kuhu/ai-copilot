import { redisClient } from "../app";

export const getProfile = TryCatch( async(req, res) => {
    const user = req.user; // req.user is set in isAuth middleware
    const sessionId = req.sessionId;

    const sessionData = await redisClient.get(`session:${sessionId}`)
    let sessionInfo = null
    if(sessionData){
        const parsedSession = JSON.parse(sessionData)
        sessionInfo = {
            sessionId, 
            loginTime: parsedSession.createdAt,
            lastActivity: parsedSession.lastActivity
        }
    }

    res.json({ user })
})

