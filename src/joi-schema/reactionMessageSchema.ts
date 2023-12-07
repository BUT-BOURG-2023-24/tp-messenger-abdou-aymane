import joi from "joi";

export const reactionMessageSchema = joi.object({
    reaction: joi.string().required(),
});