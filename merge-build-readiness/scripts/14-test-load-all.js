// merge-build-readiness script 14: test mode, one probe of figma.loadAllPagesAsync() (read-only). No placeholders.
// Kept apart from script 12 because some hosts refuse this call outright; the Figma MCP's use_figma forbids it.
try { await figma.loadAllPagesAsync(); return { loadAllPagesAsync: { ok: true } }; }
catch (e) { return { loadAllPagesAsync: { ok: false, error: String((e && e.message) || e).slice(0, 120) } }; }
