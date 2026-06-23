import express from 'express'
import { createGroup, getValidAdminGroups} from '../controller/group.controller.js';
import { userValidation } from '../service/authValidation.service.js';

const groupRouter = express.Router();

groupRouter.post("/api/create/group", userValidation, createGroup )
groupRouter.get("/api/get/groups", userValidation, getValidAdminGroups)

export default groupRouter;