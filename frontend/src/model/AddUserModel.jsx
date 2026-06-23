import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserInTheAdminList } from "../service/admin.service";
import { addUserIntheList, handleAddUserModel } from "../features/chatSlice";

function AddUserModel() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await addUserInTheAdminList(formData);

    if (data) {
      dispatch(addUserIntheList(data.admin));
      dispatch(handleAddUserModel());
    }
  };
  const { addUserModel } = useSelector((state) => state.chat);
  return (
    <div
      className={`open_model ${addUserModel ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
    >
      <div className="flex h-full w-full flex-col overflow-hidden bg-[#f0f2f5] shadow-2xl rounded-sm">
        <div className="flex h-14 items-end bg-[#008069] p-5 text-white">
          <div className="flex items-center gap-6">
            <button className="hover:opacity-80">
              <svg
                xmlns="http://w3.org"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <h1 className="text-xl font-medium tracking-wide">New chat</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 bg-white p-6 space-y-8">
          <div className="relative border-b border-gray-200 focus-within:border-[#008069] transition-colors py-1">
            <label className="block text-xs font-normal text-[#008069] mb-1">
              User Name
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Enter name"
              required
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Email Input */}
          <div className="relative border-b border-gray-200 focus-within:border-[#008069] transition-colors py-1">
            <label className="block text-xs font-normal text-[#008069] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="relative border-b border-gray-200 focus-within:border-[#008069] transition-colors py-1">
            <label className="block text-xs font-normal text-[#008069] mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>

          {/* WhatsApp Style Floating Action Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00a884] text-white shadow-md hover:bg-[#008069] transition-all hover:scale-105"
            >
              {/* Checkmark Icon */}
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
        </form>
      </div>
    </div>
  );
}

export default AddUserModel;
