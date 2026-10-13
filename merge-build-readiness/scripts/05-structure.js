// merge-build-readiness script 05: structure within scope (read-only).
// Feeds BR-03, BR-05, BR-14 (pinned modes), BR-16, BR-17, BR-28 to BR-31. Placeholder: __SCOPE_ID__.
const SCOPE_ID = '__SCOPE_ID__';
const MAX_EX = 10;
const BUDGET = 500; // layers per frame; about 25,000 tokens of get_design_context at 45-55 tokens a layer (measured 2026-10-03)
const MAX_FRAMES = 60; // about 5 KB of frame widths for BR-31; framesCount says when there are more
const MAX_REMOTE = 60; // remote components listed for BR-01 and the interactive list; remoteComponentsCount says when there are more
const ex = (a, x) => { if (a.length < MAX_EX) a.push(x); };
const scope = await figma.getNodeByIdAsync(SCOPE_ID);
if (!scope) return { error: 'scope not found: ' + SCOPE_ID };
if (scope.type === 'PAGE') await scope.loadAsync();
const DEFAULT_NAME = /^(Frame|Group|Rectangle|Ellipse|Vector|Line|Polygon|Star|Union|Subtract|Intersect|Exclude|Section) \d+$/;
const ART = new Set(['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON', 'ELLIPSE', 'LINE', 'RECTANGLE']);
const isArtOnly = n => ART.has(n.type) || ('children' in n && n.children.length > 0 && n.children.every(isArtOnly));
const STATUS_WORDS = /approved|ratified|final|ready|draft|proposal|review|deprecated|archive|do not build|not for build|wip|explor/i;
const top = [], loose = [];
const kids = 'children' in scope ? scope.children : [];
for (const c of kids) {
  if (c.type === 'SECTION') { top.push(c); for (const g of c.children) top.push(g); }
  else { top.push(c); if (scope.type === 'PAGE') loose.push(c); }
}
const r = { scope: { id: scope.id, name: scope.name, type: scope.type } };
let devStatusReadable = true; // use_figma refuses devStatus (tested 2026-10-03); Figma's agent may not
const readStatus = n => { if (!devStatusReadable) return 'unavailable'; try { return n.devStatus ? n.devStatus.type : 'none'; } catch (e) { devStatusReadable = false; return 'unavailable'; } };
r.status = { devStatus: {}, statusNamed: [], topLevelCount: top.length };
for (const n of top) {
  const ds = readStatus(n);
  r.status.devStatus[ds] = (r.status.devStatus[ds] || 0) + 1;
  if (STATUS_WORDS.test(n.name)) ex(r.status.statusNamed, n.name);
}
r.size = { looseOnPage: loose.filter(n => n.type !== 'SECTION').length, sections: kids.filter(n => n.type === 'SECTION').length, budget: BUDGET, overBudget: [] };
const counts = top.filter(n => n.type !== 'SECTION').map(n => ({ n, c: 'findAll' in n ? n.findAll(() => true).length + 1 : 1 })).sort((a, b) => b.c - a.c);
for (const { n, c } of counts) if (c > BUDGET) ex(r.size.overBudget, n.name + ' ' + n.id + ' (' + c + ')');
r.size.overBudgetCount = counts.filter(x => x.c > BUDGET).length;
// BR-31: under 600px is mobile (Material's compact class), 1,200px and up is desktop, between is tablet
r.frames = [];
r.framesCount = top.filter(n => n.type === 'FRAME').length;
for (const n of top) if (n.type === 'FRAME' && r.frames.length < MAX_FRAMES) r.frames.push({ id: n.id, name: n.name, w: Math.round(n.width), kind: n.width < 600 ? 'mobile' : n.width < 1200 ? 'tablet' : 'desktop' });
const nodes = [];
const walk = n => { nodes.push(n); if (n.type !== 'INSTANCE' && 'children' in n) for (const c of n.children) walk(c); };
for (const c of kids) walk(c);
r.walked = nodes.length;
r.detached = { count: 0, inReadyForDev: 0, ex: [] };
r.layout = { noAutoLayout: 0, noAutoLayoutEx: [], fixedOverHug: 0, fixedOverHugEx: [] };
r.defaultNames = { checked: 0, count: 0, ex: [] };
r.stray = { count: 0, ex: [] };
r.pinnedModes = { nonDefault: 0, ex: [] };
r.instances = { local: 0, remote: 0 };
const remoteSets = new Map();
// Default mode of every collection a frame pins, so only a non-default mode counts for BR-14
const defaultMode = new Map();
const defaultOf = async cid => { if (!defaultMode.has(cid)) { let c = null; try { c = await figma.variables.getVariableCollectionByIdAsync(cid); } catch (e) {} defaultMode.set(cid, c ? c.defaultModeId : null); } return defaultMode.get(cid); };
// The top-level frame or section a node sits in, for BR-16's Ready for dev test
const topOf = n => { let t = n; while (t.parent && t.parent.type !== 'PAGE' && t.parent.type !== 'SECTION') t = t.parent; return t; };
const insideComponent = n => { for (let p = n.parent; p; p = p.parent) if (p.type === 'COMPONENT' || p.type === 'COMPONENT_SET') return true; return false; };
for (const n of nodes) {
  if (n.type === 'FRAME' && n.detachedInfo) { r.detached.count++; const d = n.detachedInfo; const t = topOf(n); const st = readStatus(t); if (st === 'READY_FOR_DEV' || st === 'COMPLETED') r.detached.inReadyForDev++; ex(r.detached.ex, n.name + ' ' + n.id + ' | from ' + (d.type === 'local' ? 'local ' + d.componentId : 'library ' + d.componentKey) + ' | in ' + t.name + ' (' + st + ')'); }
  if ((n.type === 'FRAME' || n.type === 'COMPONENT') && n.layoutMode === 'NONE' && n.children.length >= 2 && !n.children.every(isArtOnly)) { r.layout.noAutoLayout++; ex(r.layout.noAutoLayoutEx, n.name + ' ' + n.id); }
  if (n.type === 'INSTANCE') {
    const pt = n.parent && n.parent.type;
    if (pt === 'PAGE' || pt === 'SECTION') { r.stray.count++; ex(r.stray.ex, n.name + ' ' + n.id); }
    const mc = await n.getMainComponentAsync();
    if (mc) {
      if (mc.remote) { r.instances.remote++; const set = mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent : mc; const k = set.name; remoteSets.set(k, (remoteSets.get(k) || 0) + 1); } else r.instances.local++;
    }
    if (mc && mc.layoutMode !== 'NONE') {
      const h = n.layoutSizingHorizontal === 'FIXED' && mc.layoutSizingHorizontal === 'HUG';
      const v = n.layoutSizingVertical === 'FIXED' && mc.layoutSizingVertical === 'HUG';
      if (h || v) { r.layout.fixedOverHug++; ex(r.layout.fixedOverHugEx, n.name + ' ' + n.id + (h ? ' W' : '') + (v ? ' H' : '')); }
    }
  }
  if (!insideComponent(n) && n.type !== 'COMPONENT' && n.type !== 'COMPONENT_SET' && !isArtOnly(n)) {
    r.defaultNames.checked++;
    if (DEFAULT_NAME.test(n.name)) { r.defaultNames.count++; ex(r.defaultNames.ex, n.name + ' ' + n.id); }
  }
  for (const [cid, mid] of Object.entries(n.explicitVariableModes || {})) { const def = await defaultOf(cid); if (def && mid !== def) { r.pinnedModes.nonDefault++; ex(r.pinnedModes.ex, n.name + ' ' + n.id); break; } }
}
r.remoteComponentsCount = remoteSets.size;
r.remoteComponents = [...remoteSets.entries()].sort((a, b) => b[1] - a[1]).slice(0, MAX_REMOTE).map(([k, c]) => k + ' x' + c);
const seen = new Map();
for (const n of top) { const k = n.name.trim(); seen.set(k, (seen.get(k) || 0) + 1); }
r.duplicateTopLevel = [...seen.entries()].filter(([, c]) => c > 1).map(([k, c]) => k + ' x' + c).slice(0, MAX_EX);
return r;
