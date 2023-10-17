import mongoose, { Schema, Document, Types } from "mongoose";
import { MongooseID } from "../../../types";

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  from: Types.ObjectId;
  content: string;
  postedAt: Date;
  replyTo: Types.ObjectId | null;
  edited: boolean;
  deleted: boolean;
  reactions: { [userId: string]: string };
}

const MessageSchema: Schema<IMessage> = new Schema<IMessage>({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
  edited: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  reactions: {
    type: Map,
    of: String,
  },
});

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export { MessageModel, MessageSchema };
