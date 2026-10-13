// merge-email-check script 02: images, the logo, icons and color (read-only). Feeds EM-06 to EM-16, EM-19 (text
// contrast, from merge-build-readiness script 08), EM-20, EM-29 and EM-30.
// Split on 2026-10-06 from 01-checks.js, which ran this and script 01 as two parts of one script: Figma's agent runs
// a script through evaluate_script, whose code may be at most 20,000 characters. Scripts 01 and 02 each carry their own
// copy of the helpers they share, so change both together.
// Placeholders: __EMAILS__ (JSON: script 00's `emails`, as confirmed or corrected; each frame needs `id` and `role`,
// plus `dark: true` if it shows dark mode) and __SETTINGS__ (JSON: the house settings, or null for MERGE's).
const EMAILS = __EMAILS__;
const SETTINGS = __SETTINGS__;
const t0 = Date.now();
// MERGE's house settings (checklist.md, "House settings"); a project overrides any of them through __SETTINGS__
const S = Object.assign({
  maxSlice: 1500, // image slice height, Jill Redo's workshop deck and D-16 (EM-30)
  altCharPx: 8.8, // average width of a 16px character, so the alt text that fits on one line is width / 8.8 (EM-07)
  darkReference: '#121212', // a stand-in for a mail app's dark background (EM-14; checklist.md, open question)
}, SETTINGS || {});
const MAX_EX = 10; // examples per list, with a total beside each, to stay under use_figma's 20 KB return
const few = a => a.slice(0, MAX_EX);
if (!Array.isArray(EMAILS)) return { error: 'EMAILS must be the JSON array script 00 returns as `emails`' };
// Line and paragraph separators break regexes and JSON readers. Build them with fromCharCode: a backslash-u-2028
// escape typed into a use_figma call arrives as a real separator and breaks the script (2026-10-05).
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029);
const NEWLINES = /\s*\n\s*/g;
const clean = s => String(s).split(LS).join(' / ').split(PS).join(' / ').replace(NEWLINES, ' / ').trim();
const short = (s, n) => clean(s).slice(0, n);
const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const findAll = (n, types) => ('findAllWithCriteria' in n ? n.findAllWithCriteria({ types }) : []);
const box = n => n.absoluteBoundingBox;
const size = n => Math.round(n.width) + 'x' + Math.round(n.height);
const shown = p => p.visible !== false;
const fillsOf = n => (Array.isArray(n.fills) ? n.fills.filter(p => shown(p) && (p.opacity ?? 1) > 0) : []);
const isSolid = p => p.type === 'SOLID';
const solidOf = n => fillsOf(n).find(isSolid);
const opaqueSolid = paints => paints.find(p => isSolid(p) && (p.opacity ?? 1) >= 1);
const strokesOf = n => (Array.isArray(n.strokes) ? n.strokes.filter(shown) : []);
const weightOf = n => (typeof n.strokeWeight === 'number' ? n.strokeWeight : 1); // strokeWeight can be figma.mixed
const hasImage = n => fillsOf(n).some(p => p.type === 'IMAGE');
// Compare layers by ID, never as objects: a layer inside an instance found by findAllWithCriteria isn't the same
// object as the one in its parent's children, so indexOf returned -1 and Set lookups missed it (2026-10-05).
const visibleIn = (n, frame) => { for (let p = n; p && p.id !== frame.id; p = p.parent) if (p.visible === false) return false; return true; };
const insideAny = (n, ids, frame) => { for (let p = n.parent; p && p.id !== frame.id; p = p.parent) if (ids.has(p.id)) return true; return false; };
// --- Notes on a layer, read three ways (checklist.md, "Notes for the scripts"): a category named for one of the
// eight kinds; an annotation in any category that starts "Kind:"; a preset Accessibility annotation mentioning alt.
// A note that starts "Suggestion" only suggests, so it counts toward Partly at most.
const KINDS = ['alt text', 'decorative image', 'heading level', 'link or cta', 'dark mode', 'dynamic content', 'mobile behavior', 'content model field'];
const NOTE_PREFIX = /^\s*([A-Za-z ]+?)\s*:\s*([\s\S]*)$/;
const BOLD = /\*\*/g, ALT = /\balt\b/i, SUGGESTION = /^\W*suggest(ion|ed)?\b/i;
const catById = new Map();
try { for (const c of await figma.annotations.getAnnotationCategoriesAsync()) catById.set(c.id, c); } catch (e) {}
const notesOf = n => {
  let list = []; try { list = n.annotations || []; } catch (e) {}
  return list.map(a => {
    const cat = catById.get(a.categoryId), label = cat ? cat.label.trim().toLowerCase() : '';
    const text = clean(a.labelMarkdown || a.label || ''), m = text.replace(BOLD, '').match(NOTE_PREFIX);
    const pre = m && KINDS.includes(m[1].toLowerCase()) ? m[1].toLowerCase() : null;
    const kind = KINDS.includes(label) ? label : pre || (cat && cat.isPreset && label === 'accessibility' && ALT.test(text) ? 'alt text' : null);
    // a suggestion can also follow the kind, as in "Alt text: Suggestion: ...", so test the body too
    const body = pre && kind === pre ? m[2] : text;
    return { kind, text: body, suggestion: SUGGESTION.test(text) || SUGGESTION.test(body) };
  });
};
// A note on the layer itself, or on the nearest layer holding it below the email frame, because a layer inside an
// instance can only carry the instance's notes; `on` names the holding layer, and `kind` null takes any kind.
const noteUp = (n, frame, kind) => {
  for (let p = n; p && p.id !== frame.id; p = p.parent) { const x = notesOf(p).find(y => (kind ? y.kind === kind : y.kind)); if (x) return Object.assign(x, { on: p.id === n.id ? undefined : p.id }); }
  return null;
};
const noteText = (x, n) => short(x.text, n) + (x.suggestion ? ' (suggestion)' : '') + (x.on ? ' (on ' + x.on + ')' : '');
// --- Buttons (checklist.md, "Notes for the scripts"): a frame or instance named button, btn or cta, or one holding a
// single short text layer on a filled, rounded shape.
const CONTAINERS = ['FRAME', 'INSTANCE', 'COMPONENT', 'GROUP'];
const BUTTON_NAME = /(^|[^a-z])(button|btn|cta)([^a-z]|$)/i;
const MAX_LABEL = 40; // a button label or a standalone link is a few words; a longer single text is a card or a band
const MAX_BUTTON_H = 80; // taller than any button we've seen drawn; a filled card with one line of text is not one
const radiusOf = n => ('topLeftRadius' in n ? Math.max(n.topLeftRadius, n.topRightRadius, n.bottomLeftRadius, n.bottomRightRadius) : 0);
const isButton = n => {
  if (!CONTAINERS.includes(n.type)) return false;
  if (BUTTON_NAME.test(n.name)) return true;
  if (n.height > MAX_BUTTON_H) return false;
  const texts = findAll(n, ['TEXT']);
  if (texts.length !== 1 || texts[0].characters.trim().length > MAX_LABEL) return false;
  if (n.type !== 'GROUP') return !!solidOf(n) && radiusOf(n) > 0;
  return n.children.some(c => c.type === 'RECTANGLE' && solidOf(c) && radiusOf(c) > 0);
};
// Load the frame's page, and touch every instance's children: layers inside instances load lazily, and a page search
// found 234 text layers before and 955 after (merge-build-readiness, 2026-10-05). `page` is the frame's page.
let page = null;
const loaded = new Set();
const load = async n => {
  page = n; while (page.type !== 'PAGE') page = page.parent;
  if (!loaded.has(page.id)) { await page.loadAsync(); loaded.add(page.id); }
  for (let pass = 0, last = -1; pass < 4; pass++) { const inst = findAll(n, ['INSTANCE']); if (inst.length === last) break; last = inst.length; for (const i of inst) i.children.length; }
};
const MAX_IMAGES = 40; // image rows per frame; a cap of 10 hid real items in merge-build-readiness
const MAX_PAIRS = 8; // failing color pairs per frame; they're grouped, so 8 covers every distinct problem we've seen
const ICON_MAX = 48; // icons are no larger than 48px (checklist.md, "Notes for the scripts")
const iconSize = n => Math.max(n.width, n.height) <= ICON_MAX;
const ICON_NEED = 3; // WCAG 1.4.11 non-text contrast, for icons and button edges
const MIN_BACKGROUND = 8; // a fill under 8px on either side is a rule or a divider, not a background (EM-15)
const OVERLAP = 0.2; // EM-10: text is over an image when a fifth or more of its box overlaps it
const ALT_TOLERANCE = 0.1; // EM-07: up to 10% over the estimate is a flag, beyond it Fail
// The logo, when no layer is named for it: a note that mentions the logo, else the first image or vector near the top.
// The header bands we've seen are 66px (TOFU) and 86px (Adobe) tall, so 120px covers them; at 70% of the frame's width
// or more it's a hero, not a logo.
const LOGO_TOP = 120, LOGO_MAX_SHARE = 0.7;
const PLATE_AREA = 3; // a shape under the logo with less than three times its area hugs it, so it may be a plate
const BYTES_BUDGET_MS = 8000; // reading an image's bytes took 0.2 to 0.4 seconds each on 2026-10-05; stop well before a timeout
// Regexes live in named constants: rjsmin reads a regex literal straight after => as division and strips its spaces
// ("knock ?out" became "knock?out", 2026-10-05), so no arrow function may start with one.
const TEXTY = /headline|heading|title|button|btn|cta|offer|text|copy/i; // image names that suggest words baked into the image
const REVERSED = /revers|light version|white|knock[ -]?out|swap/i; // a dark-mode note that names a reversed logo
const SWAPS = /swap|dark version|reversed|light version/i; // an icon whose dark-mode note says it swaps is left out of EM-14
const LOGO_WORD = /\blogo\b/i; // a note that mentions the logo
const LOGO = /logo/i; // a layer named for the logo, "AdobeLogo" included; logos are exempt from text contrast (WCAG 1.4.3)
const ICON_NAME = /icon/i;
const QUOTE = /[“"]([^”"]{2,})[”"]/; // the alt text itself, when a note quotes it
const DECORATIVE = /\bdecorative\b|alt\s*=\s*["“”]{2}|empty alt/i;
// --- WCAG 2.2 relative luminance and contrast ratio, as in merge-build-readiness script 08
const lin = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg, a, bg) => ({ r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) });
const r2 = x => Math.round(x * 100) / 100;
const vs = (p, bg) => r2(ratio(over(p.color, p.opacity ?? 1, bg), bg)); // a paint's contrast against a background
const [dr, dg, db] = [1, 3, 5].map(i => parseInt(S.darkReference.slice(i, i + 2), 16) / 255), DARK = { r: dr, g: dg, b: db };
// --- The background behind a layer: merge-build-readiness script 08's walk. The topmost opaque layer under the layer's
// center, children first, then the parent's fill, up to the page; a boolean shape is its own fill; a main component's
// edge means no background is known. With imagesOff, image fills are skipped, which gives the color a reader sees with
// images blocked, or behind a background image classic Outlook doesn't show (EM-10, EM-11); without it, an image or
// gradient underneath means "check from a screenshot" (EM-19).
const covers = (b, c) => b && c.x >= b.x && c.x <= b.x + b.width && c.y >= b.y && c.y <= b.y + b.height;
const addFills = (s, layers, imagesOff) => {
  const vf = fillsOf(s).filter(f => !imagesOff || f.type !== 'IMAGE');
  if (vf.some(f => f.type !== 'SOLID')) return 'complex';
  const o = 'opacity' in s ? s.opacity : 1; // a section has fills but no opacity, and reading it throws (2026-10-05)
  layers.push(...vf.reverse().map(f => ({ f, o: (f.opacity ?? 1) * o, id: s.id })));
  return layers.some(l => l.o >= 1);
};
const under = (s, c, layers, imagesOff) => {
  if (s.visible === false || s.type === 'TEXT' || !covers(box(s), c)) return false;
  if ('children' in s && s.type !== 'BOOLEAN_OPERATION') for (let i = s.children.length - 1; i >= 0; i--) { const r = under(s.children[i], c, layers, imagesOff); if (r) return r; }
  return addFills(s, layers, imagesOff);
};
const behind = (n, imagesOff) => {
  const b = box(n), layers = [];
  const c = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  const done = () => {
    let base = (page.backgrounds.find(shown) || { color: { r: 1, g: 1, b: 1 } }).color;
    const i = layers.findIndex(l => l.o >= 1);
    for (const { f, o } of (i >= 0 ? layers.slice(0, i + 1) : layers).reverse()) base = over(f.color, o, base);
    return { base, top: i >= 0 ? layers[i].id : null };
  };
  for (let cur = n; cur.parent && cur.type !== 'PAGE'; cur = cur.parent) {
    if (cur.type === 'COMPONENT' || cur.type === 'COMPONENT_SET') return { unknown: true };
    const parent = cur.parent, sibs = parent.children;
    for (let i = sibs.findIndex(x => x.id === cur.id) - 1; i >= 0; i--) { const r = under(sibs[i], c, layers, imagesOff); if (r === 'complex') return { complex: true }; if (r) return done(); }
    if (parent.type !== 'PAGE') { const r = addFills(parent, layers, imagesOff); if (r === 'complex') return { complex: true }; if (r) return done(); }
  }
  return done();
};
// --- A bound color in every mode of its collection, following aliases (merge-build-readiness script 08), so a file that
// themes an email with light and dark variable modes gets each mode's contrast (Steve approved keeping it, 2026-10-05)
const varCache = new Map();
const getVar = async id => { if (!varCache.has(id)) varCache.set(id, await figma.variables.getVariableByIdAsync(id)); return varCache.get(id); };
const colOf = v => figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
const resolveIn = async (id, modeId, depth = 0) => {
  const v = await getVar(id); if (!v || depth > 8) return null; // an alias chain deeper than 8 is a loop, not a real token tier
  const col = await colOf(v);
  const val = v.valuesByMode[modeId] !== undefined ? v.valuesByMode[modeId] : v.valuesByMode[col.defaultModeId];
  if (val && val.type === 'VARIABLE_ALIAS') return resolveIn(val.id, modeId, depth + 1);
  return val && 'r' in val ? val : null;
};
const paintModes = async p => {
  const vid = p.boundVariables && p.boundVariables.color && p.boundVariables.color.id;
  const v = vid ? await getVar(vid) : null; if (!v) return [{ color: p.color }];
  const col = await colOf(v), res = [];
  for (const m of col.modes) { const c = await resolveIn(vid, m.modeId); if (c) res.push({ mode: col.modes.length > 1 ? m.name : null, color: c }); }
  return res.length ? res : [{ color: p.color }];
};
// --- Text contrast for every segment and color mode: WCAG large text is 24px, or 18.66px bold, and needs 3 to 1
const contrasts = async (t, base) => {
  const res = [];
  for (const s of t.getStyledTextSegments(['fills', 'fontSize', 'fontWeight'])) {
    const fill = s.fills.find(p => shown(p) && isSolid(p)); if (!fill) continue;
    const need = s.fontSize >= 24 || (s.fontSize >= 18.66 && s.fontWeight >= 700) ? 3 : 4.5;
    for (const { mode, color } of await paintModes(fill)) {
      const fg = over(color, (fill.opacity ?? 1) * (t.opacity ?? 1), base);
      res.push({ r: ratio(fg, base), need, key: hex(fg) + ' on ' + hex(base) + ' ' + s.fontSize + 'px/' + s.fontWeight + (mode ? ' [' + mode + ']' : '') });
    }
  }
  return res;
};
// --- Whether an image is certainly opaque, from its first bytes: a JPG, or a PNG of color type 0 (gray) or 2 (RGB).
// An alpha channel doesn't prove transparency, since an opaque photo saved as PNG has one too (the TOFU file's "eye
// rainbow 1", 2026-10-05), so EM-16 still needs a screenshot. A tRNS chunk on a type 0 or 2 PNG is rare and ignored.
// Bytes are read only for EM-16's candidates, and only until the time budget is spent; after that, undefined.
const opaque = new Map(); let bytesMs = 0;
const isOpaque = async hash => {
  if (!opaque.has(hash) && bytesMs < BYTES_BUDGET_MS) {
    const t = Date.now(); let r = null;
    try { const b = await figma.getImageByHash(hash).getBytesAsync(); r = (b[0] === 0xff && b[1] === 0xd8) || (b[0] === 0x89 && (b[25] === 0 || b[25] === 2)); } catch (e) {}
    bytesMs += Date.now() - t; opaque.set(hash, r);
  }
  return opaque.get(hash);
};
const out = { emails: [] };
const counts = { images: 0, alt: 0, altSuggestionOnly: 0, altFlag: 0, altFail: 0, dark: 0, darkSuggestionOnly: 0, background: 0, exportSvgPdf: 0, exportNone: 0, tall: 0 };
const SHAPES = ['FRAME', 'RECTANGLE', 'ELLIPSE', 'POLYGON', 'STAR', 'VECTOR', 'INSTANCE', 'COMPONENT', 'BOOLEAN_OPERATION', 'GROUP', 'TEXT'];
const VECTORISH = ['VECTOR', 'BOOLEAN_OPERATION'];
for (const e of EMAILS) {
  const er = { name: e.name, frames: [], illustrations: [] }, darkByName = new Map();
  for (const f of e.frames || []) {
    const frame = await figma.getNodeByIdAsync(f.id);
    if (!frame) { er.frames.push({ id: f.id, error: 'not found' }); continue; }
    await load(frame);
    const fb = box(frame), fr = { id: frame.id, role: f.role, dark: !!f.dark || undefined };
    er.frames.push(fr);
    // Paint order: a pre-order walk lists every layer before the layers drawn on top of it
    const order = new Map(); let k = 0;
    const walk = n => { order.set(n.id, k++); if ('children' in n) for (const c of n.children) walk(c); };
    walk(frame);
    const all = findAll(frame, SHAPES).filter(n => visibleIn(n, frame));
    const imgs = all.filter(n => n.type !== 'TEXT' && hasImage(n));
    const texts = all.filter(n => n.type === 'TEXT' && n.characters.trim());
    // EM-09 data: images named like text. EM-08's headline comes from the layout part's heading lists, with sizes.
    const texty = imgs.filter(n => TEXTY.test(n.name));
    fr.imagesNamedLikeText = few(texty).map(n => n.id + ' ' + short(n.name, 40)); fr.imagesNamedLikeTextTotal = texty.length;
    // --- EM-13 data: the logo, by name (counted once, at its outermost layer), then from a note, then by position
    const named = all.filter(n => n.type !== 'TEXT' && LOGO.test(n.name)), namedIds = new Set(named.map(n => n.id));
    let logos = named.filter(n => !insideAny(n, namedIds, frame)).map(n => [n, 'name']);
    const imageOrVector = n => hasImage(n) || VECTORISH.includes(n.type);
    if (!logos.length) logos = all.filter(n => imageOrVector(n) && LOGO_WORD.test((noteUp(n, frame, null) || { text: '' }).text)).slice(0, 2).map(n => [n, 'note']);
    if (!logos.length) logos = all.filter(n => imageOrVector(n) && box(n).y - fb.y < LOGO_TOP && n.width < frame.width * LOGO_MAX_SHARE && !iconSize(n)).sort((a, b) => box(a).y - box(b).y).slice(0, 1).map(n => [n, 'top ' + LOGO_TOP + 'px']);
    const logoIds = new Set(logos.map(l => l[0].id));
    fr.logos = []; fr.logosTotal = logos.length;
    for (const [n, why] of few(logos)) {
      const dn = noteUp(n, frame, 'dark mode'), bg = behind(n, false);
      const topNode = bg.top ? await figma.getNodeByIdAsync(bg.top) : null;
      const strokes = strokesOf(n), sw = weightOf(n);
      const img = fillsOf(n).find(p => p.type === 'IMAGE'), solid = solidOf(n);
      fr.logos.push({ id: n.id, name: short(n.name, 30), why, look: img ? 'image ' + img.imageHash.slice(0, 8) : solid ? hex(solid.color) : n.type, darkNote: dn ? noteText(dn, 120) : null, namesReversed: dn ? REVERSED.test(dn.text) : false, outline: strokes.length && sw > 0 && strokes[0].color ? hex(strokes[0].color) + ' ' + sw + 'px' : undefined, effects: (n.effects || []).filter(shown).map(x => x.type).join(',') || undefined, possiblePlate: topNode && topNode.width * topNode.height < PLATE_AREA * n.width * n.height ? topNode.id : undefined });
    }
    // --- Images: one row each for EM-06, EM-07, EM-11, EM-12, EM-29 and EM-30
    fr.images = [];
    for (const n of imgs) {
      counts.images++;
      const own = fillsOf(n), fill = own.find(p => p.type === 'IMAGE');
      const alt = noteUp(n, frame, 'alt text'), dec = noteUp(n, frame, 'decorative image'), dark = noteUp(n, frame, 'dark mode');
      // the alt text itself: a quoted string if the note quotes one, else the note's first line
      const q = alt && alt.text.match(QUOTE), altValue = alt ? (q ? q[1] : alt.text.split(' / ')[0].trim()) : '';
      const decorative = dec ? 'marked' + (dec.suggestion ? ' (suggestion)' : '') : alt && DECORATIVE.test(alt.text) ? 'in alt note' : undefined;
      const maxChars = Math.floor(n.width / S.altCharPx), icon = iconSize(n);
      // EM-11: a solid fill under the image in its own fills, or on a holding layer that fits it within 2px
      const ownSolid = opaqueSolid(own.slice(0, own.indexOf(fill)));
      const b = box(n), pb = n.parent.id !== frame.id && box(n.parent);
      const fits = pb && ['x', 'y', 'width', 'height'].every(k => Math.abs(pb[k] - b[k]) <= 2);
      const wrapSolid = fits ? opaqueSolid(fillsOf(n.parent)) : null;
      // EM-29: the image's own export settings, else the nearest layer holding it below the frame
      let exp = null;
      for (let p = n; p.id !== frame.id; p = p.parent) if (p.exportSettings && p.exportSettings.length) { exp = p.exportSettings.map(x => x.format).join('/') + (p.id !== n.id ? ' (on ' + p.id + ')' : ''); break; }
      const altExcess = alt && !decorative ? altValue.length - maxChars : 0;
      const row = { id: n.id, name: short(n.name, 30), size: size(n), logo: logoIds.has(n.id) || undefined, icon: icon || undefined, alt: alt ? noteText(Object.assign({}, alt, { text: altValue }), 100) : undefined, fit: alt && !decorative ? altValue.length + '/' + maxChars : undefined, decorative, dark: dark ? noteText(dark, 80) : undefined, background: ownSolid ? hex(ownSolid.color) + ' own' : wrapSolid ? hex(wrapSolid.color) + ' on ' + n.parent.id : undefined, export: exp || undefined };
      if (alt && !alt.suggestion || dec && !dec.suggestion) counts.alt++; else if (alt || dec) counts.altSuggestionOnly++;
      if (altExcess > maxChars * ALT_TOLERANCE) counts.altFail++; else if (altExcess > 0) counts.altFlag++;
      if (dark) counts[dark.suggestion ? 'darkSuggestionOnly' : 'dark']++;
      if (row.background) counts.background++;
      if (!exp) counts.exportNone++; else if (exp.includes('SVG') || exp.includes('PDF')) counts.exportSvgPdf++;
      if (n.height > S.maxSlice) counts.tall++;
      if (fr.images.length < MAX_IMAGES) fr.images.push(row);
      // EM-16 data: images that aren't the logo or an icon, have no solid color under them and may be transparent
      if (!logoIds.has(n.id) && !icon && !ownSolid && !(fill.imageHash && await isOpaque(fill.imageHash))) { if (f.dark) darkByName.set(n.name, n.id); else er.illustrations.push({ id: n.id, name: short(n.name, 30) }); }
    }
    fr.imagesTotal = imgs.length;
    // --- EM-19 text contrast, grouped into failing color pairs, and EM-10: text whose box overlaps an image painted
    // below it by a fifth or more, at any level and inside instances, and its contrast with images off
    const pairs = new Map(), screenshot = [], overImages = []; let textLayers = 0, logoText = 0;
    for (const t of texts) {
      if (LOGO.test(t.name) || insideAny(t, namedIds, frame) || insideAny(t, logoIds, frame)) { logoText++; continue; }
      textLayers++;
      const tb = box(t), area = tb.width * tb.height;
      const img = imgs.find(i => { const ib = box(i), w = Math.min(tb.x + tb.width, ib.x + ib.width) - Math.max(tb.x, ib.x), h = Math.min(tb.y + tb.height, ib.y + ib.height) - Math.max(tb.y, ib.y); return order.get(i.id) < order.get(t.id) && w > 0 && h > 0 && w * h >= OVERLAP * area; });
      if (img) {
        const off = behind(t, true);
        const worst = off.base ? (await contrasts(t, off.base)).sort((a, b) => a.r / a.need - b.r / b.need)[0] : null;
        overImages.push(t.id + ' "' + short(t.characters, 30) + '" over ' + img.id + ', images off: ' + (worst ? worst.key + ' ' + r2(worst.r) + ' (needs ' + worst.need + ')' : 'check from a screenshot'));
      }
      const bg = behind(t, false);
      if (!bg.base) { screenshot.push(t.id); continue; }
      for (const c of await contrasts(t, bg.base)) if (c.r + 1e-9 < c.need) {
        const p = pairs.get(c.key) || { ratio: r2(c.r), need: c.need, count: 0, ex: [] };
        p.count++; if (p.ex.length < 3 && !p.ex.includes(t.id)) p.ex.push(t.id); pairs.set(c.key, p);
      }
    }
    fr.em19 = { textLayers, logoTextSkipped: logoText, failingPairs: pairs.size, failing: [...pairs.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, MAX_PAIRS).map(([key, v]) => key + ': ' + v.ratio + ' (needs ' + v.need + ') x' + v.count + ' ' + v.ex.join(',')), checkFromScreenshot: screenshot.length, checkFromScreenshotEx: few(screenshot) };
    fr.em10 = { count: overImages.length, ex: overImages.slice(0, MAX_EX * 2) };
    // --- EM-14 and EM-20: icons are vectors, or layers named icon, no larger than 48px, counted at the outermost layer
    const isIconish = n => iconSize(n) && (VECTORISH.includes(n.type) || ICON_NAME.test(n.name));
    const iconIds = new Set(), iconRows = []; let iconImages = 0;
    for (const n of all) {
      if (n.type === 'TEXT' || !isIconish(n) || insideAny(n, iconIds, frame) || LOGO.test(n.name) || insideAny(n, namedIds, frame) || logoIds.has(n.id)) continue;
      iconIds.add(n.id);
      if (hasImage(n)) { iconImages++; continue; }
      // the icon's color: its own solid fill, else the first solid fill inside it, else a solid stroke
      const parts = [n, ...findAll(n, ['VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE', 'RECTANGLE'])], inner = parts.slice(1).find(x => solidOf(x));
      const paint = solidOf(n) || (inner && solidOf(inner)) || strokesOf(n).find(isSolid);
      if (!paint) continue;
      const dn = noteUp(n, frame, 'dark mode'), swaps = !!dn && SWAPS.test(dn.text), bg = behind(n, false);
      const onBg = bg.base ? vs(paint, bg.base) : null, onDark = vs(paint, DARK);
      // how many solid colors the icon draws with: more than one means the color measured may be the wrong one, as with
      // panel 4's red disc and white X (91:44), so the agent confirms it from a screenshot
      const colors = new Set(parts.flatMap(x => fillsOf(x).concat(strokesOf(x))).filter(isSolid).map(p => hex(p.color))).size;
      if (onBg !== null && onBg < ICON_NEED || onDark < ICON_NEED) iconRows.push(n.id + ' ' + short(n.name, 20) + ' ' + hex(paint.color) + ' on ' + (bg.base ? hex(bg.base) + ' ' + onBg : 'image or gradient') + ', on dark ' + onDark + ', ' + colors + (colors > 1 ? ' colors' : ' color') + (swaps ? ' (swaps, left out)' : ''));
    }
    fr.em14 = { icons: iconIds.size, imageIcons: iconImages, under3: iconRows.filter(s => !s.endsWith('left out)')).length, ex: few(iconRows) };
    // --- EM-15: frames and shapes whose solid fill is exactly #FFFFFF or #000000, the email frame included
    const pure = [frame, ...all].filter(n => n.type !== 'TEXT' && n.width >= MIN_BACKGROUND && n.height >= MIN_BACKGROUND && !isIconish(n)).map(n => [n, opaqueSolid(fillsOf(n))]).filter(([n, p]) => p && ['#ffffff', '#000000'].includes(hex(p.color)));
    fr.em15 = { count: pure.length, ex: few(pure).map(([n, p]) => n.id + ' ' + short(n.name, 20) + ' ' + hex(p.color) + ' ' + size(n)) };
    // --- EM-20: each button's fill and edge against what's around it, and its label against its fill
    const buttonIds = new Set(); fr.em20 = [];
    for (const b of all) {
      if (!CONTAINERS.includes(b.type) || insideAny(b, buttonIds, frame) || !isButton(b)) continue;
      buttonIds.add(b.id);
      const bg = behind(b, false), shape = b.type === 'GROUP' ? b.children.find(c => c.type === 'RECTANGLE' && solidOf(c)) || b : b;
      const fill = solidOf(shape), stroke = strokesOf(shape).find(isSolid), sw = weightOf(shape);
      const t = findAll(b, ['TEXT'])[0], tf = t && t.getStyledTextSegments(['fills'])[0].fills.find(isSolid);
      if (fr.em20.length < MAX_EX) fr.em20.push(b.id + ' "' + (t ? short(t.characters, 30) : '') + '" fill ' + (fill ? hex(fill.color) : 'none') + ', around ' + (bg.base ? hex(bg.base) + (fill ? ' ' + vs(fill, bg.base) : '') : 'image or gradient') + ', edge ' + (stroke && sw > 0 ? hex(stroke.color) + ' ' + sw + 'px' + (bg.base ? ' ' + vs(stroke, bg.base) : '') : 'none') + (tf && fill ? ', label ' + r2(ratio(tf.color, fill.color)) : ''));
    }
    fr.em20Total = buttonIds.size;
  }
  // EM-16: the same illustration's layer in the email's dark-mode frame, matched by name, so the agent can look at it there
  for (const il of er.illustrations) { const d = darkByName.get(il.name); if (d) il.inDarkFrame = d; }
  er.illustrationsTotal = er.illustrations.length; er.illustrations = few(er.illustrations);
  out.emails.push(er);
}
out.counts = counts;
out.ms = Date.now() - t0;
return out;
