import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, MoreVertical } from "lucide-react";
import { setIsGroupInfo } from "../../features/groupSlice";

function RightChatWindowHeader() {

  const { users, activeChat } = useSelector((state) => state.chat);
  const {isGroupInfo} = useSelector((state) => state.group);
  const dispatch = useDispatch();

  console.log(isGroupInfo)

  return (
    <div className="h-[60px] bg-[#f0f2f5] px-4 flex items-center justify-between border-b border-[#e9edef]">
      <div
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-xl"
        onClick={() => dispatch(setIsGroupInfo())}
      >
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          <img
            src={`https://dicebear.com ${
              users.find((u) => u._id === activeChat)?.displayName
            }`}
            alt="active avatar"
            className="w-full h-full"
          />
        </div>
        <div>
          <h1 className="font-normal text-[16px]">
            {users.find((u) => u._id === activeChat)?.userName}
          </h1>
          <p className="text-xs text-[#667781]">online</p>
        </div>
      </div>
      <div className="flex gap-6 text-[#54656f]">
        <Search className="w-5 h-5 cursor-pointer" />
        <MoreVertical className="w-5 h-5 cursor-pointer" />
      </div>
    </div>
  );
}

export default RightChatWindowHeader;
