// merge-email-check script 01: frames, modules, the preview area and length (read-only). Feeds EM-01 to EM-05.
// Placeholders: __EMAILS__ (JSON: script 00's `emails`, as confirmed or corrected by the agent; each frame needs at
// least `id` and `role`, and `dark` if it shows dark mode) and __SETTINGS__ (JSON: the house settings, or null).
const EMAILS = __EMAILS__;
const SETTINGS = __SETTINGS__;
const t0 = Date.now();
// MERGE's house settings (checklist.md, "House settings"); a project overrides any of them through __SETTINGS__
const DEFAULTS = {
  mobileWidth: [320, 480], desktopWidth: [600, 700], // accepted frame widths (D-7, D-8)
  mobileDefault: 375, desktopDefault: 600, // MERGE's own widths; another accepted width passes with a note
  previewArea: 300, // the first 300px of the desktop frame, Jill Redo's scorecard, "Preview Pane"
  maxLength: 4500, // about six desktop scrolls, Jill Redo's workshop deck
};
const S = Object.assign({}, DEFAULTS, SETTINGS || {});
const MAX_EX = 10; // examples per list, with a total beside each, to stay under use_figma's 20 KB return
const MAX_MODULES = 40; // a cap of 10 hid real items from the agent in merge-build-readiness; 40 with a count is safe
if (!Array.isArray(EMAILS)) return { error: 'EMAILS must be the JSON array script 00 returns as `emails`' };
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029); // separators that break regexes and JSON readers
const clean = s => String(s).split(LS).join(' / ').split(PS).join(' / ').replace(/\s*\n\s*/g, ' / ').trim();
const short = (s, n) => { s = clean(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
// --- Notes on a layer, read three ways (checklist.md, "Notes for the scripts"): a category named for one of the
// eight kinds; an annotation in any category that starts "Kind:"; a preset Accessibility annotation mentioning alt.
const KINDS = ['alt text', 'decorative image', 'heading level', 'link or cta', 'dark mode', 'dynamic content', 'mobile behavior', 'content model field'];
const catById = new Map(); let categories = 'unavailable';
try { const cs = await figma.annotations.getAnnotationCategoriesAsync(); for (const c of cs) catById.set(c.id, c); categories = cs.map(c => c.label); } catch (e) {}
const notesOf = n => {
  let list = []; try { list = n.annotations || []; } catch (e) { return []; }
  return list.map(a => {
    const cat = a.categoryId ? catById.get(a.categoryId) : null;
    const label = cat ? cat.label.trim() : '';
    const text = clean(a.labelMarkdown || a.label || '');
    let kind = null, how = null, body = text;
    const m = text.replace(/\*\*/g, '').match(/^\s*([A-Za-z ]+?)\s*:\s*([\s\S]*)$/);
    if (KINDS.includes(label.toLowerCase())) { kind = label.toLowerCase(); how = 'category'; }
    else if (m && KINDS.includes(m[1].toLowerCase())) { kind = m[1].toLowerCase(); how = 'prefix'; body = m[2]; }
    else if (cat && cat.isPreset && label === 'Accessibility' && /\balt\b/i.test(text)) { kind = 'alt text'; how = 'preset'; }
    return { kind, how, cat: label || 'none', text: body, suggestion: /^\W*suggest(ion|ed)?\b/i.test(text) };
  });
};
// --- Buttons (checklist.md, "Notes for the scripts"): a frame or instance named button, btn or cta, or one holding a
// single short text layer on a filled, rounded shape.
const BUTTON_NAME = /(^|[^a-z])(button|btn|cta)([^a-z]|$)/i;
const MAX_LABEL = 40; // a button label is a few words; a longer single text is a card or a band
const MAX_BUTTON_H = 80; // taller than any button we've seen drawn; a filled card with one line of text is not one
const solidOf = n => (Array.isArray(n.fills) ? n.fills.find(p => p.visible !== false && p.type === 'SOLID' && (p.opacity ?? 1) > 0) : null);
const radiusOf = n => ('topLeftRadius' in n ? Math.max(n.topLeftRadius, n.topRightRadius, n.bottomLeftRadius, n.bottomRightRadius) : 0);
const isButton = n => {
  if (!['FRAME', 'INSTANCE', 'COMPONENT', 'GROUP'].includes(n.type)) return false;
  if (BUTTON_NAME.test(n.name)) return true;
  if (n.height > MAX_BUTTON_H || !('findAllWithCriteria' in n)) return false;
  const texts = n.findAllWithCriteria({ types: ['TEXT'] });
  if (texts.length !== 1 || texts[0].characters.trim().length > MAX_LABEL) return false;
  if (n.type !== 'GROUP') return !!solidOf(n) && radiusOf(n) > 0;
  return n.children.some(c => c.type === 'RECTANGLE' && solidOf(c) && radiusOf(c) > 0);
};
// Compare layers by ID, never as objects: a layer inside an instance found by findAllWithCriteria isn't the same
// object as the one in its parent's children, so indexOf returned -1 and Set lookups missed it (2026-10-05).
const visibleIn = (n, frame) => { for (let p = n; p && p.id !== frame.id; p = p.parent) if (p.visible === false) return false; return true; };
const hasImage = n => Array.isArray(n.fills) && n.fills.some(p => p.visible !== false && p.type === 'IMAGE');
// Load the pages the frames are on, and touch every instance's children: layers inside instances load lazily, and a
// page search found 234 text layers before and 955 after (merge-build-readiness, 2026-10-05).
const loaded = new Set();
const frameNode = async id => {
  const n = await figma.getNodeByIdAsync(id); if (!n) return null;
  let p = n; while (p && p.type !== 'PAGE') p = p.parent;
  if (p && !loaded.has(p.id)) { await p.loadAsync(); loaded.add(p.id); }
  for (let pass = 0, last = -1; pass < 4 && 'findAllWithCriteria' in n; pass++) { const inst = n.findAllWithCriteria({ types: ['INSTANCE'] }); if (inst.length === last) break; last = inst.length; for (const i of inst) i.children.length; }
  return n;
};
const out = { categories, emails: [] };
let notesRead = 0, notesMatched = 0;
for (const e of EMAILS) {
  const r = { name: e.name, frames: [] };
  const nodes = [];
  for (const f of e.frames || []) {
    const n = await frameNode(f.id);
    if (!n) { r.frames.push({ id: f.id, error: 'not found' }); continue; }
    const b = n.absoluteBoundingBox;
    const width = Math.round(n.width);
    const role = f.role || null;
    const fr = { id: n.id, name: short(n.name, 60), role, dark: !!f.dark, w: width, h: Math.round(n.height), x: Math.round(b.x), layers: 'children' in n ? n.children.filter(c => c.visible !== false).length : 0 };
    // EM-01: notes for a width other than MERGE's own, and the frame's own notes (a frame-level mobile behavior note)
    if (role === 'desktop' && width !== S.desktopDefault) fr.widthNote = 'accepted, but the house default is ' + S.desktopDefault + 'px';
    if (role === 'mobile' && width !== S.mobileDefault) fr.widthNote = 'accepted, but the house default is ' + S.mobileDefault + 'px';
    if (!fr.layers) fr.empty = true;
    // EM-05
    if (role === 'desktop' && n.height > S.maxLength) fr.overLength = Math.round(n.height - S.maxLength);
    const fnotes = notesOf(n); notesRead += fnotes.length; notesMatched += fnotes.filter(x => x.kind).length;
    const mb = fnotes.find(x => x.kind === 'mobile behavior');
    if (mb) fr.frameMobileNote = short(mb.text, 120);
    r.frames.push(fr); nodes.push({ n, fr });
  }
  // EM-01 and EM-02 summary. Light frames only for order: a dark-mode frame is a view of the same email.
  const light = nodes.filter(x => !x.fr.dark);
  const mob = light.filter(x => x.fr.role === 'mobile'), desk = light.filter(x => x.fr.role === 'desktop');
  r.em01 = { mobile: nodes.filter(x => x.fr.role === 'mobile').length, desktop: nodes.filter(x => x.fr.role === 'desktop').length, emptyFrames: nodes.filter(x => x.fr.empty).map(x => x.fr.id) };
  r.em02 = mob.length && desk.length ? { mobileX: mob[0].fr.x, desktopX: desk[0].fr.x, mobileLeft: mob[0].fr.x < desk[0].fr.x } : 'needs one light mobile and one light desktop frame';
  // EM-03: modules are the direct children of the light desktop frame, or of the mobile frame when the desktop one is
  // empty. A module counts as noted when it, or the frame itself, carries a mobile behavior note.
  const base = desk.find(x => x.fr.layers) || mob.find(x => x.fr.layers);
  if (base) {
    const kids = base.n.children.filter(c => c.visible !== false).sort((a, b) => a.absoluteBoundingBox.y - b.absoluteBoundingBox.y);
    const CONTAINERS = ['FRAME', 'GROUP', 'INSTANCE', 'COMPONENT', 'SECTION'];
    const mods = kids.map(c => {
      const ns = notesOf(c); notesRead += ns.length; notesMatched += ns.filter(x => x.kind).length;
      const mb = ns.find(x => x.kind === 'mobile behavior');
      return { id: c.id, name: short(c.name, 40), type: c.type, y: Math.round(c.absoluteBoundingBox.y - base.n.absoluteBoundingBox.y), note: mb ? short(mb.text, 80) : null };
    });
    const loose = mods.filter(m => !CONTAINERS.includes(m.type)).length;
    r.em03 = {
      from: base.fr.id + ' (' + base.fr.role + ')', modules: mods.length, withNote: mods.filter(m => m.note).length,
      frameNote: !!base.fr.frameMobileNote,
      // More than half the frame's direct children being single text or shape layers means the email isn't grouped
      // into modules, as in the Adobe rebuild's desktop frame (2026-10-05), so a per-module count means little.
      looseLayers: loose, notGroupedIntoModules: loose > mods.length / 2,
      list: mods.slice(0, MAX_MODULES), listTotal: mods.length,
    };
  } else r.em03 = 'no frame has layers';
  // EM-04: text, buttons and images whose top edge is inside the preview area, desktop frames first. Mobile frames
  // are returned too, since the checklist leaves open whether the rule applies there (open question, 2026-10-05).
  r.em04 = [];
  for (const { n, fr } of nodes) {
    if (fr.dark || !fr.layers) continue;
    const top = n.absoluteBoundingBox.y;
    const items = [];
    const buttons = new Set();
    const inButton = t => { for (let p = t.parent; p && p.id !== n.id; p = p.parent) if (buttons.has(p.id)) return true; return false; };
    // findAllWithCriteria returns parents before children, so a button inside a button is counted once
    for (const c of n.findAllWithCriteria({ types: ['FRAME', 'INSTANCE', 'COMPONENT', 'GROUP'] })) if (visibleIn(c, n) && !inButton(c) && isButton(c)) buttons.add(c.id);
    for (const c of n.findAllWithCriteria({ types: ['TEXT', 'FRAME', 'RECTANGLE', 'INSTANCE', 'GROUP', 'VECTOR', 'ELLIPSE'] })) {
      if (!visibleIn(c, n)) continue;
      const y = Math.round(c.absoluteBoundingBox.y - top);
      if (y >= S.previewArea) continue;
      if (buttons.has(c.id)) { const t = c.findAllWithCriteria({ types: ['TEXT'] })[0]; items.push({ kind: 'button', id: c.id, y, text: t ? short(t.characters, 40) : null }); }
      else if (c.type === 'TEXT' && c.characters.trim() && !inButton(c)) items.push({ kind: 'text', id: c.id, y, size: c.fontSize === figma.mixed ? 'mixed' : c.fontSize, text: short(c.characters, 60) });
      else if (hasImage(c)) items.push({ kind: 'image', id: c.id, y, name: short(c.name, 40), w: Math.round(c.width), h: Math.round(c.height) });
    }
    items.sort((a, b) => a.y - b.y);
    r.em04.push({ frame: fr.id, role: fr.role, previewArea: S.previewArea, items: items.slice(0, 15), itemsTotal: items.length, texts: items.filter(i => i.kind === 'text').length, buttons: items.filter(i => i.kind === 'button').length, images: items.filter(i => i.kind === 'image').length });
  }
  out.emails.push(r);
}
// Whether the file uses any of the three ways of writing notes; none at all makes the note checks Couldn't check
out.notes = { read: notesRead, matched: notesMatched };
out.ms = Date.now() - t0;
return out;
