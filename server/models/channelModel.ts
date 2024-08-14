import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	members: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
	],
	admin: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	messages: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Message",
			required: false,
		},
	],
	createdAt: {
		type: Number,
		default: Date.now(),
	},
	updatedAt: {
		type: Number,
		default: Date.now(),
	},
});
//mongoose middleware to handle updating on save operation
ChannelSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});
//mongoose middleware to handle updating on findOneAndUpdate operation
ChannelSchema.pre("findOneAndUpdate", function (next) {
	this.set({ updatedAt: Date.now() });
	next();
});

const Channel = mongoose.model("Channel", ChannelSchema);
export default Channel;
