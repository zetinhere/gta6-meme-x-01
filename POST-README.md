# POST.json — READ THIS FIRST

`POST.json` currently holds a placeholder:

```json
{"url": "TODO-POST-URL"}
```

That is **not** a real post address, and the gate refuses it — on purpose. The post does not exist yet.

## What has to happen, in order

1. The user posts the meme to X from the public account **@ajtnc1109**:
   - image: `meme.png` in this repository
   - caption: the exact text in `CAPTION.md` (bounty link, `@makefunai`, and play code `makefun-buckle-quince-hilltop`)
   - before the deadline: **Monday 2026-11-23 14:00 UTC (21:00 WIB)**
2. Copy the post's address as X shows it: `https://x.com/ajtnc1109/status/<id>`
3. Replace `TODO-POST-URL` in `POST.json` with that address:
   ```json
   {"url": "https://x.com/ajtnc1109/status/<id>"}
   ```
4. Commit and push, then submit the entry (parent runs the submit) before the deadline.

Do **not** invent a post URL. Do **not** submit with the placeholder — the gate reads the post from X and refuses an entry whose post cannot be read.
