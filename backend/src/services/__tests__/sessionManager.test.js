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
  let token;

  test("createSession - should create a session and return a token", async () => {
    token = await createSession("user123", { role: "admin" });
    expect(typeof token).toBe("string");
    expect(token.length).toBe(64);
  });

  test("validateSession - should return session data for valid token", async () => {
    const session = await validateSession(token);
    expect(session.userId).toBe("user123");
    expect(session.role).toBe("admin");
  });

  test("validateSession - should throw for invalid token", async () => {
    await expect(validateSession("invalid-token")).rejects.toThrow(
      "Session not found or has expired"
    );
  });

  test("refreshSession - should extend TTL for valid session", async () => {
    const result = await refreshSession(token);
    expect(result).toBe(true);
  });

  test("invalidateSession - should delete a session", async () => {
    const result = await invalidateSession(token);
    expect(result).toBe(true);
  });

  test("invalidateSession - should return false for already-deleted session", async () => {
    const result = await invalidateSession(token);
    expect(result).toBe(false);
  });

  test("createSession - should throw if userId missing", async () => {
    await expect(createSession("")).rejects.toThrow(
      "userId is required to create a session"
    );
  });
});
