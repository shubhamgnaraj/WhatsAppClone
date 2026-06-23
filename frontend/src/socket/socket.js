import { io } from "socket.io-client";

const socketURL = "http://localhost:3000";

export const socket = io(socketURL, { withCredentials: true })

