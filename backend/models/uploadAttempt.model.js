import mongoose from "mongoose";

const uploadAttemptSchema = new mongoose.Schema(
    {
        attemptId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },

        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
            index: true,
        },

        publicId: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        resourceType: {
            type: String,
            required: true,
            trim: true,
            enum: ["image", "video", "raw", "audio", "document"],
        },
    },
    {
        timestamps: true,
        collection: "uploadAttempts",
    }
);

uploadAttemptSchema.index({ publicId: 1, status: 1 });

const UploadAttempt = mongoose.model("UploadAttempt", uploadAttemptSchema);

export default UploadAttempt;