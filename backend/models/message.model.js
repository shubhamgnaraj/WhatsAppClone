import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

messageSchema.index({senderId: 1, reciverId: 1, createdAt: 1})

const Message = mongoose.model("Message", messageSchema);

export default Message;