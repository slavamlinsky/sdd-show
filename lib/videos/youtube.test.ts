import assert from "node:assert/strict";
import test from "node:test";
import { parseYoutubeId } from "../videos-youtube.ts";

test("parseYoutubeId accepts watch, short, shorts, and bare ids", () => {
  assert.equal(
    parseYoutubeId("https://www.youtube.com/watch?v=dQw4w9wgXcQ"),
    "dQw4w9wgXcQ",
  );
  assert.equal(parseYoutubeId("https://youtu.be/dQw4w9wgXcQ"), "dQw4w9wgXcQ");
  assert.equal(
    parseYoutubeId("https://youtube.com/shorts/dQw4w9wgXcQ"),
    "dQw4w9wgXcQ",
  );
  assert.equal(
    parseYoutubeId("https://www.youtube.com/embed/dQw4w9wgXcQ"),
    "dQw4w9wgXcQ",
  );
  assert.equal(parseYoutubeId("dQw4w9wgXcQ"), "dQw4w9wgXcQ");
  assert.equal(parseYoutubeId("https://example.com/watch?v=dQw4w9wgXcQ"), null);
});
