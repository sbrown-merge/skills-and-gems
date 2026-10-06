// merge-email-check script 00: resolve the scope, the file, and which frames are emails (read-only).
// Adapted from merge-build-readiness script 00. Placeholders: '__SCOPE_ID__' (plain text: a page, section or frame ID;
// leave it as '' to use the current selection) and __SETTINGS__ (JSON: the house settings, or null for MERGE's).
// Returns `emails`, which both parts of script 01 take as __EMAILS__ once the agent has confirmed or corrected it.
const SCOPE_ID = '__SCOPE_ID__';
const SETTINGS = __SETTINGS__;
const t0 = Date.now();
// MERGE's house settings (checklist.md, "House settings"); a project overrides any of them through __SETTINGS__
const S = Object.assign({
  mobileWidth: [320, 480], // accepted mobile widths; MERGE draws at 375 (D-7, D-8; Jill Redo's scorecard says 480)
  desktopWidth: [600, 700], // accepted desktop widths; MERGE draws at 600, and 700 passes so older files don't fail
}, SETTINGS || {});
const MAX_EX = 10; // examples per list, with a total beside each, to stay under use_figma's 20 KB return
// The shortest real email still carries a header, a message, a CTA and a footer. Frames under 400px tall in the TOFU
// file were subject-line cards (77px), footer components (314px) and note panels (235 to 285px), not emails.
const MIN_EMAIL_HEIGHT = 400;
const MAX_DEPTH = 3; // sections and presentation frames nest at most two or three deep in the files we've seen
// Line and paragraph separators break regexes and JSON readers. Build them with fromCharCode: a backslash-u-2028
// escape typed into a use_figma call arrives as a real separator and breaks the script (2026-10-05).
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029);
const NEWLINES = /\s*\n\s*/g;
const clean = s => String(s).split(LS).join(' / ').split(PS).join(' / ').replace(NEWLINES, ' / ').trim();
const short = (s, n) => clean(s).slice(0, n);
let fileKey = null; try { fileKey = figma.fileKey || null; } catch (e) {}
// The scope: the given ID, else a single selected layer. With neither, return the pages so the agent can ask.
const given = SCOPE_ID && !SCOPE_ID.startsWith('__');
const sel = figma.currentPage.selection;
const scope = given ? await figma.getNodeByIdAsync(SCOPE_ID) : sel.length === 1 ? sel[0] : null;
if (!scope) return { fileKey, scope: null, note: given ? 'not found' : sel.length + ' layers selected', currentPage: figma.currentPage.id, pageCount: figma.root.children.length, pages: figma.root.children.slice(0, 100).map(p => p.id + ' ' + clean(p.name)) };
const pageOf = n => { while (n && n.type !== 'PAGE') n = n.parent; return n; };
await pageOf(scope).loadAsync();
const w = n => Math.round(n.width);
const roleOf = n => (w(n) >= S.mobileWidth[0] && w(n) <= S.mobileWidth[1] ? 'mobile' : w(n) >= S.desktopWidth[0] && w(n) <= S.desktopWidth[1] ? 'desktop' : null);
const FRAMES = ['FRAME', 'COMPONENT', 'INSTANCE'];
const shown = n => n.visible !== false;
const found = [], presentation = [], skipped = [];
// A frame at an email width that holds only one other email-width frame of a different width is a presentation
// wrapper, like the Adobe rebuild's 680px gray frames around a 600px email (EM-01); the inner frame is the email.
const consider = (c, depth) => {
  const role = roleOf(c);
  if (role && c.height >= MIN_EMAIL_HEIGHT) {
    const kids = 'children' in c ? c.children.filter(shown) : [];
    const inner = kids.length === 1 && FRAMES.includes(kids[0].type) && roleOf(kids[0]) && w(kids[0]) !== w(c) && kids[0].height >= MIN_EMAIL_HEIGHT ? kids[0] : null;
    found.push({ node: inner || c, wrapper: inner ? c : null });
  } else if (w(c) > S.desktopWidth[1] && 'children' in c && depth < MAX_DEPTH) {
    // Wider than any email: a mail-app window or a presentation board, which EM-01 treats as N/A, so look inside it
    presentation.push(c.id + ' ' + short(c.name, 50) + ' ' + w(c) + 'px'); visit(c, depth + 1);
  } else if (w(c) >= S.mobileWidth[0]) skipped.push(c.id + ' ' + short(c.name, 50) + ' ' + w(c) + 'x' + Math.round(c.height) + (role ? ' too short' : ' width outside both ranges'));
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
const PARENS = /\(.*?\)/g, NON_WORD = /[^a-z0-9]+/g, EDGE_PUNCT = /^[\s/:,()-]+|[\s/:,()-]+$/g, SPACES = /\s+/g, DARK = /dark/i;
const keyOf = s => s.toLowerCase().replace(PARENS, ' ').replace(WORDS, ' ').replace(NON_WORD, ' ').trim();
const sectionOf = n => { for (let p = n.parent; p && p.type !== 'PAGE'; p = p.parent) if (p.type === 'SECTION') return p; return null; };
const groups = new Map();
for (const f of found) {
  const named = f.wrapper || f.node, sec = sectionOf(named);
  let k = keyOf(clean(named.name));
  const label = k ? clean(named.name).replace(WORDS, ' ').replace(EDGE_PUNCT, '').replace(SPACES, ' ') : clean((sec || scope).name);
  if (!k) k = 'section ' + (sec || scope).id;
  const g = groups.get(k) || { name: label, section: sec ? sec.id : null, frames: [] };
  g.frames.push({ id: f.node.id, role: roleOf(f.node), dark: DARK.test(named.name + ' ' + f.node.name), name: short(f.node.name, 50), w: w(f.node), h: Math.round(f.node.height), wrapper: f.wrapper ? f.wrapper.id : undefined });
  groups.set(k, g);
}
// Where no email in a section has both a mobile and a desktop frame but the section holds both widths, the names are
// one email's variants (the Adobe worst cases: "Frame D: Classic Outlook ...", "Frame F: Gmail app ..."), so merge them.
let emails = [...groups.values()];
const bySection = new Map();
for (const g of emails) if (g.section) bySection.set(g.section, (bySection.get(g.section) || []).concat([g]));
for (const [sid, gs] of bySection) {
  const roles = new Set(gs.flatMap(g => g.frames.map(f => f.role)));
  if (gs.length < 2 || roles.size < 2 || gs.some(g => new Set(g.frames.map(f => f.role)).size > 1)) continue;
  emails = emails.filter(g => !gs.includes(g));
  emails.push({ name: clean((await figma.getNodeByIdAsync(sid)).name), section: sid, frames: gs.flatMap(g => g.frames), mergedBySection: true });
}
return {
  fileKey, scope: { id: scope.id, name: clean(scope.name), type: scope.type, page: pageOf(scope).id },
  emailCount: emails.length, emails: emails.slice(0, 40), // 40 emails is more than any scope a run checks at once
  presentationFrames: presentation.slice(0, MAX_EX), presentationCount: presentation.length,
  skippedFrames: skipped.slice(0, MAX_EX), skippedCount: skipped.length, ms: Date.now() - t0,
};
