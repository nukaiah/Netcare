import express from 'express';
const groupDcoumentRouter = express.Router();
import { uploadGroupDocumentsController, getGropuDocumentsController } from "../Controllers/GroupDocumentsController.js";
import { checkAuth, checkSuperAdmin } from "../Utils/Jwt_Token.js"

groupDcoumentRouter.post("/create", checkAuth, checkSuperAdmin, uploadGroupDocumentsController);
groupDcoumentRouter.get("/getAll", checkAuth, getGropuDocumentsController);

export default groupDcoumentRouter;

