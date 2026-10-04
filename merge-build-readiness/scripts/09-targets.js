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
const page = (() => { let n = scope; while (n.type !== 'PAGE') n = n.parent; return n; })();
// Entries can be passed as scripts 04 and 05 return them: "Buttons 33065:310933" or "Button x12"
const want = new Set();
for (const e of INTERACTIVE) { const s = String(e).trim(); want.add(s); const id = s.match(/^(.*?)\s+(I?\d+:\d+)$/); if (id) { want.add(id[1]); want.add(id[2]); } const cnt = s.match(/^(.*?)\s+x\d+$/); if (cnt) want.add(cnt[1]); }
const lin = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg, a, bg) => ({ r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) });
const solid = arr => (Array.isArray(arr) ? arr.find(p => p.visible !== false && p.type === 'SOLID') : null);
// The color directly behind a target: its nearest ancestor with an opaque solid fill; null when an image or gradient is in the way
const bgOf = n => { for (let p = n.parent; p && p.type !== 'PAGE'; p = p.parent) { if (Array.isArray(p.fills) && p.fills.some(f => f.visible !== false && f.type !== 'SOLID')) return null; const f = solid(p.fills); if (f && (f.opacity ?? 1) >= 1) return f.color; } return (page.backgrounds.find(p => p.visible !== false) || { color: { r: 1, g: 1, b: 1 } }).color; };
const targets = [], targetSet = new Set();
for (const n of ('findAllWithCriteria' in scope ? scope.findAllWithCriteria({ types: ['INSTANCE'] }) : [])) {
  if (!n.visible) continue;
  const mc = await n.getMainComponentAsync(); if (!mc) continue;
  const set = mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent : mc;
  if (!(want.has(set.id) || want.has(set.name) || want.has(mc.id))) continue;
  let nested = false; for (let p = n.parent; p && p !== scope; p = p.parent) if (targetSet.has(p)) { nested = true; break; } // a button inside a nav item counts once
  if (nested) continue;
  targetSet.add(n);
  targets.push({ n, set: set.name, variant: mc.name, b: n.absoluteBoundingBox });
}
// Layers with a prototype interaction are targets too. Text layers are left out: a link inside a run of text is an
// inline target, which WCAG exempts, and the script can't size a link that is only part of a text layer.
let prototypeLinks = 0;
for (const n of ('findAllWithCriteria' in scope ? scope.findAllWithCriteria({ types: ['FRAME', 'INSTANCE', 'GROUP'] }) : [])) {
  let has = false; try { has = !!(n.reactions && n.reactions.length); } catch (e) {}
  if (!has || !n.visible) continue;
  prototypeLinks++;
  if (targetSet.has(n)) continue;
  let inside = false; for (let p = n.parent; p && p !== scope; p = p.parent) if (targetSet.has(p)) { inside = true; break; }
  if (inside) continue;
  targetSet.add(n);
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
const faint = []; let drawn = 0, faintCount = 0;
for (const t of targets) {
  if (!t.b || DISABLED.test(t.variant)) continue;
  const bg = bgOf(t.n); if (!bg) continue;
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
return { scope: scope.name, targets: targets.length, prototypeLinks, sizesBySet: sizes, under24: small.length, under24Failing: failSize.length, under24FailingEx: failSize.slice(0, MAX_EX), boundaryDrawn: drawn, boundaryUnder3: faintCount, boundaryUnder3Ex: faint };
