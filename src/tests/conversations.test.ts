import http from "http";
import { Express } from "express";
import { setup, teardown } from "./setupTests";
import supertest from "supertest";
import {
  createConversation,
  getAllConversations,
  deleteConversation,
  addMessageToConversation,
  markMessageAsSeen,
} from "../services/ConversationService";

import { reactToMessage } from "../services/MessageService";

describe("CONVERSATIONS", () => {
  let app: Express, server: http.Server;
  let conversationId: string;
  let messageId: string;

  beforeAll(async () => {
    let res = await setup();
    app = res.app;
    server = res.server;
  });

  afterAll(async () => {
    await teardown();
  });

  test("CREATE Conversation success", async () => {
    const participants = ["user1", "user2"];
    const response = await supertest(app)
      .post("/create-conversation")
      .send({ participants })
      .expect(200);

    expect(response.body.conversation).toBeDefined();
    conversationId = response.body.conversation._id;
  });

  test("CREATE Conversation wrong users", async () => {
    const wrongParticipants = ["user3", "user4"];
    const response = await supertest(app)
      .post("/create-conversation")
      .send({ participants: wrongParticipants })
      .expect(400); // Adjust the expected status code based on your application logic

    expect(response.body.error).toBeDefined();
  });

  test("GET All conversation success", async () => {
    const response = await supertest(app).get("/all-conversations").expect(200);

    expect(response.body.conversations).toBeDefined();
    expect(Array.isArray(response.body.conversations)).toBe(true);
  });

  test("POST Message in conversation", async () => {
    const message = { text: "Hello, world!" };
    const response = await supertest(app)
      .post(`/add-message/${conversationId}`)
      .send({ message })
      .expect(200);

    expect(response.body.conversation).toBeDefined();
    messageId = response.body.conversation.messages[0]._id;
  });

  test("POST Reply message in conversation", async () => {
    const replyMessage = { text: "Reply to the first message" };
    const response = await supertest(app)
      .post(`/add-reply/${conversationId}/${messageId}`)
      .send({ message: replyMessage })
      .expect(200);

    expect(response.body.conversation).toBeDefined();
  });

  test("PUT Edit message in conversation", async () => {
    const updatedText = "Updated text";
    const response = await supertest(app)
      .put(`/edit-message/${conversationId}/${messageId}`)
      .send({ text: updatedText })
      .expect(200);

    expect(response.body.conversation).toBeDefined();
    expect(response.body.conversation.messages[0].text).toBe(updatedText);
  });

  test("POST React message in conversation", async () => {
    const reaction = { emoji: "👍" };
    const response = await supertest(app)
      .post(`/react-message/${conversationId}/${messageId}`)
      .send({ reaction })
      .expect(200);

    expect(response.body.conversation).toBeDefined();
    expect(response.body.conversation.messages[0].reactions).toContainEqual(
      reaction
    );
  });

  test("POST See conversation", async () => {
    const response = await supertest(app)
      .post(`/see-conversation/${conversationId}`)
      .expect(200);

    expect(response.body.conversation).toBeDefined();
    expect(response.body.conversation.seen.length).toBeGreaterThan(0);
  });

  test("DELETE Message in conversation", async () => {
    const response = await supertest(app)
      .delete(`/delete-message/${conversationId}/${messageId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  test("DELETE Conversation", async () => {
    const response = await supertest(app)
      .delete(`/delete-conversation/${conversationId}`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
