import * as http from "http";
import express from "express";
import { Server } from "socket.io";
import { Database } from "./database/database";
import { SocketController } from "./socket/socketController";
import UserRouter from "./routers/UserRouter";
import cors from "cors";
import ConversationRouter from "./routers/ConversationRouter"
import MessageRouter from "./routers/MessageRouter"

const app = express();

function makeApp(database: Database, auth: any) {
  app.locals.database = database;
  database.connect();
  app.locals.auth = auth;
  const server = http.createServer(app);
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

	const server = http.createServer(app);
	app.use(express.json());
	
	app.use('/conversations', ConversationRouter);
	app.use('/message', MessageRouter);

 
  app.use("/users", UserRouter);

  app.locals.sockerController = socketController;

  return { app, server };
}

export { makeApp };
