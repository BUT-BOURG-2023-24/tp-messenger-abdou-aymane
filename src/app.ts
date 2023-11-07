import * as http from "http";
import express from "express";
import { Server } from "socket.io";
import { Database } from "./database/database";
import { SocketController } from "./socket/socketController";
import ConversationRouter from "./routers/ConversationRouter"
import MessageRouter from "./routers/MessageRouter"

const app = express();

function makeApp(database: Database) 
{
	app.locals.database = database;

	const server = http.createServer(app);
	app.use(express.json());
	
	app.use('/conversations', ConversationRouter);
	app.use('/message', MessageRouter);

	const io = new Server(server, { cors: { origin: "*" } });
	let socketController = new SocketController(io, database);

	app.locals.sockerController = socketController;

	return { app, server };
}

export { makeApp };
