import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export const verifyToken: any = (
	req: Request & { userId: string },
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies.jwt;
	if (!token) return res.status(401).send("You are not authenticated");
	jwt.verify(token, process.env.JWT_KEY!, async (err, payload) => {
		if (err) return res.status(403).send("Invalid token");
		req.userId = payload.userId;
		next();
	});
};
