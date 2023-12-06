import http from "http";
import { Express } from "express";
import { setup, teardown } from "./setupTests";
import supertest from "supertest";
import {
  createUser,
  getUserByName,
  getUserById,
  getUsersByIds,
  getAllUsers,
} from "../services/UserService";

describe('USERS', () => {
  let app: Express, server: http.Server;

  beforeAll(async () => {
    let res = await setup();
    app = res.app;
    server = res.server;
  });

  afterAll(async () => {
    await teardown();
  });

  test("Create and get user by name", async () => {
    const username = "testUser";
    const password = "testPassword";
    const profilePicId = "testPicId";

    // Create user
    const createUserResponse = await createUser(username, password, profilePicId);
    const createdUser = createUserResponse.user;

    // Get user by name
    const getUserResponse = await getUserByName(username);

    expect(createdUser).toBeDefined();
    expect(getUserResponse).toEqual(createdUser);
  });

  test("Get user by ID", async () => {
    const username = "testUser";
    const password = "testPassword";
    const profilePicId = "testPicId";

    // Create user
    const createUserResponse = await createUser(username, password, profilePicId);
    const createdUser = createUserResponse.user;

    // Get user by ID
    const getUserByIdResponse = await getUserById(createdUser?._id);

    expect(getUserByIdResponse.user).toEqual(createdUser);
  });

  test("Get users by IDs", async () => {
    const username1 = "user1";
    const username2 = "user2";
    const username3 = "user3";

    // Create users
    const createUserResponse1 = await createUser(username1, "password1", "picId1");
    const createUserResponse2 = await createUser(username2, "password2", "picId2");
    const createUserResponse3 = await createUser(username3, "password3", "picId3");

    const users = [createUserResponse1.user, createUserResponse2.user, createUserResponse3.user];

    // Get users by IDs
    const getUsersByIdsResponse = await getUsersByIds(users.map(user => user?._id));

    expect(getUsersByIdsResponse).toEqual(users);
  });

  test("Get all users", async () => {
    const getAllUsersResponse = await getAllUsers();
    // Assuming there are no other users in the database, check if the response is an array
    expect(Array.isArray(getAllUsersResponse)).toBe(true);
  });
});
