// merge-build-readiness script 10: fingerprint the scope and the file, and compare with a baseline (read-only).
// Placeholders: __SCOPE_IDS__, a JSON array of the scope's node or page IDs; __BASELINE__, null on the first run and
// the first run's result on the second; __ADDED__, the number of annotations script 11 added (0 if none).
// On the second run it returns intact: true only when everything matches except annotations, which must have risen
// by exactly __ADDED__. Script 11 annotates only layers inside the scope, so that count is exact.
const SCOPE_IDS = __SCOPE_IDS__;
const BASELINE = __BASELINE__;
const ADDED = __ADDED__;
if (!Array.isArray(SCOPE_IDS)) return { error: '__SCOPE_IDS__ must be a JSON array of IDs' };
const fnv = s => { let x = 0x811c9dc5; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; } return x; };
const num = v => (typeof v === 'number' ? Math.round(v * 100) / 100 : String(typeof v));
const json = v => { try { return v === figma.mixed ? 'mixed' : JSON.stringify(v); } catch (e) { return 'unavailable'; } };
const has = (n, k) => k in n;
// What the fingerprint records for each layer: identity, geometry, paint, layout, type, bindings and component props
const sig = n => [n.id, n.type, n.name,
  has(n, 'visible') ? n.visible : '', num(n.x), num(n.y), num(n.width), num(n.height),
  has(n, 'opacity') ? num(n.opacity) : '',
  has(n, 'fills') ? json(n.fills) : '', has(n, 'strokes') ? json(n.strokes) : '', has(n, 'effects') ? json(n.effects) : '',
  has(n, 'strokeWeight') ? json(n.strokeWeight) : '',
  has(n, 'layoutMode') ? [n.layoutMode, n.paddingLeft, n.paddingRight, n.paddingTop, n.paddingBottom, n.itemSpacing].join(',') : '',
  has(n, 'layoutSizingHorizontal') ? n.layoutSizingHorizontal + ',' + n.layoutSizingVertical : '',
  has(n, 'topLeftRadius') ? [n.topLeftRadius, n.topRightRadius, n.bottomLeftRadius, n.bottomRightRadius].join(',') : '',
  n.type === 'TEXT' ? n.characters + json(n.textStyleId) + json(n.fontSize) + json(n.fontName) + json(n.lineHeight) + json(n.letterSpacing) : '',
  has(n, 'rotation') ? num(n.rotation) : '', has(n, 'constraints') ? json(n.constraints) : '', has(n, 'explicitVariableModes') ? json(n.explicitVariableModes) : '',
  has(n, 'boundVariables') ? json(n.boundVariables) : '',
  n.type === 'INSTANCE' ? json(n.componentProperties) + json(n.overrides) : '',
  (n.type === 'COMPONENT_SET' || (n.type === 'COMPONENT' && !(n.parent && n.parent.type === 'COMPONENT_SET'))) ? json(Object.keys(n.componentPropertyDefinitions || {}).sort()) + (n.description || '') : '',
].join('|');
let hash = 0, nodes = 0, annotations = 0;
for (const id of SCOPE_IDS) {
  const s = await figma.getNodeByIdAsync(id);
  if (!s) return { error: 'scope not found: ' + id };
  if (s.type === 'PAGE') await s.loadAsync();
  // Walk by hand and stop at instances: their layers come from the main component plus the overrides recorded above,
  // the skill never writes inside one, and on 2026-10-04 one run out of several didn't return layers inside instances,
  // which would make two unchanged fingerprints disagree.
  const visit = n => {
    nodes++;
    hash = (hash + fnv(sig(n))) >>> 0; // a sum, so the order layers are visited in doesn't matter
    try { annotations += (n.annotations || []).length; } catch (e) {}
    if (n.type !== 'INSTANCE' && 'children' in n) for (const c of n.children) visit(c);
  };
  visit(s);
}
const vars = await figma.variables.getLocalVariablesAsync();
const variableHash = vars.reduce((h, v) => (h + fnv(v.id + v.name + json(v.valuesByMode) + json(v.scopes) + json(v.codeSyntax) + (v.description || '') + v.hiddenFromPublishing)) >>> 0, 0);
const styles = [...(await figma.getLocalTextStylesAsync()), ...(await figma.getLocalEffectStylesAsync()), ...(await figma.getLocalPaintStylesAsync())];
const styleHash = styles.reduce((h, s) => (h + fnv(s.id + s.name + json(s.boundVariables) + json(s.fontSize) + json(s.effects) + json(s.paints) + (s.description || ''))) >>> 0, 0);
const now = { nodes, hash: hash.toString(16), annotations, variables: vars.length, variableHash: variableHash.toString(16), styles: styles.length, styleHash: styleHash.toString(16), pages: figma.root.children.length };
if (!BASELINE) return now;
const changed = [];
for (const k of Object.keys(now)) {
  if (k === 'annotations') { if (now.annotations !== BASELINE.annotations + ADDED) changed.push('annotations: expected ' + (BASELINE.annotations + ADDED) + ', found ' + now.annotations); }
  else if (String(now[k]) !== String(BASELINE[k])) changed.push(k + ': was ' + BASELINE[k] + ', now ' + now[k]);
}
return { intact: changed.length === 0, changed, now };
