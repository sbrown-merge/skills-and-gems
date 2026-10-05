// merge-email-check script 03: type, links, headings, content notes, the preheader and the footer (read-only).
// Feeds EM-17, EM-18, EM-22, EM-23, EM-24 (data), EM-25, EM-27 and EM-28.
// Placeholders: '__SCOPE_ID__' (plain text: the scope script 00 resolved, searched for preheader and fallback notes that
// sit outside the email frames, such as a subject-line card), __EMAILS__ (JSON: script 00's `emails`, as confirmed)
// and __SETTINGS__ (JSON, or null for MERGE's).
const SCOPE_ID = '__SCOPE_ID__';
const EMAILS = __EMAILS__;
const SETTINGS = __SETTINGS__;
const t0 = Date.now();
// MERGE's house settings (checklist.md, "House settings"); a project overrides any of them through __SETTINGS__
const DEFAULTS = {
  headline: [20, 22], // headline sizes in px, Jill Redo's workshop deck and D-16
  bodyLineHeight: [1.4, 1.6], // body line height as a multiple of the font size, same source
  capsMaxChars: 25, // all caps only for short labels: "LIMITED TIME OFFER" is 18 characters, a sentence is longer
};
const S = Object.assign({}, DEFAULTS, SETTINGS || {});
const MAX_EX = 10; // examples per list, with a total beside each, to stay under use_figma's 20 KB return
const MAX_LIST = 40; // full lists the agent judges from (EM-24); a cap of 10 hid real items in merge-build-readiness
const BODY_MIN_CHARS = 80; // a paragraph: at 80 characters a text runs past one line at either width
const HEADING_MAX_CHARS = 120; // a heading is a line or two; longer large text is a pull quote or a paragraph
const HEADING_MIN_SIZE = 20; // the bottom of the house headline range; smaller bold text is a label
const NAV_ROW_TOLERANCE = 4; // standalone links whose tops sit within 4px of each other form a row, like a nav bar
// The web-safe families of checklist.md, "Notes for the scripts". Segoe UI and San Francisco count as brand fonts.
const WEB_SAFE = ['arial', 'helvetica', 'georgia', 'times new roman', 'verdana', 'tahoma', 'trebuchet ms', 'courier new'];
// Regexes live in named constants: rjsmin reads a regex literal straight after => as division and strips its spaces
// ("knock ?out" became "knock?out", 2026-10-05), so no arrow function may start with one.
const LINK_WORDS = /unsubscribe|opt[ -]?out|view (it )?in (your )?browser|view online|read (more|now)|learn more|click here|privacy|preferences|manage (your )?subscription|www\.|https?:|\.com\b/i;
const HEADING_NAME = /^h[1-6]\b|heading|headline/i; // not "title": the Adobe rebuild's "Pro tip: title" is a job title (2026-10-05)
const LEVEL = /\bH([1-6])\b/i;
// Marketo {{lead.First Name}}, {FirstName}, %%name%%, Mailchimp *|FNAME|*, and [First Name]-style fields; a bracket only counts
// with a field word inside, since Gmail's "[Message clipped]" matched a looser pattern (2026-10-05)
const MERGE_TAG = /\{\{[^}]+\}\}|\{[A-Za-z][\w .]*\}|%%[^%]+%%|\*\|[A-Z0-9_]+\|\*|\[(first|last|full|company|account|job|email|city)[^\]]{0,20}\]/gi;
const PREHEADER = /pre-?header|preview text|preview line/i;
const FALLBACK = /fallback|font stack|in place of|substitut|stands? in for|standing in for/i;
const UNSUB = /unsubscribe|opt[ -]?out|stop receiving|manage (your )?(email )?(preferences|subscription)/i;
const PREFS = /preferences|manage (your )?subscription/i;
const PRIVACY = /privacy/i;
// A postal address: a street number and a street word, a US "City, ST 12345", a UK postcode, or a PO box
const ADDRESS = /\b\d{1,6}\s+[A-Za-z0-9.'-]+(\s+[A-Za-z0-9.'-]+){0,4}\s+(street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|place|pl|court|ct|parkway|pkwy|square|sq|suite|floor)\b|\b[A-Z][a-z]+,\s*[A-Z]{2}\s+\d{5}(-\d{4})?\b|\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b|\bP\.?\s?O\.?\s+Box\s+\d+/i;
const FOOTER_NAME = /footer/i;
const LINK_NAME = /\blink\b/i; // a layer named as a link, like the Adobe rebuild's "Link: Read now"
const PUNCT = /^[\s.,;:!?)(]+$/; // punctuation in another color isn't a link
if (!Array.isArray(EMAILS)) return { error: 'EMAILS must be the JSON array script 00 returns as `emails`' };
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029); // separators that break regexes and JSON readers
const clean = s => String(s).split(LS).join(' / ').split(PS).join(' / ').replace(/\s*\n\s*/g, ' / ').trim();
const short = (s, n) => { s = clean(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
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
// Compare layers by ID, never as objects: a layer inside an instance found by findAllWithCriteria isn't the same
// object as the one in its parent's children, so indexOf returned -1 and Set lookups missed it (2026-10-05).
const noteUp = (n, frame, kinds) => {
  for (let p = n; p && p.id !== frame.id; p = p.parent) { const ns = notesOf(p).filter(x => kinds.includes(x.kind)); if (ns.length) return { ns, on: p.id === n.id ? 'self' : p.id }; }
  return null;
};
// --- Buttons, as in script 01
const BUTTON_NAME = /(^|[^a-z])(button|btn|cta)([^a-z]|$)/i;
const MAX_LABEL = 40, MAX_BUTTON_H = 80; // a button label is a few words; a filled card with one line of text is not a button
const solidOf = n => (Array.isArray(n.fills) ? n.fills.find(p => p.visible !== false && p.type === 'SOLID' && (p.opacity ?? 1) > 0) : null);
const radiusOf = n => ('topLeftRadius' in n ? Math.max(n.topLeftRadius, n.topRightRadius, n.bottomLeftRadius, n.bottomRightRadius) : 0);
const isButton = n => {
  if (!['FRAME', 'INSTANCE', 'COMPONENT', 'GROUP'].includes(n.type)) return false;
  if (BUTTON_NAME.test(n.name)) return true;
  if (n.height > MAX_BUTTON_H || !('findAllWithCriteria' in n)) return false;
  const texts = n.findAllWithCriteria({ types: ['TEXT'] });
  if (texts.length !== 1 || texts[0].characters.trim().length > MAX_LABEL) return false;
  if (n.type !== 'GROUP') return !!solidOf(n) && radiusOf(n) > 0;
  return n.children.some(c => c.type === 'RECTANGLE' && solidOf(c) && radiusOf(c) > 0);
};
const visibleIn = (n, frame) => { for (let p = n; p && p.id !== frame.id; p = p.parent) if (p.visible === false) return false; return true; };
const loaded = new Set();
const loadPageOf = async n => { let p = n; while (p && p.type !== 'PAGE') p = p.parent; if (p && !loaded.has(p.id)) { await p.loadAsync(); loaded.add(p.id); } };
const touchInstances = n => { for (let pass = 0, last = -1; pass < 4 && 'findAllWithCriteria' in n; pass++) { const inst = n.findAllWithCriteria({ types: ['INSTANCE'] }); if (inst.length === last) break; last = inst.length; for (const i of inst) i.children.length; } };
const fillKey = fills => { const f = Array.isArray(fills) ? fills.find(p => p.visible !== false && p.type === 'SOLID') : null; return f ? hex(f.color) : 'none'; };
const out = { emails: [] };
const fonts = new Map(); // family -> { layers, styles }
let noteCount = 0, matched = 0;
for (const e of EMAILS) {
  const er = { name: e.name, frames: [] };
  for (const f of e.frames || []) {
    const frame = await figma.getNodeByIdAsync(f.id);
    if (!frame) { er.frames.push({ id: f.id, error: 'not found' }); continue; }
    await loadPageOf(frame); touchInstances(frame);
    const top = frame.absoluteBoundingBox.y;
    const fr = { id: frame.id, role: f.role, dark: !!f.dark };
    const texts = frame.findAllWithCriteria({ types: ['TEXT'] }).filter(t => visibleIn(t, frame) && t.characters.trim());
    const buttons = new Map();
    const inButton = t => { for (let p = t.parent; p && p.id !== frame.id; p = p.parent) if (buttons.has(p.id)) return true; return false; };
    for (const c of frame.findAllWithCriteria({ types: ['FRAME', 'INSTANCE', 'COMPONENT', 'GROUP'] })) if (visibleIn(c, frame) && !inButton(c) && isButton(c)) buttons.set(c.id, c);
    for (const n of frame.findAllWithCriteria({ types: ['FRAME', 'INSTANCE', 'GROUP', 'TEXT', 'RECTANGLE', 'VECTOR'] })) { const ns = notesOf(n); noteCount += ns.length; matched += ns.filter(x => x.kind).length; }
    const inline = [], standalone = [], headings = [], styledHeadings = [], t18 = { headline: [], lineHeight: [], centered: [], caps: [] };
    const dynamic = { notes: 0, fields: 0, tags: [] };
    for (const t of texts) {
      const segs = t.getStyledTextSegments(['fontName', 'fontSize', 'fontWeight', 'lineHeight', 'textCase', 'textDecoration', 'hyperlink', 'fills']);
      const chars = t.characters;
      // EM-17: font families
      for (const s of segs) { const fam = s.fontName.family; const e2 = fonts.get(fam) || { layers: new Set(), styles: new Set() }; e2.layers.add(t.id); e2.styles.add(s.fontName.style); fonts.set(fam, e2); }
      const maxSize = Math.max(...segs.map(s => s.fontSize));
      const y = Math.round(t.absoluteBoundingBox.y - top);
      const btn = inButton(t);
      // EM-23: heading-level notes; text styled like a heading without one
      const hn = noteUp(t, frame, ['heading level']);
      const lv = hn ? (hn.ns[0].text.match(LEVEL) || [])[1] : null;
      const looksHeading = !btn && chars.length <= HEADING_MAX_CHARS && (HEADING_NAME.test(t.name) || (maxSize >= HEADING_MIN_SIZE && Math.max(...segs.map(s => s.fontWeight)) >= 600) || maxSize >= 24);
      if (hn) headings.push({ id: t.id, level: lv ? +lv : null, y, text: short(chars, 40), suggestion: hn.ns[0].suggestion || undefined, on: hn.on !== 'self' ? hn.on : undefined });
      else if (looksHeading) styledHeadings.push(t.id + ' ' + maxSize + 'px ' + short(chars, 30));
      // EM-18: house type defaults
      const body = !btn && chars.length >= BODY_MIN_CHARS && maxSize < HEADING_MIN_SIZE;
      if ((looksHeading || hn) && (maxSize < S.headline[0] || maxSize > S.headline[1])) t18.headline.push(t.id + ' ' + maxSize + 'px ' + short(chars, 30));
      if (body) {
        const lh = segs.map(s => (s.lineHeight.unit === 'PIXELS' ? s.lineHeight.value / s.fontSize : s.lineHeight.unit === 'PERCENT' ? s.lineHeight.value / 100 : null));
        const off = lh.find(v => v === null || v < S.bodyLineHeight[0] - 1e-6 || v > S.bodyLineHeight[1] + 1e-6);
        if (off !== undefined) t18.lineHeight.push(t.id + ' ' + (off === null ? 'auto' : off.toFixed(2)) + ' ' + short(chars, 30));
        if (t.textAlignHorizontal === 'CENTER') t18.centered.push(t.id + ' ' + short(chars, 30));
      }
      const letters = chars.replace(/[^A-Za-z]/g, '');
      if (chars.trim().length > S.capsMaxChars && (segs.every(s => s.textCase === 'UPPER') || (letters.length > 3 && letters === letters.toUpperCase()))) t18.caps.push(t.id + ' ' + short(chars, 30));
      // EM-22 and EM-24: links. A range is a link when it carries a hyperlink, or when its color differs from the
      // text's main color (the Adobe rebuild sets no hyperlinks and shows links by color alone, 2026-10-05).
      if (!btn) {
        const byColor = new Map(); for (const s of segs) byColor.set(fillKey(s.fills), (byColor.get(fillKey(s.fills)) || 0) + s.characters.length);
        const main = [...byColor.entries()].sort((a, b) => b[1] - a[1])[0][0];
        const allLinked = segs.every(s => s.hyperlink);
        const whole = allLinked || LINK_WORDS.test(chars) && chars.trim().length <= MAX_LABEL || LINK_NAME.test(t.name);
        if (whole && segs.length >= 1 && (allLinked || segs.every(s => fillKey(s.fills) === main))) {
          standalone.push({ id: t.id, y, h: Math.round(t.height), text: short(chars, 40), underlined: segs.every(s => s.textDecoration === 'UNDERLINE'), hyperlink: allLinked, color: main });
        } else if (segs.length > 1) {
          for (const s of segs) {
            const k = fillKey(s.fills);
            if (!s.hyperlink && k === main) continue;
            if (!s.characters.trim() || PUNCT.test(s.characters)) continue;
            inline.push({ id: t.id, text: short(s.characters, 40), underlined: s.textDecoration === 'UNDERLINE', hyperlink: !!s.hyperlink, color: k, around: main });
          }
        }
      }
      // EM-25: merge tags in the text
      const tags = chars.match(MERGE_TAG); if (tags) for (const g of tags) if (dynamic.tags.length < MAX_EX) dynamic.tags.push(t.id + ' ' + g);
    }
    // EM-22: a nav row is three or more standalone links side by side; it's exempt, as are buttons
    for (const l of standalone) l.navRow = standalone.filter(o => Math.abs(o.y - l.y) <= NAV_ROW_TOLERANCE).length >= 3 || undefined;
    // EM-25: dynamic-content and content-field notes on any layer in the frame
    for (const n of frame.findAllWithCriteria({ types: ['FRAME', 'INSTANCE', 'GROUP', 'TEXT', 'RECTANGLE'] })) { for (const x of notesOf(n)) { if (x.kind === 'dynamic content') dynamic.notes++; if (x.kind === 'content model field') dynamic.fields++; } }
    for (const x of notesOf(frame)) { if (x.kind === 'dynamic content') dynamic.notes++; if (x.kind === 'content model field') dynamic.fields++; }
    // EM-28: the footer is a layer named footer, else the module lowest on the page
    // the outermost layer named footer: "Footer logo: Adobe" sits inside the Adobe rebuild's "Footer" frame (2026-10-05)
    const named = new Map(frame.findAllWithCriteria({ types: ['FRAME', 'INSTANCE', 'GROUP', 'COMPONENT'] }).filter(n => visibleIn(n, frame) && FOOTER_NAME.test(n.name)).map(n => [n.id, n]));
    const insideNamed = n => { for (let p = n.parent; p && p.id !== frame.id; p = p.parent) if (named.has(p.id)) return true; return false; };
    let footer = [...named.values()].filter(n => !insideNamed(n)).sort((a, b) => b.absoluteBoundingBox.y - a.absoluteBoundingBox.y)[0], how = 'name';
    if (!footer && 'children' in frame) { footer = frame.children.filter(c => c.visible !== false).sort((a, b) => b.absoluteBoundingBox.y - a.absoluteBoundingBox.y)[0]; how = 'lowest module'; }
    if (footer) {
      const ftexts = 'findAllWithCriteria' in footer ? footer.findAllWithCriteria({ types: ['TEXT'] }).filter(t => visibleIn(t, frame)) : footer.type === 'TEXT' ? [footer] : [];
      const all = ftexts.map(t => t.characters).join(' / ');
      const find = re => { const t = ftexts.find(x => re.test(x.characters)); return t ? t.id + ' ' + short((t.characters.match(new RegExp('.{0,30}(?:' + re.source + ').{0,30}', 'i')) || [t.characters])[0], 70) : null; };
      const unsubT = ftexts.find(x => UNSUB.test(x.characters));
      let unsubLinked = null;
      if (unsubT) { const m = unsubT.characters.search(UNSUB); const segs = unsubT.getStyledTextSegments(['hyperlink', 'fills', 'textDecoration']); const s = segs.find(x => m >= x.start && m < x.end); unsubLinked = s ? { hyperlink: !!s.hyperlink, underlined: s.textDecoration === 'UNDERLINE' } : null; }
      const elsewhere = re => !re.test(all) && texts.some(t => re.test(t.characters)) ? texts.find(t => re.test(t.characters)).id : null;
      fr.em28 = { footer: footer.id + ' ' + short(footer.name, 40), how, unsubscribe: find(UNSUB), unsubscribeLink: unsubLinked, address: find(ADDRESS), privacy: find(PRIVACY), preferences: find(PREFS), unsubscribeElsewhere: elsewhere(UNSUB), addressElsewhere: elsewhere(ADDRESS) };
    } else fr.em28 = 'no footer found';
    headings.sort((a, b) => a.y - b.y);
    const levels = headings.map(h => h.level).filter(Boolean);
    const skips = []; let prev = 0;
    for (const h of headings) { if (!h.level) continue; if (h.level > prev + 1 && prev) skips.push('H' + prev + ' to H' + h.level + ' at ' + h.id); prev = h.level; }
    if (levels.length && levels[0] !== 1) skips.unshift('first heading is H' + levels[0]);
    fr.em23 = { h1: levels.filter(l => l === 1).length, headings: headings.slice(0, MAX_LIST), headingsTotal: headings.length, skips, styledWithoutLevel: styledHeadings.length, styledWithoutLevelEx: styledHeadings.slice(0, MAX_EX) };
    fr.em22 = { inline: inline.length, inlineUnderlined: inline.filter(l => l.underlined).length, inlineEx: inline.slice(0, MAX_EX), standalone: standalone.length, standaloneUnderlined: standalone.filter(l => l.underlined).length, standaloneEx: standalone.slice(0, MAX_EX) };
    // EM-24: every link and button label, so the agent can read them out of context
    const labels = [];
    for (const b of buttons.values()) { const t = b.findAllWithCriteria ? b.findAllWithCriteria({ types: ['TEXT'] })[0] : null; labels.push('button ' + b.id + ': ' + (t ? short(t.characters, 50) : '(no text layer)')); }
    for (const l of standalone) labels.push('link ' + l.id + ': ' + l.text);
    for (const l of inline) labels.push('inline ' + l.id + ': ' + l.text);
    fr.em24 = { labels: labels.slice(0, MAX_LIST), total: labels.length };
    fr.em18 = { headlineOutside: t18.headline.length, headlineEx: t18.headline.slice(0, MAX_EX), lineHeightOutside: t18.lineHeight.length, lineHeightEx: t18.lineHeight.slice(0, MAX_EX), centeredBody: t18.centered.length, centeredEx: t18.centered.slice(0, MAX_EX), longCaps: t18.caps.length, capsEx: t18.caps.slice(0, MAX_EX) };
    fr.em25 = dynamic;
    er.frames.push(fr);
  }
  out.emails.push(er);
}
// EM-17: families, whether each is web-safe, and anything in the scope that names a fallback
out.em17 = { families: [...fonts.entries()].map(([fam, v]) => ({ family: fam, webSafe: WEB_SAFE.includes(fam.toLowerCase()), layers: v.layers.size, styles: [...v.styles].slice(0, 6) })) };
// EM-17 and EM-27 also look outside the email frames, across the scope: a subject-line card or a caption can carry them
const scope = SCOPE_ID && !SCOPE_ID.startsWith('__') ? await figma.getNodeByIdAsync(SCOPE_ID) : null;
const pre = [], fallback = [], fallbackFrames = [], scopeTags = []; let scopeDynamic = 0, scopeFields = 0;
if (scope) {
  if (scope.type === 'PAGE') await scope.loadAsync(); else await loadPageOf(scope);
  const nodes = 'findAllWithCriteria' in scope ? scope.findAllWithCriteria({ types: ['FRAME', 'INSTANCE', 'GROUP', 'TEXT', 'RECTANGLE', 'SECTION', 'COMPONENT'] }) : [];
  for (const n of [scope, ...nodes]) {
    if (n.type === 'TEXT' && (PREHEADER.test(n.name) || PREHEADER.test(n.characters.slice(0, 40)))) pre.push('text ' + n.id + ' "' + short(n.name, 30) + '": ' + short(n.characters, 80));
    if (n.type === 'TEXT' && FALLBACK.test(n.characters) && fallback.length < MAX_EX) fallback.push('text ' + n.id + ': ' + short(n.characters, 100));
    if ((n.type === 'FRAME' || n.type === 'SECTION') && /fallback|web-?safe|arial|helvetica|georgia/i.test(n.name)) fallbackFrames.push(n.id + ' ' + short(n.name, 50));
    for (const x of notesOf(n)) {
      if (PREHEADER.test(x.text)) pre.push('note on ' + n.id + ' [' + x.cat + ']' + (x.suggestion ? ' (suggestion)' : '') + ': ' + short(x.text, 120));
      if (FALLBACK.test(x.text) && fallback.length < MAX_EX) fallback.push('note on ' + n.id + ' [' + x.cat + ']: ' + short(x.text, 100));
      if (x.kind === 'dynamic content') scopeDynamic++;
      if (x.kind === 'content model field') scopeFields++;
    }
    // EM-25 across the scope: a subject line on a card outside the frames can carry a merge tag, as TOFU's does
    if (n.type === 'TEXT') { const tags = n.characters.match(MERGE_TAG); if (tags) for (const g of tags) if (scopeTags.length < MAX_EX) scopeTags.push(n.id + ' ' + g); }
  }
}
out.em17.fallbackNotes = fallback; out.em17.framesShowingFallback = fallbackFrames.slice(0, MAX_EX);
out.em27 = { scope: scope ? scope.id : 'none given', found: pre.length, ex: pre.slice(0, MAX_EX) };
out.em25 = { scopeNotes: scopeDynamic, scopeFieldNotes: scopeFields, scopeTags }; // the whole scope, frames included
out.notes = { read: noteCount, matched };
out.ms = Date.now() - t0;
return out;
