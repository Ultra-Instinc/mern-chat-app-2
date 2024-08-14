import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.ts";
import {
	createChannel,
	getChannelMessages,
	getUserChannels,
} from "../controllers/channelController.ts";

const router = Router();

router.post("/create-channel", verifyToken, createChannel);
router.get("/get-user-channels", verifyToken, getUserChannels);
router.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);

export default router;
