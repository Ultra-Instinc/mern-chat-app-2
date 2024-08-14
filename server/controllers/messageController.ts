import { Response, Request } from "express";
import { mkdirSync, renameSync } from "fs";
import Message from "./../models/messageModel.ts";
export const getMessages: any = async (
	req: Request & { userId: string },
	res: Response
) => {
	try {
		const user1 = req.userId;
		const user2 = req.body.id;
		if (!user1 || !user2)
			return res.status(400).send("Both user ID's are required!");

		const messages = await Message.find({
			$or: [
				{ sender: user1, recipient: user2 },
				{ sender: user2, recipient: user1 },
			],
		}).sort({ timestamp: 1 });
		return res.status(200).json({ messages });
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<messageController>");
	}
};
export const uploadFile: any = async (
	req: Request & { userId: string },
	res: Response
) => {
	try {
		if (!req.file) {
			return res.status(400).send("File is required");
		}
		const date = Date.now();
		let fileDir = `uploads/files/${date}`;
		let fileName = `${fileDir}/${req.file.originalname}`;

		mkdirSync(fileDir, { recursive: true });

		renameSync(req.file.path, fileName);

		return res.status(200).json({ filePath: fileName });
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<messageController>");
	}
};
