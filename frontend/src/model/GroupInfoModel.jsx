import React from "react";
import {
  X,
  Trash2,
  LogOut,
  UserPlus,
  Search,
  Bell,
  ShieldAlert,
  Image as ImageIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setIsGroupInfo } from "../features/groupSlice";

const GroupInfoModel = ({ isOpen, onClose, groupData }) => {
  const { isGroupInfo } = useSelector((state) => state.group);
  const dispatch = useDispatch()

  const {
    name = "The Backbenchers 🎒",
    photo = null,
    description = "Hey there! This group is for weekend plan discussions, sharing memes, and project updates. Keep it chill.",
    membersCount = 12,
    members = [
      { id: 1, name: "You", status: "Available", isAdmin: true },
      { id: 2, name: "Samit (Bhidu)", status: "Busy", isAdmin: true },
      { id: 3, name: "Rahul", status: "At the gym", isAdmin: false },
      { id: 4, name: "Sneha", status: "Sleeping", isAdmin: false },
    ],
  } = groupData || {};

  const handleClearChat = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all messages in this chat?",
    );
    if (confirmClear) {
      alert("Chat cleared successfully!");
    }
  };

  const handleExitGroup = () => {
    const confirmExit = window.confirm(`Exit "${name}" group?`);
    if (confirmExit) {
      alert("You left the group.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transform ease-in delay-500">
        <div className="relative w-full max-w-md h-[90vh] bg-[#f0f2f5] dark:bg-[#111b21] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-4 py-3 bg-[#008069] text-white shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch(setIsGroupInfo())}
                className="p-1 hover:bg-[#016b58] rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
              <h2 className="font-medium text-lg text-white">Group info</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            <div className="bg-white dark:bg-[#111b21] px-6 py-7 flex flex-col items-center text-center shadow-sm">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-[#dfe5e7] dark:bg-[#202c33] flex items-center justify-center shadow-inner mb-4 group relative cursor-pointer">
                {photo ? (
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={56} className="text-[#8696a0]" />
                )}
              </div>
              <h1 className="text-xl font-semibold text-[#111b21] dark:text-[#e9edef] mb-1">
                {name}
              </h1>
              <p className="text-sm text-[#667781] dark:text-[#8696a0]">
                Group · {membersCount} participants
              </p>
            </div>

            <div className="bg-white dark:bg-[#202c33] p-4 shadow-sm">
              <h3 className="text-xs font-medium text-[#008069] dark:text-[#00a884] uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-[15px] text-[#3b4a54] dark:text-[#d1d7db] leading-relaxed break-words">
                {description}
              </p>
            </div>

            <div className="bg-white dark:bg-[#202c33] shadow-sm divide-y divide-[#f0f2f5] dark:divide-[#2a3942]">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#202c33]/80">
                <div className="flex items-center gap-4 text-[#3b4a54] dark:text-[#d1d7db]">
                  <Bell size={20} className="text-[#8696a0]" />
                  <span className="text-[15px]">Mute notifications</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#202c33]/80">
                <div className="flex items-center gap-4 text-[#3b4a54] dark:text-[#d1d7db]">
                  <ShieldAlert size={20} className="text-[#8696a0]" />
                  <span className="text-[15px]">
                    Encryption{" "}
                    <span className="text-xs text-[#8696a0] block">
                      Messages are end-to-end encrypted
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#202c33] shadow-sm">
              <div className="p-4 flex items-center justify-between border-b border-[#f0f2f5] dark:border-[#2a3942]">
                <span className="text-[15px] font-medium text-[#667781] dark:text-[#8696a0]">
                  {membersCount} participants
                </span>
                <Search size={18} className="text-[#8696a0] cursor-pointer" />
              </div>

              <div className="divide-y divide-[#f0f2f5] dark:divide-[#2a3942] max-h-64 overflow-y-auto">
                <div className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-[#222e35] cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white">
                    <UserPlus size={20} />
                  </div>
                  <span className="text-[15px] font-medium text-[#00a884]">
                    Add participant
                  </span>
                </div>

                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-[#222e35] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#dfe5e7] dark:bg-[#111b21] flex items-center justify-center text-[#8696a0] font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-medium text-[#111b21] dark:text-[#e9edef]">
                          {member.name}
                        </h4>
                        <p className="text-xs text-[#667781] dark:text-[#8696a0] truncate max-w-[200px]">
                          {member.status}
                        </p>
                      </div>
                    </div>
                    {member.isAdmin && (
                      <span className="text-[10px] border border-[#00a884]/40 text-[#00a884] dark:text-[#00a884] px-1.5 py-0.5 rounded bg-[#00a884]/10 font-medium">
                        Group Admin
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#202c33] shadow-sm mb-4 divide-y divide-[#f0f2f5] dark:divide-[#2a3942]">
              {/* Clear Chat Button */}
              <button
                onClick={handleClearChat}
                className="w-full flex items-center gap-4 p-4 text-[#ea0038] hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-medium text-[15px] text-left"
              >
                <Trash2 size={20} className="shrink-0" />
                <span>Clear Chat</span>
              </button>

              <button
                onClick={handleExitGroup}
                className="w-full flex items-center gap-4 p-4 text-[#ea0038] hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-medium text-[15px] text-left"
              >
                <LogOut size={20} className="shrink-0" />
                <span>Exit Group</span>
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default GroupInfoModel;
