import type { Database } from "../database/database";
import { Server, Socket } from "socket.io";
import type { IConversation } from "../database/Mongo/Models/ConversationModel";
import {IMessage} from "../database/Mongo/Models/MessageModel";
import ConversationModel from "../database/Mongo/Models/ConversationModel";
import {getAllConversationsForUser} from "../services/ConversationService"
export class SocketController {
  public socketIdToUserId: Map<string, string> = new Map<string, string>();

  constructor(private io: Server, private Database: Database) {
      this.connect();
      this.listenRoomChanged();
  }

  connect() {
      this.io.on("connection", async (socket: Socket) => {
          const userId = socket.handshake.headers.userid as string;
          console.log("user connected : " + userId);
          await this.connectionToSocketRoom(userId, socket);
          socket.on("disconnect", () => {
              this.socketIdToUserId.delete(socket.id);
              socket.broadcast.emit("@onDisconnected", {userId});
          });
      });
  }

  private async connectionToSocketRoom(userId: string, socket: Socket) {
      if (userId) {
          this.socketIdToUserId.set(socket.id, userId);
      }
      const conversations = await getAllConversationsForUser(userId)
      if (!('error' in conversations)) {
        for (const conversation of conversations) {
          socket.join(conversation.id.toString());
        }
      }
      socket.broadcast.emit("@onConnected", {userId});
  }

  public addMessageEvent(conversationId: string, message: IMessage): void {
      this.io.to(conversationId).emit("@newMessage", {message});
  }


  public editedMessageEvent(conversationId: string, message: IMessage): void {
      this.io.to(conversationId).emit("@messageEdited", {message});
  }

  public deletedMessageEvent(conversationId: string, message: IMessage): void {
      this.io.to(conversationId).emit("@messageDeleted", {message});
  }

  public addReactionEvent(conversationId: string, message: IMessage): void {
      this.io.to(conversationId).emit("@reactionAdded", {message});
  }

  public deleteConversationEvent(conversation: IConversation): void {
      this.io.to(conversation._id.toString()).emit("@conversationDeleted", {conversation});
  }

  public seenConversationEven(conversation: IConversation): void {
      this.io.to(conversation._id.toString()).emit("@conversationSeen", {conversation});
  }

  private getUserSocketId(userId: string) {
      for (let [socketId, id] of this.socketIdToUserId.entries()) {
          if (id === userId) {
              return socketId;
          }
      }
      return null;
  }

  public newConversationEvent(conversation: IConversation, participants: string[]) {
      participants.forEach((participant) => {
          let socketId = this.getUserSocketId(participant);
          if (socketId) {
              this.io.sockets.sockets.get(socketId)?.join(conversation._id.toString());
          }
      });
      this.io.to(conversation._id.toString()).emit("@newConversation", {conversation});
  }
 
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
