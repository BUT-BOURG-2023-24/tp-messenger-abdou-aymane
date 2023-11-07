import { Request, Response, NextFunction}  from 'express';
const jwt = require('jsonwebtoken');
import config from '../config'

const express = require("express");
const conversations = express.Router();
const conversationController = require("../controllers/ConversationController");


function checkAuth(req: Request, res: Response, next: NextFunction)
{
	next();
}

//Dans le readme
// Créer une nouvelle conversation
conversations.post("", checkAuth, conversationController.createConversation);

// Obtenir toutes les conversations
conversations.post("", checkAuth, conversationController.getAllConversations);

// Supprimer une conversation
conversations.delete("/:id", checkAuth, conversationController.deleteConversation);

// Route pour marquer un message comme vu dans une conversation
conversations.post('/see/:id', checkAuth, conversationController.markMessageAsSeen);

// Route pour ajouter un nouveau message
conversations.post('/:id', checkAuth, conversationController.addMessageToConversation);


// Pas dans le readme
// Obtenir une conversation spécifique en fonction des participants
conversations.get("/participants/:participantIds", checkAuth, conversationController.getConversationWithParticipants);

// Obtenir toutes les conversations pour un utilisateur donné
conversations.get("/user/:userId", checkAuth, conversationController.getAllConversationsForUser);

// Obtenir une conversation par ID
conversations.get("/:id", checkAuth, conversationController.getConversationById);

// Ajouter un message à une conversation
conversations.post("/:id/message", checkAuth, conversationController.addMessageToConversation);

// Marquer une conversation comme "vue" pour un utilisateur donné et un message donné
conversations.put("/:id/seen/:userId/:messageId", checkAuth, conversationController.setConversationSeenForUserAndMessage);


export default conversations;