import { Request, Response, NextFunction}  from 'express';
const jwt = require('jsonwebtoken');
require('dotenv').config();

const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/ConversationController");


function checkAuth(req: Request, res: Response, next: NextFunction)
{
	const token = req.headers.authorization;
	if(!token)
	{
		return res.status(401).json({error:'Need a token!'});
	}
	try
	{
		const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
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

//Dans le readme
// Créer une nouvelle conversation
router.post("/", checkAuth, conversationController.createConversation);

// Obtenir toutes les conversations
router.post("/", checkAuth, conversationController.getAllConversations);

// Supprimer une conversation
router.delete("/:id", checkAuth, conversationController.deleteConversation);

// Route pour marquer un message comme vu dans une conversation
router.post('/see/:id', checkAuth, conversationController.markMessageAsSeen);

// Route pour ajouter un nouveau message
router.post('/:id', checkAuth, conversationController.addMessageToConversation);


// Pas dans le readme
// Obtenir une conversation spécifique en fonction des participants
router.get("/participants/:participantIds", checkAuth, conversationController.getConversationWithParticipants);

// Obtenir toutes les conversations pour un utilisateur donné
router.get("/user/:userId", checkAuth, conversationController.getAllConversationsForUser);

// Obtenir une conversation par ID
router.get("/:id", checkAuth, conversationController.getConversationById);

// Ajouter un message à une conversation
router.post("/:id/message", checkAuth, conversationController.addMessageToConversation);

// Marquer une conversation comme "vue" pour un utilisateur donné et un message donné
router.put("/:id/seen/:userId/:messageId", checkAuth, conversationController.setConversationSeenForUserAndMessage);


export default router;