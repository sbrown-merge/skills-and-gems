// merge-build-readiness script 00: resolve the scope and the file (read-only). No placeholders.
// Runs first, so the opening question can offer the selection or a page as the scope, and every page's ID is known
// before script 10 needs the scope's IDs.
const MAX_PAGES = 100; // more pages than any file a run can read whole, and about 5 KB of return
const page = figma.currentPage;
let fileKey = null; try { fileKey = figma.fileKey || null; } catch (e) {}
let user = null; try { user = figma.currentUser ? figma.currentUser.name : null; } catch (e) {} // unavailable under use_figma
const sel = page.selection.map(n => ({ id: n.id, name: n.name, type: n.type }));
return {
  fileKey,
  user,
  pageCount: figma.root.children.length,
  pages: figma.root.children.slice(0, MAX_PAGES).map(p => ({ id: p.id, name: p.name })),
  currentPage: { id: page.id, name: page.name, topLevel: page.children.length },
  selectionCount: sel.length,
  selection: sel.slice(0, 10),
};
