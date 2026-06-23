import React from "react";
import { MessageSquare, User, Users, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { handleAddUserModel, handleCreateGroupModel } from "../../features/chatSlice";
import LeftSideUserSearchInput from "./LeftSideUserSearchInput";

function LeftAdminHeader() {
  const dispatch = useDispatch();
  return (
    <div>
      <div className="w-full  flex items-center justify-between bg-[#f0f2f5] p-1 px-2 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer">
          <img
            src="https://unsplash.com"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-6 text-[#54656f]">
          <Users
            className="icon_styling"
            onClick={() => dispatch(handleCreateGroupModel())}
          />
          <User
            className="icon_styling"
            onClick={() => dispatch(handleAddUserModel())}
          />
          <MoreVertical className="icon_styling" />
        </div>
      </div>
      <LeftSideUserSearchInput />
    </div>
  );
}

export default LeftAdminHeader;
