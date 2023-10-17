import mongoose, { Schema, Document, Types } from "mongoose";
import { MongooseID } from "../../../types";


export interface IConversation extends Document {
  participants: Types.Array<Types.ObjectId>;
  messages: Types.Array<Types.ObjectId>;
  title: string;
  lastUpdate: Date;
  seen: { [userId: string]: string };
}

const conversationSchema: Schema<IConversation> = new Schema<IConversation>({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  title: {
    type: String,
    required: true,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
  seen: {
    type: Map,
    of: String,
  },
});

const ConversationModel = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default ConversationModel;
