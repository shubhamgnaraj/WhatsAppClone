import React from "react";
import { Paperclip, Smile, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../features/chatSlice";
import { useRef } from "react";
import { uploadFile } from "../../service/admin.service";

function RightMsgInputBox({ socket, messageInput, setMessageInput }) {
  const { activeChat, userType } = useSelector((state) => state.chat);

  const fileRef = useRef(null);

  const dispatch = useDispatch();
  const adminId = localStorage.getItem("adminId");

  const handleFileOnchange = (e) => {
    const file = e.target.files[0];

    if (file) {
      fileRef.current = file;
    }
  };

  const handleOnSendMsg = async () => {
    // Validate required fields
    if (!messageInput.trim()) {
      console.warn("Message is empty");
      return;
    }

    const payload = { 
      reciverId: activeChat, 
      content: messageInput.trim(), 
      chatType: userType 
    };

    socket.emit("sendMessage", payload);

    const localMsg = {
      reciverId: activeChat,
      senderId: adminId,
      chatType: userType,
      content: messageInput.trim(),
      status: "sent",
      createdAt: Date.now(),
    };

    dispatch(addMessage(localMsg));
    setMessageInput("");
  };

  return (
    <div className="h-[62px] bg-[#f0f2f5] px-4 flex items-center gap-4 border-t border-[#e9edef]">
      <div className="flex gap-4 text-[#54656f]">
        <Smile className="w-[26px] h-[26px] cursor-pointer" />

        <label htmlFor="whatsApp-icon" className="flex ">
          <Paperclip className="w-[26px] h-[26px] cursor-pointer" />
          <input
            type="file"
            accept="image/*"
            id="whatsApp-icon"
            className="hidden"
            onChange={(e) => handleFileOnchange(e)}
          />
        </label>
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
  );
}

export default RightMsgInputBox;
