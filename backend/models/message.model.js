import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messageType: {
        type: String,
        required: true,
        default: "text"
    },
    chatType: {
        type: String,
        required: true,
        enum: ["User", 'Group']
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'read'],
        default: 'sent'
    },
    readAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

messageSchema.index({ reciverId: 1, chatType: 1});
messageSchema.index({senderId: 1, reciverId: 1});

const Message = mongoose.model("Message", messageSchema);

export default Message;