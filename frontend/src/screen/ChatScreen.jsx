import React, { useEffect, useRef, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { Search, MessageSquare } from "lucide-react";
import { io } from "socket.io-client";

import chatListener from "../app/socketMiddleware";
import LeftSection from "../components/chat/LeftSection";
import RightSection from "../components/chat/RightSection";
import AdminAddUserModel from "../model/AdminAddUserModel";
import AdminCreateGroupModel from "../model/AdminCreateGroupModel";
import LeftSidePageBG from "../components/backgroundPages/LeftSidePageBG";

function ChatScreen() {
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState("");

  const socketRef = useRef(null);
  const isTypingRef = useRef(false);
  const typingTimeOutRef = useRef(null);

  const {
    users,
    messages,
    activeChat,
    usersUnreadMsgCount,
    userTyping,
    userType,
    addUserModel,
    showUserModel,
    showGroupModel,
  } = useSelector((state) => state.chat);
  const { isGroupInfo } = useSelector((state) => state.group);
  const { replyMsg } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const adminId = localStorage.getItem("adminId");

  useEffect(() => {
    if (userType === "Group") return;

    const reciverId = activeChat;

    if (!messageInput.trim() || !activeChat) {
      if (isTypingRef.current) {
        dispatch({
          type: "socket/stopTyping",
          payload: reciverId,
        });

        isTypingRef.current = false;
      }
      return;
    }

    if (!isTypingRef.current) {
      isTypingRef.current = true;

      dispatch({
        type: "socket/startTyping",
        payload: reciverId,
      });
    }

    if (typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current);

    typingTimeOutRef.current = setTimeout(() => {
      dispatch({
        type: "socket/stopTyping",
        payload: reciverId,
      });

      isTypingRef.current = false;
    }, 2000);

    return () => {
      if (typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current);
    };
  }, [messageInput, activeChat]);

  return (
    <>
      <LeftSidePageBG>
        <LeftSection />

        <AdminAddUserModel />
        <AdminCreateGroupModel />
      </LeftSidePageBG>

      <RightSection
        socket={socketRef.current}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
      />
    </>
  );
}

export default ChatScreen;
