import { Router, Request, Response, NextFunction } from 'express';
import * as messageController from '../controllers/MessageController';
const jwt = require('jsonwebtoken');
import config from '../config'

const message = Router();

function checkAuth(req: Request, res: Response, next: NextFunction)
{
	const token = req.headers.authorization;
	if(!token)
	{
		return res.status(401).json({error:'Need a token!'});
	}
	try
	{
		const decodedToken = jwt.verify(token, config.SECRET_KEY);
		const userId = decodedToken.userId;
		if (req.body && req.body.userId && req.body.userId !== userId) 
		{
			return res.status(401).json({error:'Invalid token!'});
		} 
	}
	catch(error)
	{
		return res.status(401).json({error:'Expired token!'});
	}
	next();
}

// Éditer un message existant
message.put('/:id', checkAuth, messageController.editMessage);

// Réagir à un message
message.post('/:id', checkAuth, messageController.reactToMessage);

// Créer un nouveau message dans une conversation
message.post('/:conversationId/message', checkAuth, messageController.createMessage);

// Supprimer un message
message.delete('/:id', checkAuth, messageController.deleteMessage);


// Obtenir un message par son ID
message.get('/:id', checkAuth, messageController.getMessageById);

export default message;
