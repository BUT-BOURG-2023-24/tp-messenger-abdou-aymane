import type { Database } from "../database/database";
import { Server, Socket } from "socket.io";

export class SocketController {
  private socketIdToUserId: string[] = [];

  constructor(private io: Server, private database: Database) {
    this.connect();
    this.listenRoomChanged();
  }

  public get SocketIdToUserId(): string[] {
	return this.socketIdToUserId;
  }
  


  connect() {
    this.io.on("connection", (socket: Socket) => {
      const userId = socket.handshake.headers.userid;
      if (typeof userId === "string") {
        this.socketIdToUserId.push(userId);
        console.log("userId", userId);
      }
    });
  }

  // Cette fonction vous sert juste de debug.
  // Elle permet de log l'informations pour chaque changement d'une room.
  listenRoomChanged() {
    this.io.of("/").adapter.on("create-room", (room) => {
      console.log(`room ${room} was created`);
    });

    this.io.of("/").adapter.on("join-room", (room, id) => {
      console.log(`socket ${id} has joined room ${room}`);
    });

    this.io.of("/").adapter.on("leave-room", (room, id) => {
      console.log(`socket ${id} has leave room ${room}`);
    });

    this.io.of("/").adapter.on("delete-room", (room) => {
      console.log(`room ${room} was deleted`);
    });
  }
}
