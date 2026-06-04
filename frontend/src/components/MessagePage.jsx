import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUsers,
  setActiveChat,
  setMessages,
  addMessage,
  updateMessageStatus,
  replaceMessageWithDB,
  setUnreadCount,
  updateUnreadCount,
  removeUnreadCount,
  setUserTyping,
  clearUserTyping,
  receiveMessage,
} from "../features/chatSlice";
import { getAdminUsers, getTheMessagesSAndR } from "../service/admin.service";
import {
  Search,
  CheckCheck,
  Check,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
} from "lucide-react";
import { io } from "socket.io-client";
import { useRef } from "react";

export default function MessagePage() {
  const dispatch = useDispatch();
  const {
    users,
    messages,
    activeChat,
    usersUnreadMsgCount,
    userTyping,
  } = useSelector((state) => state.chat);

  const [messageInput, setMessageInput] = React.useState("");
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
      if (msgData.senderId === activeChat) {
        dispatch(receiveMessage(msgData));
      }
    });

    socketRef.current.on("unreadMsgesCount", (countData) => {
      dispatch(setUnreadCount(countData || {}));
    });

    socketRef.current.on("notificationMsg", ({ senderId, unreadCount }) => {
      dispatch(updateUnreadCount({ userId: senderId, count: unreadCount }));
    });

    socketRef.current.on("removeUnreadCount", ({ userId }) => {
      dispatch(removeUnreadCount(userId));
    });

    socketRef.current.on("msgStatusUpdate", ({ reciverId, status }) => {
      dispatch(updateMessageStatus({ reciverId, status }));
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

    return () => {
      socketRef.current.off("reciveAMsg");
      socketRef.current.off("unreadMsgesCount");
      socketRef.current.off("notificationMsg");
      socketRef.current.off("removeUnreadCount");
      socketRef.current.off("msgStatusUpdate");
      socketRef.current.off("msgCreated");
      socketRef.current.off("typingStart");
      socketRef.current.off("typingStop");
    };
  }, [activeChat, dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      const adminData = await getAdminUsers();
      if (adminData) dispatch(setUsers(adminData.allUsers));
    };
    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
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

  const goToSpecificUserChat = async (userId) => {
    dispatch(setActiveChat(userId));
    const adminUserMsgData = await getTheMessagesSAndR(userId);
    if (adminUserMsgData) {
      dispatch(setMessages(adminUserMsgData.chatHistory));
    }
    socketRef.current.emit("chatOpenClearUnread", { userId });
    socketRef.current.emit("chat_opend", { chattingWith: userId });
    dispatch(removeUnreadCount(userId));
  };

  const handleOnSendMsg = () => {
    if (!messageInput.trim()) return;

    const payload = { reciverId: activeChat, content: messageInput };
    socketRef.current.emit("sendMessage", payload);

    const localMsg = {
      senderId: adminId,
      reciverId: activeChat,
      content: messageInput,
      status: "sent",
      createdAt: Date.now(),
    };

    dispatch(addMessage(localMsg));
    setMessageInput("");
  };

  return (
    <div className="flex h-screen w-screen bg-[#eae6df] overflow-hidden font-sans antialiased text-[#111b21]">
      <div className="w-[30%] min-w-[340px] max-w-[400px] h-full bg-white flex flex-col border-r border-[#e9edef]">
        <div className="h-[60px] bg-[#f0f2f5] px-4 flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer">
            <img
              src="https://unsplash.com"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-6 text-[#54656f]">
            <MessageSquare className="w-5 h-5 cursor-pointer" />
            <MoreVertical className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        <div className="p-2 bg-white flex items-center border-b border-[#f0f2f5]">
          <div className="bg-[#f0f2f5] flex items-center w-full rounded-lg px-3 py-1.5 gap-3">
            <Search className="w-4 h-4 text-[#667781]" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="bg-transparent text-sm w-full focus:outline-none placeholder-[#667781]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => goToSpecificUserChat(user._id)}
              className={`flex items-center gap-3 px-3 py-3 cursor-pointer border-b border-[#f0f2f5] hover:bg-[#f5f6f6] transition-colors ${
                activeChat === user._id ? "bg-[#f0f2f5]" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                <img
                  src={`https://dicebear.com{user.userName}`}
                  alt="avatar"
                  className="w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h2 className="font-normal text-[16px] truncate">
                    {user.userName}
                  </h2>
                  <span
                    className={`text-xs ${
                      user.unread > 0
                        ? "text-[#00a884] font-medium"
                        : "text-[#667781]"
                    }`}
                  >
                    {user.time || ""}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-[#667781] truncate pr-2">
                    {userTyping.senderId === user._id ? (
                      <p className="text-[green] font-medium">
                        {userTyping.typing}
                      </p>
                    ) : (
                      "No Message yet!"
                    )}
                  </div>
                  {user.unread > 0 && (
                    <span className="bg-[#00a884] text-white text-xs font-medium rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                      {user.unread}
                    </span>
                  )}
                </div>
              </div>

              {usersUnreadMsgCount[user._id] > 0 && (
                <div className="py-1 px-[0.6rem] bg-[#279927] text-white font-semibold rounded-full text-sm">
                  {usersUnreadMsgCount[user._id]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 h-full flex flex-col bg-[#efeae2] relative">
        <div className="relative z-10 flex flex-col h-full">
          {activeChat ? (
            <>
              <div className="h-[60px] bg-[#f0f2f5] px-4 flex items-center justify-between border-b border-[#e9edef]">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={`https://dicebear.com{users.find(
                        (u) => u._id === activeChat
                      )?.userName}`}
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

              <div className="flex-1 overflow-y-auto px-10 py-4 flex flex-col gap-2">
                {messages.map((msg, index) => (
                  <div
                    key={msg._id || index}
                    className={`flex ${
                      adminId === msg.senderId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`${
                        adminId === msg.senderId ? "bg-[#d9fdd3]" : "bg-white"
                      } max-w-[65%] rounded-lg px-3 py-1.5 shadow-sm relative text-[14.2px]`}
                    >
                      <p className="pr-12 break-words text-[#111b21]">
                        {msg.content}
                      </p>

                      <div className="absolute right-1 bottom-0 flex gap-1 ">
                        <span className=" text-[11px] text-[#667781]">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Just now"}
                        </span>
                        {msg.senderId === adminId && (
                          <div className="w-4 ">
                            {msg.status === "sent" ? (
                              <Check size={15} />
                            ) : msg.status === "delivered" ? (
                              <CheckCheck size={15} />
                            ) : (
                              <CheckCheck
                                size={15}
                                className="text-blue-500 font-semibold"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-[62px] bg-[#f0f2f5] px-4 flex items-center gap-4 border-t border-[#e9edef]">
                <div className="flex gap-4 text-[#54656f]">
                  <Smile className="w-[26px] h-[26px] cursor-pointer" />
                  <Paperclip className="w-[26px] h-[26px] cursor-pointer" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Type a message"
                    className="w-full bg-white rounded-lg px-4 py-2 text-sm text-[#111b21] focus:outline-none"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleOnSendMsg()}
                  />
                </div>
                <button
                  onClick={handleOnSendMsg}
                  className="text-[#54656f] hover:text-[#111b21]"
                >
                  <Send className="w-6 h-6 cursor-pointer" />
                </button>
              </div>
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
