import joi from "joi";

export const createConversationSchema = joi.object({
    concernedUsersIds: joi.array().items(joi.string().required()).required(),
});