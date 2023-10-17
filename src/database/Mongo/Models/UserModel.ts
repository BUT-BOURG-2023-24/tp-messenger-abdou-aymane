import mongoose, { Schema, Document } from "mongoose";
import { MongooseID } from "../../../types";


export interface IUser extends Document {
	username: string;
	password: string;
	profilePicId: string;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
	username: String,
	password: String,
	profilePicId: String,
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
