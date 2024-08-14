import { Response, Request } from "express";
import User from "./../models/userModel.ts";
import mongoose from "mongoose";
import Message from "../models/messageModel.ts";
export const searchContacts: any = async (
	req: Request & { userId: string },
	res: Response
) => {
	try {
		const { searchTerm } = req.body;
		if (!searchTerm) return res.status(400).send("SearchTerm required");

		const sanitizedSearchTerm = searchTerm.replace(
			/[.*+?^{}()|[\]\\]/g,
			"\\$&"
		);
		const regex = new RegExp(sanitizedSearchTerm, "i");
		const contacts = await User.find({
			$and: [
				{ _id: { $ne: req.userId } }, // exclude the user that makes the requres
				{ $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }, // if the [fn||ln||email] includes searchTerm
			],
		});
		return res.status(200).json({ contacts });
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<contactsController>");
	}
};

export const getAllContacts: any = async (
	req: Request & { userId: string },
	res: Response
) => {
	try {
		const users = await User.find(
			{ _id: { $ne: req.userId } },
			"firstName lastName _id email"
		);

		const contacts = users.map((user) => ({
			label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
			value: user._id,
		}));
		return res.status(200).json({ contacts });
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<contactsController>");
	}
};

export const getContactsForDMList: any = async (
	req: Request & { userId: mongoose.Types.ObjectId },
	res: Response
) => {
	try {
		let { userId } = req;

		userId = new mongoose.Types.ObjectId(userId);

		const contacts = await Message.aggregate([
			{
				$match: {
					$or: [{ sender: userId }, { recipient: userId }],
				},
			},
			{
				$sort: { timeStamp: -1 },
			},
			{
				$group: {
					_id: {
						$cond: {
							if: { $eq: ["$sender", userId] },
							then: "$recipient",
							else: "$sender",
						},
					},
					lastMessageTime: { $first: "$timestamp" },
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "_id",
					foreignField: "_id",
					as: "contactInfo",
				},
			},
			{ $unwind: "$contactInfo" },
			{
				$project: {
					_id: 1,
					lastMessageTime: 1,
					email: "$contactInfo.email",
					firstName: "$contactInfo.firstName",
					lastName: "$contactInfo.lastName",
					image: "$contactInfo.image",
					color: "$contactInfo.color",
				},
			},
			{
				$sort: {
					lastMessageTime: -1,
				},
			},
		]);

		return res.status(200).json({ contacts });
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<contactsController>");
	}
};
