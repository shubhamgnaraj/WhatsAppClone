import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ChevronDown, ChevronUp } from "lucide-react";
import { createAGroup } from "../service/group.service";
import { handleCreateGroupModel } from "../features/chatSlice";

function CreateGroupScreen() {
  const [formData, setFormData] = useState({
    groupName: "",
    groupIcon: "",
    groupMembers: new Set(),
  });
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const { createGroupModel, users } = useSelector((state) => state.chat);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnCreateGroup = (e) => {
    e.preventDefault();

    console.log("formData: ", formData);
  };

  const handleOnAddUserInGroup = (userId) => {
    setFormData((prev) => {
      const updateMembers = new Set(prev.groupMembers);

      if (updateMembers.has(userId)) {
        updateMembers.delete(userId);
      } else {
        updateMembers.add(userId);
      }

      return {
        ...prev,
        groupMembers: updateMembers,
      };
    });
  };

  const handleToCreateGroup = async () => {
    if (
      !formData.groupName.trim() ||
      !formData.groupIcon.trim() ||
      formData.groupMembers < 3
    )
      return;

    const data = await createAGroup(formData);

    if (data) {
      dispatch(handleCreateGroupModel());
      setFormData({
        groupName: "",
        groupIcon: "",
        groupMembers: new Set(),
      });
    }
  };

  return (
    <div
      className={`open_model ${createGroupModel ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
    >
      <form onSubmit={handleOnCreateGroup} className="flex-1 bg-white p-6 ">
        <div className="space-y-8">
          <div className="relative border-b border-gray-200 focus-within:border-[#008069] transition-colors py-1">
            <label className="block text-xs font-normal text-[#008069] mb-1">
              Group Name
            </label>
            <input
              type="text"
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              placeholder="Enter groupName..."
              required
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Email Input */}
          <div className="relative border-b border-gray-200 focus-within:border-[#008069] transition-colors py-1">
            <label className="block text-xs font-normal text-[#008069] mb-1">
              Group Icon
            </label>
            <input
              type="text"
              name="groupIcon"
              value={formData.groupIcon}
              onChange={handleChange}
              placeholder="Enter groupIcon..."
              required
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          <div
            className="relative border-b border-gray-200 focus-within:border-[#008069] transition-colors py-1 cursor-pointer"
            onClick={() => setIsUserListOpen(!isUserListOpen)}
          >
            <div className="text-xs font-normal text-[#008069] mb-1 flex items-center gap-x-1 transition-all ease-in delay-200">
              <div> Select Members </div>

              {isUserListOpen ? (
                <ChevronUp className="icon_styling" />
              ) : (
                <ChevronDown className="icon_styling" />
              )}
            </div>
          </div>
        </div>

        {isUserListOpen && (
          <>
            <div className="w-full h-[50%] flex flex-col flex-1 overflow-y-auto divide-y divide-[#e9edef] border-l border-t-0 border-r-0 border-b border-gray-200 border gap-y-1 ">
              {users?.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleOnAddUserInGroup(user.id)}
                    className={`flex items-center  gap-3 px-3 py-3 cursor-pointer border-b border-[#f0f2f5]  ${formData.groupMembers.has(user.id) && "bg-[#00806919]"}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden object-center">
                      <img
                        src={`https://dicebear.com${user.displayName}`}
                        alt="avatar"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0 ">
                      <div className="flex justify-between items-baseline mb-1">
                        <h2 className="font-normal text-sm truncate">
                          {user.displayName}
                        </h2>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>kuchh nahi hai bhidu yaha pe</div>
              )}
            </div>

            <div className="pt-4 flex justify-center">
              <button
                disabled={formData.groupMembers.size < 3}
                onClick={() => setIsUserListOpen(false)}
                type="button"
                className={`flex h-12 w-12 items-center justify-center rounded-full ${formData.groupMembers.size < 3 ? "bg-gray-200 opacity-50 cursor-not-allowed" : "opacity-100 bg-[#00a884] hover:bg-[#008069] transition-all cursor-pointer"}  text-white shadow-md  `}
              >
                <svg
                  xmlns="http://w3.org"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </button>
            </div>
          </>
        )}

        {formData.groupMembers.size >= 3 && (
          <div className="text-xs  text-[#008069] my-2">
            You Are Try To Add{" "}
            <span className="font-medium text-[#066957]">
              {formData.groupMembers.size}
            </span>{" "}
            Members In A Group
          </div>
        )}

        {!isUserListOpen && (
          <div className="w-full flex justify-start">
            <button
              type="submit"
              className="text-white bg-[#00a884] hover:bg-[#008069] font-semibold cursor-pointer py-2 px-4 rounded-lg text-sm mt-5"
              onClick={handleToCreateGroup}
            >
              Create Group
            </button>
          </div>
        )}
        {/* WhatsApp Style Floating Action Button */}
      </form>
    </div>
  );
}

export default CreateGroupScreen;
