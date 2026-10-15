import React, { useEffect, useState } from "react";
import { Camera, Pen, Plus } from "lucide-react";
import StatusAvatar from "./StatusAvatar";
import { useDispatch } from "react-redux";
import { handleOnStatusPreview } from "../../features/statusSlice";

function AdminAddStatusBadge() {
  const [preview, setPreview] = useState(null);
  const [statusUrl, setStatusUrl] = useState(null);

  const dispatch = useDispatch();

  const handleOnFileChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const type = file.type.slice(0, 5);

    dispatch(handleOnStatusPreview({ url, type, file }));
  };

  return (
    <div className="w-full py-2 px-4 ">
      <h1 className="my-2 font-bold">My Status</h1>

      <div className="w-full flex justify-center">
        <div className="w-[93%] bg-white p-2 rounded-lg flex items-center justify-between">
          <button className="w-full flex items-center gap-3 text-left">
            <div
              className="relative shrink-0"
              style={{ width: 56, height: 56 }}
            >
              <StatusAvatar
                src="https://i.pravatar.cc/150?img=60"
                name="My status"
                size={56}
              />
              <label
                htmlFor="status-avatar-upload"
                className="block h-full w-full cursor-pointer"
              >
                <input
                  type="file"
                  id="status-avatar-upload"
                  className="hidden"
                  onChange={(e) => handleOnFileChange(e)}
                  accept="image/* video/*"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-[19px] w-[19px] rounded-full bg-[#25D366] border-2 border-white flex items-center justify-center">
                  <Plus size={12} className="text-white" strokeWidth={3} />
                </span>
              </label>
            </div>
            <div>
              <p className="text-[15px] font-normal text-[#111b21]">
                My status
              </p>
              <p className="text-[13px] text-[#667781]">
                Tap to add status update
              </p>
            </div>
          </button>

          <div className="flex items-center gap-x-4">
            <button className="p-2 bg-gray-100 rounded-full">
              <Camera size={20} className="" />
            </button>

            <button className="p-2 bg-gray-100 rounded-full">
              <Pen size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAddStatusBadge;
