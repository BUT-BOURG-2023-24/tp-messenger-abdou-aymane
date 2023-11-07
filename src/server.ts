import { makeApp } from "./app";
import  Database from "./database/database";
import config from "./config";

let DBInstance = new Database(
	false
);
const auth = require("./auth");

const { server } = makeApp(DBInstance,auth);

server.listen(config.PORT, () => {
	console.log(`Server is listening on http://localhost:${config.PORT}`);
});