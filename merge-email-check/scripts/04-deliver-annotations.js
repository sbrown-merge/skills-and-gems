// merge-email-check script 04: deliver findings as Dev Mode annotations. The only merge-email-check script that writes.
// Adapted from merge-build-readiness script 11 on 2026-10-07 for the companion skill merge-email-check-annotate.
// Placeholders: __SCOPE_IDS__, the same JSON array as script 03; __FINDINGS__, a JSON array of
// { "id": "<layer ID>", "lines": ["Rule: ...", "Status: ...", "See: ..."] }, one string per annotation line.
// Guards, as in script 11: at most 20 findings; only layers inside the scope, compared by ID; one new annotation in the
// preset Development category; never rewrites an existing annotation, so a person's own notes, which Figma's API would
// re-escape on rewrite, are never touched.
// The one difference from script 11: email designs carry many build notes (Alt text, Dark mode, Mobile behavior), so
// the layer at fault often has an annotation already. When it does, when it sits inside an instance (its ID starts
// with "I"), or when it can't hold annotations, the script walks up to the nearest holder: a layer that can hold
// annotations, isn't inside an instance and has none yet. The walk stops at the scope root, which counts as a holder
// when it qualifies. The holder gets the annotation, with a first line "Layer: <name> (<ID>)" naming the layer at fault.
// A holder annotated earlier in the same run has an annotation by then, so a later finding moves further up.
// Returns { annotated: [{ id, on, moved }], annotatedCount, skipped: [{ id, why }] }: id is the finding's layer, on is
// the layer that got the annotation, and moved is true when they differ. Pass annotatedCount to script 03 as __ADDED__.
const SCOPE_IDS = __SCOPE_IDS__;
const FINDINGS = __FINDINGS__;
if (!Array.isArray(SCOPE_IDS) || !Array.isArray(FINDINGS)) return { error: '__SCOPE_IDS__ and __FINDINGS__ must be JSON arrays' };
const MAX = 20; // more annotations than this bury the ones that matter
// Figma's API escapes & and straight quotes again on every save, so write "and" and typographic quotes instead.
// The patterns are named constants because the minifier strips spaces from a regular expression that follows =>.
const AMP = /\s*&\s*/g, PAIRED = /"([^"]*)"/g, DQ = /"/g, SQ = /'/g;
const clean = s => String(s).replace(AMP, ' and ').replace(PAIRED, '“$1”').replace(DQ, '”').replace(SQ, '’');
const scopeIds = new Set(SCOPE_IDS); // compared by ID, not object, in case a host returns a fresh object per lookup
const inScope = n => { for (let p = n; p; p = p.parent) if (scopeIds.has(p.id)) return true; return false; };
// A layer can take this run's annotation when it holds annotations, isn't inside an instance and has none yet
const free = n => { try { return 'annotations' in n && !n.id.startsWith('I') && n.annotations.length === 0; } catch (e) { return false; } };
// The layer itself when it's free, otherwise its nearest free ancestor up to and including the scope root, else null
const holder = n => { for (let p = n; p; p = p.parent) { if (free(p)) return p; if (scopeIds.has(p.id)) return null; } return null; };
const cats = await figma.annotations.getAnnotationCategoriesAsync();
const dev = cats.find(c => c.isPreset && c.label === 'Development');
if (!dev) return { error: 'The preset Development annotation category was not found; deliver as comments instead.' };
const annotated = [], skipped = [];
for (const f of FINDINGS.slice(0, MAX)) {
  let n = null;
  try { n = await figma.getNodeByIdAsync(f.id); } catch (e) {}
  if (!n) { skipped.push({ id: f.id, why: 'layer not found' }); continue; }
  if (!inScope(n)) { skipped.push({ id: f.id, why: 'outside the scope' }); continue; }
  const lines = Array.isArray(f.lines) ? f.lines : [];
  if (!lines.length) { skipped.push({ id: f.id, why: 'no lines to write' }); continue; }
  const h = holder(n);
  if (!h) { skipped.push({ id: f.id, why: 'no layer up to the scope root can take a new annotation; deliver this one as a comment' }); continue; }
  const moved = h.id !== n.id;
  const text = (moved ? ['Layer: ' + n.name + ' (' + n.id + ')'] : []).concat(lines).map(clean).join('\n');
  try { h.annotations = [{ labelMarkdown: text, categoryId: dev.id }]; annotated.push({ id: n.id, on: h.id, moved }); }
  catch (e) { skipped.push({ id: f.id, why: String((e && e.message) || e).slice(0, 100) }); }
}
if (FINDINGS.length > MAX) skipped.push({ id: '(rest)', why: (FINDINGS.length - MAX) + ' findings over the limit of ' + MAX });
return { annotated, annotatedCount: annotated.length, skipped };
