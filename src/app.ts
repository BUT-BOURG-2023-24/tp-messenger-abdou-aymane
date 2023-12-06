import * as http from "http";
import express from "express";
import { Server } from "socket.io";
import { Database } from "./database/database";
import { SocketController } from "./socket/socketController";
import UserRouter from "./routers/UserRouter";
import cors from "cors";
import ConversationRouter from "./routers/ConversationRouter";
import MessageRouter from "./routers/MessageRouter";

const app = express();

function makeApp(database: Database) {
  app.locals.database = database;
  database.connect();
  const server = http.createServer(app);
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: "*",
    })
  );

  app.use("/conversations", ConversationRouter);
  app.use("/message", MessageRouter);
  app.use("/users", UserRouter);

  const io = new Server(server, { cors: { origin: "*" } });
  let socketController = new SocketController(io, database);
  app.locals.sockerController = socketController;

  return { app, server };
}

export { makeApp };
