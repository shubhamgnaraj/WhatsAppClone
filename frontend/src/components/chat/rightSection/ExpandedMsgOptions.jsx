import React from "react";
import {addReplyMsgObj, addAndRemoveOptExpandedId} from "../../../features/messageSlice"
import { useDispatch } from "react-redux";

function ExpandedMsgOptions({message}) {

  const dispatch = useDispatch();

  const handleMsgOption = (option) => {

    if(option === "Reply") {

      dispatch(addReplyMsgObj(message));
      dispatch(addAndRemoveOptExpandedId(message._id))
    }
  }
  return (
    <div className="absolute -right-10 top-full z-30 mt-1 flex w-36 origin-top-right flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-[12px] text-gray-700 shadow-md">
      {['Reply', 'Star', 'Favorite', 'Delete'].map((option, idx) => (
        <button
          key={idx}
          className="flex h-9 w-full cursor-pointer items-center px-3 text-left transition-colors duration-200 hover:bg-green-50 hover:text-black"
          onClick={() => handleMsgOption(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default ExpandedMsgOptions;
