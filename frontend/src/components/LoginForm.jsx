import { useState } from "react";
import { loginUserService } from "../service/userAuth.service";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const handleOnSubmitUserLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim())
      return alert("all filed is required");

    const data = await loginUserService({ email, password });

    if(data) {
      localStorage.setItem("adminId", data.userExist._id)
      navigate("/api/admin/users")
    }
    setEmail("");
    setPassword("");

  };

  return (
    <form
      onSubmit={handleOnSubmitUserLogin}
      className="p-10 flex flex-col gap-4"
    >
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        className="border border-gray-300 "
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Youe Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 "
      />

      <input type="submit" value="Submit" className="border border-gray-300 " />
    </form>
  );
}

export default LoginForm;
