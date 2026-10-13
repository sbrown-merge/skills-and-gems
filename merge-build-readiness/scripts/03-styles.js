// merge-build-readiness script 03: text and effect styles (read-only). Feeds BR-01, BR-15.
// No placeholders.
const MAX_EX = 10;
let publishReadable = true;
const status = async o => { if (!publishReadable) return 'unavailable'; try { return await o.getPublishStatusAsync(); } catch (e) { publishReadable = false; return 'unavailable'; } }; // styles lack this method under use_figma (tested 2026-10-03)
const text = await figma.getLocalTextStylesAsync();
const effect = await figma.getLocalEffectStylesAsync();
const TEXT_FIELDS = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];
const publish = {};
const t = { total: text.length, fullyBound: 0, unboundByField: {}, ex: [], described: 0 };
for (const s of text) {
  const st = await status(s); publish[st] = (publish[st] || 0) + 1;
  const bv = s.boundVariables || {};
  const missing = TEXT_FIELDS.filter(f => !(bv[f] || (f === 'fontWeight' && bv.fontStyle)));
  for (const f of missing) t.unboundByField[f] = (t.unboundByField[f] || 0) + 1;
  if (!missing.length) t.fullyBound++; else if (t.ex.length < MAX_EX) t.ex.push(s.name + ' (' + missing.join(', ') + ')');
  if (s.description && s.description.trim()) t.described++;
}
const e = { total: effect.length, fullyBound: 0, ex: [] };
for (const s of effect) {
  const st = await status(s); publish[st] = (publish[st] || 0) + 1;
  let ok = true;
  for (const fx of s.effects) {
    if (fx.type !== 'DROP_SHADOW' && fx.type !== 'INNER_SHADOW') continue;
    const bv = fx.boundVariables || {};
    const missing = ['color', 'radius', 'spread', 'offsetX', 'offsetY'].filter(f => !bv[f]);
    if (missing.length) { ok = false; if (e.ex.length < MAX_EX) e.ex.push(s.name + ' (' + missing.join(', ') + ')'); }
  }
  if (ok) e.fullyBound++;
}
return { publish, text: t, effect: e };
