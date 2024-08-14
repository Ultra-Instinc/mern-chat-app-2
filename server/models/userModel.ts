import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";
const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Email is Required!"],
		unique: [true, "This Email is already associated with an account!"],
	},
	password: {
		type: String,
		required: [true, "Password is Required!"],
	},
	firstName: {
		type: String,
		required: false,
	},
	lastName: {
		type: String,
		required: false,
	},
	image: {
		type: String,
		required: false,
	},
	color: {
		type: Number,
		required: false,
	},
	profileSetup: {
		type: Boolean,
		default: false,
	},
});

UserSchema.pre("save", async function (next) {
	const salt = await genSalt();
	this.password = await hash(this.password, salt);
	next();
}); // middleWare to encrypt the password before saving to database

const User = mongoose.model("User", UserSchema);

export default User;
