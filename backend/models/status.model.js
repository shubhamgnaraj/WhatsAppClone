import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        enum: ["image", "video"],
        required: true
    },
    mediaURL: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "pending"
    },
    caption: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    expireAt: {
        type: Date
    }
})

statusSchema.index({userId: 1, createdAt: -1})

const UserStatus = mongoose.model("UserStatus", statusSchema)

export default UserStatus;