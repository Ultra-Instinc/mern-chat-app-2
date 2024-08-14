import jwt from "jsonwebtoken";
export const jwtTokenInstance = (email: string, userId: any) => {
	return jwt.sign({ email, userId }, process.env.JWT_KEY!, {
		expiresIn: 3 * 24 * 60 * 60 * 1000,
	});
};
