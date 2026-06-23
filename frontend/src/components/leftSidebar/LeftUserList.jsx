import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminUsers,
  getTheMessagesSAndR,
} from "../../service/admin.service";
import {
  setUsers,
  setActiveChat,
  setMessages,
  setUserType,
  removeUnreadCount,
} from "../../features/chatSlice";

function LeftUserList({ socket }) {
  const {
    users,
    userTyping,
    activeChat,
    usersUnreadMsgCount,
    addUserModel,
    createGroupModel,
  } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  const fetchUsers = async () => {
    const adminData = await getAdminUsers();

    if (adminData) dispatch(setUsers(adminData.finalResult));
  };

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  const goToSpecificUserChat = async (userId, userType) => {
    dispatch(setActiveChat(userId));

    dispatch(setUserType(userType));

    if (userType === "Group") {
      socket.emit("joinGroup", { userId });
    }

    const adminUserMsgData = await getTheMessagesSAndR(userId, userType);

    if (adminUserMsgData) {
      dispatch(setMessages(adminUserMsgData.chatHistory));
    }

    socket.emit("chatOpenClearUnread", { userId });
    socket.emit("chat_opend", { chattingWith: userId });

    dispatch(removeUnreadCount(userId));
  };

  return (
    <div
      className={`flex-1 overflow-y-auto bg-white absolute top-0 left-0 w-full ${!addUserModel && !createGroupModel ? "z-10 delay-500" : "z-0"}`}
    >
      {users?.length > 0 ? (
        users.map((user) => (
          <div
            key={user.id}
            onClick={() => goToSpecificUserChat(user.id, user.type)}
            className={`flex items-center gap-3  px-3 py-3 cursor-pointer border-b border-[#f0f2f5] hover:bg-[#f5f6f6] transition-colors ${
              activeChat === user.id ? "bg-[#f0f2f5]" : ""
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
                  {user.displayName}
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
                  {userTyping.senderId === user.id ? (
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

            {usersUnreadMsgCount[user.id] > 0 && (
              <div className="py-1 px-[0.6rem] bg-[#279927] text-white font-semibold rounded-full text-sm">
                {usersUnreadMsgCount[user.id]}
              </div>
            )}
          </div>
        ))
      ) : (
        <div>kuchh nahi hai bhidu yaha pe</div>
      )}
    </div>
  );
}

export default LeftUserList;
