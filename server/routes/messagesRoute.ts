import { Router } from "express";
import { getMessages, uploadFile } from "../controllers/messageController.ts";
import { verifyToken } from "./../middlewares/authMiddleware.ts";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "uploads/files" });

router.post("/get-messages", verifyToken, getMessages);
router.post("/upload-file", verifyToken, upload.single("file"), uploadFile);

export default router;
