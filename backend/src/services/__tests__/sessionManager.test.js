const {
  createSession,
  validateSession,
  invalidateSession,
  refreshSession,
  disconnect,
} = require("../sessionManager");

afterAll(async () => {
  await disconnect();
});

describe("Session Manager", () => {

  // createSession tests
  test("createSession - should create a session and return a token", async () => {
    const token = await createSession("user123", { role: "admin" });
    expect(typeof token).toBe("string");
    expect(token.length).toBe(64);
    await invalidateSession(token);
  });

  test("createSession - should throw if userId missing", async () => {
    await expect(createSession("")).rejects.toThrow("userId is required to create a session");
  });

  test("createSession - should throw if metadata is not a plain object", async () => {
    await expect(createSession("user123", null)).rejects.toThrow("metadata must be a plain object");
    await expect(createSession("user123", [1, 2])).rejects.toThrow("metadata must be a plain object");
  });

  test("createSession - metadata cannot override userId", async () => {
    const token = await createSession("realUser", { userId: "hacker" });
    const session = await validateSession(token);
    expect(session.userId).toBe("realUser");
    await invalidateSession(token);
  });

  // validateSession tests
  test("validateSession - should return session data for valid token", async () => {
    const token = await createSession("user456", { role: "user" });
    const session = await validateSession(token);
    expect(session.userId).toBe("user456");
    expect(session.role).toBe("user");
    await invalidateSession(token);
  });

  test("validateSession - should throw for invalid token", async () => {
    await expect(validateSession("invalid-token-xyz")).rejects.toThrow(
      "Session not found or has expired"
    );
  });

  // refreshSession tests
  test("refreshSession - should return true for valid session", async () => {
    const token = await createSession("user789");
    const result = await refreshSession(token);
    expect(result).toBe(true);
    await invalidateSession(token);
  });

  test("refreshSession - should return false for non-existent session", async () => {
    const result = await refreshSession("non-existent-token-xyz");
    expect(result).toBe(false);
  });

  test("refreshSession - should throw if token missing", async () => {
    await expect(refreshSession("")).rejects.toThrow("Token is required to refresh session");
  });

  // invalidateSession tests
  test("invalidateSession - should delete a session and return true", async () => {
    const token = await createSession("userDel");
    const result = await invalidateSession(token);
    expect(result).toBe(true);
  });

  test("invalidateSession - should return false for already-deleted session", async () => {
    const token = await createSession("userDel2");
    await invalidateSession(token);
    const result = await invalidateSession(token);
    expect(result).toBe(false);
  });
});
