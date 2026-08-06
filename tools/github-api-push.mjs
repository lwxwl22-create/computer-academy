import { execSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";

const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) {
  console.error("GH_TOKEN is required");
  process.exit(1);
}

const OWNER = "lwxwl22-create";
const REPO = "computer-academy";
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
const ROOT = process.cwd();

async function api(path, options = {}) {
  const res = await fetch(API + path, {
    method: options.method || "GET",
    headers: {
      Authorization: "Bearer " + TOKEN,
      "User-Agent": "codex-push",
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(path + " -> " + res.status + " " + (data?.message || text.slice(0, 200)));
  }
  return data;
}

function listTracked() {
  const out = execSync("git ls-tree -r HEAD --name-only", { cwd: ROOT, encoding: "utf8" });
  return out.split("\n").map((s) => s.trim()).filter(Boolean);
}

function getMode(path) {
  const out = execSync(`git ls-tree HEAD -- "${path}"`, { cwd: ROOT, encoding: "utf8" });
  const m = out.match(/^(\d{6})/);
  return m ? m[1] : "100644";
}

async function main() {
  const files = listTracked();
  console.log("Tracked files:", files.length);

  const headRef = await api("/git/ref/heads/main");
  const baseSha = headRef.object.sha;
  console.log("Remote base:", baseSha.slice(0, 7));

  const entries = [];
  for (let i = 0; i < files.length; i++) {
    const rel = files[i];
    const abs = join(ROOT, rel.split("/").join(sep));
    if (!statSync(abs).isFile()) continue;
    const content = readFileSync(abs).toString("base64");
    const blob = await api("/git/blobs", {
      method: "POST",
      body: { content, encoding: "base64" },
    });
    entries.push({ path: rel, mode: getMode(rel), type: "blob", sha: blob.sha });
    if (i % 20 === 0 || i === files.length - 1) console.log("blobs", i + 1 + "/" + files.length);
  }

  const tree = await api("/git/trees", {
    method: "POST",
    body: { tree: entries },
  });
  console.log("Tree:", tree.sha.slice(0, 7));

  const commit = await api("/git/commits", {
    method: "POST",
    body: {
      message: "push: sync local main via API (boolean highlight + GPU animation)",
      tree: tree.sha,
      parents: [baseSha],
    },
  });
  console.log("Commit:", commit.sha.slice(0, 7));

  try {
    await api("/git/refs", {
      method: "POST",
      body: { ref: "refs/heads/main", sha: commit.sha },
    });
  } catch (e) {
    if (String(e.message).includes("Reference already exists")) {
      await api("/git/refs/heads/main", {
        method: "PATCH",
        body: { sha: commit.sha, force: true },
      });
    } else {
      throw e;
    }
  }
  console.log("Pushed main ->", commit.sha);
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
