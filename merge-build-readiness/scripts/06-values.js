// merge-build-readiness script 06: bound versus literal values, and the grid, within scope (read-only).
// Feeds BR-07, BR-08 (literal values). Placeholder: __SCOPE_ID__. Counts once per layer per field, not per side or corner.
const SCOPE_ID = '__SCOPE_ID__';
const MAX_EX = 10;
const ex = (a, x) => { if (a.length < MAX_EX) a.push(x); };
const scope = await figma.getNodeByIdAsync(SCOPE_ID);
if (!scope) return { error: 'scope not found: ' + SCOPE_ID };
if (scope.type === 'PAGE') await scope.loadAsync();
const ART = new Set(['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON', 'ELLIPSE', 'LINE']);
const isArtOnly = n => ART.has(n.type) || ('children' in n && n.children.length > 0 && n.children.every(isArtOnly));
const r = { scope: scope.name, fields: {}, artLiteralFills: 0, instanceColorOverrides: 0, byTopLevel: {}, ex: [], grid: { checked: 0, off: 0, values: {} } };
const tally = (field, bound, n, top) => {
  const f = r.fields[field] || (r.fields[field] = { bound: 0, literal: 0 });
  if (bound) f.bound++; else { f.literal++; ex(r.ex, field + ' ' + n.name + ' ' + n.id); r.byTopLevel[top] = (r.byTopLevel[top] || 0) + 1; }
};
const round = v => Math.round(v * 100) / 100;
const gridTally = v => { r.grid.checked++; if (Math.abs(v) < 0.5 || v === 1 || v === 2) return; if (v % 4 !== 0) { r.grid.off++; const k = String(round(v)); r.grid.values[k] = (r.grid.values[k] || 0) + 1; } };
const paints = (n, key, top, art) => {
  const arr = n[key];
  if (!Array.isArray(arr)) return;
  const styleId = key === 'fills' ? n.fillStyleId : n.strokeStyleId;
  const styled = typeof styleId === 'string' && styleId !== '';
  const solid = arr.filter(p => p.visible !== false && p.type === 'SOLID');
  if (!solid.length) return;
  const bound = styled || solid.every(p => p.boundVariables && p.boundVariables.color);
  if (art && !bound) { r.artLiteralFills++; return; }
  tally(n.type === 'TEXT' ? 'textFill' : key, bound, n, top);
};
const visit = (n, top) => {
  const art = isArtOnly(n);
  const bv = n.boundVariables || {};
  paints(n, 'fills', top, art);
  paints(n, 'strokes', top, art);
  if (n.type === 'TEXT') tally('textStyle', (typeof n.textStyleId === 'string' && n.textStyleId !== '') || !!bv.fontSize, n, top);
  if ('layoutMode' in n && n.layoutMode !== 'NONE') {
    const pads = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'].filter(k => n[k] > 0);
    if (pads.length) { tally('padding', pads.every(k => bv[k]), n, top); for (const k of pads) if (!bv[k]) gridTally(n[k]); }
    if (n.itemSpacing > 0 && n.primaryAxisAlignItems !== 'SPACE_BETWEEN') { tally('gap', !!bv.itemSpacing, n, top); if (!bv.itemSpacing) gridTally(n.itemSpacing); }
  }
  if ('topLeftRadius' in n && !art) {
    const corners = ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'].filter(k => n[k] > 0 && n[k] < 999);
    if (corners.length) tally('radius', corners.every(k => bv[k]), n, top);
  }
  if (!art && Array.isArray(n.strokes) && n.strokes.some(p => p.visible !== false) && typeof n.strokeWeight === 'number' && n.strokeWeight > 0) tally('strokeWeight', !!bv.strokeWeight, n, top);
  if (n.name !== top && n.parent && n.parent.type !== 'PAGE' && n.parent.type !== 'SECTION' && !art && n.type !== 'TEXT' && 'layoutSizingHorizontal' in n) {
    if (n.layoutSizingHorizontal === 'FIXED' && !bv.width) gridTally(n.width);
    if (n.layoutSizingVertical === 'FIXED' && !bv.height) gridTally(n.height);
  }
  if (n.type === 'INSTANCE') {
    // Inside an instance only its overrides count, so a library problem is counted once, at its main component
    r.instanceColorOverrides += (n.overrides || []).filter(o => o.overriddenFields.some(f => f === 'fills' || f === 'strokes')).length;
    return;
  }
  if ('children' in n) for (const c of n.children) visit(c, top);
};
const kids = 'children' in scope ? scope.children : [scope];
for (const c of kids) { if (c.type === 'SECTION') for (const g of c.children) visit(g, g.name); else visit(c, c.name); }
r.byTopLevel = Object.fromEntries(Object.entries(r.byTopLevel).sort((a, b) => b[1] - a[1]).slice(0, MAX_EX));
r.grid.values = Object.fromEntries(Object.entries(r.grid.values).sort((a, b) => b[1] - a[1]).slice(0, 15)); // the 15 commonest off-grid values, about 1 KB
return r;
