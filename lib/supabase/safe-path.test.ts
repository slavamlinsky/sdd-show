import assert from "node:assert/strict";
import test from "node:test";
import { searchParamString } from "../search-params.ts";
import { safeNextPath } from "./safe-path.ts";

test("safeNextPath allows valid internal paths", () => {
  assert.equal(safeNextPath("/glossary"), "/glossary");
  assert.equal(safeNextPath("/account?tab=profile"), "/account?tab=profile");
});

test("safeNextPath rejects open redirects and backslash paths", () => {
  assert.equal(safeNextPath("//evil.com"), "/");
  assert.equal(safeNextPath("https://evil.com"), "/");
  assert.equal(safeNextPath("/foo\\bar"), "/");
  assert.equal(safeNextPath("/foo\\@evil.com"), "/");
  assert.equal(safeNextPath(undefined, "/course"), "/course");
});

test("searchParamString uses first value for duplicate query keys", () => {
  assert.equal(searchParamString(["/glossary", "/account"]), "/glossary");
  assert.equal(searchParamString(["1", "0"]), "1");
  assert.equal(searchParamString("oauth"), "oauth");
  assert.equal(searchParamString(undefined), undefined);
});

test("sign-in next param: duplicate keys and backslashes normalize safely", () => {
  const fromDuplicates = safeNextPath(
    searchParamString(["/glossary", "//evil.com"]),
  );
  assert.equal(fromDuplicates, "/glossary");

  const fromBackslash = safeNextPath(searchParamString("/glossary\\@evil.com"));
  assert.equal(fromBackslash, "/");
});
