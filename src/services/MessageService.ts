import ConversationModel from '../database/Mongo/Models/ConversationModel';
import MessageModel, { IMessage } from '../database/Mongo/Models/MessageModel';

async function createMessage(message: IMessage) {
  try {
    const newMessage = new MessageModel(message);
    const savedMessage = await newMessage.save();
    
    // Find the conversation and add the new message's ID to it
    const conversation = await ConversationModel.findById(newMessage.conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    conversation.messages.push(savedMessage._id);
    await conversation.save();
    
    return { message: savedMessage };
  } catch (error) {
    return { error };
  }
}

async function editMessage(id: string, newContent: string) {
  try {
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      id,
      { content: newContent, edited: true },
      { new: true }
    );

    return updatedMessage ? { message: updatedMessage } : { error: 'Message not found' };
  } catch (error) {
    return { error };
  }
}

async function deleteMessage(id: string) {
  try {
    const deletedMessage = await MessageModel.findByIdAndRemove(id);
    return deletedMessage ? { success: true } : { error: 'Message not found' };
  } catch (error) {
    return { error };
  }
}

async function reactToMessage(id: string, userId: string, reaction: string) {
    try {
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        id,
        { $set: { [`reactions.${userId}`]: reaction } },
        { new: true }
      );
  
      return updatedMessage ? { message: updatedMessage } : { error: 'Message not found' };
    } catch (error) {
      return { error };
    }
}

async function getMessageById(conversationId: string) {
  try {
    const message = await MessageModel.find({ conversationId: conversationId }).exec();;
    return message ? { message } : { error: 'Message not found' };
  } catch (error) {
    return { error };
  }
}



export {
  createMessage,
  editMessage,
  deleteMessage,
  reactToMessage,
  getMessageById,
};
