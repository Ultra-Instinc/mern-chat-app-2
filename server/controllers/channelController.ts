import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/userModel.ts";
import Channel from "./../models/channelModel.ts";

export const createChannel: any = async (
	req: Request & { userId: mongoose.Schema.Types.ObjectId },
	res: Response
) => {
	try {
		const { name, members } = req.body;
		const userId = req.userId;

		const admin = await User.findById(userId);

		if (!admin) {
			return res.status(404).json({ message: "Admin user not found" });
		}

		const validMembers = await User.find({ _id: { $in: members } });

		if (validMembers.length !== members.length) {
			return res
				.status(400)
				.json({ message: "Some members are not valid users" });
		}

		const newChannel = new Channel({
			name,
			members,
			admin: userId,
		});
		await newChannel.save();
		return res.status(201).json({ channel: newChannel });
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<channelController>");
	}
};

export const getChannelMessages: any = async (
	req: Request & { userId: mongoose.Schema.Types.ObjectId },
	res: Response
) => {
	try {
		const { channelId } = req.params;

		const channel = await Channel.findById(channelId).populate({
			path: "messages",
			populate: {
				path: "sender",
				select: "firstName lastName email _id image color",
			},
		});
		if (!channel) return res.status(404).send("Channel not found!");

		const messages = channel.messages;
		return res.status(200).json(messages);
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<channelController>");
	}
};

export const getUserChannels: any = async (
	req: Request & { userId: string },
	res: Response
) => {
	try {
		const userId = new mongoose.Types.ObjectId(req.userId);
		const channels = await Channel.find({
			$or: [{ admin: userId }, { members: userId }],
		}).sort({ updatedAt: -1 });

		return res.status(200).json({ channels });
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<channelController>");
	}
};
