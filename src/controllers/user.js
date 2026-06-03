import { redisClient } from "../app.js";
import { loginSchema, registerSchema } from "../config/zod.js";
import TryCatch from "../middleware/TryCatch.js";
import sanitize from "mongo-sanitize";
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import crypto from 'crypto';
import { getVerifyEmailHtml } from "../config/html.js";
import sendEmail from "../config/sendMail.js";

export const register = TryCatch(async(req, res) => {
    const sanitizedBody = sanitize(req.body);
    const validation = registerSchema.safeParse(sanitizedBody);
    if (!validation.success) {
        const errors = validation?.error?.issues;
        let formattedErrors = [];
        if(errors && Array.isArray(errors)){
            formattedErrors = errors.map(err => {
               const { path, message, code } = err;
               return {
                   field: path ? path.join('.') : 'Unknown error',
                   message: message || 'Validation error',
                   code 
               }
           })
        }
        return res.status(400).json({ message: formattedErrors });
    }
    const { name, email, password } = validation.data;
    console.log('email is ',email)
    //rate limiting using ip and email
    const rateLimitKey = `register:${req.ip}:${email}`;
    if(await redisClient.get(rateLimitKey)) {
        return res.status(429).json({ message: 'Too many attempts. Please try again later.' });
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({ message: 'User already exists' });
    }
    // encrypt password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyKey = `verify:${verifyToken}`;

    const dataToStore ={
        name, email , password: hashedPassword
    }
    await redisClient.setEx(verifyKey, 300, JSON.stringify(dataToStore)); // expire in 5 mins
    const subject = 'Verify your email for account creation';
    const html = getVerifyEmailHtml({ email, token: verifyToken });
    await sendEmail(email, subject, html);
    await redisClient.set(rateLimitKey,"true",{EX:60}); // block for 1 min after each attempt


    return res.json({
        message:"If your email is valid, a verification link has been sent. It will expire in 5 minutes.",
        name,
        email,
        password: hashedPassword
    })
})

export const verifyUser = TryCatch(async(req, res) => {
    const {token} = req.params;
    if(!token){
        return res.status(400).json({message : 'Verification token is requried.'})
    }

    const verifyKey = `verify:${token}`;
    //get the user data stored in redis using the token
    const userDataJson = await redisClient.get(verifyKey);
    if(!userDataJson){
        return res.status(400).json({message: 'Verification link is expired'})
    }

    //delete verification data from redis
    await redisClient.del(verifyKey);

    const userData = JSON.parse(userDataJson);
    const {name, email, password} = userData;

    // user can have only one account, so check if user already exists in db
    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({message: 'User already exists'})
    }
    // create new user
    const newUser = await User.create({
        name, email, password
    })
    res.status(201).json({
        message: 'Email verified successfully! Your account has been created.',
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        }
    })
})

export const loginUser = TryCatch(async(req, res) => {
        const sanitizedBody = sanitize(req.body);
    const validation = loginSchema.safeParse(sanitizedBody);
    if (!validation.success) {
        const errors = validation?.error?.issues;
        let formattedErrors = [];
        if(errors && Array.isArray(errors)){
            formattedErrors = errors.map(err => {
               const { path, message, code } = err;
               return {
                   field: path ? path.join('.') : 'Unknown error',
                   message: message || 'Validation error',
                   code 
               }
           })
        }
        return res.status(400).json({ message: formattedErrors });
    }
    const { name, email } = validation.data;

    const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;
    if(await redisClient.get(rateLimitKey)) {
        return res.status(429).json({ message: 'Too many login attempts. Please try again later.' });
    }

    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({message: 'Invalid credentials'})
    }
    
})