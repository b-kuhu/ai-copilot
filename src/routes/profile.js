import express from "express";
import { getProfile } from "../controllers/profile";
import { validateRequest } from "../middleware/validateRequest";

const router = express.Router()

router.get('/profile', validateRequest, getProfile)
router.post('/upload-resume', validateRequest, uploadResume)