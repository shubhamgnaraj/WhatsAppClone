import "./App.css";
import { Router, Route, Routes } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import MessagePage from "./components/MessagePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
        <Route path="/register/user" element={<RegisterForm />} />
        <Route path="/login/user" element={<LoginForm />} />

        <Route path="/api/admin/users" element={<MessagePage />} />
    </Routes>
  );
}

export default App;
