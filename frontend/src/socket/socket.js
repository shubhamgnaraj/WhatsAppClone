import { io } from "socket.io-client";

const socketURL = "http://localhost:3000";

export const socket = io(socketURL, {
    withCredentials: true,
    autoConnect: false,
    reconnection: true,
});

export const getSocketToken = () => {
    const localToken = localStorage.getItem("token");
    if (localToken) return localToken;

    const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

    return cookieToken || null;
};

export const connectSocket = () => {
    const token = getSocketToken();
    if (!token) return false;

    socket.auth = { token };
    if (!socket.connected) socket.connect();
    return true;
};

socket.on("connect", () => {
    console.log("connected socket!", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("socket connect_error:", error.message);
});
