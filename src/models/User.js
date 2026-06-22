import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    originalFileName: String,
    filePath: String,
    mimeType: String,
    size: Number,
    uploadedAt: Date,
    extractedText: String,
  },
  { _id: false }
);

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    masterResume:{
        type: resumeSchema,
    }
}, { timestamps: true })

const User = mongoose.model('User', schema);
export default User;