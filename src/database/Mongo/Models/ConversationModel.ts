import mongoose, { Schema, Document, Types } from "mongoose";
import { MongooseID } from "../../../types";

export interface IConversation extends Document {
  participants: Types.Array<Types.ObjectId | string>;
  messages: Types.Array<Types.ObjectId | string>;
  title: string;
  lastUpdate: Date;
  seen: { [userId: string]: string };
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
  participants: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
  messages: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    default: [],
  },  
  title: {
    type: String,
    required: true,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
  seen: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      messageId: {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
      hasSeen: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const ConversationModel = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default ConversationModel;
