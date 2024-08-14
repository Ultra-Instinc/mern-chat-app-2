import { Router } from "express";
import {
	login,
	signUp,
	getUserInfo,
	updateProfile,
	addProfileImage,
	removeProfileImage,
	logout,
} from "../controllers/authController.ts";
import { verifyToken } from "../middlewares/authMiddleware.ts";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/profiles/" });

router.post("/signup", signUp);
router.post("/login", login);
router.get("/user-info", verifyToken, getUserInfo);
router.post("/update-profile", verifyToken, updateProfile);
router.post(
	"/add-profile-image",
	verifyToken,
	upload.single("profile-image"),
	addProfileImage
);

router.delete("/remove-profile-image", verifyToken, removeProfileImage);
router.post("/logout", logout);

export default router;
