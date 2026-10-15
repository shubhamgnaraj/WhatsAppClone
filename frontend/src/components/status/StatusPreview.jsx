import React, { useEffect, useState } from "react";

import { X, MoreVertical, Send, Camera, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "nanoid"

import {
  handleOnStatusPreview,
  pushNewAdminStatus,
} from "../../features/statusSlice";
import { sendToServerStatusData } from "../../service/status.service";

function StatusPreview() {
  const [statusDescription, setStatusDescription] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  const { statusPreview, adminStatus, isLoading } = useSelector(
    (state) => state.status,
  );
  const dispatch = useDispatch();

  const handleOnSendStatusData = async () => {
    dispatch(handleOnStatusPreview({}));

    const tempId = Date.now();

    const localStatusData = {
      _id: tempId,
      mediaType: statusPreview.type,
      status: "uploading",
      mediaURL: statusPreview.url,
      caption: statusDescription,
    };

    dispatch(
      pushNewAdminStatus({
        type: "localState",
        newStatus: localStatusData,
      }),
    );

    const statusData = await sendToServerStatusData({
      attemptId: nanoid(),
      statusDescription,
      file: statusPreview.file,
    });

    if (statusData) {
      dispatch(
        pushNewAdminStatus({
          type: "responseState",
          newStatus: statusData.newStatus,
          tempId,
        }),
      );
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-screen bg-black">
      <div className="w-full h-full relative flex items-center justify-center">
        {/* Top bar */}
        <div className="absolute top-6 left-2 right-2 flex justify-between z-10 px-2">
          <div className="flex items-center gap-4">
            <X
              size={22}
              className="text-white cursor-pointer"
              onClick={() => dispatach(handleOnStatusPreview({}))}
            />
            <MoreVertical size={20} className="text-white" />
          </div>
        </div>

        {/* Media + thumbnail wrapped together so thumbnail sits right below photo */}
        <div className="w-full h-full flex flex-col items-center justify-center py-24 px-2 gap-3">
          <div className="flex-1 min-h-0 flex items-center justify-center">
            {statusPreview.type === "image" ? (
              <img
                src={statusPreview.url}
                alt="status"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <video
                src={statusPreview.url}
                className="max-w-full max-h-full object-contain rounded-lg"
                autoPlay
                controls={false}
              />
            )}
          </div>

          {/* Mini thumbnail - right below the photo now */}
          <div className="relative w-14 h-14 rounded-md overflow-hidden group cursor-pointer shrink-0">
            <img
              src={statusPreview.url}
              alt="thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Trash2 size={18} className="text-white" />
            </div>
          </div>
        </div>

        {/* Bottom bar: reply input + send button */}
        <div className="absolute bottom-4 left-2 right-2 flex items-center gap-2 px-2 z-10">
          <div className="flex-1 flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Reply..."
              className="bg-transparent text-white placeholder-white/60 text-sm w-full outline-none"
              value={statusDescription}
              onChange={(e) => setStatusDescription(e.target.value)}
            />
            <Camera size={18} className="text-white/80" />
          </div>

          <button
            className="w-10 h-10 flex items-center justify-center bg-[#00a884] rounded-full shrink-0"
            onClick={handleOnSendStatusData}
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatusPreview;
