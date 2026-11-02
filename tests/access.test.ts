import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canAccept,
  canPublishBrief,
  canSeeCompletionNames,
  canShape,
} from "../src/server/access";

describe("access", () => {
  it("colleague cannot shape, accept, or publish", () => {
    assert.equal(canShape("colleague"), false);
    assert.equal(canAccept("colleague"), false);
    assert.equal(canPublishBrief("colleague"), false);
  });

  it("trainer can shape and accept but not publish", () => {
    assert.equal(canShape("trainer"), true);
    assert.equal(canAccept("trainer"), true);
    assert.equal(canPublishBrief("trainer"), false);
  });

  it("sponsor can shape, accept, and publish", () => {
    assert.equal(canShape("sponsor"), true);
    assert.equal(canAccept("sponsor"), true);
    assert.equal(canPublishBrief("sponsor"), true);
  });

  it("only trainer and sponsor see completion names", () => {
    assert.equal(canSeeCompletionNames("colleague"), false);
    assert.equal(canSeeCompletionNames("trainer"), true);
    assert.equal(canSeeCompletionNames("sponsor"), true);
  });
});
