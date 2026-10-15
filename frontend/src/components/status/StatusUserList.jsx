import React from "react";
import { MoreVertical, Search } from "lucide-react";
import StatusRow from "./StatusRow";
import { useEffect } from "react";
import {
  getUsersWtihStatus,
  getValidUserStatus,
} from "../../service/status.service";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleStatusUploaders,
  handleViewUserStatus,
  specificUserStatus,
} from "../../features/statusSlice";

const viewedUpdates = [
  {
    id: 5,
    name: "Neha Verma",
    time: "Yesterday, 9:58 PM",
    avatar: "https://i.pravatar.cc/150?img=25",
    segments: 4,
    viewed: true,
  },
  {
    id: 6,
    name: "Karan Singh",
    time: "Yesterday, 6:31 PM",
    avatar: "https://i.pravatar.cc/150?img=15",
    segments: 1,
    viewed: true,
  },
  {
    id: 7,
    name: "Ishita Rao",
    time: "Yesterday, 4:10 PM",
    avatar: "https://i.pravatar.cc/150?img=5",
    segments: 2,
    viewed: true,
  },
];

function StatusUserList() {
  const [usersWithStatus, setUsersWithStatus] = useState([]);

  const { statusUsers } = useSelector((state) => state.status);
  const dispatch = useDispatch();

  useEffect(() => {
    const getStatuses = async () => {
      const data = await getUsersWtihStatus();

      if (data) {
        dispatch(handleStatusUploaders(data.uplodedStatusUsers));
      }
    };

    getStatuses();
  }, []);
  return (
    <aside className="w-[380px] border-r border-[#e6eaea] bg-white">
      <div className="px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#111b21]">Status</h2>
        <div className="flex items-center gap-3 text-[#667781]">
          <Search size={18} />
          <MoreVertical size={18} />
        </div>
      </div>

      <div className="px-4 pt-2 text-[13px] text-[#667781]">Recent updates</div>
      <div className="pt-1">
        {statusUsers?.length > 0 &&
          statusUsers.map((u) => (
            <div
              onClick={async () => {
                dispatch(
                  handleViewUserStatus({
                    type: "selectedUser",
                    userStatusData: u,
                  }),
                );
                const result = await getValidUserStatus(u.userId);

                if (result) {
                  dispatch(
                    specificUserStatus({
                      type: "selectedUserStatuses",
                      userStatuses: result.userStatuses,
                    }),
                  );
                }
              }}
              key={u.userId}
            >
              <StatusRow
                name={u.userName}
                avatar={u.userPhoto}
                segments={u.statusCount}
              />
            </div>
          ))}
      </div>

      <div className="px-4 pt-3 text-[13px] text-[#667781]">Viewed updates</div>
      <div className="pt-1">
        {viewedUpdates.map((u) => (
          <StatusRow
            key={u.id}
            name={u.name}
            time={u.time}
            avatar={u.avatar}
            segments={u.segments}
            viewed={u.viewed}
          />
        ))}
      </div>
    </aside>
  );
}

export default StatusUserList;
