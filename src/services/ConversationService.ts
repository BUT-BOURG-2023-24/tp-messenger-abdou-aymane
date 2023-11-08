const mongoose = require("mongoose");
import { Request, Response } from 'express';
import ConversationModel, { IConversation } from '../database/Mongo/Models/ConversationModel';
import { IMessage } from '../database/Mongo/Models/MessageModel';
import UserModel , {IUser} from '../database/Mongo/Models/UserModel';

// Dans le readme
async function createConversation(participants: string[]) {
  try {
    let title ="Conversations entre ";
    for (const user of participants) {
        const userId: IUser | null = await UserModel.findById(user);
        if (userId) {
          title += userId.username + " ";
        }
    }
    const newConversation = new ConversationModel({
      participants,
      title: title,
    });
    const savedConversation = await newConversation.save();
    return { conversation: savedConversation };
  } catch (error) {
    return { error };
  }
}

async function getAllConversations(id :string) {
  try {
    const conversations = await ConversationModel.find({ participants: { $in: [id] } });
    return { conversations } || null;
  } catch ( error ){
    return { error };
  }
}

async function deleteConversation(id: string) {
  try {
    const conversation = await ConversationModel.findByIdAndRemove(id);
    return { success: !!conversation };
  } catch (error) {
    return { error };
  }
}

async function markMessageAsSeen(conversationId: string, userId: string, messageId: string) {
  try {
    const updatedConversation = await ConversationModel.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: {
          seen: {
            userId: userId,
            messageId: messageId,
            hasSeen: true,
          },
        },
      },
      { new: true }
    );

    return updatedConversation;
  } catch (error) {
    return null;
  }
}

async function addMessageToConversation(id: string, message: IMessage) {
  try {
    const conversation = await ConversationModel.findById(id);
    if (!conversation) {
      return { error: "Conversation non trouvée" };
    }
    conversation.messages.push(message);
    const updatedConversation = await conversation.save();
    return { conversation: updatedConversation };
  } catch (error) {
    return { error };
  }
}

// Pas dans le readme
async function getConversationWithParticipants(participantIds: string) {
  try {
    const conversation = await ConversationModel.findOne({ participants: participantIds });
    return { conversation };
  } catch (error) {
    return { error };
  }
}

async function getAllConversationsForUser(userId: string) {
  try {
    const conversations = await ConversationModel.find({ participants: userId });
    return { conversations };
  } catch (error) {
    return { error };
  }
}

async function getConversationById(id: string) {
  try {
    const conversation = await ConversationModel.findById(id);
    return { conversation } || null;
  } catch (error) {
    return { error };
  }
}

async function setConversationSeenForUserAndMessage(id: string, userId: string, messageId: string) {
  try {
    const conversation = await ConversationModel.findById(id);
    if (!conversation) {
      return { error: "Conversation non trouvée" };
    }
    conversation.seen[userId] = messageId;
    const updatedConversation = await conversation.save();
    return { conversation: updatedConversation };
  } catch (error) {
    return { error };
  }
}


export {
  getConversationWithParticipants,
  getAllConversationsForUser,
  getConversationById,
  createConversation,
  addMessageToConversation,
  setConversationSeenForUserAndMessage,
  deleteConversation,
  getAllConversations,
  markMessageAsSeen,
};


