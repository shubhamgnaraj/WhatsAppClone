import React from "react";
import { MessageSquare, User, Users, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  showUserAddModel,
  showGroupCreateModel,
} from "../../../features/chatSlice";
import UserListSearchInput from "./UserListSearchInput";

function ListHeader() {
  const dispatch = useDispatch();

  const { showUserModel, showGroupModel } = useSelector((state) => state.chat);

  return (
    <div className="h-28 px-4 py-2 w-full relative">
      <div className="w-full  flex items-center justify-between bg-[#f0f2f5] p-1 px-2 rounded-xl">
        <div className=" py-1 rounded-full bg-gray-300 overflow-hidden cursor-pointer">
          <img
            src="https://unsplash.com"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-3 text-[#54656f] ">
          <div
            className={`icon_div p-2 ${showGroupModel && "bg-gray-200 rounded-full"}`}
          >
            <Users
              className="icon_styling "
              onClick={() => dispatch(showGroupCreateModel())}
            />
          </div>

          <div className={`icon_div p-2 ${showUserModel && "bg-gray-200 rounded-full"}`}>
            <User
              className="icon_styling"
              onClick={() => dispatch(showUserAddModel())}
            />
          </div>

          <div className="icon_div p-2">

          <MoreVertical className="icon_styling" />
          </div>
        </div>
      </div>
      <UserListSearchInput />
    </div>
  );
}

export default ListHeader;
