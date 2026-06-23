import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { loginUser, registerUser } from "./controller/userAuth.controller.js";
import { userValidation } from "./service/authValidation.service.js";
import { addUserAdminList, getUsersAndGroupsAdminList, getTheMessgesSAndR } from "./controller/user.controller.js";
import upload from "./service/multer.js";
import groupRouter from "./router/group.routes.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(groupRouter);

app.get("/", (req, res) => {
    res.send("hello world");
});

app.post("/register/user", registerUser);
app.post("/login/user", loginUser);

app.post("/api/add/user", userValidation, addUserAdminList);
app.get("/api/admin/users", userValidation, getUsersAndGroupsAdminList)

app.get("/api/messages/", userValidation, getTheMessgesSAndR);
// app.post("/api/upload/media", upload.single('media'), userValidation, mediaHandler)


export default app;
