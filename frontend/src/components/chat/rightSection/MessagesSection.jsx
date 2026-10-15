import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, CheckCheck, ChevronDown } from "lucide-react";
import ExpandedMsgOptions from "./ExpandedMsgOptions";
import { addAndRemoveOptExpandedId } from "../../../features/messageSlice";

function MessagesSection({ socket }) {
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [expandedMsgId, setExpandedMsgId] = useState(null);

  const batchIdsRef = useRef([]);
  const currentReciverIdRef = useRef(null);
  const msgReadTimeOutRef = useRef(null);

  const { messages, userType } = useSelector((state) => state.chat);

  const [msges, setMsges] = useState(messages);
  const { messageOptExpandedId } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const adminId = localStorage.getItem("adminId");

  useEffect(() => {

    if (userType === "Group") return;
    const options = {
      root: null,
      threshold: 0.5,
    };

    const callback = (entries, observer) => {
      let newIdFound = false;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const msgE = entry.target;
          const msgId = msgE.getAttribute("data-id");
          const msgStatus = msgE.getAttribute("data-status");

          currentReciverIdRef.current = msgE.getAttribute("data-sender");

          if (currentReciverIdRef.current === adminId || msgStatus === "read") {
            observer.unobserve(msgE);
            return;
          }

          if (!batchIdsRef.current.includes(msgId)) {
            batchIdsRef.current.push(msgId);
            newIdFound = true;
          }

          observer.unobserve(msgE);
        }
      });

      if (newIdFound) {
        if (msgReadTimeOutRef.current !== null) {
          clearTimeout(msgReadTimeOutRef.current);
        }

        msgReadTimeOutRef.current = setTimeout(() => {
          if (batchIdsRef.current.length > 0) {
            dispatch({
              type: "socket/msgsReadBatch",
              payload: {
                senderId: currentReciverIdRef.current,
                batchIds: [...batchIdsRef.current],
              },
            });
            batchIdsRef.current = [];
          }
          msgReadTimeOutRef.current = null;
        }, 2000);
      }
    };

    const observer = new IntersectionObserver(callback, options);

    const messageElements = document.querySelectorAll(".chat-messages");
    messageElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();

      if (msgReadTimeOutRef.current !== null) {
        clearTimeout(msgReadTimeOutRef.current);
        msgReadTimeOutRef.current = null;

        if (batchIdsRef.current.length > 0) {
          dispatch({
            type: "socket/msgsReadBatch",
            payload: {
              senderId: currentReciverIdRef.current,
              batchIds: [...batchIdsRef.current],
            },
          });

          batchIdsRef.current = [];
        }
      }
    };
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-10 py-4 flex flex-col gap-2">
      {messages.map((msg, index) => (
        <div
          key={msg._id || index}
          className={`chat-messages relative flex  ${
            adminId === msg.senderId ? "justify-end" : "justify-start"
          }`}
          data-id={msg._id}
          data-status={msg.status}
          data-sender={msg.senderId}
        >
          <div
            className={`${
              adminId === msg.senderId ? "bg-[#d9fdd3]" : "bg-white"
            } max-w-[65%] rounded-lg px-3 py-1.5 shadow-sm relative text-[14.2px]`}
            onMouseEnter={() => setHoveredMsgId(msg._id)}
            onMouseLeave={() => {
              setHoveredMsgId(null);
            }}
          >
            <div className={`flex flex-col justify-start`}>
              {adminId !== msg.senderId && (
                <div className="text-[10px] text-gray-500 capitalize">
                  {msg.senderName}
                </div>
              )}

              <div className="pr-12 break-words text-[#111b21] relative w-full relative">
                {msg.content}

                {hoveredMsgId === msg._id && (
                  <div className="absolute right-0 -top-1 z-10 cursor-pointer p-[1px] rounded-md border-[1px] border-gray-100 bg-[#ffffff]">
                    <ChevronDown
                      size={12}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(addAndRemoveOptExpandedId(msg._id));
                      }}
                    />
                  </div>
                )}

                {messageOptExpandedId === msg._id && (
                  <ExpandedMsgOptions message={msg} />
                )}
              </div>
            </div>

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
                  ) : msg.status === "read" ? (
                    <CheckCheck
                      size={15}
                      className="text-blue-500 font-semibold"
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessagesSection;
