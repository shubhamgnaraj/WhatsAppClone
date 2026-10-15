import React, { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getValidUserStatus } from "../service/status.service";
import { specificUserStatus } from "../features/statusSlice";

function SeenUserStatus() {
  const [statusIndex, setStatusIndex] = useState(0);
  const [userIndex, setUserIndex] = useState(0);
  const [findIndex, setFindIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const { selectedUserStatuses, statusUsers, selectedUser } = useSelector(
    (state) => state.status,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const findIndex = statusUsers.findIndex(
      (user) => user.userId === selectedUser.userId,
    );

    setUserIndex(findIndex);
    setFindIndex(findIndex);
  }, []);

  useEffect(() => {
    let timerId;

    if (selectedUserStatuses.length === 0) {
      setLoading(true);
      return;
    }

    if (userIndex >= statusUsers.length) {
      clearTimeout(timerId);
      return;
    }

    setLoading(false);
    if (statusIndex >= selectedUserStatuses.length) {
      if (statusUsers[userIndex].statusCount === statusIndex) {
        setUserIndex((prevIndex) => prevIndex + 1);
        setStatusIndex(0);
        clearTimeout(timerId);
      }
    } else {
      timerId = setTimeout(() => {
        setStatusIndex((prevIndex) => prevIndex + 1);
      }, 5000);
    }

    return () => clearTimeout(timerId);
  }, [selectedUserStatuses, statusUsers, statusIndex, userIndex]);

  useEffect(() => {
    if (userIndex === findIndex || userIndex >= statusUsers.length) return;

    setLoading(true);
    async function fetchUserStatuses() {
      const user = statusUsers[userIndex];

      const statuses = await getValidUserStatus(user?.userId);
      setLoading(true);

      if (statuses) {
        setLoading(false);
        dispatch(
          specificUserStatus({
            type: "selectedUserStatuses",
            userStatuses: statuses.userStatuses,
          }),
        );
      }
    }

    fetchUserStatuses();
  }, [userIndex]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 select-none">
      <button
        className="absolute top-6 right-8 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-20"
        aria-label="Close"
      >
        {/* <X className="w-6 h-6" /> */}
        {loading ? "load" : "ok"}
      </button>

      <button
        className="hidden md:flex items-center justify-center absolute left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
        aria-label="Previous status"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        className="hidden md:flex items-center justify-center absolute right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
        aria-label="Next status"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="relative flex h-screen w-full max-w-md flex-col overflow-hidden bg-black text-white sm:h-[92vh] sm:rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80"
          alt="User status"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative z-10 flex gap-1 px-3 pt-3">
          {selectedUserStatuses?.map((_, index) => {
            return (
              <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                <div
                  className={`h-full w-full rounded-full ${statusIndex === index ? " bg-white animate-[statusProgress_5s_linear_forwards]" : ""}`}
                />
              </div>
            );
          })}
        </div>

        <div className="relative z-10 flex items-center gap-3 px-3 pt-3">
          <button
            type="button"
            className="flex items-center gap-1 rounded-full p-1 hover:bg-white/10"
            aria-label="Back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          {/*  name={u.userName}
                avatar={u.userPhoto}
                segments={u.statusCount} */}
          <img
            src={"https://i.pravatar.cc/100?img=12"}
            alt="User avatar"
            className="h-10 w-10 rounded-full border border-white/40 object-cover"
          />

          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[15px] font-semibold">John Carter</p>
            <p className="text-xs text-white/80">Today, 10:24 AM</p>
          </div>

          <button
            type="button"
            className="rounded-full p-2 hover:bg-white/10"
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <circle cx="12" cy="5" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="12" cy="19" r="1.8" />
            </svg>
          </button>
        </div>

        <div className="flex-1" />

        <div className="relative z-10 px-6 pb-4 text-center">
          <p className="text-base leading-snug drop-shadow">
            Sunday mornings hit different up here ⛰️
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-1 pb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5 rotate-180 text-white/80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>24 views</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeenUserStatus;
