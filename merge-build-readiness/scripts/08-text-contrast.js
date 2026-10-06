// merge-build-readiness script 08: text contrast within scope (read-only), BR-32
// Placeholder: __SCOPE_ID__ (a page, section, frame or component). Returns failing color pairs, grouped.
const SCOPE_ID = '__SCOPE_ID__';
const t0 = Date.now();
const MAX_EX = 12; // enough examples to link evidence without passing use_figma's 20 KB return limit
const scope = await figma.getNodeByIdAsync(SCOPE_ID);
if (!scope) return { error: 'scope not found: ' + SCOPE_ID };
if (scope.type === 'PAGE') await scope.loadAsync();
// Layers inside instances load lazily: a page search found 234 text layers before each instance's children were
// touched and 955 after (2026-10-05). Touch them until the instance count settles, so counts don't swing between runs.
for (let pass = 0, last = -1; pass < 4 && 'findAllWithCriteria' in scope; pass++) { const inst = scope.findAllWithCriteria({ types: ['INSTANCE'] }); if (inst.length === last) break; last = inst.length; for (const i of inst) i.children.length; }
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
  const out = [];
  for (const m of col.modes) { const c = await resolveIn(vid, m.modeId); if (c) out.push({ mode: col.modes.length > 1 ? m.name : null, color: c }); }
  return out.length ? out : [{ mode: null, color: p.color }];
};
const visibleFills = n => (Array.isArray(n.fills) ? n.fills.filter(p => p.visible !== false && (p.opacity ?? 1) > 0) : []);
const box = n => n.absoluteBoundingBox;
const covers = (b, c) => b && c.x >= b.x && c.x <= b.x + b.width && c.y >= b.y && c.y <= b.y + b.height;
// What a sibling layer paints under the text's center, its children first, as they're drawn above its own fill.
// Pushes fills topmost first; returns true at an opaque one, 'complex' at an image or gradient. Text isn't a background.
// Children count: a nav bar's dark shape inside a white frame was missed when only the frame's fill was read (2026-10-05).
const under = (s, c, layers) => {
  if (!s.visible || s.type === 'TEXT' || !covers(box(s), c)) return false;
  // a boolean shape's children only define its outline; its own fill is what shows
  if ('children' in s && s.type !== 'BOOLEAN_OPERATION') for (let i = s.children.length - 1; i >= 0; i--) { const r = under(s.children[i], c, layers); if (r) return r; }
  const vf = visibleFills(s);
  if (vf.some(f => f.type !== 'SOLID')) return 'complex';
  layers.push(...vf.slice().reverse().map(f => ({ f, o: (f.opacity ?? 1) * (s.opacity ?? 1) })));
  return layers.some(l => l.o >= 1);
};
// Background: the layers under the text's center, nearest first, at every level up to the page.
// Stops at the first opaque solid layer; an image or gradient underneath makes it "check from a screenshot".
// It also stops at a main component's edge: what lies outside one is the board it's shown on, not where it's used
// (white labels in a fill-less Navigation Links component scored 1.00:1 against the board, 2026-10-05).
const background = n => {
  const b = box(n); if (!b) return { complex: true };
  const c = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  const layers = [];
  for (let cur = n; cur && cur.type !== 'PAGE'; cur = cur.parent) {
    if (cur.type === 'COMPONENT' || cur.type === 'COMPONENT_SET') return { unknown: cur.type === 'COMPONENT' && cur.parent && cur.parent.type === 'COMPONENT_SET' ? cur.parent : cur };
    const parent = cur.parent;
    if (parent && 'children' in parent) {
      const sibs = parent.children;
      // by id: a layer found inside an instance isn't the same object as its entry in children, so indexOf gave -1 (2026-10-05)
      for (let i = sibs.findIndex(x => x.id === cur.id) - 1; i >= 0; i--) {
        const r = under(sibs[i], c, layers);
        if (r === 'complex') return { complex: true };
        if (r) return { complex: false, base: compose(layers) };
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
const unknown = new Map(); let unknownCount = 0; // text with no background inside its component, by component
for (const t of all) {
  if (!t.characters.trim()) continue;
  let hidden = !t.visible; for (let p = t.parent; !hidden && p && p.type !== 'PAGE'; p = p.parent) if (p.visible === false) hidden = true;
  if (hidden) continue;
  textLayers++;
  const bg = background(t);
  if (bg.complex) { complexCount++; if (complexEx.length < MAX_EX) complexEx.push(t.id); continue; }
  if (bg.unknown) { unknownCount++; const k = bg.unknown.name + ' ' + bg.unknown.id; const e = unknown.get(k) || { count: 0, ex: t.id }; e.count++; unknown.set(k, e); continue; }
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
return { scope: scope.name, textLayers, segmentsChecked: checked, failingPairs: pairs.size, failing, checkFromScreenshot: complexCount, checkFromScreenshotEx: complexEx, noBackground: unknownCount, noBackgroundComponents: unknown.size, noBackgroundEx: [...unknown.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, MAX_EX).map(([k, v]) => k + ' x' + v.count + ' e.g. ' + v.ex), ms: Date.now() - t0 };
