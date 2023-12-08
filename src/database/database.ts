import mongoose, { Connection } from "mongoose";
import config from "../config";

class Database {
  fromTest: boolean;

  constructor(fromTest: boolean) {
    this.fromTest = fromTest;
  }

  async connect() {
    try {
      if (this.fromTest) {
        await mongoose.connect(config.DB_ADDRESS_TEST);
      } else {
        await mongoose.connect(config.DB_ADDRESS);
      }
      console.log(this.fromTest ? "DB TEST connected !" : "DB connected !");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error;
    }
  }
}

export default Database;
export type { Database };
