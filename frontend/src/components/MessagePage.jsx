import React, { useEffect } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import {
  setActiveChat,
  setMessages,
  addMessage,
  removeUnreadCount,
  receiveMessage,
  userReadMessages,
  setUnreadCount,
  updateUnreadCount,
  updateMessageStatus,
  replaceMessageWithDB,
  setUserTyping,
  clearUserTyping,
} from "../features/chatSlice";
import { getAdminUsers, getTheMessagesSAndR } from "../service/admin.service";
import {
  Search,
  MessageSquare,
  MoreVertical,
  ReceiptEuroIcon,
} from "lucide-react";
import { io } from "socket.io-client";
import { useRef } from "react";
import { useState } from "react";
import LeftAdminHeader from "./leftSidebar/LeftAdminHeader";
import LeftSideUserSearchInput from "./leftSidebar/LeftSideUserSearchInput";
import LeftUserList from "./leftSidebar/LeftUserList";
import RightChatWindowHeader from "./rightSidebar/RightChatWindowHeader";
import AdminUserMsg from "./rightSidebar/AdminUserMsg";
import chatListener from "../socket/socketListner";
import RightMsgInputBox from "./rightSidebar/RightMsgInputBox";
import AddUserModel from "../model/AddUserModel";
import CreateGroupScreen from "../model/CreateGroupScreen";

export default function MessagePage() {
  const dispatch = useDispatch();
  const {
    users,
    messages,
    activeChat,
    usersUnreadMsgCount,
    userTyping,
    userType,
    addUserModel,
  } = useSelector((state) => state.chat);

  const [messageInput, setMessageInput] = React.useState("");
  const [file, setFile] = React.useState("");

  const socketRef = useRef(null);
  const isTypingRef = useRef(false);
  const typingTimeOutRef = useRef(null);
  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket Connected:", socketRef.current.id);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Setup Socket Event Listeners
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("reciveAMsg", (msgData) => {
      console.log("msgData: ", msgData);
        dispatch(receiveMessage(msgData));
    });

    socketRef.current.on(
      "msgStatusUpdate",
      ({ batchIds, status, reciverId }) => {
        if (batchIds) {
          dispatch(userReadMessages({ batchIds, status }));
        } else if (reciverId) {
          dispatch(updateMessageStatus({ reciverId, status }));
        }
      },
    );

    socketRef.current.on("unreadMsgesCount", (countData) => {
      dispatch(setUnreadCount(countData || {}));
    });

    socketRef.current.on("notificationMsg", ({ senderId, unreadCount }) => {
      dispatch(updateUnreadCount({ userId: senderId, count: unreadCount }));
    });

    socketRef.current.on("removeUnreadCount", ({ userId }) => {
      dispatch(removeUnreadCount(userId));
    });

    socketRef.current.on("msgCreated", (createdMsg) => {
      dispatch(replaceMessageWithDB(createdMsg));
    });

    socketRef.current.on("typingStart", (data) => {
      dispatch(setUserTyping({ senderId: data.senderId, typing: "Typing..." }));
    });

    socketRef.current.on("typingStop", () => {
      dispatch(clearUserTyping());
    });

    socketRef.current.on("errorOccured", (errorMsg) => {
      console.error("❌ Socket error:", errorMsg);
      alert(`Error: ${errorMsg}`);
    });

    return () => {
      socketRef.current.off("reciveAMsg");
      socketRef.current.off("unreadMsgesCount");
      socketRef.current.off("notificationMsg");
      socketRef.current.off("removeUnreadCount");
      socketRef.current.off("msgStatusUpdate");
      socketRef.current.off("msgCreated");
      socketRef.current.off("typingStart");
      socketRef.current.off("typingStop");
      socketRef.current.off("errorOccured");
    };
  }, [activeChat, dispatch]);

  useEffect(() => {
    if (userType === "Group") return;

    if (!messageInput.trim() || !activeChat) {
      if (isTypingRef.current) {
        socketRef.current.emit("typing_stop", { reciverId: activeChat });
        isTypingRef.current = false;
      }
      return;
    }

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current.emit("typing_start", { reciverId: activeChat });
    }

    if (typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current);

    typingTimeOutRef.current = setTimeout(() => {
      socketRef.current.emit("typing_stop", { reciverId: activeChat });
      isTypingRef.current = false;
    }, 2000);

    return () => {
      if (typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current);
    };
  }, [messageInput, activeChat]);

  return (
    <div className="flex h-screen w-screen bg-[#eae6df] overflow-hidden font-sans antialiased text-[#111b21]">
      {/* left side phase */}
      <div className="w-[30%] min-w-[340px] max-w-[400px] bg-white flex flex-col border-r border-[#e9edef]">
        <div className=" h-28 px-4 py-2 w-full relative">
          <LeftAdminHeader />
        </div>

        <div className="w-full h-full relative">
          <LeftUserList socket={socketRef.current} />
          <AddUserModel />
          <CreateGroupScreen />
        </div>
      </div>

      <div className="flex-1 h-full flex flex-col bg-[#efeae2] relative">
        <div className="relative z-10 flex flex-col h-full">
          {activeChat ? (
            <>
              <RightChatWindowHeader />

              <AdminUserMsg socket={socketRef.current} />

              <RightMsgInputBox
                socket={socketRef.current}
                messageInput={messageInput}
                setMessageInput={setMessageInput}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#667781]">
              <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">Select a chat to start messaging bhidu!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
