import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";


export interface IUser extends Document {
	username: string;
	password: string;
	profilePicId: string;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
	username: {
		type: String,
		require: true,
	},
	password: {
		type: String,
		required: true,
	},
	profilePicId: {
		type: String,
		required: true,
	}
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
