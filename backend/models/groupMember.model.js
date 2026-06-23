import mongoose from "mongoose";

const groupMemberSchema = mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Group"
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    role: {
        type: String,
        enum: ['member', 'admin'],
        default: 'member'
    },
    joinAt: {
        type: Date,
        required: true
    },
})

groupMemberSchema.index({ groupId: 1, memberId: 1 }, { unique: true });


const GroupMember = mongoose.model("GroupMember", groupMemberSchema);

export default GroupMember;