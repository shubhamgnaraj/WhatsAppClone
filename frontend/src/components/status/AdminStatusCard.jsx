import StatusAvatar from "./StatusAvatar";
import { Ellipsis } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

function AdminStatusCard({ status}) {

  return (
    <div className="w-full flex justify-center mt-2">
      <div className="w-[93%] bg-white p-2 rounded-lg flex items-center justify-between">
        {/* Avatar with status ring */}
        <div
          className="relative shrink-0 cursor-pointer"
          style={{ width: 56, height: 56 }}
        >
          <StatusAvatar src={status.mediaURL} name="My status" size={56} />
        </div>

        {/* Text */}

        {status.status === "pending" ? (
          <div className="ml-3 flex-1 font-bold test-lg">Adding Status....</div>
        ) : (
          <div className="ml-3 flex-1">
            <p className="text-[17px] font-semibold text-[#1a1a1a] leading-tight">
              No views yet
            </p>
            <p className="text-[15px] text-[#8a8a8a] leading-tight">Just now</p>
          </div>
        )}

        {/* Overflow menu */}
        <button className="p-2 bg-gray-100 rounded-full">
          <Ellipsis size={20} />
        </button>
      </div>
    </div>
  );
}

export default AdminStatusCard;
