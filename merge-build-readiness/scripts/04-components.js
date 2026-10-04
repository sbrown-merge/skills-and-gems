// merge-build-readiness script 04: components across the whole file (read-only).
// Feeds BR-01, BR-18 to BR-23, BR-26 (component names). No placeholders. Loads every page with page.loadAsync(),
// which took 5.5 seconds for 46 pages under use_figma (2026-10-03); use_figma forbids figma.loadAllPagesAsync().
const MAX_EX = 10;
const ex = (a, x) => { if (a.length < MAX_EX) a.push(x); };
const DEFAULT_NAME = /^(Frame|Group|Rectangle|Ellipse|Vector|Line|Polygon|Star|Union|Subtract|Intersect|Exclude|Section) \d+$/;
const ART = new Set(['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON', 'ELLIPSE', 'LINE', 'RECTANGLE']);
const isArtOnly = n => ART.has(n.type) || ('children' in n && n.children.length > 0 && n.children.every(isArtOnly));
const STATE_PROP = /state|status|interaction|disabled|selected|pressed|hover|focus|active/i;
const BOOLISH = /^(yes|no|on|off|true|false)$/i;
// Names that suggest a control someone clicks or taps; the agent confirms the list before script 09 uses it
const INTERACTIVE_NAME = /button|link|tab|checkbox|radio|toggle|switch|input|field|select|dropdown|menu|nav|chip|pagination|arrow|accordion|slider|stepper|search|carousel|indicator|control/i;
const MAX_VARIANTS = 30; // Figma's library skill splits a set past about 30 combinations (G3, G5)
const MAX_CANDIDATES = 80; // about 4 KB of names and IDs; past that the list is truncated and says so
const status = async o => { try { return await o.getPublishStatusAsync(); } catch (e) { return 'unavailable'; } };
const owners = [];
const exampleNodes = [];
const examplesPage = { found: false, components: 0, other: 0 };
for (const page of figma.root.children) {
  await page.loadAsync();
  if (/^\s*examples\s*$/i.test(page.name)) { examplesPage.found = true; for (const c of page.children) { if (c.type === 'COMPONENT' || c.type === 'COMPONENT_SET') examplesPage.components++; else if (c.type !== 'SECTION') examplesPage.other++; } }
  for (const n of page.findAllWithCriteria({ types: ['FRAME', 'COMPONENT', 'COMPONENT_SET'] })) if (/_example\s*$/i.test(n.name)) exampleNodes.push(n);
  for (const n of page.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })) {
    if (n.type === 'COMPONENT' && n.parent && n.parent.type === 'COMPONENT_SET') continue;
    owners.push({ n, page: page.name });
  }
}
const publish = { hiddenByPrefix: 0 };
const names = new Map();
const propIndex = {};
const r = { owners: owners.length, sets: 0, standalone: 0, overThirty: [], overThirtyCount: 0, propOverThirty: [], descEmpty: 0, descEx: [], docLinks: 0, defaultPropNames: [], boolishValues: [], unwired: [], withDefaultChildren: 0, defaultChildEx: [], slots: { components: 0, slotProps: 0, slotPropsDescribed: 0, ex: [] }, stateProps: [], untrimmed: [], interactiveCandidates: [], interactiveCandidatesCount: 0, examples: { components: 0, frames: 0, ex: [] } };
for (const { n } of owners) {
  if (/^[._]/.test(n.name)) publish.hiddenByPrefix++; else { const s = await status(n); publish[s] = (publish[s] || 0) + 1; }
  const key = n.name.trim().toLowerCase();
  names.set(key, (names.get(key) || []).concat(n.id));
  if (n.name !== n.name.trim()) ex(r.untrimmed, JSON.stringify(n.name) + ' ' + n.id);
  if (n.type === 'COMPONENT_SET') { r.sets++; if (n.children.length > MAX_VARIANTS) { r.overThirtyCount++; ex(r.overThirty, n.name + ' (' + n.children.length + ') ' + n.id); } }
  else r.standalone++;
  if (n.description && n.description.trim()) ex(r.descEx, n.name + ': ' + n.description.slice(0, 60)); else r.descEmpty++;
  if (n.documentationLinks && n.documentationLinks.length) r.docLinks++;
  let defs = {};
  try { defs = n.componentPropertyDefinitions || {}; } catch (e) {}
  const referenced = new Set();
  for (const d of n.findAll(() => true)) { const ref = d.componentPropertyReferences; if (ref) for (const v of Object.values(ref)) referenced.add(v); }
  let slotProps = 0;
  for (const [pname, def] of Object.entries(defs)) {
    const base = pname.split('#')[0];
    const norm = base.toLowerCase().replace(/[\s_-]/g, '');
    (propIndex[norm] = propIndex[norm] || new Set()).add(base);
    if (/^Property \d+$/.test(base)) ex(r.defaultPropNames, n.name + ' > ' + base);
    if (def.type === 'VARIANT') {
      if (def.variantOptions.length > MAX_VARIANTS) ex(r.propOverThirty, n.name + ' > ' + base + ' (' + def.variantOptions.length + ')');
      const boolish = def.variantOptions.filter(o => BOOLISH.test(o) && o !== 'true' && o !== 'false');
      if (boolish.length) ex(r.boolishValues, n.name + ' > ' + base + ': ' + boolish.join('/'));
      if (STATE_PROP.test(base)) ex(r.stateProps, n.name + ' > ' + base + ': ' + def.variantOptions.join('/'));
    } else if (def.type === 'SLOT') {
      slotProps++; r.slots.slotProps++;
      if (def.description && def.description.trim()) r.slots.slotPropsDescribed++;
    } else {
      if (!referenced.has(pname)) ex(r.unwired, n.name + ' > ' + base + ' (' + def.type + ')');
      if (def.type === 'BOOLEAN' && STATE_PROP.test(base)) ex(r.stateProps, n.name + ' > ' + base + ' (boolean)');
    }
  }
  const hasStateProp = Object.entries(defs).some(([p, d]) => (d.type === 'VARIANT' || d.type === 'BOOLEAN') && STATE_PROP.test(p.split('#')[0]));
  if (INTERACTIVE_NAME.test(n.name) || hasStateProp) { r.interactiveCandidatesCount++; if (r.interactiveCandidates.length < MAX_CANDIDATES) r.interactiveCandidates.push(n.name + ' ' + n.id); }
  const slotNodes = n.findAllWithCriteria({ types: ['SLOT'] }).length;
  if (slotNodes || slotProps) { r.slots.components++; ex(r.slots.ex, n.name + ' (' + slotNodes + ' slots, described: ' + (n.description && n.description.trim() ? 'yes' : 'no') + ')'); }
  const defaults = n.findAll(d => DEFAULT_NAME.test(d.name) && !isArtOnly(d));
  if (defaults.length) { r.withDefaultChildren++; ex(r.defaultChildEx, n.name + ' (' + defaults.length + ')'); }
}
for (const n of exampleNodes) { if (n.type === 'FRAME') r.examples.frames++; else r.examples.components++; ex(r.examples.ex, n.type + ' ' + n.name + ' ' + n.id); }
const dupes = [...names.entries()].filter(([, ids]) => ids.length > 1).map(([k, ids]) => k + ' x' + ids.length + ' ' + ids.slice(0, 3).join(','));
r.examplesPage = examplesPage;
return { publish, ...r, duplicateNameCount: dupes.length, duplicateNames: dupes.slice(0, MAX_EX), nearDuplicatePropNames: Object.values(propIndex).filter(s => s.size > 1).map(s => [...s].join(' | ')).slice(0, MAX_EX) };
