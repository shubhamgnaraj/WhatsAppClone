import React from "react";
import { useState } from "react";
import { registerUserService } from "../../service/userAuth.service";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()
  const handleOnSubmitUserRegisteration = async (e) => {
    e.prevetDefault();

    if (!userName.trim() || !email.trim() || !password.trim())
      return alert("all filed is required");

    const data = await registerUserService({ userName, email, password });

   if(data) {
    localStorage.setItem("adminId", data.userExist._id)

    navigate("/api/admin/users")
   }

    setUserName("");
    setEmail("");
    setPassword("");
  };

  return (
    <form onSubmit={handleOnSubmitUserRegisteration}>
      <input
        type="text"
        placeholder="Enter your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="border border-gray-300 "
      />
      <input
        type="email"
        placeholder="Enter here Email"
        value={email}
        className="border border-gray-300 "
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter here Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 "
      />

      <input type="submit" value="Submit" className="border border-gray-300 " />
    </form>
  );
}

export default RegisterForm;
