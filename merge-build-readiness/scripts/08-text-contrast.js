// merge-build-readiness script 08: text contrast within scope (read-only), BR-32
// Placeholder: __SCOPE_ID__ (a page, section, frame or component). Returns failing color pairs, grouped.
const SCOPE_ID = '__SCOPE_ID__';
const t0 = Date.now();
const MAX_EX = 12; // enough examples to link evidence without passing use_figma's 20 KB return limit
const scope = await figma.getNodeByIdAsync(SCOPE_ID);
if (!scope) return { error: 'scope not found: ' + SCOPE_ID };
if (scope.type === 'PAGE') await scope.loadAsync();
const page = (() => { let n = scope; while (n.type !== 'PAGE') n = n.parent; return n; })();
// WCAG 2.2 relative luminance and contrast ratio
const lin = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg, a, bg) => ({ r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) });
const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
// Resolve a bound color in every mode of its collection, following aliases
const varCache = new Map();
const getVar = async id => { if (!varCache.has(id)) varCache.set(id, await figma.variables.getVariableByIdAsync(id)); return varCache.get(id); };
const resolveIn = async (id, modeId, depth = 0) => {
  const v = await getVar(id); if (!v || depth > 8) return null;
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
  const out = [];
  for (const m of col.modes) { const c = await resolveIn(vid, m.modeId); if (c) out.push({ mode: col.modes.length > 1 ? m.name : null, color: c }); }
  return out.length ? out : [{ mode: null, color: p.color }];
};
const visibleFills = n => (Array.isArray(n.fills) ? n.fills.filter(p => p.visible !== false && (p.opacity ?? 1) > 0) : []);
const box = n => n.absoluteBoundingBox;
const overlaps = (a, b) => a && b && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
const hasNonSolid = n => {
  if (visibleFills(n).some(f => f.type !== 'SOLID')) return true;
  return 'findAll' in n && n.findAll(d => d.visible && visibleFills(d).some(f => f.type !== 'SOLID')).length > 0;
};
// Background: the layers under the text, nearest first, at every level up to the page.
// Stops at the first opaque solid layer; an image or gradient underneath makes it "check from a screenshot".
const background = n => {
  const tb = box(n);
  const layers = [];
  for (let cur = n; cur && cur.type !== 'PAGE'; cur = cur.parent) {
    const parent = cur.parent;
    if (parent && 'children' in parent) {
      const sibs = parent.children; const idx = sibs.indexOf(cur);
      for (let i = idx - 1; i >= 0; i--) {
        const s = sibs[i];
        if (!s.visible || !overlaps(box(s), tb)) continue;
        if (hasNonSolid(s)) return { complex: true };
        const solid = visibleFills(s).filter(f => f.type === 'SOLID');
        if (solid.length) { layers.push(...solid.map(f => ({ f, o: (f.opacity ?? 1) * (s.opacity ?? 1) }))); if (layers.some(l => l.o >= 1)) return { complex: false, base: compose(layers) }; }
      }
    }
    if (parent && parent.type !== 'PAGE') {
      const pf = visibleFills(parent);
      if (pf.some(f => f.type !== 'SOLID')) return { complex: true };
      layers.push(...pf.filter(f => f.type === 'SOLID').reverse().map(f => ({ f, o: (f.opacity ?? 1) * (parent.opacity ?? 1) })));
      if (layers.some(l => l.o >= 1)) return { complex: false, base: compose(layers) };
    }
  }
  return { complex: false, base: compose(layers) };
};
function compose(layers) {
  // layers are nearest-first; paint from the page background upward
  let base = (page.backgrounds.find(p => p.visible !== false) || { color: { r: 1, g: 1, b: 1 } }).color;
  const firstOpaque = layers.findIndex(l => l.o >= 1);
  const stack = (firstOpaque >= 0 ? layers.slice(0, firstOpaque + 1) : layers).reverse();
  for (const { f, o } of stack) base = over(f.color, o, base);
  return base;
}
const all = ('findAllWithCriteria' in scope ? scope.findAllWithCriteria({ types: ['TEXT'] }) : []);
const pairs = new Map();
let complexCount = 0; const complexEx = []; let checked = 0; let textLayers = 0;
for (const t of all) {
  if (!t.characters.trim()) continue;
  let hidden = !t.visible; for (let p = t.parent; !hidden && p && p.type !== 'PAGE'; p = p.parent) if (p.visible === false) hidden = true;
  if (hidden) continue;
  textLayers++;
  const bg = background(t);
  if (bg.complex) { complexCount++; if (complexEx.length < MAX_EX) complexEx.push(t.id); continue; }
  for (const s of t.getStyledTextSegments(['fills', 'fontSize', 'fontWeight'])) {
    const fill = s.fills.find(f => f.visible !== false && f.type === 'SOLID'); if (!fill) continue;
    const alpha = (fill.opacity ?? 1) * (t.opacity ?? 1);
    // WCAG large text: 18pt (24px), or 14pt (18.66px) bold
    const large = s.fontSize >= 24 || (s.fontSize >= 18.66 && s.fontWeight >= 700);
    const need = large ? 3 : 4.5;
    for (const { mode, color } of await paintModes(fill)) {
      checked++;
      const fg = over(color, alpha, bg.base);
      const r = ratio(fg, bg.base);
      if (r + 1e-9 < need) {
        const key = hex(fg) + ' on ' + hex(bg.base) + ' @' + s.fontSize + 'px/' + s.fontWeight + (mode ? ' [' + mode + ']' : '');
        const e = pairs.get(key) || { ratio: Math.round(r * 100) / 100, need, count: 0, ex: [] };
        e.count++; if (e.ex.length < 3) e.ex.push(t.id); pairs.set(key, e);
      }
    }
  }
}
const failing = [...pairs.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, MAX_EX).map(([k, v]) => ({ pair: k, ...v }));
return { scope: scope.name, textLayers, segmentsChecked: checked, failingPairs: pairs.size, failing, checkFromScreenshot: complexCount, checkFromScreenshotEx: complexEx, ms: Date.now() - t0 };
