// merge-email-check script 04: color (read-only). Feeds EM-19 (text contrast, from merge-build-readiness script 08),
// EM-14 (icons on light and on dark), EM-15 (pure white and pure black fills) and EM-20 (data: button edges, icons).
// Placeholders: __EMAILS__ (JSON: script 00's `emails`, as confirmed) and __SETTINGS__ (JSON, or null for MERGE's).
const EMAILS = __EMAILS__;
const SETTINGS = __SETTINGS__;
const t0 = Date.now();
// MERGE's house settings (checklist.md, "House settings"); a project overrides any of them through __SETTINGS__
const DEFAULTS = {
  darkReference: '#121212', // a stand-in for a mail app's dark background, used for EM-14 (checklist.md, open question)
  avoidPureBackgrounds: true, // D-21, from D-12: pure #FFFFFF and #000000 set off Outlook.com's recoloring
};
const S = Object.assign({}, DEFAULTS, SETTINGS || {});
const MAX_EX = 10; // examples per list, with a total beside each, to stay under use_figma's 20 KB return
const MAX_PAIRS = 8; // failing color pairs per frame; they're grouped, so 8 covers every distinct problem we've seen
const ICON_MAX = 48; // icons are no larger than 48px (checklist.md, "Notes for the scripts")
const MIN_BACKGROUND = 8; // a fill under 8px on either side is a rule or a divider, not a background (EM-15)
const ICON_NEED = 3; // WCAG 1.4.11 non-text contrast, for icons and button edges
const LOGO = /logo/i; // logos are exempt from text contrast under WCAG 1.4.3
const ICON_NAME = /icon/i;
const SWAPS = /swap|dark version|reversed|light version/i; // an icon whose dark-mode note says it swaps is left out of EM-14
if (!Array.isArray(EMAILS)) return { error: 'EMAILS must be the JSON array script 00 returns as `emails`' };
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029); // separators that break regexes and JSON readers
const clean = s => String(s).split(LS).join(' / ').split(PS).join(' / ').replace(/\s*\n\s*/g, ' / ').trim();
const short = (s, n) => { s = clean(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
// --- WCAG 2.2 relative luminance and contrast ratio, as in merge-build-readiness script 08
const lin = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg, a, bg) => ({ r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) });
const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const fromHex = h => { const m = String(h).replace('#', ''); return { r: parseInt(m.slice(0, 2), 16) / 255, g: parseInt(m.slice(2, 4), 16) / 255, b: parseInt(m.slice(4, 6), 16) / 255 }; };
const DARK = fromHex(S.darkReference);
const r2 = x => Math.round(x * 100) / 100;
// --- Notes, read three ways (checklist.md, "Notes for the scripts"); only dark-mode notes are needed here
const KINDS = ['alt text', 'decorative image', 'heading level', 'link or cta', 'dark mode', 'dynamic content', 'mobile behavior', 'content model field'];
const catById = new Map();
try { for (const c of await figma.annotations.getAnnotationCategoriesAsync()) catById.set(c.id, c); } catch (e) {}
// Compare layers by ID, never as objects: a layer inside an instance found by findAllWithCriteria isn't the same
// object as the one in its parent's children, so indexOf returned -1 and Set lookups missed it (2026-10-05).
const darkNoteUp = (n, frame) => {
  for (let p = n; p && p.id !== frame.id; p = p.parent) {
    let list = []; try { list = p.annotations || []; } catch (e) { continue; }
    for (const a of list) {
      const cat = a.categoryId ? catById.get(a.categoryId) : null;
      const text = clean(a.labelMarkdown || a.label || '');
      const m = text.replace(/\*\*/g, '').match(/^\s*([A-Za-z ]+?)\s*:/);
      if ((cat && cat.label.trim().toLowerCase() === 'dark mode') || (m && m[1].toLowerCase() === 'dark mode')) return text;
    }
  }
  return null;
};
// --- Resolve a bound color in every mode of its collection, following aliases (merge-build-readiness script 08)
const varCache = new Map();
const getVar = async id => { if (!varCache.has(id)) varCache.set(id, await figma.variables.getVariableByIdAsync(id)); return varCache.get(id); };
const resolveIn = async (id, modeId, depth = 0) => {
  const v = await getVar(id); if (!v || depth > 8) return null; // an alias chain deeper than 8 is a loop, not a real token tier
  const col = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
  const val = v.valuesByMode[modeId] !== undefined ? v.valuesByMode[modeId] : v.valuesByMode[col.defaultModeId];
  if (val && val.type === 'VARIABLE_ALIAS') return resolveIn(val.id, modeId, depth + 1);
  return val && 'r' in val ? val : null;
};
const paintModes = async p => {
  const vid = p.boundVariables && p.boundVariables.color && p.boundVariables.color.id;
  if (!vid) return [{ mode: null, color: p.color }];
  const v = await getVar(vid); if (!v) return [{ mode: null, color: p.color }];
  const col = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
  const res = [];
  for (const m of col.modes) { const c = await resolveIn(vid, m.modeId); if (c) res.push({ mode: col.modes.length > 1 ? m.name : null, color: c }); }
  return res.length ? res : [{ mode: null, color: p.color }];
};
// --- The background behind a layer: merge-build-readiness script 08's walk. The topmost opaque layer under the layer's
// center, including the children of the layers beneath it; a boolean shape is its own fill; an image or gradient
// underneath means "check from a screenshot"; a main component's edge means no background is known.
const visibleFills = n => (Array.isArray(n.fills) ? n.fills.filter(p => p.visible !== false && (p.opacity ?? 1) > 0) : []);
const box = n => n.absoluteBoundingBox;
const covers = (b, c) => b && c.x >= b.x && c.x <= b.x + b.width && c.y >= b.y && c.y <= b.y + b.height;
const under = (s, c, layers) => {
  if (!s.visible || s.type === 'TEXT' || !covers(box(s), c)) return false;
  if ('children' in s && s.type !== 'BOOLEAN_OPERATION') for (let i = s.children.length - 1; i >= 0; i--) { const r = under(s.children[i], c, layers); if (r) return r; }
  const vf = visibleFills(s);
  if (vf.some(f => f.type !== 'SOLID')) return 'complex';
  layers.push(...vf.slice().reverse().map(f => ({ f, o: (f.opacity ?? 1) * (s.opacity ?? 1) })));
  return layers.some(l => l.o >= 1);
};
let page = null;
const compose = layers => {
  let base = (page.backgrounds.find(p => p.visible !== false) || { color: { r: 1, g: 1, b: 1 } }).color;
  const firstOpaque = layers.findIndex(l => l.o >= 1);
  for (const { f, o } of (firstOpaque >= 0 ? layers.slice(0, firstOpaque + 1) : layers).reverse()) base = over(f.color, o, base);
  return base;
};
const background = n => {
  const b = box(n); if (!b) return { complex: true };
  const c = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  const layers = [];
  for (let cur = n; cur && cur.type !== 'PAGE'; cur = cur.parent) {
    if (cur.type === 'COMPONENT' || cur.type === 'COMPONENT_SET') return { unknown: true };
    const parent = cur.parent;
    if (parent && 'children' in parent) {
      const sibs = parent.children;
      for (let i = sibs.findIndex(x => x.id === cur.id) - 1; i >= 0; i--) { const r = under(sibs[i], c, layers); if (r === 'complex') return { complex: true }; if (r) return { base: compose(layers) }; }
    }
    if (parent && parent.type !== 'PAGE') {
      const pf = visibleFills(parent);
      if (pf.some(f => f.type !== 'SOLID')) return { complex: true };
      layers.push(...pf.filter(f => f.type === 'SOLID').reverse().map(f => ({ f, o: (f.opacity ?? 1) * (parent.opacity ?? 1) })));
      if (layers.some(l => l.o >= 1)) return { base: compose(layers) };
    }
  }
  return { base: compose(layers) };
};
// --- Buttons, as in script 01
const BUTTON_NAME = /(^|[^a-z])(button|btn|cta)([^a-z]|$)/i;
const MAX_LABEL = 40, MAX_BUTTON_H = 80; // a button label is a few words; a filled card with one line of text is not a button
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
const visibleIn = (n, frame) => { for (let p = n; p && p.id !== frame.id; p = p.parent) if (p.visible === false) return false; return true; };
const loaded = new Set();
const out = { darkReference: S.darkReference, emails: [] };
for (const e of EMAILS) {
  const er = { name: e.name, frames: [] };
  for (const f of e.frames || []) {
    const frame = await figma.getNodeByIdAsync(f.id);
    if (!frame) { er.frames.push({ id: f.id, error: 'not found' }); continue; }
    page = frame; while (page.type !== 'PAGE') page = page.parent;
    if (!loaded.has(page.id)) { await page.loadAsync(); loaded.add(page.id); }
    // layers inside instances load lazily; touch them until the count settles (merge-build-readiness, 2026-10-05)
    for (let pass = 0, last = -1; pass < 4; pass++) { const inst = frame.findAllWithCriteria({ types: ['INSTANCE'] }); if (inst.length === last) break; last = inst.length; for (const i of inst) i.children.length; }
    const fr = { id: frame.id, role: f.role, dark: !!f.dark };
    const inLogo = n => { for (let p = n.parent; p && p.id !== frame.id; p = p.parent) if (LOGO.test(p.name)) return true; return false; };
    // --- EM-19: text contrast, grouped into failing color pairs
    const pairs = new Map(); let checked = 0, textLayers = 0, logoText = 0; const complexEx = []; let complexCount = 0;
    for (const t of frame.findAllWithCriteria({ types: ['TEXT'] })) {
      if (!t.characters.trim() || !visibleIn(t, frame)) continue;
      if (inLogo(t) || LOGO.test(t.name)) { logoText++; continue; }
      textLayers++;
      const bg = background(t);
      if (bg.complex || bg.unknown) { complexCount++; if (complexEx.length < MAX_EX) complexEx.push(t.id); continue; }
      for (const s of t.getStyledTextSegments(['fills', 'fontSize', 'fontWeight'])) {
        const fill = s.fills.find(p => p.visible !== false && p.type === 'SOLID'); if (!fill) continue;
        const alpha = (fill.opacity ?? 1) * (t.opacity ?? 1);
        const large = s.fontSize >= 24 || (s.fontSize >= 18.66 && s.fontWeight >= 700); // WCAG large text: 24px, or 18.66px bold
        const need = large ? 3 : 4.5;
        for (const { mode, color } of await paintModes(fill)) {
          checked++;
          const fg = over(color, alpha, bg.base);
          const r = ratio(fg, bg.base);
          if (r + 1e-9 < need) {
            const key = hex(fg) + ' on ' + hex(bg.base) + ' @' + s.fontSize + 'px/' + s.fontWeight + (mode ? ' [' + mode + ']' : '');
            const p = pairs.get(key) || { ratio: r2(r), need, count: 0, ex: [] };
            p.count++; if (p.ex.length < 3 && !p.ex.includes(t.id)) p.ex.push(t.id); pairs.set(key, p);
          }
        }
      }
    }
    fr.em19 = { textLayers, segmentsChecked: checked, logoTextSkipped: logoText, failingPairs: pairs.size, failing: [...pairs.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, MAX_PAIRS).map(([k, v]) => ({ pair: k, ...v })), checkFromScreenshot: complexCount, checkFromScreenshotEx: complexEx };
    // --- EM-14 and EM-20: icons. Vectors, or layers named icon, no larger than 48px, counted at the outermost layer.
    const isIconish = n => Math.max(n.width, n.height) <= ICON_MAX && (n.type === 'VECTOR' || n.type === 'BOOLEAN_OPERATION' || ICON_NAME.test(n.name));
    const icons = []; const iconSet = new Set();
    for (const n of frame.findAllWithCriteria({ types: ['VECTOR', 'BOOLEAN_OPERATION', 'FRAME', 'INSTANCE', 'GROUP', 'RECTANGLE', 'ELLIPSE'] })) {
      if (!visibleIn(n, frame) || !isIconish(n) || inLogo(n) || LOGO.test(n.name)) continue;
      let inside = false; for (let p = n.parent; p && p.id !== frame.id; p = p.parent) if (iconSet.has(p.id)) { inside = true; break; }
      if (inside) continue;
      iconSet.add(n.id); icons.push(n);
    }
    const iconRows = []; let iconFail = 0, iconImage = 0, iconSwapped = 0;
    for (const n of icons) {
      const own = visibleFills(n);
      if (own.some(p => p.type === 'IMAGE')) { iconImage++; iconRows.push({ id: n.id, name: short(n.name, 30), image: true }); continue; }
      // the icon's color: its own solid fill, else the first solid fill or stroke inside it
      let paint = own.find(p => p.type === 'SOLID');
      if (!paint && 'findAllWithCriteria' in n) { const inner = n.findAllWithCriteria({ types: ['VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE', 'RECTANGLE'] }).find(x => visibleFills(x).some(p => p.type === 'SOLID')); if (inner) paint = visibleFills(inner).find(p => p.type === 'SOLID'); }
      if (!paint && Array.isArray(n.strokes)) paint = n.strokes.find(p => p.visible !== false && p.type === 'SOLID');
      if (!paint) { iconRows.push({ id: n.id, name: short(n.name, 30), color: 'none found' }); continue; }
      const note = darkNoteUp(n, frame);
      const swaps = note && SWAPS.test(note);
      if (swaps) iconSwapped++;
      const bg = background(n);
      const c = paint.color;
      const onBg = bg.base ? r2(ratio(over(c, paint.opacity ?? 1, bg.base), bg.base)) : null;
      const onDark = r2(ratio(over(c, paint.opacity ?? 1, DARK), DARK));
      const fail = !swaps && ((onBg !== null && onBg < ICON_NEED) || onDark < ICON_NEED);
      if (fail) iconFail++;
      iconRows.push({ id: n.id, name: short(n.name, 30), color: hex(c), background: bg.base ? hex(bg.base) : bg.complex ? 'image or gradient' : 'unknown', onBackground: onBg, onDark, swaps: swaps || undefined, fail: fail || undefined });
    }
    fr.em14 = { icons: icons.length, failing: iconFail, imageIcons: iconImage, swapped: iconSwapped, list: iconRows.slice(0, MAX_EX * 2), listTotal: iconRows.length };
    // --- EM-15: frames and shapes whose solid fill is exactly #FFFFFF or #000000, the email frame included
    const pure = []; let pureCount = 0;
    for (const n of [frame, ...frame.findAllWithCriteria({ types: ['FRAME', 'RECTANGLE', 'ELLIPSE', 'INSTANCE', 'COMPONENT', 'GROUP'] })]) {
      if (!visibleIn(n, frame) || n.width < MIN_BACKGROUND || n.height < MIN_BACKGROUND || isIconish(n)) continue;
      const p = visibleFills(n).find(x => x.type === 'SOLID' && (x.opacity ?? 1) >= 1);
      if (!p) continue;
      const h = hex(p.color);
      if (h === '#ffffff' || h === '#000000') { pureCount++; if (pure.length < MAX_EX) pure.push(n.id + ' ' + short(n.name, 30) + ' ' + h + ' ' + Math.round(n.width) + 'x' + Math.round(n.height)); }
    }
    fr.em15 = { applies: S.avoidPureBackgrounds, count: pureCount, ex: pure };
    // --- EM-20: each button's fill and edge against what's around it
    const buttons = [];
    for (const c of frame.findAllWithCriteria({ types: ['FRAME', 'INSTANCE', 'COMPONENT', 'GROUP'] })) {
      if (!visibleIn(c, frame) || !isButton(c)) continue;
      if (buttons.some(b => { for (let p = c.parent; p && p.id !== frame.id; p = p.parent) if (p.id === b.id) return true; return false; })) continue;
      buttons.push(c);
    }
    fr.em20 = { buttons: buttons.length, list: [] };
    for (const b of buttons) {
      const bg = background(b);
      const shape = b.type === 'GROUP' ? b.children.find(c => c.type === 'RECTANGLE' && solidOf(c)) || b : b;
      const fill = solidOf(shape);
      const stroke = Array.isArray(shape.strokes) ? shape.strokes.find(p => p.visible !== false && p.type === 'SOLID') : null;
      const sw = typeof shape.strokeWeight === 'number' ? shape.strokeWeight : 1; // strokeWeight can be figma.mixed
      const t = b.findAllWithCriteria ? b.findAllWithCriteria({ types: ['TEXT'] })[0] : null;
      const tf = t ? t.getStyledTextSegments(['fills'])[0].fills.find(p => p.type === 'SOLID') : null;
      fr.em20.list.push({ id: b.id, name: short(b.name, 30), label: t ? short(t.characters, 30) : null, fill: fill ? hex(fill.color) : null, edge: stroke && sw > 0 ? hex(stroke.color) + ' ' + sw + 'px' : null, around: bg.base ? hex(bg.base) : 'image or gradient', fillVsAround: fill && bg.base ? r2(ratio(over(fill.color, fill.opacity ?? 1, bg.base), bg.base)) : null, edgeVsAround: stroke && sw > 0 && bg.base ? r2(ratio(over(stroke.color, stroke.opacity ?? 1, bg.base), bg.base)) : null, labelVsFill: tf && fill ? r2(ratio(tf.color, fill.color)) : null });
    }
    fr.em20.list = fr.em20.list.slice(0, MAX_EX);
    er.frames.push(fr);
  }
  out.emails.push(er);
}
out.ms = Date.now() - t0;
return out;
