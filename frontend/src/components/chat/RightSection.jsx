import React from "react";

import { useSelector } from "react-redux";
import { MessageSquare } from "lucide-react";

import MessageSectionHeader from "./rightSection/MessageSectionHeader";
import AdminCreateGroupModel from "../../model/AdminCreateGroupModel";
import MessagesSection from "./rightSection/MessagesSection";
import ReplyParentMsg from "./rightSection/ReplyParentMsg";
import SendMessageInput from "./rightSection/SendMessageInput";

function RightSection({ socket, messageInput, setMessageInput }) {
  const { activeChat } = useSelector((state) => state.chat);
  const { isGroupInfo } = useSelector((state) => state.group);
  const { replyMsg } = useSelector((state) => state.message);

  return (
    <div className="flex-1 h-full flex flex-col bg-[#efeae2] relative">
      {activeChat ? (
        <>
          <MessageSectionHeader />

          {isGroupInfo && <AdminCreateGroupModel />}

          <MessagesSection socket={socket} />

          {Object.entries(replyMsg).length > 0 && <ReplyParentMsg />}

          <SendMessageInput socket={socket} messageInput={messageInput} setMessageInput={setMessageInput}/>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-[#667781]">
          <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg">Select a chat to start messaging bhidu!</p>
        </div>
      )}
    </div>
  );
}

export default RightSection;
