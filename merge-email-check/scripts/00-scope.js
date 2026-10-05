// merge-email-check script 00: resolve the scope, the file, and which frames are emails (read-only).
// Adapted from merge-build-readiness script 00. Placeholders: '__SCOPE_ID__' (plain text: a page, section or frame ID;
// leave it as '' to use the current selection) and __SETTINGS__ (JSON: the house settings, or null for MERGE's).
// Returns `emails`, which every later script takes as __EMAILS__ once the agent has confirmed or corrected it.
const SCOPE_ID = '__SCOPE_ID__';
const SETTINGS = __SETTINGS__;
const t0 = Date.now();
// MERGE's house settings (checklist.md, "House settings"); a project overrides any of them through __SETTINGS__
const DEFAULTS = {
  mobileWidth: [320, 480], // accepted mobile frame widths; MERGE draws at 375 (D-7, D-8; Jill Redo's scorecard says 480)
  desktopWidth: [600, 700], // accepted desktop widths; MERGE draws at 600, and 700 passes so older files don't fail
};
const S = Object.assign({}, DEFAULTS, SETTINGS || {});
const MAX_PAGES = 100; // more pages than any file a run reads whole, and about 5 KB of return
const MAX_EX = 10; // examples per list, with a total beside each, to stay under use_figma's 20 KB return
// The shortest real email still carries a header, a message, a CTA and a footer. Frames under 400px tall in the TOFU
// file were subject-line cards (77px), footer components (314px) and note panels (235 to 285px), not emails.
const MIN_EMAIL_HEIGHT = 400;
const MAX_DEPTH = 3; // sections and presentation frames nest at most two or three deep in the files we've seen
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029); // line and paragraph separators break regexes and JSON readers
const clean = s => String(s).split(LS).join(' / ').split(PS).join(' / ').replace(/\s*\n\s*/g, ' / ');
const page = figma.currentPage;
let fileKey = null; try { fileKey = figma.fileKey || null; } catch (e) {}
let user = null; try { user = figma.currentUser ? figma.currentUser.name : null; } catch (e) { user = 'unavailable'; } // not supported under use_figma
const sel = page.selection.map(n => ({ id: n.id, name: clean(n.name), type: n.type }));
const out = {
  fileKey, user,
  pageCount: figma.root.children.length,
  pages: figma.root.children.slice(0, MAX_PAGES).map(p => ({ id: p.id, name: clean(p.name) })),
  currentPage: { id: page.id, name: clean(page.name) },
  selectionCount: sel.length, selection: sel.slice(0, MAX_EX),
  settings: S,
};
// The scope: the given ID, else a single selected layer. With neither, return the pages so the agent can ask.
let scope = null;
if (SCOPE_ID && !SCOPE_ID.startsWith('__')) scope = await figma.getNodeByIdAsync(SCOPE_ID);
else if (page.selection.length === 1) scope = page.selection[0];
if (!scope) { out.scope = null; out.note = SCOPE_ID && !SCOPE_ID.startsWith('__') ? 'scope not found: ' + SCOPE_ID : 'no scope given and no single selection'; out.ms = Date.now() - t0; return out; }
const pageOf = n => { while (n && n.type !== 'PAGE') n = n.parent; return n; };
if (scope.type === 'PAGE') await scope.loadAsync(); else { const p = pageOf(scope); if (p) await p.loadAsync(); }
out.scope = { id: scope.id, name: clean(scope.name), type: scope.type, page: pageOf(scope) ? pageOf(scope).id : null };
const w = n => Math.round(n.width);
const roleOf = n => (w(n) >= S.mobileWidth[0] && w(n) <= S.mobileWidth[1] ? 'mobile' : w(n) >= S.desktopWidth[0] && w(n) <= S.desktopWidth[1] ? 'desktop' : null);
const FRAMES = ['FRAME', 'COMPONENT', 'INSTANCE'];
const shown = n => n.visible !== false;
const found = [], presentation = [], skipped = []; let skippedCount = 0;
// A frame at an email width that holds only one other email-width frame of a different width is a presentation
// wrapper, like the Adobe rebuild's 680px gray frames around a 600px email (2026-10-05); the inner frame is the email.
const consider = (c, depth) => {
  const role = roleOf(c);
  if (role && c.height >= MIN_EMAIL_HEIGHT) {
    const kids = 'children' in c ? c.children.filter(shown) : [];
    const inner = kids.length === 1 && FRAMES.includes(kids[0].type) && roleOf(kids[0]) && w(kids[0]) !== w(c) && kids[0].height >= MIN_EMAIL_HEIGHT ? kids[0] : null;
    found.push({ node: inner || c, wrapper: inner ? c : null });
    return;
  }
  // Wider than any email: a mail-app window or a presentation board, which EM-01 treats as N/A, so look inside it
  if (w(c) > S.desktopWidth[1] && 'children' in c && depth < MAX_DEPTH) { presentation.push(c); visit(c, depth + 1); return; }
  if (w(c) >= S.mobileWidth[0]) { skippedCount++; if (skipped.length < MAX_EX) skipped.push(c.id + ' ' + clean(c.name).slice(0, 50) + ' ' + w(c) + 'x' + Math.round(c.height) + (role ? ' (too short)' : ' (width outside both ranges)')); }
};
function visit(n, depth) {
  for (const c of n.children) {
    if (!shown(c)) continue;
    if (FRAMES.includes(c.type)) consider(c, depth);
    else if ((c.type === 'SECTION' || c.type === 'GROUP') && depth < MAX_DEPTH) visit(c, depth + 1);
  }
}
if (FRAMES.includes(scope.type) && roleOf(scope)) consider(scope, 0);
else if ('children' in scope) visit(scope, 0);
// Group frames into emails by name, with the size and mode words taken out ("P1 Email 1 / Mobile 375" and
// "P1 Email 1 / Desktop 600" are one email). Names that reduce to nothing fall back to their section.
const WORDS = /\b(mobile|desktop|phone|tablet|light|dark|mode|frame\s+[a-z]|email\s+\d{3}|\d{3,4}\s*(px|pt)?)\b/gi;
const keyOf = s => s.toLowerCase().replace(/\(.*?\)/g, ' ').replace(WORDS, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
const sectionOf = n => { for (let p = n.parent; p && p.type !== 'PAGE'; p = p.parent) if (p.type === 'SECTION') return p; return null; };
const groups = new Map();
for (const f of found) {
  const named = f.wrapper || f.node;
  const sec = sectionOf(named);
  let k = keyOf(clean(named.name));
  const label = k ? clean(named.name).replace(WORDS, ' ').replace(/^[\s/:,()-]+|[\s/:,()-]+$/g, '').replace(/\s+/g, ' ') : sec ? clean(sec.name) : clean(scope.name);
  if (!k) k = 'section ' + (sec ? sec.id : scope.id);
  const g = groups.get(k) || { name: label, section: sec ? sec.id : null, frames: [] };
  const b = named.absoluteBoundingBox;
  g.frames.push({ id: f.node.id, role: roleOf(f.node), dark: /dark/i.test(named.name + ' ' + f.node.name), name: clean(f.node.name).slice(0, 60), w: w(f.node), h: Math.round(f.node.height), x: Math.round(b.x), y: Math.round(b.y), kids: 'children' in f.node ? f.node.children.filter(shown).length : 0, wrapper: f.wrapper ? f.wrapper.id + ' ' + clean(f.wrapper.name).slice(0, 60) : null });
  groups.set(k, g);
}
// Where no email in a section has both a mobile and a desktop frame but the section holds both widths, the names are
// one email's variants (the Adobe worst cases: "Frame D: Classic Outlook ...", "Frame F: Gmail app ..."), so merge them.
let emails = [...groups.values()];
const bySection = new Map();
for (const g of emails) if (g.section) bySection.set(g.section, (bySection.get(g.section) || []).concat([g]));
const merged = [];
for (const [sid, gs] of bySection) {
  if (gs.length < 2) continue;
  const roles = new Set(gs.flatMap(g => g.frames.map(f => f.role)));
  if (gs.some(g => new Set(g.frames.map(f => f.role)).size > 1) || roles.size < 2) continue;
  const sec = await figma.getNodeByIdAsync(sid);
  emails = emails.filter(g => !gs.includes(g));
  emails.push({ name: clean(sec.name), section: sid, frames: gs.flatMap(g => g.frames), mergedBySection: true });
  merged.push(sid);
}
out.emailCount = emails.length;
out.emails = emails.slice(0, 40); // 40 emails is more than any scope a run checks at once
out.mergedSections = merged;
out.presentationFrames = presentation.slice(0, MAX_EX).map(p => p.id + ' ' + clean(p.name).slice(0, 50) + ' ' + w(p) + 'px');
out.presentationCount = presentation.length;
out.skippedFrames = skipped; out.skippedCount = skippedCount;
out.ms = Date.now() - t0;
return out;
