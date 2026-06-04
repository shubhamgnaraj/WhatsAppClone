import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { socketValidation } from "./service/socketValidation.service.js";
import Message from "./models/message.model.js";
import client from "./service/redisConnection.js";

const server = http.createServer(app);
const port = 3000;
const mongoUri =
    "mongodb+srv://ganraj:ganraj123@cluster0.s9mvtn8.mongodb.net/?appName=Cluster0";

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

io.use(socketValidation);

io.on("connection", async (socket) => {
    console.log("Socket connected:", socket.id);

    const adminId = socket.adminId;

    if (!adminId) return;

    const addInList = await client.sAdd(`online`, adminId);

    socket.join(adminId);

    // Update sent messages to delivered and notify senders
    const sentMessages = await Message.find(
        { reciverId: adminId, status: "sent" }
    ).select("senderId");

    if (sentMessages.length > 0) {
        await Message.updateMany(
            { reciverId: adminId, status: "sent" },
            { $set: { status: "delivered" } },
        );

        // Notify each sender about delivery status
        sentMessages.forEach((msg) => {
            io.to(msg.senderId.toString()).emit("msgStatusUpdate", {
                reciverId: adminId,
                status: "delivered",
            });
        });
    }

    const userUnreadCounts = await client.hGetAll(`unread:${adminId}`);

    if (userUnreadCounts && Object.keys(userUnreadCounts).length > 0) {
        socket.emit("unreadMsgesCount", userUnreadCounts);
    }

    socket.on("chatOpenClearUnread", async ({ userId }) => {
        const removeCount = await client.hDel(`unread:${adminId}`, userId);

        socket.emit("removeUnreadCount", { userId });
    });

    socket.on("chat_opend", async ({ chattingWith }) => {
        await client.set(`chat_with:${adminId}`, chattingWith);

        const message = await Message.updateMany(
            { senderId: new mongoose.Types.ObjectId(chattingWith), reciverId: new mongoose.Types.ObjectId(adminId), status: { $ne: 'read' } },
            { $set: { status: 'read' } }
        );

        // Notify sender about read status
        io.to(chattingWith).emit("msgStatusUpdate", { reciverId: adminId, status: 'read' })
    });

    socket.on("typing_start", ({ reciverId }) => {
        socket.to(reciverId).emit("typingStart", { reciverId, senderId: adminId });
    });

    socket.on("typing_stop", ({ reciverId }) => {
        socket.to(reciverId).emit("typingStop", { reciverId, senderId: adminId });
    });

    socket.on("sendMessage", async (messageData) => {
        try {
            const { reciverId, content } = messageData;

            let localStatus;
            const isOnline = await client.sIsMember(`online`, reciverId);
            const currentChatWith = await client.get(`chat_with:${reciverId}`);

            const isChatWindowOpen = currentChatWith === adminId;

            if (isOnline && !isChatWindowOpen) localStatus = "delivered";
            else if (isOnline && isChatWindowOpen) localStatus = "read";
            else localStatus = "sent";

            const mongoRId = new mongoose.Types.ObjectId(reciverId);
            const mongoSId = new mongoose.Types.ObjectId(adminId);

            const createMsg = await Message.create({
                reciverId: mongoRId,
                senderId: mongoSId,
                content,
                createdAt: Date.now(),
                status: localStatus,
            });

            // Send created message back to sender with actual status
            socket.emit("msgCreated", createMsg);

            if (isOnline && isChatWindowOpen) {
                io.to(reciverId).emit("reciveAMsg", createMsg);

            } else if (isOnline && !isChatWindowOpen) {
                const updateCount = await client.hIncrBy(
                    `unread:${reciverId}`,
                    adminId,
                    1,
                );

                io.to(reciverId).emit("notificationMsg", {
                    senderId: adminId,
                    unreadCount: updateCount,
                });

                io.to(reciverId).emit("msgSendSuccessfully", { readByUser: adminId, status: 'delivered' })

            } else {
                await client.hIncrBy(`unread:${reciverId}`, adminId, 1);
                io.to(reciverId).emit("msgSendSuccessfully", { readByUser: adminId, status: 'sent' })

            }
        } catch (error) {
            socket.emit("errorOccured", error.message);
        }
    });

    // disconnect server
    socket.on("disconnect", async () => {
        await client.sRem("online", adminId);
        await client.del(`chat_with:${adminId}`);
    });
});

mongoose
    .connect(mongoUri)
    .then(() => {
        console.log("connnected mongo✅");
        server.listen(port, () => {
            console.log("server connected");
        });
    })
    .catch((err) => {
        console.log(`something went wrong: ${err.message}`);
    });
