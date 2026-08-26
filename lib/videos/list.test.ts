import assert from "node:assert/strict";
import test from "node:test";
import type { VideoEntry } from "../videos-data.ts";
import {
  paginateVideos,
  parseVideoPageQuery,
  parseVideoPageSizeQuery,
  parseVideoSortQuery,
  sortVideos,
} from "../videos-list.ts";

const sample: VideoEntry[] = [
  { id: "a", title: "Zebra talk", youtubeId: "aaaaaaaaaaa" },
  { id: "b", title: "Alpha demo", youtubeId: "bbbbbbbbbbb" },
  { id: "c", title: "Middle clip", youtubeId: "ccccccccccc" },
];

const orderIndex = new Map(sample.map((video, index) => [video.id, index]));

test("parseVideoSortQuery falls back to newest", () => {
  assert.equal(parseVideoSortQuery(null), "newest");
  assert.equal(parseVideoSortQuery("nope"), "newest");
  assert.equal(parseVideoSortQuery("title-asc"), "title-asc");
});

test("parseVideoPageSizeQuery accepts 6, 12, 24, 48 only", () => {
  assert.equal(parseVideoPageSizeQuery("6"), 6);
  assert.equal(parseVideoPageSizeQuery("24"), 24);
  assert.equal(parseVideoPageSizeQuery("99"), 12);
});

test("parseVideoPageQuery clamps invalid values to 1", () => {
  assert.equal(parseVideoPageQuery("0"), 1);
  assert.equal(parseVideoPageQuery("abc"), 1);
  assert.equal(parseVideoPageQuery("3"), 3);
});

test("sortVideos orders by curated index and title", () => {
  assert.deepEqual(
    sortVideos(sample, "featured", orderIndex).map((v) => v.id),
    ["a", "b", "c"],
  );
  assert.deepEqual(
    sortVideos(sample, "newest", orderIndex).map((v) => v.id),
    ["c", "b", "a"],
  );
  assert.deepEqual(
    sortVideos(sample, "title-asc", orderIndex).map((v) => v.id),
    ["b", "c", "a"],
  );
  assert.deepEqual(
    sortVideos(sample, "title-desc", orderIndex).map((v) => v.id),
    ["a", "c", "b"],
  );
});

test("paginateVideos slices and clamps page", () => {
  const page1 = paginateVideos(sample, 1, 2);
  assert.equal(page1.page, 1);
  assert.equal(page1.totalPages, 2);
  assert.equal(page1.rangeStart, 1);
  assert.equal(page1.rangeEnd, 2);
  assert.deepEqual(page1.items.map((v) => v.id), ["a", "b"]);

  const pageHigh = paginateVideos(sample, 9, 2);
  assert.equal(pageHigh.page, 2);
  assert.deepEqual(pageHigh.items.map((v) => v.id), ["c"]);
});
