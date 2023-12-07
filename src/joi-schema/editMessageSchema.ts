import joi from "joi";

export const editMessageSchema = joi.object({
    newMessageContent: joi.string().required(),
});