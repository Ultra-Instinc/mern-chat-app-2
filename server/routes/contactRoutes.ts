import { Router } from "express";
import {
	getAllContacts,
	getContactsForDMList,
	searchContacts,
} from "./../controllers/contactController.ts";
import { verifyToken } from "./../middlewares/authMiddleware.ts";

const router = Router();

router.post("/search", verifyToken, searchContacts);
router.get("/get-contacts-for-dm", verifyToken, getContactsForDMList);
router.get("/get-all-contacts", verifyToken, getAllContacts);

export default router;
