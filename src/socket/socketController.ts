import type { Database } from "../database/database";
import { Server, Socket } from "socket.io";
import type { IConversation } from "../database/Mongo/Models/ConversationModel";
import ConversationModel from "../database/Mongo/Models/ConversationModel";

export class SocketController {
  private socketIdToUserId: Record<string, string> = {};

  constructor(private io: Server, private database: Database) {
    this.connect();
    this.listenRoomChanged();
  }

  public get SocketIdToUserId(): string[] {
    return Object.values(this.socketIdToUserId);
  }

  connect() {
    this.io.on("connection", async (socket: Socket) => {
      const userId = socket.handshake.headers.userid;
      if (typeof userId === "string") {
        this.socketIdToUserId[socket.id] = userId;
        console.log("userId", userId);
      }
      const conversations = await findUserConversations(String(userId));
      joinRooms(socket, conversations);

      // Handle disconnect event
      socket.on("disconnect", () => {
        if (this.socketIdToUserId[socket.id]) {
          const disconnectedUserId = this.socketIdToUserId[socket.id];
          delete this.socketIdToUserId[socket.id];
          console.log(`User ${disconnectedUserId} disconnected`);
        }
      });
    });

    function joinRooms(socket: Socket, conversations: IConversation[]): void {
      conversations.forEach((conversation) => {
        const roomName = String(conversation.id);
        socket.join(roomName);
      });
    }

    async function findUserConversations(userId: string): Promise<IConversation[]> {
      const userConversations = await ConversationModel.find({
        participants: { $in: [userId] },
      });
      return userConversations;
    }
  }

  // This function is just for debugging.
  // It logs information for each room change.
  listenRoomChanged() {
    const handleRoomChange = (event: string, room: string, id: string) => {
      console.log(`Socket ${id} ${event} room ${room}`);
    };

    this.io.of("/").adapter.on("create-room", (room) => {
      handleRoomChange("created", room, "");
    });

    this.io.of("/").adapter.on("join-room", (room, id) => {
      handleRoomChange("joined", room, id);
    });

    this.io.of("/").adapter.on("leave-room", (room, id) => {
      handleRoomChange("left", room, id);
    });

    this.io.of("/").adapter.on("delete-room", (room) => {
      handleRoomChange("deleted", room, "");
    });
  }
}
