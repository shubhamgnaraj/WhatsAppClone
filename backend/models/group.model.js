import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({

  groupName: {
    type: String,
    requried: true,
    unique: true,
  },
  groupIcon: {
    type: String,
    requried: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});


const Group = mongoose.model("Group", groupSchema);

export default Group;
