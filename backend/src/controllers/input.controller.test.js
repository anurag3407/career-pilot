import assert from "node:assert/strict";
import { describe, test, mock } from "node:test";

import { inputupload, parseInputDataPayload } from "./input.controller.js";
import userModel from "../models/User.model.js";

describe("parseInputDataPayload", () => {
  test("returns parsed object for valid JSON strings", () => {
    assert.deepEqual(parseInputDataPayload('{"jobRole":"Engineer"}'), {
      jobRole: "Engineer",
    });
  });

  test("returns empty object for missing payloads", () => {
    assert.deepEqual(parseInputDataPayload(undefined), {});
    assert.deepEqual(parseInputDataPayload(null), {});
  });

  test("returns null for malformed JSON strings", () => {
    assert.equal(parseInputDataPayload("{invalid json"), null);
  });

  test("returns null for empty strings", () => {
    assert.equal(parseInputDataPayload(""), null);
    assert.equal(parseInputDataPayload("   "), null);
  });

  test("passes through object payloads", () => {
    const payload = { experience: "Mid Level" };
    assert.equal(parseInputDataPayload(payload), payload);
  });

  test("returns null for arrays and primitive JSON values", () => {
    assert.equal(parseInputDataPayload([]), null);
    assert.equal(parseInputDataPayload('["React"]'), null);
    assert.equal(parseInputDataPayload('"Engineer"'), null);
    assert.equal(parseInputDataPayload("42"), null);
    assert.equal(parseInputDataPayload("true"), null);
  });
});

describe("inputupload", () => {
  test("returns 400 for invalid JSON payloads before touching persistence", async () => {
    const findByIdMock = mock.method(userModel, "findById", async () => {
      throw new Error("findById should not be reached");
    });

    const req = {
      body: {
        data: "{invalid json",
      },
      user: {
        id: "user-id",
      },
      file: null,
    };

    let statusCode;
    let body;
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(payload) {
        body = payload;
        return this;
      },
    };

    await inputupload(req, res);

    assert.equal(statusCode, 400);
    assert.deepEqual(body, {
      message: "Invalid JSON format in request body",
    });
    assert.equal(findByIdMock.mock.callCount(), 0);

    findByIdMock.mock.restore();
  });
});
