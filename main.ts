// gta6-meme-x-01 entry runner (Node 22, standard library only).
//
// The entry itself is the X post: a GTA 6 meme posted from a public account,
// carrying a make.fun link and/or @makefunai plus one of our play codes.
// This program only delivers POST.json — the file that names that post —
// from the repository root into the output directory, after checking the
// file is actually a well-formed pointer to a real X post. The house reads
// the post from X itself; nothing this program writes about the post is
// judged, so a bad pointer must fail loudly here instead of silently
// shipping a broken entry.
//
// Run locally the same way the grader does, with the two directories
// swapped for local ones:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// An X post address, exactly as X shows it. The gate accepts x.com or
// twitter.com, a handle, then /status/ followed by digits only.
// Built from a string on purpose: Node's built-in TypeScript stripping
// chokes on a regex literal that contains an escaped slash (\/).
const POST_URL_PATTERN = new RegExp(
  '^https://(x\\.com|twitter\\.com)/[^/]+/status/\\d+$',
);

// The sealed scorer refuses a POST.json larger than this.
const MAX_POST_FILE_BYTES = 16384;

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(step: string, detail: string): never {
  console.error(`[gta6-meme-x-01] FAILED at ${step}: ${detail}`);
  process.exit(1);
}

const postPath = join(botDir, 'POST.json');
const memePath = join(botDir, 'meme.png');
const outPath = join(outputDir, 'POST.json');

console.log(`[gta6-meme-x-01] reading ${postPath}`);

if (!existsSync(postPath)) {
  fail('read', `POST.json is missing under ${botDir}`);
}

const raw = readFileSync(postPath);
console.log(`[gta6-meme-x-01] POST.json is ${raw.length} bytes`);

if (raw.length > MAX_POST_FILE_BYTES) {
  fail('size', `POST.json is ${raw.length} bytes, over the ${MAX_POST_FILE_BYTES} byte limit`);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw.toString('utf8'));
} catch (err) {
  fail('parse', `POST.json is not valid JSON: ${(err as Error).message}`);
}

if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
  fail('shape', 'POST.json must be a JSON object like {"url": "https://x.com/<handle>/status/<id>"}');
}

const url = (parsed as Record<string, unknown>).url;
if (typeof url !== 'string' || !POST_URL_PATTERN.test(url)) {
  fail('url', `url ${JSON.stringify(url)} is not an X post address (expected https://x.com/<handle>/status/<id>)`);
}
console.log(`[gta6-meme-x-01] post url OK: ${url}`);

// The post's first picture is what the judge sees, so the meme file the
// post was made from must still be in the repository.
if (!existsSync(memePath)) {
  fail('meme', `meme.png is missing under ${botDir}`);
}
const memeBytes = statSync(memePath).size;
console.log(`[gta6-meme-x-01] meme.png present (${memeBytes} bytes)`);

mkdirSync(outputDir, { recursive: true });
writeFileSync(outPath, raw);

// Prove the copy landed intact: read the output back and compare it
// byte-for-byte with what was read from the repository.
const writtenBack = readFileSync(outPath);
if (!writtenBack.equals(raw)) {
  fail('verify', `${outPath} does not match ${postPath} after writing`);
}
console.log(`[gta6-meme-x-01] wrote ${outPath} (${writtenBack.length} bytes, verified)`);
