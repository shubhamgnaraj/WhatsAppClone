import React from "react";
import  {useNavigate}  from "react-router-dom";

function Home() {
  const navigate = useNavigate()
  return (
    <div>
      <button className="p-4 border border-gray300 rounded-lg"onClick={() => navigate("/register/user")}>Register</button>
      <button className="p-4 border border-gray300 rounded-lg" onClick={() => navigate("/login/user")}>Login</button>
    </div>
  );
}

export default Home;
