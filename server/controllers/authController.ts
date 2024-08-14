import { Request, Response, NextFunction } from "express";
import User from "../models/userModel.ts";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";
import { jwtTokenInstance } from "../utils/createToken.ts";

export const signUp = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).send("Email and Password is required");
		}
		const user = await User.create({ email, password });
		res.cookie("jwt", jwtTokenInstance(email, user.id), {
			httpOnly: true,
			secure: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "none",
		});
		return res.status(201).json({
			user: {
				id: user.id,
				email: user.email,
				// firstName: user.firstName,
				// lastName: user.lastName,
				// image: user.image,
				profileSetup: user.profileSetup,
			},
		});
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error <authController>");
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).send("Email and Password is required");
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).send("User not found !");
		}
		const auth = await compare(password, user.password);
		if (!auth) {
			return res.status(400).send("Password is In-correct !");
		}
		res.cookie("jwt", jwtTokenInstance(email, user._id), {
			httpOnly: true,
			secure: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "none",
		});
		return res.status(200).json({
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				image: user.image,
				profileSetup: user.profileSetup,
			},
		});
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error <authController>");
	}
};

export const getUserInfo: any = async (
	req: Request & { userId: string },
	res: Response
) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(404).send("User with the given email not found");
		}
		return res.status(200).json({
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			image: user.image,
			profileSetup: user.profileSetup,
			color: user.color,
		});
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<authController>");
	}
};

export const updateProfile: any = async (
	req: Request & { userId: string },
	res: Response
) => {
	try {
		const { userId } = req;
		const { firstName, lastName, color } = req.body;
		if (!firstName || !lastName || !color) {
			return res.status(404).send("FirstName, Lastname & color are required");
		}
		const user = await User.findByIdAndUpdate(
			userId,
			{
				firstName,
				lastName,
				color,
				profileSetup: true,
			},
			{ new: true, runValidators: true }
		);
		if (!user) {
			return res.status(404).send("User with the given email not found");
		}
		return res.status(200).json({
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			image: user.image,
			profileSetup: user.profileSetup,
			color: user.color,
		});
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<authController>");
	}
};
export const addProfileImage: any = async (req: any, res: Response) => {
	try {
		if (!req.file) {
			return res.status(400).send("File is required");
		}
		const date = Date.now();
		let fileName = "uploads/profiles/" + date + req.file.originalname;
		renameSync(req.file.path, fileName);
		const updatedUser = await User.findByIdAndUpdate(
			req.userId,
			{ image: fileName },
			{ new: true, runValidators: true }
		);

		return res.status(200).json({
			image: updatedUser?.image,
		});
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<authController>");
	}
};

export const removeProfileImage: any = async (
	req: Request & { userId: string },
	res: Response
) => {
	try {
		const { userId } = req;
		const user = await User.findById(userId);

		if (!user) return res.status(404).send("User not found");

		if (user.image) {
			unlinkSync(user.image);
		}
		user.image = null;
		await user.save();
		return res.status(200).send("Profile Image Deleted");
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<authController>");
	}
};
export const logout: any = async (_: Request, res: Response) => {
	try {
		res.clearCookie("jwt");
		res.status(200).send("Logout Successful");
	} catch (error) {
		console.log({ error });
		return res.status(500).send("Internal Server Error<authController>");
	}
};
