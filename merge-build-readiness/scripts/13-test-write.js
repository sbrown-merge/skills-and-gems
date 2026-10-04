// merge-build-readiness script 13: test mode, write probe. Runs only if the person allows it. Placeholder: __STEP__,
// 'create' or 'delete', and __LAYER_ID__ for 'delete'. 'create' adds one throwaway frame far from the design with a
// two-line Development annotation and reads it back; 'delete' removes that frame and nothing else.
const STEP = '__STEP__';
const NAME = 'merge-build-readiness test layer (safe to delete)';
if (STEP === 'create') {
  const page = figma.currentPage;
  const right = page.children.reduce((m, n) => Math.max(m, n.x + n.width), 0);
  const f = figma.createFrame();
  f.name = NAME; f.resize(120, 60); f.x = right + 2000; f.y = 0; // 2,000px right of everything, out of sight of the design
  const cats = await figma.annotations.getAnnotationCategoriesAsync();
  const dev = cats.find(c => c.isPreset && c.label === 'Development');
  const label = 'Rule: Test annotation from merge-build-readiness\nStatus: Open question for the designer';
  let annotation;
  try { f.annotations = [{ labelMarkdown: label, categoryId: dev ? dev.id : undefined }]; const back = f.annotations[0] || {}; annotation = { ok: true, lineBreaksKept: (back.labelMarkdown || '').includes('\n'), readBack: back.labelMarkdown || back.label || null }; }
  catch (e) { annotation = { ok: false, error: String(e.message || e).slice(0, 120) }; }
  return { createdNodeIds: [f.id], annotation };
}
if (STEP === 'delete') {
  const n = await figma.getNodeByIdAsync('__LAYER_ID__');
  if (!n) return { deleted: false, why: 'not found' };
  if (n.name !== NAME || n.type !== 'FRAME') return { deleted: false, why: 'refused: not the test layer' };
  n.remove();
  return { deleted: true, removedNodeIds: ['__LAYER_ID__'] };
}
return { error: 'STEP must be create or delete' };
