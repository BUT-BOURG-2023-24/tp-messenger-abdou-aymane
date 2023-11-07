import UserModel, { IUser } from "../database/Mongo/Models/UserModel";

async function createUser(username:string,password:string,profilePicId:string) {
  try {
    const user = new UserModel({username,password,profilePicId});
    const savedUser = await user.save();
    return { user: savedUser };
  } catch (error) {
    return { error };
  }
}

async function getUserByName(username: string) : Promise<IUser | null>{
  try {
    const user = await UserModel.findOne({ username });
    return user;
  } catch (error) {
    return null ;
  }
}

async function getUserById(id: string) {
  try {
    const user = await UserModel.findById(id);
    return { user };
  } catch (error) {
    return { error };
  }
}

async function getUsersByIds(ids: string[]) {
  try {
    const users = await UserModel.find({ _id: { $in: ids } });
    return { users };
  } catch (error) {
    return { error };
  }
}


export { createUser, getUserByName, getUserById, getUsersByIds };
