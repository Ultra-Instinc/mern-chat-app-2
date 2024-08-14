import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.ts";
import contactRoute from "./routes/contactRoutes.ts";
import messagesRoute from "./routes/messagesRoute.ts";
import channelsRoute from "./routes/channelRoute.ts";
import setupSocket from "./socket.ts";

config();

const app = express();
app.use(cookieParser());
app.use(
	cors({
		origin: [process.env.ORIGIN!],
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
		credentials: true,
	})
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.get("/", (_, res) => {
	res.send("Hello World");
});

app.use("/api/auth", authRoute);
app.use("/api/contacts", contactRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/channels", channelsRoute);

const server = app.listen(PORT, () => {
	console.log(`server running at http://localhost:${PORT}`);
});
setupSocket(server);
mongoose
	.connect(process.env.DATABASE_URL!)
	.then(() => console.log("Mongo DB connected successfully!"))
	.catch((err) => console.error(err));
