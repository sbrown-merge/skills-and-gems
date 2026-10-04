// merge-build-readiness script 01: file and pages (read-only). Feeds BR-02, BR-04, BR-06.
// No placeholders. Reads page names, the first page's text and any linked-repo line.
const MAX_LINES = 40; // enough of the cover to judge purpose, owner and status
const SECRET = /password|passcode|token|secret|api[ -]?key/i; // never echo credentials from a cover page
const pages = figma.root.children.map((p, i) => ({ i, id: p.id, name: p.name }));
let thumbnail;
try { const t = await figma.getFileThumbnailNodeAsync(); thumbnail = t ? { id: t.id, name: t.name, type: t.type } : null; }
catch (e) { thumbnail = 'unavailable'; } // use_figma refuses this call (tested 2026-10-03)
const LINKED = /^\s*linked repo:\s*(\S+)\s*$/i;
const GH = /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+(\/tree\/\S+)?$/;
const COVER_NAME = /\b(cover|start here|read ?me)\b/i; // whole words, so "Discover" or "Recovery" doesn't count
const first = figma.root.children[0];
await first.loadAsync();
const readText = page => page.findAllWithCriteria({ types: ['TEXT'] });
const firstTexts = readText(first);
const signals = [];
const scan = (page, texts) => { for (const t of texts) for (const line of t.characters.split(/\r?\n/)) { const m = line.match(LINKED); if (m) signals.push({ page: page.name, firstPage: page === first, id: t.id, url: m[1], github: GH.test(m[1]) }); } };
scan(first, firstTexts);
for (const p of figma.root.children.slice(1)) {
  if (!COVER_NAME.test(p.name.trim())) continue;
  await p.loadAsync();
  scan(p, readText(p));
}
const lines = [];
for (const t of firstTexts) for (const l of t.characters.split(/\r?\n/)) { if (lines.length >= MAX_LINES) break; const s = l.trim(); if (s) lines.push(SECRET.test(s) ? '[line withheld: looks like a credential]' : s.slice(0, 100)); }
return {
  pageCount: pages.length,
  pages,
  thumbnail,
  firstPage: { id: first.id, name: first.name, textLines: lines },
  otherGuidePages: pages.filter(p => p.i > 0 && COVER_NAME.test(p.name.trim())),
  linkedRepoSignals: signals,
  examplesPages: pages.filter(p => /^\s*examples\s*$/i.test(p.name)),
};
