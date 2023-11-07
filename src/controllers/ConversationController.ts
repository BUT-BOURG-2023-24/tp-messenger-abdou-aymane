import { Request, Response}  from 'express';
import * as ConversationService from '../services/ConversationService';
import { IMessage } from '../database/Mongo/Models/MessageModel';
const jwt = require('jsonwebtoken');
require('dotenv').config();

function getUserId(req: Request){

  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const userId = decodedToken.userId;

  return userId;
}

export async function getConversationWithParticipants(req: Request, res: Response) {
  const { participantIds } = req.params;
  const result = await ConversationService.getConversationWithParticipants(participantIds);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
}

export async function getAllConversations(req: Request, res: Response){
  
  const result = await ConversationService.getAllConversations();
  if(result.error){
    return res.status(500).json(result);
  }
  return res.json(result);
}

export async function markMessageAsSeen(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { messageId } = req.body;

		const userId = getUserId(req);

    const updatedConversation = await ConversationService.markMessageAsSeen(id, userId, messageId);

    if (updatedConversation) {
      return res.status(200).json({
        conversation: updatedConversation,
      });
    } else {
      return res.status(404).json({ error: 'Conversation or message not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function addMessageToConversation(req: Request, res: Response) {
  const { id } = req.params;
  const { content, messageReplyId } = req.body;
  
  const userId = getUserId(req);
  const newMessage = {
    conversationId: id, 
    from: userId, 
    content: content, 
    postedAt: new Date(), 
    replyTo: messageReplyId || null, 
    edited: false,
    deleted: false,
    reactions: {}, 
  } as IMessage;
  const result = await ConversationService.addMessageToConversation(id, newMessage);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
}

export async function getAllConversationsForUser(req: Request, res: Response) {
  const { userId } = req.params;
  const result = await ConversationService.getAllConversationsForUser(userId);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
}

export async function getConversationById(req: Request, res: Response) {
  const { id } = req.params;
  const result = await ConversationService.getConversationById(id);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
}

export async function createConversation(req: Request, res: Response) {
  const { concernedUsersIds } = req.body;
  const result = await ConversationService.createConversation(concernedUsersIds);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
}

export async function setConversationSeenForUserAndMessage(req: Request, res: Response) {
  const { id, userId, messageId } = req.params;
  const result = await ConversationService.setConversationSeenForUserAndMessage(id, userId, messageId);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
}

export async function deleteConversation(req: Request, res: Response) {
  const { id } = req.params;
  const result = await ConversationService.deleteConversation(id);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
}
