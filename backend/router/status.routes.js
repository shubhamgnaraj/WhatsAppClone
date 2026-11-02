import express from 'express'
import upload from "../service/multer.js"
import { userValidation } from '../service/authValidation.service.js';
import {
	getUploadedUsersStatuses,
	getUserStatus,
	saveStatusDataInDB,
} from '../controller/status.controller.js';

const statusRouter = express.Router();

statusRouter.post("/admin/status", userValidation, upload.single("mediaData"), saveStatusDataInDB);

statusRouter.get("/admin/status", userValidation, getUploadedUsersStatuses);
statusRouter.get("/user/status/:userId", userValidation, getUserStatus)

export default statusRouter;