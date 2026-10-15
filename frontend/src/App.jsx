import "./App.css";
import { Route, Routes, Outlet } from "react-router-dom";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import Home from "./components/Home";
import StatusScreen from "./screen/StatusScreen";
import ChatScreen from "./screen/ChatScreen";
import InheritTwoPage from "./components/backgroundPages/InheritTwoPage";
import { useEffect } from "react";
import { connectSocket, socket } from "./socket/socket";
import { socketListner } from "./socket/socketListner";

function AppLayout() {
  return (
    <InheritTwoPage>
      <Outlet />
    </InheritTwoPage>
  );
}

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const connected = connectSocket();
    if (!connected) return;

    const cleanup = socketListner();

    return () => {
      cleanup();
      socket.disconnect();
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register/user" element={<RegisterForm />} />
      <Route path="/login/user" element={<LoginForm />} />

      <Route element={<AppLayout />}>
        <Route path="/status" element={<StatusScreen />} />
        <Route path="/users/chats" element={<ChatScreen />} />
        <Route path="/users/status" element={<StatusScreen />} />
      </Route>
    </Routes>
  );
}

export default App;
