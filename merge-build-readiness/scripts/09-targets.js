// merge-build-readiness script 09: tap and click targets, and non-text contrast, within scope (read-only).
// Feeds BR-33, BR-34. Placeholders: __SCOPE_ID__, and __INTERACTIVE__, the component set or component IDs or names
// the agent judged interactive in BR-20, as a JSON array.
const SCOPE_ID = '__SCOPE_ID__';
const INTERACTIVE = __INTERACTIVE__;
const MAX_EX = 10;
const MIN = 24; // WCAG 2.2 SC 2.5.8, in CSS px
const scope = await figma.getNodeByIdAsync(SCOPE_ID);
if (!scope) return { error: 'scope not found: ' + SCOPE_ID };
if (scope.type === 'PAGE') await scope.loadAsync();
// Layers inside instances load lazily: a page search found 234 text layers before each instance's children were
// touched and 955 after (2026-10-05). Touch them until the instance count settles, so counts don't swing between runs.
for (let pass = 0, last = -1; pass < 4 && 'findAllWithCriteria' in scope; pass++) { const inst = scope.findAllWithCriteria({ types: ['INSTANCE'] }); if (inst.length === last) break; last = inst.length; for (const i of inst) i.children.length; }
const page = (() => { let n = scope; while (n.type !== 'PAGE') n = n.parent; return n; })();
// Entries can be passed as scripts 04 and 05 return them: "Buttons 33065:310933" or "Button x12"
const want = new Set();
for (const e of INTERACTIVE) { const s = String(e).trim(); want.add(s); const id = s.match(/^(.*?)\s+(I?\d+:\d+)$/); if (id) { want.add(id[1]); want.add(id[2]); } const cnt = s.match(/^(.*?)\s+x\d+$/); if (cnt) want.add(cnt[1]); }
const lin = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg, a, bg) => ({ r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) });
const solid = arr => (Array.isArray(arr) ? arr.find(p => p.visible !== false && p.type === 'SOLID') : null);
const fillsOf = n => (Array.isArray(n.fills) ? n.fills.filter(p => p.visible !== false && (p.opacity ?? 1) > 0) : []);
const covers = (b, c) => b && c.x >= b.x && c.x <= b.x + b.width && c.y >= b.y && c.y <= b.y + b.height;
const opaque = (n, f) => { const o = f.find(x => x.type === 'SOLID' && (x.opacity ?? 1) >= 1 && (n.opacity ?? 1) >= 1); return o ? o.color : undefined; };
// The color behind a target, found as script 08 finds a text's: the topmost opaque layer under its center, including
// the children of the layers beside it (a nav bar's dark shape sat inside a white frame, 2026-10-05). null when an image
// or gradient is in the way; 'unknown' at a main component's edge, since outside one is the board it's shown on.
const behind = (s, c) => {
  if (!s.visible || s.type === 'TEXT' || !covers(s.absoluteBoundingBox, c)) return undefined;
  if ('children' in s && s.type !== 'BOOLEAN_OPERATION') for (let i = s.children.length - 1; i >= 0; i--) { const r = behind(s.children[i], c); if (r !== undefined) return r; }
  const f = fillsOf(s); return f.some(x => x.type !== 'SOLID') ? null : opaque(s, f);
};
const bgOf = n => {
  const b = n.absoluteBoundingBox; const c = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  for (let cur = n; cur.parent && cur.type !== 'PAGE'; cur = cur.parent) {
    if (cur.type === 'COMPONENT' || cur.type === 'COMPONENT_SET') return 'unknown';
    const p = cur.parent, sibs = p.children;
    // by id: a layer found inside an instance isn't the same object as its entry in children, so indexOf gave -1 (2026-10-05)
    for (let i = sibs.findIndex(x => x.id === cur.id) - 1; i >= 0; i--) { const r = behind(sibs[i], c); if (r !== undefined) return r; }
    if (p.type === 'PAGE') break;
    const f = fillsOf(p); if (f.some(x => x.type !== 'SOLID')) return null;
    const o = opaque(p, f); if (o) return o;
  }
  return (page.backgrounds.find(p => p.visible !== false) || { color: { r: 1, g: 1, b: 1 } }).color;
};
const targets = [], targetSet = new Set(); // of IDs, for the same reason
for (const n of ('findAllWithCriteria' in scope ? scope.findAllWithCriteria({ types: ['INSTANCE'] }) : [])) {
  if (!n.visible) continue;
  const mc = await n.getMainComponentAsync(); if (!mc) continue;
  const set = mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent : mc;
  if (!(want.has(set.id) || want.has(set.name) || want.has(mc.id))) continue;
  let nested = false; for (let p = n.parent; p && p.id !== scope.id; p = p.parent) if (targetSet.has(p.id)) { nested = true; break; } // a button inside a nav item counts once
  if (nested) continue;
  targetSet.add(n.id);
  targets.push({ n, set: set.name, variant: mc.name, b: n.absoluteBoundingBox });
}
// Layers with a prototype interaction are targets too. Text layers are left out: a link inside a run of text is an
// inline target, which WCAG exempts, and the script can't size a link that is only part of a text layer.
let prototypeLinks = 0;
for (const n of ('findAllWithCriteria' in scope ? scope.findAllWithCriteria({ types: ['FRAME', 'INSTANCE', 'GROUP'] }) : [])) {
  let has = false; try { has = !!(n.reactions && n.reactions.length); } catch (e) {}
  if (!has || !n.visible) continue;
  prototypeLinks++;
  if (targetSet.has(n.id)) continue;
  let inside = false; for (let p = n.parent; p && p.id !== scope.id; p = p.parent) if (targetSet.has(p.id)) { inside = true; break; }
  if (inside) continue;
  targetSet.add(n.id);
  targets.push({ n, set: 'Layers with prototype links', variant: n.name, b: n.absoluteBoundingBox });
}
// BR-34: a target under 24px passes if a 24px circle centered on it overlaps no other target and no other small target's circle
const center = b => ({ x: b.x + b.width / 2, y: b.y + b.height / 2 });
const rectDist = (c, b) => Math.hypot(Math.max(b.x - c.x, 0, c.x - (b.x + b.width)), Math.max(b.y - c.y, 0, c.y - (b.y + b.height)));
const small = targets.filter(t => t.b && (t.b.width < MIN || t.b.height < MIN));
const failSize = [];
for (const t of small) {
  const c = center(t.b);
  const crowded = targets.find(o => o !== t && o.b && (rectDist(c, o.b) < MIN / 2 || (small.includes(o) && Math.hypot(c.x - center(o.b).x, c.y - center(o.b).y) < MIN)));
  if (crowded) failSize.push(t.set + ' (' + Math.round(t.b.width) + 'x' + Math.round(t.b.height) + ') ' + t.n.id + ' crowds ' + crowded.n.id);
}
// BR-33: only targets that draw a fill or border are checked; a text-only link is identified by its text (BR-32)
const DISABLED = /disabled|inactive/i;
const faint = []; let drawn = 0, faintCount = 0, unknownBg = 0; const unknownEx = [];
for (const t of targets) {
  if (!t.b || DISABLED.test(t.variant)) continue;
  const bg = bgOf(t.n); if (!bg) continue;
  if (bg === 'unknown') { unknownBg++; if (unknownEx.length < MAX_EX) unknownEx.push(t.set + ' > ' + t.variant + ' ' + t.n.id); continue; }
  const f = solid(t.n.fills), s = solid(t.n.strokes);
  const sw = typeof t.n.strokeWeight === 'number' ? t.n.strokeWeight : 1;
  const fr = f ? ratio(over(f.color, (f.opacity ?? 1) * (t.n.opacity ?? 1), bg), bg) : 1;
  const sr = s && sw > 0 ? ratio(over(s.color, s.opacity ?? 1, bg), bg) : 1;
  if (Math.max(fr, sr) <= 1.05) continue; // 1.05 or less is the same color as the background, so nothing is drawn
  drawn++;
  if (Math.max(fr, sr) < 3) { faintCount++; if (faint.length < MAX_EX) faint.push(t.set + ' > ' + t.variant + ' ' + t.n.id + ' fill ' + fr.toFixed(2) + ' border ' + sr.toFixed(2)); }
}
const sizes = {};
for (const t of targets) { if (!t.b) continue; const e = sizes[t.set] || (sizes[t.set] = { count: 0, minW: 1e9, minH: 1e9 }); e.count++; e.minW = Math.min(e.minW, Math.round(t.b.width)); e.minH = Math.min(e.minH, Math.round(t.b.height)); }
return { scope: scope.name, targets: targets.length, prototypeLinks, sizesBySet: sizes, under24: small.length, under24Ex: small.slice(0, MAX_EX).map(t => t.set + ' (' + Math.round(t.b.width) + 'x' + Math.round(t.b.height) + ') ' + t.n.id), under24Failing: failSize.length, under24FailingEx: failSize.slice(0, MAX_EX), boundaryDrawn: drawn, boundaryUnder3: faintCount, boundaryUnder3Ex: faint, boundaryNoBackground: unknownBg, boundaryNoBackgroundEx: unknownEx };
