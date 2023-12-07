import joi from "joi";

export const seeMessageConversationSchema = joi.object({
    conversationId: joi.string().required(),
});