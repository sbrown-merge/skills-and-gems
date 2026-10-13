// merge-email-check script 01: frames, modules, the preview area, type, links, headings, tap targets, content notes,
// the preheader and the footer (read-only). Feeds EM-01 to EM-05, EM-17, EM-18 and EM-21 to EM-28.
// Split on 2026-10-06 from 01-checks.js, which ran this and script 02 as two parts of one script: Figma's agent runs
// a script through evaluate_script, whose code may be at most 20,000 characters, and the merged script was 30,292
// minified. Scripts 01 and 02 each carry their own copy of the helpers they share, so change both together.
// Placeholders: '__SCOPE_ID__' (plain text: the scope script 00 resolved, searched for preheader, fallback and content
// notes outside the email frames, such as a subject-line card); __EMAILS__ (JSON: script 00's `emails`, as confirmed
// or corrected; each frame needs `id` and `role`, plus `dark: true` if it shows dark mode); and __SETTINGS__ (JSON:
// the house settings, or null for MERGE's).
// The agent compares the frame widths and heights returned here with the width, length and default settings itself.
const SCOPE_ID = '__SCOPE_ID__';
const EMAILS = __EMAILS__;
const SETTINGS = __SETTINGS__;
const t0 = Date.now();
// MERGE's house settings (checklist.md, "House settings"); a project overrides any of them through __SETTINGS__
const S = Object.assign({
  previewArea: 300, // the first 300px of the desktop frame, Jill Redo's scorecard, "Preview Pane" (EM-04)
  headline: [20, 22], // section headline sizes in px, Jill Redo's workshop deck and D-16 (EM-18)
  bodyLineHeight: [1.4, 1.6], // body line height as a multiple of the font size, same source
  capsMaxChars: 25, // all caps only for short labels: "LIMITED TIME OFFER" is 18 characters, a sentence is longer
  tapTarget: 44, // D-7; Jill Redo's scorecard says 40 (EM-21)
}, SETTINGS || {});
const MAX_EX = 10; // examples per list, with a total beside each, to stay under use_figma's 20 KB return
const MAX_LIST = 40; // lists the agent judges from (EM-24, EM-26); a cap of 10 hid real items in merge-build-readiness
if (!Array.isArray(EMAILS)) return { error: 'EMAILS must be the JSON array script 00 returns as `emails`' };
// Line and paragraph separators break regexes and JSON readers. Build them with fromCharCode: a backslash-u-2028
// escape typed into a use_figma call arrives as a real separator and breaks the script (2026-10-05).
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029);
const NEWLINES = /\s*\n\s*/g;
const clean = s => String(s).split(LS).join(' / ').split(PS).join(' / ').replace(NEWLINES, ' / ').trim();
const short = (s, n) => clean(s).slice(0, n);
const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const findAll = (n, types) => ('findAllWithCriteria' in n ? n.findAllWithCriteria({ types }) : []);
const box = n => n.absoluteBoundingBox;
const size = n => Math.round(n.width) + 'x' + Math.round(n.height);
const fillsOf = n => (Array.isArray(n.fills) ? n.fills.filter(p => p.visible !== false && (p.opacity ?? 1) > 0) : []);
const solidOf = n => fillsOf(n).find(p => p.type === 'SOLID');
const hasImage = n => fillsOf(n).some(p => p.type === 'IMAGE');
const colorOf = fills => { const f = solidOf({ fills }); return f ? hex(f.color) : 'none'; };
// Compare layers by ID, never as objects: a layer inside an instance found by findAllWithCriteria isn't the same
// object as the one in its parent's children, so indexOf returned -1 and Set lookups missed it (2026-10-05).
const visibleIn = (n, frame) => { for (let p = n; p && p.id !== frame.id; p = p.parent) if (p.visible === false) return false; return true; };
const insideAny = (n, ids, frame) => { for (let p = n.parent; p && p.id !== frame.id; p = p.parent) if (ids.has(p.id)) return true; return false; };
// --- Notes on a layer, read three ways (checklist.md, "Notes for the scripts"): a category named for one of the
// eight kinds; an annotation in any category that starts "Kind:"; a preset Accessibility annotation mentioning alt.
// A note that starts "Suggestion" only suggests, so it counts toward Partly at most.
const KINDS = ['alt text', 'decorative image', 'heading level', 'link or cta', 'dark mode', 'dynamic content', 'mobile behavior', 'content model field'];
const NOTE_PREFIX = /^\s*([A-Za-z ]+?)\s*:\s*([\s\S]*)$/;
const BOLD = /\*\*/g, ALT = /\balt\b/i, SUGGESTION = /^\W*suggest(ion|ed)?\b/i;
const catById = new Map();
try { for (const c of await figma.annotations.getAnnotationCategoriesAsync()) catById.set(c.id, c); } catch (e) {}
const notesOf = n => {
  let list = []; try { list = n.annotations || []; } catch (e) {}
  return list.map(a => {
    const cat = catById.get(a.categoryId), label = cat ? cat.label.trim().toLowerCase() : '';
    const text = clean(a.labelMarkdown || a.label || ''), m = text.replace(BOLD, '').match(NOTE_PREFIX);
    const pre = m && KINDS.includes(m[1].toLowerCase()) ? m[1].toLowerCase() : null;
    const kind = KINDS.includes(label) ? label : pre || (cat && cat.isPreset && label === 'accessibility' && ALT.test(text) ? 'alt text' : null);
    // a suggestion can also follow the kind, as in "Alt text: Suggestion: ...", so test the body too
    const body = pre && kind === pre ? m[2] : text;
    return { kind, text: body, suggestion: SUGGESTION.test(text) || SUGGESTION.test(body) };
  });
};
// A note on the layer itself, or on the nearest layer holding it below the email frame, because a layer inside an
// instance can only carry the instance's notes; `on` names the holding layer, and `kind` null takes any kind.
const noteUp = (n, frame, kind) => {
  for (let p = n; p && p.id !== frame.id; p = p.parent) { const x = notesOf(p).find(y => (kind ? y.kind === kind : y.kind)); if (x) return Object.assign(x, { on: p.id === n.id ? undefined : p.id }); }
  return null;
};
const noteText = (x, n) => short(x.text, n) + (x.suggestion ? ' (suggestion)' : '') + (x.on ? ' (on ' + x.on + ')' : '');
// --- Buttons (checklist.md, "Notes for the scripts"): a frame or instance named button, btn or cta, or one holding a
// single short text layer on a filled, rounded shape.
const CONTAINERS = ['FRAME', 'INSTANCE', 'COMPONENT', 'GROUP'];
const BUTTON_NAME = /(^|[^a-z])(button|btn|cta)([^a-z]|$)/i;
const MAX_LABEL = 40; // a button label or a standalone link is a few words; a longer single text is a card or a band
const MAX_BUTTON_H = 80; // taller than any button we've seen drawn; a filled card with one line of text is not one
const radiusOf = n => ('topLeftRadius' in n ? Math.max(n.topLeftRadius, n.topRightRadius, n.bottomLeftRadius, n.bottomRightRadius) : 0);
const isButton = n => {
  if (!CONTAINERS.includes(n.type)) return false;
  if (BUTTON_NAME.test(n.name)) return true;
  if (n.height > MAX_BUTTON_H) return false;
  const texts = findAll(n, ['TEXT']);
  if (texts.length !== 1 || texts[0].characters.trim().length > MAX_LABEL) return false;
  if (n.type !== 'GROUP') return !!solidOf(n) && radiusOf(n) > 0;
  return n.children.some(c => c.type === 'RECTANGLE' && solidOf(c) && radiusOf(c) > 0);
};
// Load the frame's page, and touch every instance's children: layers inside instances load lazily, and a page search
// found 234 text layers before and 955 after (merge-build-readiness, 2026-10-05). `page` is the frame's page.
let page = null;
const loaded = new Set();
const load = async n => {
  page = n; while (page.type !== 'PAGE') page = page.parent;
  if (!loaded.has(page.id)) { await page.loadAsync(); loaded.add(page.id); }
  for (let pass = 0, last = -1; pass < 4; pass++) { const inst = findAll(n, ['INSTANCE']); if (inst.length === last) break; last = inst.length; for (const i of inst) i.children.length; }
};
const MIN_TARGET = 24; // WCAG 2.2 SC 2.5.8 in CSS px, and a hard minimum on every project, spaced or not (EM-21)
const BODY_MIN_CHARS = 80; // a paragraph: at 80 characters a text runs past one line at either width
const HEADING_MAX_CHARS = 120; // a heading is a line or two; longer large text is a pull quote or a paragraph
const HEADING_MIN_SIZE = 20; // the bottom of the house headline range; smaller bold text is a label
const NAV_ROW_TOLERANCE = 4; // standalone links whose tops sit within 4px of each other form a row, like a nav bar
const NAV_ROW_MIN = 3; // a nav row of three or more links is exempt from EM-22
// The web-safe families of checklist.md, "Notes for the scripts". Segoe UI and San Francisco count as brand fonts.
const WEB_SAFE = ['arial', 'helvetica', 'georgia', 'times new roman', 'verdana', 'tahoma', 'trebuchet ms', 'courier new'];
// Regexes live in named constants: rjsmin reads a regex literal straight after => as division and strips its spaces
// ("knock ?out" became "knock?out", 2026-10-05), so no arrow function may start with one.
const LINK_WORDS = /unsubscribe|opt[ -]?out|view (it )?in (your )?browser|view online|read (more|now)|learn more|click here|privacy|preferences|manage (your )?subscription|www\.|https?:|\.com\b/i;
const LINK_NAME = /\blink\b/i; // a layer named as a link, like the Adobe rebuild's "Link: Read now"
const HEADING_NAME = /^h[1-6]\b|heading|headline/i; // not "title": the Adobe rebuild's "Pro tip: title" is a job title
const LEVEL = /\bH([1-6])\b/i;
// Marketo {{lead.First Name}}, {FirstName}, %%name%%, Mailchimp *|FNAME|*, and [First Name]-style fields; a bracket
// only counts with a field word inside, since Gmail's "[Message clipped]" matched a looser pattern (2026-10-05)
const MERGE_TAG = /\{\{[^}]+\}\}|\{[A-Za-z][\w .]*\}|%%[^%]+%%|\*\|[A-Z0-9_]+\|\*|\[(first|last|full|company|account|job|email|city)[^\]]{0,20}\]/gi;
const PREHEADER = /pre-?header|preview text|preview line/i;
// EM-27: a note that asks for a preheader isn't one. Quoted text is taken out first, so "Preheader: "Add it now"" counts.
const ASKS = /\b(add|consider|needs?|should|missing|recommend|suggest\w*|no preheader)\b|\?/i;
const QUOTED = /[“"][^”"]*[”"]/g;
const FALLBACK = /fallback|font stack|in place of|substitut|stands? in for|standing in for/i;
const FALLBACK_FRAME = /fallback|web-?safe|arial|helvetica|georgia/i;
const UNSUB = /unsubscribe|opt[ -]?out|stop receiving|manage (your )?(email )?(preferences|subscription)/i;
const PREFS = /preferences|manage (your )?subscription/i;
const PRIVACY = /privacy/i;
// A postal address: a street number and a street word, a US "City, ST 12345", a UK postcode, or a PO box
const ADDRESS = /\b\d{1,6}\s+[A-Za-z0-9.'-]+(\s+[A-Za-z0-9.'-]+){0,4}\s+(street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|place|pl|court|ct|parkway|pkwy|square|sq|suite|floor)\b|\b[A-Z][a-z]+,\s*[A-Z]{2}\s+\d{5}(-\d{4})?\b|\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b|\bP\.?\s?O\.?\s+Box\s+\d+/i;
const FOOTER_NAME = /footer/i;
const PUNCT = /^[\s.,;:!?)(]+$/; // punctuation in another color isn't a link
const NOT_LETTER = /[^A-Za-z]/g;
const out = { emails: [] };
const fonts = new Map(); // family -> the IDs of the text layers that use it (EM-17)
const frames = [];
// EM-27: each email's frame IDs, sections and lowercased name, so a preheader found outside the frames can be given to
// the email it belongs to
const info = [];
const sectionOf = n => { for (let p = n.parent; p && p.type !== 'PAGE'; p = p.parent) if (p.type === 'SECTION') return p.id; return null; };
for (const e of EMAILS) {
  const er = { name: e.name, frames: [] }, nodes = [];
  const own = { er, ids: new Set(), secs: new Set(), key: clean(e.name || '').toLowerCase(), pre: [] }; info.push(own);
  for (const f of e.frames || []) {
    const frame = await figma.getNodeByIdAsync(f.id);
    if (!frame) { er.frames.push({ id: f.id, error: 'not found' }); continue; }
    await load(frame); frames.push(frame); own.ids.add(frame.id); own.secs.add(sectionOf(frame));
    const top = box(frame).y;
    const kids = 'children' in frame ? frame.children.filter(c => c.visible !== false) : [];
    // EM-01, EM-02 and EM-05: a frame with no layers counts as missing; the agent compares x, w and h
    const fr = { id: frame.id, role: f.role, dark: !!f.dark || undefined, w: Math.round(frame.width), h: Math.round(frame.height), x: Math.round(box(frame).x), layers: kids.length };
    er.frames.push(fr); nodes.push({ frame, fr, kids });
    if (!kids.length) continue;
    const texts = findAll(frame, ['TEXT']).filter(t => visibleIn(t, frame) && t.characters.trim());
    // Buttons, counted once at the outermost layer (findAllWithCriteria lists parents before children)
    const buttonIds = new Set(), targets = [];
    for (const c of findAll(frame, CONTAINERS)) if (visibleIn(c, frame) && !insideAny(c, buttonIds, frame) && isButton(c)) {
      buttonIds.add(c.id);
      const t = findAll(c, ['TEXT'])[0], fill = solidOf(c);
      targets.push({ n: c, s: 'button ' + c.id + ' ' + size(c) + ' "' + (t ? short(t.characters, 40) : '') + '"' + (fill ? ' ' + hex(fill.color) : '') });
    }
    const preview = [], inline = [], links = [], headings = [], styled = [], t18 = { headline: [], lineHeight: [], centered: [], caps: [] };
    for (const t of texts) {
      const segs = t.getStyledTextSegments(['fontName', 'fontSize', 'fontWeight', 'lineHeight', 'textCase', 'textDecoration', 'hyperlink', 'fills']);
      const chars = t.characters, y = Math.round(box(t).y - top), inButton = insideAny(t, buttonIds, frame);
      for (const s of segs) fonts.set(s.fontName.family, (fonts.get(s.fontName.family) || new Set()).add(t.id));
      const maxSize = Math.max(...segs.map(s => s.fontSize));
      if (y < S.previewArea && !inButton && !fr.dark) preview.push('text ' + t.id + ' y' + y + ' ' + maxSize + 'px ' + short(chars, 50));
      // EM-23: heading-level notes, and text styled like a heading without one
      const hn = noteUp(t, frame, 'heading level');
      const level = hn ? +((hn.text.match(LEVEL) || [])[1] || 0) : 0;
      const looksHeading = !inButton && chars.length <= HEADING_MAX_CHARS && (HEADING_NAME.test(t.name) || (maxSize >= HEADING_MIN_SIZE && Math.max(...segs.map(s => s.fontWeight)) >= 600) || maxSize >= 24);
      if (hn) headings.push({ id: t.id, level, y, size: maxSize, s: (level ? 'H' + level : 'no level') + ' ' + t.id + ' ' + maxSize + 'px ' + short(chars, 30) + (hn.suggestion ? ' (suggestion)' : '') + (hn.on ? ' (on ' + hn.on + ')' : '') });
      else if (looksHeading) styled.push({ id: t.id, y, size: maxSize, s: t.id + ' ' + maxSize + 'px ' + short(chars, 30) });
      // EM-18: house type defaults, flags only
      if (!inButton && chars.length >= BODY_MIN_CHARS && maxSize < HEADING_MIN_SIZE) {
        const lh = segs.map(s => (s.lineHeight.unit === 'PIXELS' ? s.lineHeight.value / s.fontSize : s.lineHeight.unit === 'PERCENT' ? s.lineHeight.value / 100 : null));
        const off = lh.find(v => v === null || v < S.bodyLineHeight[0] - 1e-6 || v > S.bodyLineHeight[1] + 1e-6);
        if (off !== undefined) t18.lineHeight.push(t.id + ' ' + (off === null ? 'auto' : off.toFixed(2)) + ' ' + short(chars, 30));
        if (t.textAlignHorizontal === 'CENTER') t18.centered.push(t.id + ' ' + short(chars, 30));
      }
      const letters = chars.replace(NOT_LETTER, '');
      if (chars.trim().length > S.capsMaxChars && (segs.every(s => s.textCase === 'UPPER') || (letters.length > 3 && letters === letters.toUpperCase()))) t18.caps.push(t.id + ' ' + short(chars, 30));
      // EM-22, EM-24 and EM-21: links. A range is a link when it carries a hyperlink, or when its color differs from the
      // text's main color (the Adobe rebuild sets no hyperlinks and shows links by color alone, 2026-10-05). A whole
      // text layer is a standalone link when it's all hyperlinked, or short and link-worded, or named as a link.
      if (inButton) continue;
      const byColor = new Map(); for (const s of segs) byColor.set(colorOf(s.fills), (byColor.get(colorOf(s.fills)) || 0) + s.characters.length);
      const main = [...byColor.entries()].sort((a, b) => b[1] - a[1])[0][0];
      const allLinked = segs.every(s => s.hyperlink);
      const whole = allLinked || (LINK_WORDS.test(chars) && chars.trim().length <= MAX_LABEL) || LINK_NAME.test(t.name);
      if (whole && (allLinked || byColor.size === 1)) links.push({ n: t, y, u: segs.every(s => s.textDecoration === 'UNDERLINE'), s: 'link ' + t.id + ' ' + size(t) + ' "' + short(chars, 40) + '" ' + main + (allLinked ? ' linked' : '') });
      else if (segs.length > 1) for (const s of segs) {
        if ((!s.hyperlink && colorOf(s.fills) === main) || !s.characters.trim() || PUNCT.test(s.characters)) continue;
        inline.push((s.textDecoration === 'UNDERLINE' ? 'underlined ' : 'bare ') + t.id + ' "' + short(s.characters, 40) + '" ' + colorOf(s.fills) + ' in ' + main + (s.hyperlink ? ' linked' : ''));
      }
    }
    // EM-22: a nav row is three or more standalone links side by side; it's exempt, as are buttons
    for (const l of links) {
      const nav = links.filter(o => Math.abs(o.y - l.y) <= NAV_ROW_TOLERANCE).length >= NAV_ROW_MIN;
      targets.push({ n: l.n, s: l.s + (l.u ? ' underlined' : '') + (nav ? ' nav' : ''), bare: !l.u && !nav, nav });
    }
    // EM-21 and EM-26: every button and standalone link top to bottom, with its size. Links inside a run of text are
    // inline targets, which WCAG 2.5.8 exempts, so they're counted under EM-22 but not sized. Prototype interactions
    // aren't targets here: the rule covers buttons and linked text, and no test frame had any on 2026-10-05.
    targets.sort((a, b) => box(a.n).y - box(b.n).y);
    const side = x => Math.min(x.n.width, x.n.height);
    fr.targets = targets.slice(0, MAX_LIST).map(x => x.s + ' y' + Math.round(box(x.n).y - top)); fr.targetsTotal = targets.length;
    fr.em21 = { under24: targets.filter(x => side(x) < MIN_TARGET).length, underHouse: targets.filter(x => side(x) >= MIN_TARGET && side(x) < S.tapTarget).length };
    const standalone = targets.filter(x => x.n.type === 'TEXT');
    fr.em22 = { inline: inline.length, inlineBare: inline.filter(s => s.startsWith('bare')).length, inlineEx: inline.slice(0, MAX_EX * 2), standalone: standalone.filter(x => !x.nav).length, standaloneBare: standalone.filter(x => x.bare).length, navRowLinks: standalone.filter(x => x.nav).length };
    // EM-23: one H1, levels in order down the page
    headings.sort((a, b) => a.y - b.y);
    const skips = []; let prev = 0;
    for (const h of headings) { if (!h.level) continue; if (prev ? h.level > prev + 1 : h.level !== 1) skips.push((prev ? 'H' + prev : 'start') + ' to H' + h.level + ' at ' + h.id); prev = h.level; }
    fr.em23 = { h1: headings.filter(h => h.level === 1).length, headings: headings.slice(0, MAX_LIST / 2).map(h => h.s), headingsTotal: headings.length, suggestions: headings.filter(h => h.s.includes('(suggestion)')).length, skips, styledWithoutLevel: styled.length, styledEx: styled.slice(0, MAX_EX).map(h => h.s) };
    // EM-18: section headings outside the house range. The H1 is left out: the heading noted H1, else the largest
    // heading-like text, topmost on a tie.
    const all = headings.concat(styled);
    const h1 = all.find(h => h.level === 1) || all.slice().sort((a, b) => b.size - a.size || a.y - b.y)[0];
    for (const h of all) if (h !== h1 && (h.size < S.headline[0] || h.size > S.headline[1])) t18.headline.push(h.s);
    fr.em18 = { h1Left: h1 ? h1.id : null };
    for (const k in t18) { fr.em18[k] = t18[k].length; if (t18[k].length) fr.em18[k + 'Ex'] = t18[k].slice(0, MAX_EX); }
    // EM-04: text, buttons and images whose top edge is inside the preview area, in light frames
    if (!fr.dark) {
      for (const x of targets) { const yy = Math.round(box(x.n).y - top); if (yy < S.previewArea && x.n.type !== 'TEXT') preview.push(x.s.split(' ')[0] + ' ' + x.n.id + ' y' + yy + ' ' + x.s.slice(x.s.indexOf('"'))); }
      for (const n of findAll(frame, ['FRAME', 'RECTANGLE', 'INSTANCE', 'GROUP', 'ELLIPSE'])) { const yy = Math.round(box(n).y - top); if (yy < S.previewArea && hasImage(n) && visibleIn(n, frame)) preview.push('image ' + n.id + ' y' + yy + ' ' + size(n) + ' ' + short(n.name, 30)); }
      preview.sort((a, b) => +a.split(' ')[2].slice(1) - +b.split(' ')[2].slice(1));
      // 15 items: the most any test frame had in its preview area was 4 (a label, a hero, a headline and a line of text),
      // so 15 leaves room for a busy header while keeping the result small; the total says when it's cut short
      fr.em04 = preview.slice(0, 15); fr.em04Total = preview.length;
    }
    // EM-28: the footer is the outermost layer named footer ("Footer logo: Adobe" sits inside the Adobe rebuild's
    // "Footer" frame), else the module lowest in the frame
    const named = findAll(frame, CONTAINERS).filter(n => visibleIn(n, frame) && FOOTER_NAME.test(n.name));
    const namedIds = new Set(named.map(n => n.id));
    let footer = named.filter(n => !insideAny(n, namedIds, frame)).sort((a, b) => box(b).y - box(a).y)[0], how = 'name';
    if (!footer) { footer = kids.slice().sort((a, b) => box(b).y - box(a).y)[0]; how = 'lowest module'; }
    const ftexts = footer.type === 'TEXT' ? [footer] : findAll(footer, ['TEXT']).filter(t => visibleIn(t, frame));
    const find = re => { const t = ftexts.find(x => re.test(x.characters)); return t ? t.id + ' ' + short(t.characters.slice(Math.max(0, t.characters.search(re) - 20)), 60) : null; };
    const elsewhere = re => (ftexts.some(x => re.test(x.characters)) ? undefined : (texts.find(x => re.test(x.characters)) || {}).id);
    const unsubT = ftexts.find(x => UNSUB.test(x.characters));
    let unsubLink = null;
    if (unsubT) { const at = unsubT.characters.search(UNSUB); const s = unsubT.getStyledTextSegments(['hyperlink', 'textDecoration']).find(x => at >= x.start && at < x.end); if (s) unsubLink = (s.hyperlink ? 'hyperlink' : 'no hyperlink') + (s.textDecoration === 'UNDERLINE' ? ', underlined' : ''); }
    // EM-28: the unsubscribe link is stated in a Link or CTA note, because the developer usually sets the real URL; a
    // Figma hyperlink isn't required, so unsubLink is only informational (Steve, 2026-10-06)
    const un = unsubT && noteUp(unsubT, frame, 'link or cta');
    fr.em28 = { footer: footer.id + ' ' + short(footer.name, 30) + ' (' + how + ')', unsubscribe: find(UNSUB), unsubLink, unsubNote: un ? noteText(un, 120) : null, address: find(ADDRESS), privacy: find(PRIVACY), preferences: find(PREFS), unsubElsewhere: elsewhere(UNSUB), addressElsewhere: elsewhere(ADDRESS) };
  }
  // EM-03: modules are the direct children of the light desktop frame, or of the light mobile frame when the desktop
  // one is empty. A note on the frame itself, the module's holding layer, covers every module.
  const light = nodes.filter(x => !x.fr.dark && x.kids.length);
  const base = light.find(x => x.fr.role === 'desktop') || light.find(x => x.fr.role === 'mobile');
  if (base) {
    const fn = noteUp(base.frame, base.frame.parent, 'mobile behavior');
    const mods = base.kids.map(c => ({ c, note: noteUp(c, base.frame, 'mobile behavior') }));
    // More than half the direct layers being loose text or shapes means the email isn't grouped into modules, as in
    // the Adobe rebuild's desktop frame (2026-10-05), and the check fails for that reason.
    const loose = mods.filter(m => !CONTAINERS.includes(m.c.type)).length;
    er.em03 = { from: base.frame.id, modules: mods.length, noted: mods.filter(m => m.note && !m.note.suggestion).length, suggestionOnly: mods.filter(m => m.note && m.note.suggestion).length, frameNote: fn ? short(fn.text, 100) : null, loose, notGroupedIntoModules: loose > mods.length / 2, withoutNote: mods.filter(m => !m.note).slice(0, MAX_EX).map(m => m.c.id + ' ' + m.c.type + ' ' + short(m.c.name, 30)) };
  } else er.em03 = 'no light frame has layers';
  out.emails.push(er);
}
// EM-17: families, and whether each is web-safe
out.em17 = { families: [...fonts.entries()].map(([fam, ids]) => fam + (WEB_SAFE.includes(fam.toLowerCase()) ? ' (web-safe) ' : ' (brand) ') + ids.size + ' layers') };
// EM-17, EM-25 and EM-27 also look across the scope, outside the email frames: a subject-line card or a caption can
// carry a preheader, a fallback note or a merge tag, as TOFU's subject-line card does. Without a scope, the frames.
const scope = SCOPE_ID && !SCOPE_ID.startsWith('__') ? await figma.getNodeByIdAsync(SCOPE_ID) : null;
if (scope) await load(scope);
const NOTE_TYPES = ['FRAME', 'INSTANCE', 'GROUP', 'TEXT', 'RECTANGLE', 'VECTOR', 'ELLIPSE', 'SECTION', 'COMPONENT'];
const pre = [], fallback = [], fallbackFrames = [], tags = []; let read = 0, matched = 0, dynamic = 0, fields = 0;
// EM-27: a preheader belongs to the email whose frame holds it; else to the email whose name the outermost frame's
// name contains, longest name first ("P1 Email 1 / Subject Line" is P1 Email 1's); else to the only email in its
// section. One that fits none stays in the scope-level list.
const ownerOf = n => {
  for (let p = n; p && p.type !== 'PAGE'; p = p.parent) { const o = info.find(x => x.ids.has(p.id)); if (o) return o; }
  let top = n; while (top.parent && top.parent.type !== 'PAGE' && top.parent.type !== 'SECTION') top = top.parent;
  const name = clean(top.name).toLowerCase();
  const byName = info.filter(x => x.key && name.includes(x.key)).sort((a, b) => b.key.length - a.key.length)[0];
  const sec = sectionOf(n), inSec = info.filter(x => x.secs.has(sec));
  return byName || (sec && inSec.length === 1 ? inSec[0] : null);
};
const addPre = (n, s) => { const o = ownerOf(n); (o ? o.pre : pre).push(s); };
for (const n of (scope ? [scope] : frames).flatMap(r => [r, ...findAll(r, NOTE_TYPES)])) {
  if (n.type === 'TEXT') {
    if (PREHEADER.test(n.name) || PREHEADER.test(n.characters.slice(0, 40))) addPre(n, 'text ' + n.id + ' ' + short(n.name, 30) + ': ' + short(n.characters, 80));
    if (FALLBACK.test(n.characters)) fallback.push('text ' + n.id + ': ' + short(n.characters, 100));
    for (const g of n.characters.match(MERGE_TAG) || []) tags.push(n.id + ' ' + g);
  }
  if ((n.type === 'FRAME' || n.type === 'SECTION') && FALLBACK_FRAME.test(n.name)) fallbackFrames.push(n.id + ' ' + short(n.name, 50));
  for (const x of notesOf(n)) {
    read++; if (x.kind) matched++;
    if (x.kind === 'dynamic content') dynamic++;
    if (x.kind === 'content model field') fields++;
    if (PREHEADER.test(x.text)) addPre(n, (x.suggestion || ASKS.test(x.text.replace(QUOTED, '')) ? 'request' : 'note') + ' on ' + n.id + ': ' + short(x.text, 120));
    if (FALLBACK.test(x.text)) fallback.push('note on ' + n.id + ': ' + short(x.text, 100));
  }
}
Object.assign(out.em17, { fallbackNotes: fallback.slice(0, MAX_EX), fallbackNotesTotal: fallback.length, framesShowingFallback: fallbackFrames.slice(0, MAX_EX), framesShowingFallbackTotal: fallbackFrames.length });
// EM-27: a "request" is a note asking for a preheader, which doesn't count as one
for (const o of info) o.er.em27 = { found: o.pre.filter(s => !s.startsWith('request')).length, total: o.pre.length, ex: o.pre.slice(0, MAX_EX) };
out.em27 = { unattributed: pre.slice(0, MAX_EX), unattributedTotal: pre.length };
out.em25 = { dynamicNotes: dynamic, fieldNotes: fields, mergeTags: tags.length, tagsEx: tags.slice(0, MAX_EX) };
// Whether the file uses any of the three ways of writing notes; none at all makes the note checks Couldn't check
out.notes = { read, matched };
out.ms = Date.now() - t0;
return out;
