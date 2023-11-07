import { Request, Response } from 'express';
import * as MessageService from '../services/MessageService';
import { IMessage } from '../database/Mongo/Models/MessageModel';
const jwt = require('jsonwebtoken');
require('dotenv').config();

function getUserId(req: Request){

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.userId;
  
    return userId;
  }

export async function createMessage(req: Request, res: Response) {
  const { content, messageReplyId } = req.body;
  
  const userId = getUserId(req);

  const newMessage = {
    conversationId: req.params.id,
    from: userId,
    content,
    postedAt: new Date(),
    replyTo: messageReplyId || null,
    edited: false,
    deleted: false,
    reactions: {},
  } as IMessage;

  const result = await MessageService.createMessage(newMessage);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
}

export async function editMessage(req: Request, res: Response) {
  const { id } = req.params;
  const { newMessageContent } = req.body;

  const result = await MessageService.editMessage(id, newMessageContent);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
}

export async function deleteMessage(req: Request, res: Response) {
  const { id } = req.params;

  const result = await MessageService.deleteMessage(id);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
}

export async function reactToMessage(req: Request, res: Response) {
  const { id } = req.params;
  const { reaction } = req.body;
  const userId = getUserId(req);

  const result = await MessageService.reactToMessage(id, userId, reaction);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
}

export async function getMessageById(req: Request, res: Response) {
  const { id } = req.params;

  const result = await MessageService.getMessageById(id);
  if (result.error) {
    return res.status(500).json(result);
  }
  return res.json(result);
}
