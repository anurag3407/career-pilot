process.env.MONGODB_URI = "mongodb://localhost:27017/testdb";

const mongoose = require("mongoose");

jest.mock("mongoose", () => ({
  connect: jest.fn().mockResolvedValue({}),
  disconnect: jest.fn().mockResolvedValue({}),
  connection: {
    readyState: 1,
    on: jest.fn(),
  },
}));

const { connectDB, disconnectDB, getPoolStatus } = require("../dbPool");

describe("DBPool", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mongoose.connect.mockResolvedValue({});
    mongoose.disconnect.mockResolvedValue({});
  });

  test("connectDB - should connect with correct pool config", async () => {
    await connectDB();
    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://localhost:27017/testdb",
      expect.objectContaining({ maxPoolSize: 10, minPoolSize: 2 })
    );
  });

  test("connectDB - should return mongoose connection", async () => {
    const conn = await connectDB();
    expect(conn).toBe(mongoose.connection);
  });

  test("getPoolStatus - should return pool status object", () => {
    const status = getPoolStatus();
    expect(status).toHaveProperty("state");
    expect(status).toHaveProperty("maxPoolSize", 10);
    expect(status).toHaveProperty("minPoolSize", 2);
  });

  test("disconnectDB - should call mongoose.disconnect", async () => {
    await connectDB();
    await disconnectDB();
    expect(mongoose.disconnect).toHaveBeenCalled();
  });

  test("connectDB - should throw if MONGODB_URI is missing", async () => {
    const savedURI = process.env.MONGODB_URI;
    delete process.env.MONGODB_URI;
    jest.resetModules();
    const { connectDB: freshConnect } = require("../dbPool");
    await expect(freshConnect()).rejects.toThrow("MONGODB_URI environment variable is not set");
    process.env.MONGODB_URI = savedURI;
  });
});
