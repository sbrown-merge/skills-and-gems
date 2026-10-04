// merge-build-readiness script 07: annotations, notes and copy within scope (read-only).
// Feeds BR-24 to BR-27. Placeholder: __SCOPE_ID__.
const SCOPE_ID = '__SCOPE_ID__';
const MAX_EX = 10;
const ex = (a, x) => { if (a.length < MAX_EX) a.push(x); };
const scope = await figma.getNodeByIdAsync(SCOPE_ID);
if (!scope) return { error: 'scope not found: ' + SCOPE_ID };
if (scope.type === 'PAGE') await scope.loadAsync();
const r = { scope: scope.name };
let cats = [];
try { cats = await figma.annotations.getAnnotationCategoriesAsync(); r.categories = cats.map(c => ({ label: c.label, preset: c.isPreset })); }
catch (e) { r.categories = 'unavailable'; }
const catById = new Map(cats.map(c => [c.id, c]));
// The Dev Mode annotation schema in checklist.md (approved 2026-10-03)
const SCHEMA = {
  Development: { req: ['Rule'], keys: ['Rule', 'Breakpoint', 'Token', 'Replaces'] },
  Interaction: { req: ['Trigger', 'Result'], keys: ['Trigger', 'Result', 'State', 'Motion'] },
  Accessibility: { req: ['Role'], keys: ['Role', 'Name', 'Focus order', 'Announce', 'Alt'] },
  Content: { req: ['Source'], keys: ['Source', 'Limit', 'Overflow', 'Empty'] },
};
const SHARED = ['Status', 'See'];
const checkLabel = (category, text) => {
  const lines = text.split(/\r?\n/).map(l => l.replace(/^[*_\s]+|[*_\s]+$/g, '').replace(/\*\*/g, '')).filter(Boolean);
  const keys = lines.map(l => { const m = l.match(/^([A-Za-z][A-Za-z ]*?):\s+\S/); return m ? m[1] : null; });
  const allowed = SCHEMA[category].keys.concat(SHARED);
  const problems = [];
  if (!keys.length) problems.push('empty');
  if (keys.some(k => !k)) problems.push('a line is not Key: value');
  for (const k of keys) if (k && !allowed.includes(k)) problems.push('unknown key ' + k);
  for (const k of SCHEMA[category].req) if (!keys.includes(k)) problems.push('missing ' + k);
  return problems;
};
// findAllWithCriteria, not findAll with a callback: a file-wide findAll callback broke the use_figma transport (2026-10-03)
const TYPES = ['FRAME', 'COMPONENT', 'COMPONENT_SET', 'INSTANCE', 'TEXT', 'SECTION', 'RECTANGLE', 'GROUP', 'VECTOR', 'ELLIPSE'];
const nodes = 'findAllWithCriteria' in scope ? scope.findAllWithCriteria({ types: TYPES }) : [];
const inInstance = n => n.id.startsWith('I'); // instance sublayers: count each rule once, at its main component
const ann = { total: 0, onLayers: 0, byCategory: {}, presetFollowing: 0, presetMalformed: 0, custom: 0, uncategorized: 0, outsideSchema: [], withPinnedProperties: 0, content: [] };
for (const n of nodes) {
  let list; try { list = n.annotations; } catch (e) { continue; }
  if (!list || !list.length) continue;
  ann.onLayers++;
  for (const a of list) {
    ann.total++;
    const cat = a.categoryId ? catById.get(a.categoryId) : null;
    const label = cat ? cat.label : 'none';
    ann.byCategory[label] = (ann.byCategory[label] || 0) + 1;
    if (a.properties && a.properties.length) ann.withPinnedProperties++;
    const text = (a.labelMarkdown || a.label || '').trim();
    const where = label + ' | ' + n.name + ' ' + n.id + ' | ' + text.replace(/\s+/g, ' ').slice(0, 100);
    if (cat && cat.isPreset && SCHEMA[cat.label]) {
      const problems = checkLabel(cat.label, text);
      if (!problems.length) { ann.presetFollowing++; if (cat.label === 'Content') ex(ann.content, n.name + ' ' + n.id + ' | ' + text.replace(/\s*\n\s*/g, ' / ').slice(0, 120)); } else { ann.presetMalformed++; ex(ann.outsideSchema, 'malformed (' + problems.join('; ') + '): ' + where); }
    } else { if (cat) ann.custom++; else ann.uncategorized++; ex(ann.outsideSchema, (cat ? 'custom category' : 'no category') + ': ' + where); }
  }
}
r.annotations = ann;
const RULE = /\b(should|must|max(imum)?|min(imum)?|limit|truncate|do not|don['’]t)\b|\b\d+\s+lines?\b/i; // "2 lines", not any "line"
const PLACEHOLDER = /lorem ipsum|\[fpo\]|^\s*\[[^\]]+\]\s*$|^\s*(placeholder|label|title|text|heading|body copy)\s*$/i;
const NOTE_NAME = /^\s*(notes?|todo|annotation|spec|dev ?note|redline|callout)\b/i;
const NOTE_COMPONENT = /annotation|callout|redline|spec|note|marker/i;
const VARIANT_WORDS = /\b(long|short|empty|min|max|overflow)\b/i;
const insideComponent = n => { for (let p = n.parent; p; p = p.parent) if (p.type === 'COMPONENT' || p.type === 'COMPONENT_SET' || p.type === 'INSTANCE') return true; return false; };
const text = { total: 0, ruleLikeCount: 0, ruleLike: [], placeholders: 0, placeholderEx: [] };
const notes = { count: 0, ex: [] };
for (const n of nodes) {
  if (n.type === 'TEXT' && !inInstance(n)) {
    text.total++;
    const s = n.characters;
    // a rule is a short sentence; text of 200 characters or more is copy or documentation
    if (RULE.test(s) && s.length < 200) { text.ruleLikeCount++; ex(text.ruleLike, n.id + ' ' + s.replace(/\s+/g, ' ').slice(0, 90)); }
    if (PLACEHOLDER.test(s)) { text.placeholders++; ex(text.placeholderEx, n.id + ' ' + s.replace(/\s+/g, ' ').slice(0, 60)); }
  }
  if (inInstance(n) || insideComponent(n)) continue;
  if ((n.type === 'TEXT' || n.type === 'FRAME') && (NOTE_NAME.test(n.name) || (n.type === 'TEXT' && NOTE_NAME.test(n.characters)))) { notes.count++; ex(notes.ex, n.type + ' ' + n.name + ' ' + n.id); }
  if (n.type === 'INSTANCE') {
    const mc = await n.getMainComponentAsync();
    const nm = mc ? (mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent.name : mc.name) : '';
    if (NOTE_COMPONENT.test(nm)) { notes.count++; ex(notes.ex, 'instance of ' + nm + ' ' + n.id); }
  }
}
// BR-27: top-level frames whose names differ only by long, short, empty, min, max or overflow
const kids = 'children' in scope ? scope.children.flatMap(c => (c.type === 'SECTION' ? c.children : [c])) : [];
const groups = new Map();
for (const k of kids) { const base = k.name.replace(VARIANT_WORDS, '').replace(/\s+/g, ' ').trim().toLowerCase(); if (VARIANT_WORDS.test(k.name)) groups.set(base, (groups.get(base) || []).concat(k.name)); }
r.contentVariantFrames = [...groups.values()].slice(0, MAX_EX);
r.text = text;
r.onCanvasNotes = notes;
return r;
