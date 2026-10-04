// merge-build-readiness script 02: local variables and collections (read-only).
// Feeds BR-01, BR-08 (variable values), BR-09 to BR-14. Placeholder: __PLATFORM__ (WEB, iOS, ANDROID or ANY).
const MAX_EX = 10;
const ex = (arr, item) => { if (arr.length < MAX_EX) arr.push(item); };
const PLATFORM_IN = '__PLATFORM__';
const PLATFORM = { WEB: 'WEB', IOS: 'iOS', ANDROID: 'ANDROID', ANY: 'ANY' }[PLATFORM_IN.trim().toUpperCase()];
if (!PLATFORM) return { error: 'PLATFORM must be WEB, iOS, ANDROID or ANY, not ' + PLATFORM_IN };
const SYNTAX = {
  WEB: /^var\(--[A-Za-z0-9_-]+\)$/,
  iOS: /^\.?[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*$/,
  ANDROID: /^(@[a-z]+\/[a-z0-9_]+|[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*)$/,
};
const status = async o => { try { return await o.getPublishStatusAsync(); } catch (e) { return 'unavailable'; } };
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byId = new Map(vars.map(v => [v.id, v]));
const out = { collections: [], totals: { variables: vars.length } };
const publish = { hidden: 0 };
const scopes = { ALL_SCOPES: 0, ALL_FILLS: 0, empty: 0, booleanSkipped: 0, allScopesEx: [], allFillsEx: [] };
const desc = { empty: 0, filled: 0, filledEx: [] };
const syntax = { platform: PLATFORM, missing: 0, malformed: 0, ok: 0, malformedEx: [], shared: [], slotsSeen: { WEB: 0, iOS: 0, ANDROID: 0 } };
const grid = { checked: 0, offCount: 0, off: [] };
const weights = { stringWeights: [], numberWeights: 0 };
const aliasBroken = [];
const syntaxSeen = new Map();
// Names that hold type, timing or ratios, which aren't on the spacing grid when a variable has no scopes
const GRID_SKIP_NAME = /font|line|letter|weight|opacity|z-?index|duration|tracking|leading|ratio|scale/i;
for (const c of cols) {
  const cv = c.variableIds.map(id => byId.get(id)).filter(Boolean);
  let alias = 0, raw = 0;
  for (const v of cv) for (const val of Object.values(v.valuesByMode)) {
    if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
      alias++;
      let target = byId.get(val.id);
      if (!target) { try { target = await figma.variables.getVariableByIdAsync(val.id); } catch (e) {} }
      if (!target) aliasBroken.push({ id: v.id, name: v.name });
    } else raw++;
  }
  // Per-collection counts let the agent judge BR-10 to BR-12 over the semantic collections only
  const described = cv.filter(v => v.description && v.description.trim()).length;
  const allScopes = cv.filter(v => v.resolvedType !== 'BOOLEAN' && v.scopes.includes('ALL_SCOPES')).length;
  const withSyntax = cv.filter(v => { const cs = v.codeSyntax || {}; return PLATFORM === 'ANY' ? Object.keys(cs).length > 0 : !!cs[PLATFORM]; }).length;
  out.collections.push({ id: c.id, name: c.name, modes: c.modes.map(m => m.name), defaultMode: (c.modes.find(m => m.modeId === c.defaultModeId) || {}).name, variables: cv.length, aliasValues: alias, rawValues: raw, described, allScopes, withSyntax, hiddenFromPublishing: c.hiddenFromPublishing, publish: await status(c), isExtension: !!c.isExtension });
}
for (const v of vars) {
  if (v.hiddenFromPublishing) publish.hidden++; else { const s = await status(v); publish[s] = (publish[s] || 0) + 1; }
  if (v.resolvedType === 'BOOLEAN') scopes.booleanSkipped++;
  else if (v.scopes.includes('ALL_SCOPES')) { scopes.ALL_SCOPES++; ex(scopes.allScopesEx, v.name); }
  else if (v.scopes.length === 0) scopes.empty++;
  if (v.scopes.includes('ALL_FILLS')) { scopes.ALL_FILLS++; ex(scopes.allFillsEx, v.name); }
  if (v.description && v.description.trim()) { desc.filled++; ex(desc.filledEx, v.name + ': ' + v.description.slice(0, 80)); } else desc.empty++;
  const cs = v.codeSyntax || {};
  for (const k of Object.keys(syntax.slotsSeen)) if (cs[k]) syntax.slotsSeen[k]++;
  const slots = PLATFORM === 'ANY' ? Object.keys(cs) : [PLATFORM];
  const vals = slots.map(k => [k, cs[k]]).filter(([, x]) => x);
  if (!vals.length) syntax.missing++;
  else {
    let bad = false;
    for (const [k, x] of vals) {
      if (!SYNTAX[k].test(x)) { bad = true; ex(syntax.malformedEx, v.name + ' ' + k + '=' + x); }
      const key = k + ':' + x; if (syntaxSeen.has(key)) ex(syntax.shared, x + ' (' + syntaxSeen.get(key) + ', ' + v.name + ')'); else syntaxSeen.set(key, v.name);
    }
    if (bad) syntax.malformed++; else syntax.ok++;
  }
  if (v.resolvedType === 'FLOAT') {
    const sc = v.scopes;
    const gridScoped = sc.some(s => ['GAP', 'WIDTH_HEIGHT', 'CORNER_RADIUS'].includes(s)) || sc.includes('ALL_SCOPES') || (sc.length === 0 && !GRID_SKIP_NAME.test(v.name));
    if (gridScoped) for (const val of Object.values(v.valuesByMode)) {
      if (typeof val !== 'number') continue;
      grid.checked++;
      const isRadius = sc.includes('CORNER_RADIUS');
      if (Math.abs(val) < 0.5 || val === 1 || val === 2 || (isRadius && val >= 999)) continue; // hairlines, borders and pill radii are exempt
      if (val % 4 !== 0) { grid.offCount++; ex(grid.off, v.name + '=' + val); }
    }
    if (sc.includes('FONT_WEIGHT') || /weight/i.test(v.name)) weights.numberWeights++;
  }
  if (v.resolvedType === 'STRING' && (v.scopes.includes('FONT_WEIGHT') || /weight/i.test(v.name))) ex(weights.stringWeights, v.name);
}
return { ...out, publish, scopes, desc, syntax, grid, weights, aliasBrokenCount: aliasBroken.length, aliasBroken: aliasBroken.slice(0, MAX_EX) };
