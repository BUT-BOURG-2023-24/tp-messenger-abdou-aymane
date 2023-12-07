import { Router, Request, Response, NextFunction } from 'express';
import * as messageController from '../controllers/MessageController';
const jwt = require('jsonwebtoken');
import config from '../config'
import {checkAuth} from "../middleware/auth";
import JoiValidator from "../middleware/joiValidator";

const message = Router();

// Éditer un message existant
message.put('/:id', JoiValidator, checkAuth, messageController.editMessage);

// Réagir à un message
message.post('/:id', JoiValidator, checkAuth, messageController.reactToMessage);

// Créer un nouveau message dans une conversation
message.post('/:conversationId/message', checkAuth, messageController.createMessage);

// Supprimer un message
message.delete('/:id', checkAuth, messageController.deleteMessage);


// Obtenir un message par son ID
message.get('/:id', checkAuth, messageController.getMessageById);

export default message;
