// merge-email-check script 02: images, the logo and text over images (read-only).
// Feeds EM-06, EM-07, EM-08 and EM-09 (data), EM-10, EM-11, EM-12, EM-13 and EM-16 (data), EM-29 and EM-30.
// Placeholders: __EMAILS__ (JSON: script 00's `emails`, as confirmed) and __SETTINGS__ (JSON, or null for MERGE's).
const EMAILS = __EMAILS__;
const SETTINGS = __SETTINGS__;
const t0 = Date.now();
// MERGE's house settings (checklist.md, "House settings"); a project overrides any of them through __SETTINGS__
const DEFAULTS = {
  maxSlice: 1500, // image slice height, Jill Redo's workshop deck and D-16
  altCharPx: 8.8, // average width of a 16px character, so the alt text that fits on one line is width / 8.8 (EM-07)
};
const S = Object.assign({}, DEFAULTS, SETTINGS || {});
const MAX_IMAGES = 40; // a cap of 10 hid real items in merge-build-readiness; 40 rows stay near 12 KB
const MAX_EX = 10; // examples per list, with a total beside each, to stay under use_figma's 20 KB return
const ICON_MAX = 48; // icons are no larger than 48px (checklist.md, "Notes for the scripts")
const OVERLAP = 0.2; // text counts as over an image when a fifth of its box overlaps it; a heading flush with a hero's edge doesn't
const ALT_TOLERANCE = 0.1; // EM-07: up to 10% over the estimate is Partly, beyond it Fail
// The logo, when no layer is named for it: the first image or vector near the top of the frame. The header bands we've
// seen are 66px (TOFU) and 86px (Adobe) tall, so 120px covers them; at 70% of the frame's width or more it's a hero.
const LOGO_TOP = 120, LOGO_MAX_SHARE = 0.7;
// Regexes live in named constants: rjsmin reads a regex literal straight after => as division and strips its spaces
// ("knock ?out" became "knock?out", 2026-10-05), so no arrow function may start with one.
const TEXTY = /headline|heading|title|button|btn|cta|offer|text|copy/i; // image names that suggest words baked into the image
const REVERSED = /revers|light version|white|knock[ -]?out|swap/i; // a dark-mode note that names a reversed logo
const LOGO_WORD = /\blogo\b/i; // a note that mentions the logo
const LOGO_NAME = /logo/i; // a layer named for the logo, "AdobeLogo" included
const PLATE_AREA = 3; // a shape under the logo with less than three times its area hugs it, so it may be a plate
const BYTES_BUDGET_MS = 8000; // reading an image's bytes took 0.2 to 0.4 seconds each on 2026-10-05; stop well before a timeout
if (!Array.isArray(EMAILS)) return { error: 'EMAILS must be the JSON array script 00 returns as `emails`' };
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029); // separators that break regexes and JSON readers
const clean = s => String(s).split(LS).join(' / ').split(PS).join(' / ').replace(/\s*\n\s*/g, ' / ').trim();
const short = (s, n) => { s = clean(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
// --- Notes on a layer, read three ways (checklist.md, "Notes for the scripts"), as in script 01
const KINDS = ['alt text', 'decorative image', 'heading level', 'link or cta', 'dark mode', 'dynamic content', 'mobile behavior', 'content model field'];
const catById = new Map();
try { for (const c of await figma.annotations.getAnnotationCategoriesAsync()) catById.set(c.id, c); } catch (e) {}
const notesOf = n => {
  let list = []; try { list = n.annotations || []; } catch (e) { return []; }
  return list.map(a => {
    const cat = a.categoryId ? catById.get(a.categoryId) : null;
    const label = cat ? cat.label.trim() : '';
    const text = clean(a.labelMarkdown || a.label || '');
    let kind = null, how = null, body = text;
    const m = text.replace(/\*\*/g, '').match(/^\s*([A-Za-z ]+?)\s*:\s*([\s\S]*)$/);
    if (KINDS.includes(label.toLowerCase())) { kind = label.toLowerCase(); how = 'category'; }
    else if (m && KINDS.includes(m[1].toLowerCase())) { kind = m[1].toLowerCase(); how = 'prefix'; body = m[2]; }
    else if (cat && cat.isPreset && label === 'Accessibility' && /\balt\b/i.test(text)) { kind = 'alt text'; how = 'preset'; }
    return { kind, how, cat: label || 'none', text: body, suggestion: /^\W*suggest(ion|ed)?\b/i.test(text) };
  });
};
// A note on the layer itself, or on the nearest layer holding it below the email frame: designers often note the
// wrapper, and a layer inside an instance can only carry the instance's notes.
// Compare layers by ID, never as objects: a layer inside an instance found by findAllWithCriteria isn't the same
// object as the one in its parent's children, so indexOf returned -1 and Set lookups missed it (2026-10-05).
const noteUp = (n, frame, kinds) => {
  for (let p = n; p && p.id !== frame.id; p = p.parent) { const ns = notesOf(p).filter(x => kinds.includes(x.kind)); if (ns.length) return { ns, on: p.id === n.id ? 'self' : p.id }; }
  return null;
};
let notesRead = 0;
// --- Color: WCAG 2.2 relative luminance and contrast ratio, as in merge-build-readiness script 08
const lin = c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg, a, bg) => ({ r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) });
const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const fillsOf = n => (Array.isArray(n.fills) ? n.fills.filter(p => p.visible !== false && (p.opacity ?? 1) > 0) : []);
const hasImage = n => fillsOf(n).some(p => p.type === 'IMAGE');
const box = n => n.absoluteBoundingBox;
const covers = (b, c) => b && c.x >= b.x && c.x <= b.x + b.width && c.y >= b.y && c.y <= b.y + b.height;
// The solid color behind a point with images off: merge-build-readiness script 08's walk (the topmost layer under the
// point, children first, then the parent's fill, up to the page), except that image fills are skipped, because a
// blocked image, or a background image classic Outlook doesn't show, leaves the color behind it.
const under = (s, c, layers, skip) => {
  if (s.id === skip.id || s.visible === false || s.type === 'TEXT' || !covers(box(s), c)) return false;
  if ('children' in s && s.type !== 'BOOLEAN_OPERATION') for (let i = s.children.length - 1; i >= 0; i--) { const r = under(s.children[i], c, layers, skip); if (r) return r; }
  const vf = fillsOf(s).filter(f => f.type !== 'IMAGE');
  if (vf.some(f => f.type !== 'SOLID')) return 'complex';
  layers.push(...vf.slice().reverse().map(f => ({ f, o: (f.opacity ?? 1) * (s.opacity ?? 1), id: s.id })));
  return layers.some(l => l.o >= 1);
};
const compose = (layers, page) => {
  let base = (page.backgrounds.find(p => p.visible !== false) || { color: { r: 1, g: 1, b: 1 } }).color;
  const firstOpaque = layers.findIndex(l => l.o >= 1);
  for (const { f, o } of (firstOpaque >= 0 ? layers.slice(0, firstOpaque + 1) : layers).reverse()) base = over(f.color, o, base);
  return base;
};
const behindPoint = (n, c, page) => {
  const layers = [];
  for (let cur = n; cur && cur.type !== 'PAGE'; cur = cur.parent) {
    const parent = cur.parent;
    if (parent && 'children' in parent) {
      const sibs = parent.children;
      for (let i = sibs.findIndex(x => x.id === cur.id) - 1; i >= 0; i--) { const r = under(sibs[i], c, layers, n); if (r === 'complex') return { complex: true }; if (r) return { color: compose(layers, page), top: layers.find(l => l.o >= 1) }; }
    }
    if (parent && parent.type !== 'PAGE') {
      const pf = fillsOf(parent).filter(f => f.type !== 'IMAGE');
      if (pf.some(f => f.type !== 'SOLID')) return { complex: true };
      layers.push(...pf.reverse().map(f => ({ f, o: (f.opacity ?? 1) * (parent.opacity ?? 1), id: parent.id })));
      if (layers.some(l => l.o >= 1)) return { color: compose(layers, page), top: layers.find(l => l.o >= 1) };
    }
  }
  return { color: compose(layers, page), top: null };
};
const centerOf = b => ({ x: b.x + b.width / 2, y: b.y + b.height / 2 });
// --- Image file type and alpha channel from the first bytes. An alpha channel doesn't prove transparency: an opaque
// photo saved as PNG has one too (the TOFU file's "eye rainbow 1", 2026-10-05), so EM-16 still needs a screenshot.
const typeCache = new Map(); let bytesMs = 0, bytesSkipped = 0;
const fileType = async hash => {
  if (typeCache.has(hash)) return typeCache.get(hash);
  if (bytesMs > BYTES_BUDGET_MS) { bytesSkipped++; return { type: 'unread' }; }
  const t = Date.now(); let r = { type: 'unread' };
  try {
    const im = figma.getImageByHash(hash); const b = await im.getBytesAsync();
    const h = Array.from(b.slice(0, 4));
    if (h[0] === 0x89 && h[1] === 0x50) {
      let alpha = b[25] === 4 || b[25] === 6; // PNG color type 4 (gray + alpha) or 6 (RGBA)
      for (let i = 8; i < Math.min(b.length, 65536) && !alpha;) { const len = (b[i] << 24 | b[i + 1] << 16 | b[i + 2] << 8 | b[i + 3]) >>> 0; const name = String.fromCharCode(b[i + 4], b[i + 5], b[i + 6], b[i + 7]); if (name === 'tRNS') alpha = true; if (name === 'IDAT') break; i += len + 12; }
      r = { type: 'png', alpha };
    } else if (h[0] === 0xff && h[1] === 0xd8) r = { type: 'jpg', alpha: false };
    else if (h[0] === 0x47 && h[1] === 0x49) r = { type: 'gif', alpha: true };
    else if (h[0] === 0x52 && h[1] === 0x49) r = { type: 'webp' };
    else r = { type: 'other' };
    try { const sz = await im.getSizeAsync(); r.px = sz.width + 'x' + sz.height; } catch (e) {}
  } catch (e) { r = { type: 'unavailable', error: e.message }; }
  bytesMs += Date.now() - t; typeCache.set(hash, r); return r;
};
const loaded = new Set();
const frameNode = async id => {
  const n = await figma.getNodeByIdAsync(id); if (!n) return null;
  let p = n; while (p && p.type !== 'PAGE') p = p.parent;
  if (p && !loaded.has(p.id)) { await p.loadAsync(); loaded.add(p.id); }
  // layers inside instances load lazily; touch them until the count settles (merge-build-readiness, 2026-10-05)
  for (let pass = 0, last = -1; pass < 4 && 'findAllWithCriteria' in n; pass++) { const inst = n.findAllWithCriteria({ types: ['INSTANCE'] }); if (inst.length === last) break; last = inst.length; for (const i of inst) i.children.length; }
  return { n, page: p };
};
const visibleIn = (n, frame) => { for (let p = n; p && p.id !== frame.id; p = p.parent) if (p.visible === false) return false; return true; };
const out = { emails: [] };
const images = []; let imageTotal = 0;
const counts = { images: 0, withAlt: 0, decorative: 0, altOver: 0, altOverPartly: 0, withDark: 0, withBackground: 0, exportSvgPdf: 0, exportNone: 0, tall: 0 };
for (const e of EMAILS) {
  const er = { name: e.name, frames: [], logos: [], textOverImages: [], illustrations: [] };
  const darkByName = new Map();
  for (const f of e.frames || []) {
    const got = await frameNode(f.id);
    if (!got) { er.frames.push({ id: f.id, error: 'not found' }); continue; }
    const { n: frame, page } = got;
    const fb = box(frame);
    // Paint order: a pre-order walk lists every layer before the layers drawn on top of it
    const order = new Map(); let k = 0;
    const walk = n => { order.set(n.id, k++); if ('children' in n) for (const c of n.children) walk(c); };
    walk(frame);
    const all = frame.findAllWithCriteria({ types: ['FRAME', 'RECTANGLE', 'ELLIPSE', 'POLYGON', 'STAR', 'VECTOR', 'INSTANCE', 'COMPONENT', 'BOOLEAN_OPERATION', 'GROUP', 'TEXT'] }).filter(n => visibleIn(n, frame));
    const imgs = all.filter(n => n.type !== 'TEXT' && hasImage(n));
    const texts = all.filter(n => n.type === 'TEXT' && n.characters.trim());
    const fr = { id: frame.id, role: f.role, dark: !!f.dark, images: imgs.length, texts: texts.length };
    // EM-08: the largest text layers, which should include the headline, and any button drawn as an image
    fr.largestTexts = texts.map(t => ({ t, s: t.fontSize === figma.mixed ? Math.max(...t.getStyledTextSegments(['fontSize']).map(x => x.fontSize)) : t.fontSize })).sort((a, b) => b.s - a.s).slice(0, 5).map(x => x.t.id + ' ' + x.s + 'px ' + short(x.t.characters, 40));
    fr.imagesNamedLikeText = imgs.filter(n => TEXTY.test(n.name)).slice(0, MAX_EX).map(n => n.id + ' ' + short(n.name, 40));
    er.frames.push(fr);
    // --- Logos (checklist.md, "Notes for the scripts", plus two fallbacks for files that don't name them)
    const VECTORISH = ['VECTOR', 'BOOLEAN_OPERATION'];
    const named = new Map(all.filter(n => n.type !== 'TEXT' && LOGO_NAME.test(n.name)).map(n => [n.id, n]));
    const insideNamed = n => { for (let p = n.parent; p && p.id !== frame.id; p = p.parent) if (named.has(p.id)) return true; return false; }; // count a logo once, at its outermost layer
    let logos = [...named.values()].filter(n => !insideNamed(n)).map(n => ({ n, why: 'name' }));
    if (!logos.length) logos = all.filter(n => (hasImage(n) || VECTORISH.includes(n.type)) && (noteUp(n, frame, KINDS) || { ns: [] }).ns.some(x => LOGO_WORD.test(x.text))).slice(0, 2).map(n => ({ n, why: 'note mentions logo' }));
    if (!logos.length) { const top = all.filter(n => (hasImage(n) || VECTORISH.includes(n.type)) && box(n).y - fb.y < LOGO_TOP && n.width < frame.width * LOGO_MAX_SHARE && Math.max(n.width, n.height) > ICON_MAX).sort((a, b) => box(a).y - box(b).y)[0]; if (top) logos = [{ n: top, why: 'first image or vector in the top ' + LOGO_TOP + 'px' }]; }
    const logoSet = new Set(logos.map(l => l.n.id));
    for (const { n, why } of logos) {
      const dn = noteUp(n, frame, ['dark mode']);
      const behind = behindPoint(n, centerOf(box(n)), page);
      const topNode = behind.top ? await figma.getNodeByIdAsync(behind.top.id) : null;
      const area = topNode ? (topNode.width * topNode.height) / Math.max(1, n.width * n.height) : null;
      const strokes = Array.isArray(n.strokes) ? n.strokes.filter(s => s.visible !== false) : [];
      const sw = typeof n.strokeWeight === 'number' ? n.strokeWeight : 1; // strokeWeight can be figma.mixed
      const effects = Array.isArray(n.effects) ? n.effects.filter(x => x.visible !== false).map(x => x.type) : [];
      const fill = fillsOf(n).find(p => p.type === 'IMAGE');
      er.logos.push({ frame: frame.id, dark: !!f.dark, id: n.id, name: short(n.name, 40), type: n.type, w: Math.round(n.width), h: Math.round(n.height), why, imageHash: fill ? fill.imageHash.slice(0, 10) : null, color: !fill && fillsOf(n).find(p => p.type === 'SOLID') ? hex(fillsOf(n).find(p => p.type === 'SOLID').color) : null, darkNote: dn ? short(dn.ns[0].text, 140) + (dn.on !== 'self' ? ' (on ' + dn.on + ')' : '') : null, namesReversed: dn ? dn.ns.some(x => REVERSED.test(x.text)) : false, outline: strokes.length && sw > 0 ? hex(strokes[0].color || { r: 0, g: 0, b: 0 }) + ' ' + sw + 'px' : null, effects, behind: behind.complex ? 'image or gradient' : hex(behind.color), possiblePlate: area !== null && area < PLATE_AREA ? behind.top.id : null });
    }
    // --- Images
    for (const n of imgs) {
      imageTotal++; counts.images++;
      const b = box(n);
      const fill = fillsOf(n).find(p => p.type === 'IMAGE');
      const ft = fill && fill.imageHash ? await fileType(fill.imageHash) : { type: 'unread' };
      const alt = noteUp(n, frame, ['alt text']), dec = noteUp(n, frame, ['decorative image']), dark = noteUp(n, frame, ['dark mode']);
      if (alt) notesRead += alt.ns.length;
      const altText = alt ? alt.ns[0].text : '';
      // the alt text itself: a quoted string if the note quotes one, else the note's first line
      const q = altText.match(/[“"]([^”"]{2,})[”"]/);
      const altValue = q ? q[1] : altText.split(' / ')[0].trim();
      const decorative = dec ? 'marked' : alt && /\bdecorative\b|alt\s*=\s*["“”]{2}|empty alt/i.test(altText) ? (alt.ns[0].suggestion ? 'suggested' : 'in alt note') : null;
      const maxChars = Math.floor(n.width / S.altCharPx);
      const icon = Math.max(n.width, n.height) <= ICON_MAX;
      // EM-11: a solid fill under the image in its own fills, or on a wrapper that fits it within 2px
      const own = fillsOf(n);
      const ownSolid = own.slice(0, own.findIndex(p => p.type === 'IMAGE')).find(p => p.type === 'SOLID' && (p.opacity ?? 1) >= 1);
      const pb = n.parent && n.parent.id !== frame.id && 'absoluteBoundingBox' in n.parent ? box(n.parent) : null;
      const fits = pb && Math.abs(pb.x - b.x) <= 2 && Math.abs(pb.y - b.y) <= 2 && Math.abs(pb.width - b.width) <= 2 && Math.abs(pb.height - b.height) <= 2;
      const wrapSolid = fits ? fillsOf(n.parent).find(p => p.type === 'SOLID' && (p.opacity ?? 1) >= 1) : null;
      const behind = behindPoint(n, centerOf(b), page);
      // EM-29: the image's own export settings, else the nearest layer holding it below the frame
      let exp = null, expOn = null;
      for (let p = n; p && p.id !== frame.id; p = p.parent) { const s = 'exportSettings' in p ? p.exportSettings : []; if (s && s.length) { exp = s.map(x => x.format); expOn = p.id === n.id ? 'self' : p.id; break; } }
      const row = {
        frame: frame.id, dark: !!f.dark, id: n.id, name: short(n.name, 40), type: n.type, w: Math.round(n.width), h: Math.round(n.height),
        file: ft.type + (ft.px ? ' ' + ft.px : '') + (ft.alpha ? ' alpha' : ''), logo: logoSet.has(n.id) || undefined, icon: icon || undefined,
        alt: alt ? short(altValue, 120) : null, altNoteOn: alt && alt.on !== 'self' ? alt.on : undefined, altSuggestion: alt ? alt.ns[0].suggestion || undefined : undefined,
        altChars: alt ? altValue.length : undefined, maxChars, decorative,
        darkNote: dark ? short(dark.ns[0].text, 100) + (dark.on !== 'self' ? ' (on ' + dark.on + ')' : '') : null,
        background: ownSolid ? hex(ownSolid.color) + ' (own fill)' : wrapSolid ? hex(wrapSolid.color) + ' (wrapper ' + n.parent.id + ')' : null,
        behind: behind.complex ? 'image or gradient' : hex(behind.color),
        export: exp ? exp.join('/') + (expOn !== 'self' ? ' (on ' + expOn + ')' : '') : null,
        tall: n.height > S.maxSlice || undefined,
      };
      if (alt || decorative) counts.withAlt++;
      if (decorative) counts.decorative++;
      if (alt && !decorative && altValue.length > maxChars) { if (altValue.length <= maxChars * (1 + ALT_TOLERANCE)) counts.altOverPartly++; else counts.altOver++; row.altOver = altValue.length - maxChars; }
      if (dark) counts.withDark++;
      if (row.background) counts.withBackground++;
      if (exp && exp.some(x => x === 'SVG' || x === 'PDF')) counts.exportSvgPdf++;
      if (!exp) counts.exportNone++;
      if (row.tall) counts.tall++;
      if (images.length < MAX_IMAGES) images.push(row);
      // EM-16 data: images that aren't the logo or an icon and have no solid color under them in their own fills
      if (!logoSet.has(n.id) && !icon && !ownSolid && ft.type !== 'jpg') {
        if (f.dark) darkByName.set(n.name, n.id);
        else er.illustrations.push({ id: n.id, frame: frame.id, name: short(n.name, 40), file: row.file, behind: row.behind });
      }
    }
    // --- EM-10: text whose box overlaps an image painted below it, and its contrast with images off
    for (const t of texts) {
      const tb = box(t); if (!tb) continue;
      const area = tb.width * tb.height;
      const below = imgs.filter(i => order.get(i.id) < order.get(t.id)).map(i => { const ib = box(i); const w = Math.min(tb.x + tb.width, ib.x + ib.width) - Math.max(tb.x, ib.x); const h = Math.min(tb.y + tb.height, ib.y + ib.height) - Math.max(tb.y, ib.y); return { i, share: w > 0 && h > 0 ? (w * h) / area : 0 }; }).filter(x => x.share >= OVERLAP);
      if (!below.length) continue;
      const bg = behindPoint(t, centerOf(tb), page);
      const segs = t.getStyledTextSegments(['fills', 'fontSize', 'fontWeight']);
      let worst = null;
      for (const s of segs) {
        const fill = s.fills.find(p => p.visible !== false && p.type === 'SOLID'); if (!fill || bg.complex) continue;
        const large = s.fontSize >= 24 || (s.fontSize >= 18.66 && s.fontWeight >= 700); // WCAG large text: 24px, or 18.66px bold
        const fg = over(fill.color, (fill.opacity ?? 1) * (t.opacity ?? 1), bg.color);
        const r = ratio(fg, bg.color), need = large ? 3 : 4.5;
        if (!worst || r / need < worst.r / worst.need) worst = { r, need, fg: hex(fg) };
      }
      er.textOverImages.push({ frame: frame.id, dark: !!f.dark, id: t.id, text: short(t.characters, 40), image: below[0].i.id, imagesOff: bg.complex ? 'gradient behind, check from a screenshot' : hex(bg.color), ratio: worst ? Math.round(worst.r * 100) / 100 : null, need: worst ? worst.need : null, pass: worst ? worst.r + 1e-9 >= worst.need : null, color: worst ? worst.fg : null });
    }
  }
  // EM-16: the same illustration's layer in the email's dark-mode frame, matched by name, so the agent can look at it there
  for (const il of er.illustrations) { const d = darkByName.get(il.name); if (d) il.inDarkFrame = d; }
  er.hasDarkFrame = (e.frames || []).some(f => f.dark);
  er.textOverImagesTotal = er.textOverImages.length; er.textOverImages = er.textOverImages.slice(0, MAX_EX * 2);
  er.illustrationsTotal = er.illustrations.length; er.illustrations = er.illustrations.slice(0, MAX_EX);
  out.emails.push(er);
}
out.counts = counts;
out.images = images; out.imagesTotal = imageTotal; // every image layer in every frame, light and dark
out.altCharPx = S.altCharPx; out.maxSlice = S.maxSlice;
out.bytes = { ms: bytesMs, skipped: bytesSkipped };
out.ms = Date.now() - t0;
return out;
