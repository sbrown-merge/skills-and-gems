// merge-build-readiness script 11: deliver findings as Dev Mode annotations. With script 13, the only scripts that write.
// Placeholders: __SCOPE_IDS__, the same JSON array as script 10; __FINDINGS__, a JSON array of { "id": "<layer ID>",
// "lines": ["Rule: ...", "Status: ...", "See: ..."] }, one entry per line of the annotation schema.
// Guard: writes only the annotations of listed layers that sit inside the scope and have no annotation yet, adds one
// annotation in the preset Development category, and never rewrites an existing annotation, so a person's own notes,
// which Figma's API would re-escape on rewrite, are never touched. Skipped layers go in the report or a comment.
const SCOPE_IDS = __SCOPE_IDS__;
const FINDINGS = __FINDINGS__;
if (!Array.isArray(SCOPE_IDS) || !Array.isArray(FINDINGS)) return { error: '__SCOPE_IDS__ and __FINDINGS__ must be JSON arrays' };
const MAX = 20; // more annotations than this bury the ones that matter
// Figma's API escapes & and straight quotes again on every save, so write "and" and typographic quotes instead
const clean = s => String(s).replace(/\s*&\s*/g, ' and ').replace(/"([^"]*)"/g, '“$1”').replace(/"/g, '”').replace(/'/g, '’');
const scopeIds = new Set(SCOPE_IDS); // compared by ID, not object, in case a host returns a fresh object per lookup
const inScope = n => { for (let p = n; p; p = p.parent) if (scopeIds.has(p.id)) return true; return false; };
const cats = await figma.annotations.getAnnotationCategoriesAsync();
const dev = cats.find(c => c.isPreset && c.label === 'Development');
if (!dev) return { error: 'The preset Development annotation category was not found; deliver as comments instead.' };
const annotated = [], skipped = [];
for (const f of FINDINGS.slice(0, MAX)) {
  const n = await figma.getNodeByIdAsync(f.id);
  if (!n || !('annotations' in n)) { skipped.push({ id: f.id, why: 'layer not found or cannot hold annotations' }); continue; }
  if (n.id.startsWith('I')) { skipped.push({ id: f.id, why: 'inside an instance; annotate its main component instead' }); continue; }
  if (!inScope(n)) { skipped.push({ id: f.id, why: 'outside the scope' }); continue; }
  if (n.annotations.length) { skipped.push({ id: f.id, why: 'already has an annotation; deliver this one as a comment' }); continue; }
  try { n.annotations = [{ labelMarkdown: f.lines.map(clean).join('\n'), categoryId: dev.id }]; annotated.push(n.id); }
  catch (e) { skipped.push({ id: f.id, why: String((e && e.message) || e).slice(0, 100) }); }
}
if (FINDINGS.length > MAX) skipped.push({ id: '(rest)', why: (FINDINGS.length - MAX) + ' findings over the limit of ' + MAX });
return { annotated, annotatedCount: annotated.length, skipped };
