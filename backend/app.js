import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { loginUser, registerUser } from "./controller/userAuth.controller.js";
import { userValidation } from "./service/authValidation.service.js";
import { getTheUser, addUserAdminList, getUsersInAdminList, getTheMessgesSAndR } from "./controller/user.controller.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true   
}));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("hello world");
});

app.post("/register/user", registerUser);
app.post("/login/user", loginUser);

app.get("/api/user", userValidation, getTheUser);
app.post("/api/add/user", userValidation, addUserAdminList);
app.get("/api/admin/users", userValidation, getUsersInAdminList)

app.get("/api/messages/:reciverId", userValidation, getTheMessgesSAndR)

export default app;
