import * as joi from "joi";
import {Request} from "express";
import {userLoginSchema} from "./joi-schema/userLoginSchema";
import {createConversationSchema} from "./joi-schema/createConversationSchema";
import {addMessageConversationSchema} from "./joi-schema/addMessageConversationSchema";
import {seeMessageConversationSchema} from "./joi-schema/seeMessageConversationSchema";
import {reactionMessageSchema} from "./joi-schema/reactionMessageSchema";
import {editMessageSchema} from "./joi-schema/editMessageSchema";

interface JoiRequestValidatorResponse {
    error?: string
}

interface JoiRouteValidator {
    route: string,
    method: string,
    validatorSchema: joi.ObjectSchema<any>
}

class JoiRequestValidator {
    validators: JoiRouteValidator[] =
        [
            {
                route: "users/login",
                method: "POST",
                validatorSchema: userLoginSchema,
            }, {
                route: "conversations/",
                method: "POST",
                validatorSchema: createConversationSchema
            }, {
                route: "conversations/:id",
                method: "POST",
                validatorSchema: addMessageConversationSchema
            }, {
                route: "conversations/see/:id",
                method: "POST",
                validatorSchema: seeMessageConversationSchema
            },{
                route: "messages/:id",
                method: "PUT",
                validatorSchema: editMessageSchema
            },{
                route: "messages/:id",
                method: "POST",
                validatorSchema: reactionMessageSchema
        }
        ];

    validate(request: Request): JoiRequestValidatorResponse {


        const validator = this.validators.find((validator) => {
            return validator.route ===  (request.baseUrl + request.route.path).substring(1) && validator.method === request.method;
        });
        if (!validator) {
            return {};
        }
        const {error} = validator.validatorSchema.validate(request.body);
        if (error) {
            return {error: error.details[0].message};
        }
        return {};
    }
}

export const JoiRequestValidatorInstance = new JoiRequestValidator();