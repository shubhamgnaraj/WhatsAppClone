import React from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeReplyMsgInObj } from "../../../features/messageSlice";

function ReplyParentMsg() {
  const { replyMsg } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  return (
    <div className="w-full mx-auto px-20 bg-[#f0f2f5ec]  flex items-start justify-center ">
      <div className="w-full bg-[#f0f2f5] rounded-xl flex items-stretch overflow-hidden relative shadow-sm">
        <div className="w-[5px] bg-[#00a884] shrink-0" />

        <div className="flex-1 min-w-0 pt-[9px] pb-[11px] pl-[13px] pr-[44px] flex flex-col justify-center">
          <span className="text-[#008069] text-[13.5px] font-medium leading-tight truncate font-sans">
            {replyMsg?.userName}
          </span>

          <p className="text-[#3b4a54] text-[14.2px] leading-relaxed mt-[2px] truncate font-sans">
            {replyMsg?.content}
          </p>
        </div>

        <div className="absolute right-[14px] top-[14px] flex items-center justify-center">
          <button
            type="button"
            className="w-5 h-5 flex items-center justify-center rounded-full bg-[#84949e] text-[#ffffff] hover:bg-[#54656f] transition-colors focus:outline-none cursor-pointer"
            aria-label="Close reply preview"
            onClick={() => dispatch(removeReplyMsgInObj())}
          >
            <X className="w-3 h-3 fill-current stroke-current stroke-[1.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReplyParentMsg;
