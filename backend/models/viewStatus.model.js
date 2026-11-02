import mongoose from "mongoose";

const viewStatusSchema = mongoose.Schema({
    statusId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserStatuses",
        required: true
    },
    viewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    viewAt: {
        type: Date,
        required: true
    }
})

const ViewStatus = mongoose.model("ViewStatus", viewStatusSchema);

export default ViewStatus;