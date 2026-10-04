// merge-build-readiness script 12: test mode, read probes (read-only). Placeholder: __VERSION__.
// Tries every read the checks depend on, on the current page and file, and records whether it worked.
// figma.loadAllPagesAsync() is probed separately by script 14, so that if it's refused it can't sink these probes.
const VERSION = '__VERSION__';
const probes = {};
const probe = async (name, fn) => { try { probes[name] = { ok: true, value: await fn() }; } catch (e) { probes[name] = { ok: false, error: String((e && e.message) || e).slice(0, 120) }; } };
const page = figma.currentPage;
await probe('fileKey', () => figma.fileKey || null);
await probe('currentUser', () => (figma.currentUser ? 'readable' : null));
await probe('pageLoadAsync', async () => { const p = figma.root.children[figma.root.children.length - 1]; await p.loadAsync(); return p.children.length; });
await probe('fileThumbnail', async () => { const t = await figma.getFileThumbnailNodeAsync(); return t ? t.type : null; });
let vars = [], cols = [], text = [], comps = [];
await probe('variables', async () => { vars = await figma.variables.getLocalVariablesAsync(); return vars.length; });
await probe('collections', async () => { cols = await figma.variables.getLocalVariableCollectionsAsync(); return cols.map(c => c.modes.length + ' modes'); });
await probe('variableScopes', () => vars.filter(v => v.scopes.length).length);
await probe('variableCodeSyntax', () => vars.filter(v => Object.keys(v.codeSyntax || {}).length).length);
await probe('variableDescriptions', () => vars.filter(v => v.description).length);
await probe('variablePublishStatus', async () => (vars[0] ? await vars[0].getPublishStatusAsync() : 'no variables'));
await probe('collectionPublishStatus', async () => (cols[0] ? await cols[0].getPublishStatusAsync() : 'no collections'));
await probe('textStyles', async () => { text = await figma.getLocalTextStylesAsync(); return text.length; });
await probe('textStyleBoundVariables', () => (text[0] ? Object.keys(text[0].boundVariables || {}) : 'no styles'));
await probe('stylePublishStatus', async () => (text[0] ? await text[0].getPublishStatusAsync() : 'no styles'));
await probe('effectStyles', async () => (await figma.getLocalEffectStylesAsync()).length);
await probe('findAllWithCriteria', () => { comps = page.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] }); return comps.length; });
await probe('componentDescriptions', () => comps.filter(c => c.description).length);
await probe('componentPropertyDefinitions', () => { const c = comps.find(x => x.type === 'COMPONENT_SET'); return c ? Object.keys(c.componentPropertyDefinitions).length : 'no sets on page'; });
await probe('componentPublishStatus', async () => (comps[0] ? await comps[0].getPublishStatusAsync() : 'no components on page'));
await probe('slots', () => page.findAllWithCriteria({ types: ['SLOT'] }).length);
await probe('annotationCategories', async () => (await figma.annotations.getAnnotationCategoriesAsync()).map(c => c.label + (c.isPreset ? '' : ' (custom)')));
await probe('annotationsRead', () => page.findAllWithCriteria({ types: ['FRAME', 'INSTANCE', 'TEXT', 'COMPONENT'] }).reduce((a, n) => a + ((n.annotations || []).length), 0));
await probe('prototypeReactions', () => page.findAllWithCriteria({ types: ['FRAME', 'INSTANCE'] }).filter(n => n.reactions && n.reactions.length).length);
await probe('devStatus', () => { const n = page.children.find(c => c.type === 'FRAME' || c.type === 'SECTION'); return n ? (n.devStatus ? n.devStatus.type : 'none') : 'no frames on page'; });
await probe('detachedInfo', () => page.findAllWithCriteria({ types: ['FRAME'] }).filter(n => n.detachedInfo).length);
await probe('explicitVariableModes', () => page.findAllWithCriteria({ types: ['FRAME'] }).filter(n => Object.keys(n.explicitVariableModes || {}).length).length);
await probe('instanceOverrides', () => { const i = page.findAllWithCriteria({ types: ['INSTANCE'] })[0]; return i ? i.overrides.length : 'no instances on page'; });
// Whether a layer can screenshot itself from a script; the agent also tries its own screenshot tool (test skill step 4)
await probe('nodeScreenshotMethod', () => { const n = page.children[0]; return n ? typeof n.screenshot === 'function' || typeof n.exportAsync === 'function' : 'no layers on page'; });
await probe('textSegments', () => { const t = page.findAllWithCriteria({ types: ['TEXT'] })[0]; return t ? t.getStyledTextSegments(['fills', 'fontSize', 'fontWeight']).length : 'no text on page'; });
return { skill: 'merge-build-readiness', version: VERSION, date: new Date().toISOString().slice(0, 10), page: page.name, pageId: page.id, probes };
