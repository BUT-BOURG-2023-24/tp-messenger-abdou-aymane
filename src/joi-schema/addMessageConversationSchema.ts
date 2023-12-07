import joi from "joi";

export const addMessageConversationSchema = joi.object({
    messageContent: joi.string().required(),
    messageReplyId: joi.string(),
});