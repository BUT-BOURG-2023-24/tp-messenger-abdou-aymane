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

	// Récupérer les infos voulu depuis les extra headers.
			// socket.handshake.headers contient ce que vous voulez. 

			/*
				Dès qu'un socket utilisateur arrive, on veut l'ajouter à la room
				pour chaque conversation dans laquelle il se trouve. 

				ETAPE 1: 
					Trouver toutes les conversations ou participe l'utilisateur. 

				ETAPE 2:
					Rejoindre chaque room ayant pour nom l'ID de la conversation. 

				HINT:
					socket.join(roomName: string) permet de rejoindre une room.
					Le paramètre roomName doit absolument être de type string,
					si vous mettez un type number, cela ne fonctionnera pas.
			*/
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
