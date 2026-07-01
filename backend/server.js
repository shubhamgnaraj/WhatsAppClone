import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import dontenv from "dotenv";
dontenv.config();

import app from "./app.js";
import { socketValidation } from "./service/socketValidation.service.js";
import Message from "./models/message.model.js";
import client from "./service/redisConnection.js";
import GroupMember from "./models/groupMember.model.js";

const server = http.createServer(app);
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL;

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
    const sentMessages = await Message.find({
        reciverId: adminId,
        status: "sent",
    }).select("senderId");

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

    socket.on('joinGroup', ({ userId }) => {
        socket.join(userId)
    })

    socket.on("chatOpenClearUnread", async ({ userId }) => {
        const removeCount = await client.hDel(`unread:${adminId}`, userId);

        socket.emit("removeUnreadCount", { userId });
    });

    socket.on("chat_opend", async ({ chattingWith }) => {
        await client.set(`chat_with:${adminId}`, chattingWith);
    });

    socket.on("MsgsReadBatch", async ({ batchIds, senderId }) => {
        const message = await Message.updateMany(
            { _id: { $in: batchIds }, status: { $ne: "read" } },
            { $set: { status: "read" } },
        );

        io.to(senderId).emit("msgStatusUpdate", { batchIds, status: "read" });
    });

    socket.on("typing_start", ({ reciverId, }) => {
        console.log("typing start");
        socket.to(reciverId).emit("typingStart", { reciverId, senderId: adminId });
    });

    socket.on("typing_stop", ({ reciverId }) => {
        socket.to(reciverId).emit("typingStop", { reciverId, senderId: adminId });
    });

    socket.on("sendMessage", async (messageData) => {
        try {
            const { reciverId, content, chatType } = messageData;
            const mongoRId = new mongoose.Types.ObjectId(reciverId);
            const mongoSId = new mongoose.Types.ObjectId(adminId);

            if (chatType === "Group") {
                const createMsg = await Message.create({
                    reciverId,
                    senderId: adminId,
                    messageType: 'text',
                    chatType,
                    content,
                    status: 'delivered',
                    createdAt: Date.now()
                })

                socket.emit('msgCreated', createMsg);

                let memberIds = await client.sMembers(`group_members:${reciverId}`)

                if (!memberIds || memberIds.length === 0) {
                    const members = await GroupMember.find({ groupId: mongoRId }).select("memberId");

                    memberIds = members.map((m) => m.memberId.toString());

                    if (memberIds.length > 0) {
                        await client.sAdd(`group_members:${reciverId}`, memberIds);
                        await client.expire(`group_members:${reciverId}`, 86400)
                    }
                }

                memberIds.forEach(async (memId) => {
                    if (memId === adminId) return;

                    const isMemOnline = await client.sIsMember('online', memId);
                    if (isMemOnline) {

                        console.log('ismemOnline: ', memId)
                        io.to(memId).emit("reciveAMsg", createMsg);
                    } else await client.hIncrBy(`unRead:${memId}`, reciverId, 1)
                })

                return;
            } else {
                let localStatus;
                const isOnline = await client.sIsMember(`online`, reciverId);
                const currentChatWith = await client.get(`chat_with:${reciverId}`);
                const isChatWindowOpen = currentChatWith === adminId;

                if (isOnline && !isChatWindowOpen) localStatus = "delivered";
                else if (isOnline && isChatWindowOpen) localStatus = "read";
                else localStatus = "sent";

                const createMsg = await Message.create({
                    reciverId: mongoRId,
                    senderId: mongoSId,
                    messageType: "text",
                    chatType,
                    content,
                    createdAt: Date.now(),
                    status: localStatus,
                });

                socket.emit("msgCreated", createMsg);

                if (chatType === 'Group') {
                    io.to(reciverId).emit("reciverAMsg", createMsg)
                }
                if (isOnline && isChatWindowOpen) {
                    io.to(reciverId).emit("reciveAMsg", createMsg);

                } else if (isOnline && !isChatWindowOpen) {
                    const updateCount = await client.hIncrBy(`unread:${reciverId}`, adminId, 1);
                    io.to(reciverId).emit("notificationMsg", { senderId: adminId, unreadCount: updateCount });
                    io.to(reciverId).emit("msgSendSuccessfully", { readByUser: adminId, status: "delivered" });

                } else {
                    await client.hIncrBy(`unread:${reciverId}`, adminId, 1);
                    io.to(reciverId).emit("msgSendSuccessfully", { readByUser: adminId, status: "sent" });
                }
            }



        } catch (error) {
            socket.emit("errorOccured", error.message);
        }
    });

    socket.on("disconnect", async () => {
        await client.sRem("online", adminId);
        await client.del(`chat_with:${adminId}`);
    });
});

mongoose
    .connect(mongoUrl)
    .then(() => {
        console.log("connnected mongo✅");
        server.listen(port, () => {
            console.log("server connected");
        });
    })
    .catch((err) => {
        console.log(`something went wrong: ${err.message}`);
    });
