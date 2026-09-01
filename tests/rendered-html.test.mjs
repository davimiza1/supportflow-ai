import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the SupportFlow command center", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>SupportFlow AI - Customer Support Command Center<\/title>/i);
  assert.match(html, /SupportFlow/);
  assert.match(html, /AI shift pulse/);
  assert.match(html, /Priority inbox/);
  assert.match(html, /Send reply/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps ticket triage and responsive interactions in source", async () => {
  const [page, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(page, /const \[active, setActive\] = useState/);
  assert.match(page, /const \[filter, setFilter\] = useState/);
  assert.match(page, /const \[autopilot, setAutopilot\] = useState/);
  assert.match(page, /function selectTicket/);
  assert.match(page, /setSent\(true\)/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(layout, /SupportFlow AI - Customer Support Command Center/);
  assert.match(packageJson, /"name": "supportflow-ai"/);
});
