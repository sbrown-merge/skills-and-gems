// merge-email-check script 05: tap targets and the button list (read-only). Feeds EM-21, from merge-build-readiness
// script 09, applied to buttons and linked text, and EM-26 (data: every button and standalone link, top to bottom).
// Placeholders: __EMAILS__ (JSON: script 00's `emails`, as confirmed) and __SETTINGS__ (JSON, or null for MERGE's).
const EMAILS = __EMAILS__;
const SETTINGS = __SETTINGS__;
const t0 = Date.now();
// MERGE's house settings (checklist.md, "House settings"); a project overrides any of them through __SETTINGS__
const DEFAULTS = {
  tapTarget: 44, // D-7; Jill Redo's scorecard says 40
};
const S = Object.assign({}, DEFAULTS, SETTINGS || {});
const MIN = 24; // WCAG 2.2 SC 2.5.8, in CSS px: the floor for every project
const MAX_EX = 10; // examples per list, with a total beside each, to stay under use_figma's 20 KB return
const MAX_LIST = 40; // EM-26's list; a cap of 10 hid real items in merge-build-readiness
// Regexes live in named constants: rjsmin reads a regex literal straight after => as division and strips its spaces
// ("knock ?out" became "knock?out", 2026-10-05), so no arrow function may start with one.
const LINK_WORDS = /unsubscribe|opt[ -]?out|view (it )?in (your )?browser|view online|read (more|now)|learn more|click here|privacy|preferences|manage (your )?subscription|www\.|https?:|\.com\b/i;
const LINK_NAME = /\blink\b/i;
const BUTTON_NAME = /(^|[^a-z])(button|btn|cta)([^a-z]|$)/i;
const MAX_LABEL = 40, MAX_BUTTON_H = 80; // a button label is a few words; a filled card with one line of text is not a button
if (!Array.isArray(EMAILS)) return { error: 'EMAILS must be the JSON array script 00 returns as `emails`' };
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029); // separators that break regexes and JSON readers
const clean = s => String(s).split(LS).join(' / ').split(PS).join(' / ').replace(/\s*\n\s*/g, ' / ').trim();
const short = (s, n) => { s = clean(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const hex = c => '#' + [c.r, c.g, c.b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
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
// Compare layers by ID, never as objects: a layer inside an instance found by findAllWithCriteria isn't the same
// object as the one in its parent's children, so indexOf returned -1 and Set lookups missed it (2026-10-05).
const visibleIn = (n, frame) => { for (let p = n; p && p.id !== frame.id; p = p.parent) if (p.visible === false) return false; return true; };
const fillKey = fills => { const f = Array.isArray(fills) ? fills.find(p => p.visible !== false && p.type === 'SOLID') : null; return f ? hex(f.color) : 'none'; };
const loaded = new Set();
const out = { tapTarget: S.tapTarget, floor: MIN, emails: [] };
for (const e of EMAILS) {
  const er = { name: e.name, frames: [] };
  for (const f of e.frames || []) {
    const frame = await figma.getNodeByIdAsync(f.id);
    if (!frame) { er.frames.push({ id: f.id, error: 'not found' }); continue; }
    let page = frame; while (page.type !== 'PAGE') page = page.parent;
    if (!loaded.has(page.id)) { await page.loadAsync(); loaded.add(page.id); }
    // layers inside instances load lazily; touch them until the count settles (merge-build-readiness, 2026-10-05)
    for (let pass = 0, last = -1; pass < 4; pass++) { const inst = frame.findAllWithCriteria({ types: ['INSTANCE'] }); if (inst.length === last) break; last = inst.length; for (const i of inst) i.children.length; }
    const top = frame.absoluteBoundingBox.y;
    const targets = [], ids = new Set();
    const inside = n => { for (let p = n.parent; p && p.id !== frame.id; p = p.parent) if (ids.has(p.id)) return true; return false; };
    // Buttons, counted once at the outermost layer (findAllWithCriteria lists parents first)
    for (const c of frame.findAllWithCriteria({ types: ['FRAME', 'INSTANCE', 'COMPONENT', 'GROUP'] })) {
      if (!visibleIn(c, frame) || inside(c) || !isButton(c)) continue;
      const t = c.findAllWithCriteria({ types: ['TEXT'] })[0];
      ids.add(c.id); targets.push({ n: c, kind: 'button', label: t ? short(t.characters, 40) : '(no text layer)', fill: solidOf(c) ? hex(solidOf(c).color) : null });
    }
    // Standalone links: a whole text layer that is a link, found as script 03 finds them. A link inside a run of text
    // is an inline target, which WCAG 2.5.8 exempts, so it's counted but not sized.
    let inlineLinks = 0;
    for (const t of frame.findAllWithCriteria({ types: ['TEXT'] })) {
      if (!visibleIn(t, frame) || inside(t) || !t.characters.trim()) continue;
      const segs = t.getStyledTextSegments(['hyperlink', 'fills']);
      const allLinked = segs.every(s => s.hyperlink);
      const main = fillKey(segs[0].fills);
      const oneColor = segs.every(s => fillKey(s.fills) === main);
      const whole = allLinked || (oneColor && ((LINK_WORDS.test(t.characters) && t.characters.trim().length <= MAX_LABEL) || LINK_NAME.test(t.name)));
      if (whole) { ids.add(t.id); targets.push({ n: t, kind: 'link', label: short(t.characters, 40), fill: main }); }
      else if (segs.some(s => s.hyperlink) || !oneColor) inlineLinks++;
    }
    // Layers with a prototype interaction are targets too
    let prototypeLinks = 0;
    for (const n of frame.findAllWithCriteria({ types: ['FRAME', 'INSTANCE', 'GROUP'] })) {
      let has = false; try { has = !!(n.reactions && n.reactions.length); } catch (e) {}
      if (!has || !visibleIn(n, frame)) continue;
      prototypeLinks++;
      if (ids.has(n.id) || inside(n)) continue;
      ids.add(n.id); targets.push({ n, kind: 'prototype link', label: short(n.name, 40), fill: null });
    }
    for (const t of targets) t.b = t.n.absoluteBoundingBox;
    // EM-21: under 24px passes WCAG's spacing exception if a 24px circle centered on it overlaps no other target and no
    // other small target's circle (merge-build-readiness script 09); the house size is reported separately
    const center = b => ({ x: b.x + b.width / 2, y: b.y + b.height / 2 });
    const rectDist = (c, b) => Math.hypot(Math.max(b.x - c.x, 0, c.x - (b.x + b.width)), Math.max(b.y - c.y, 0, c.y - (b.y + b.height)));
    const small = targets.filter(t => t.b && (t.b.width < MIN || t.b.height < MIN));
    const under24 = [], crowded = [];
    for (const t of small) {
      const c = center(t.b);
      const o = targets.find(x => x !== t && x.b && (rectDist(c, x.b) < MIN / 2 || (small.includes(x) && Math.hypot(c.x - center(x.b).x, c.y - center(x.b).y) < MIN)));
      const row = t.kind + ' ' + t.n.id + ' (' + Math.round(t.b.width) + 'x' + Math.round(t.b.height) + ') ' + t.label;
      under24.push(row); if (o) crowded.push(row + ' crowds ' + o.n.id);
    }
    const underHouse = targets.filter(t => t.b && !small.includes(t) && (t.b.width < S.tapTarget || t.b.height < S.tapTarget));
    const list = targets.filter(t => t.b).sort((a, b) => a.b.y - b.b.y).map(t => ({ kind: t.kind, id: t.n.id, y: Math.round(t.b.y - top), w: Math.round(t.b.width), h: Math.round(t.b.height), label: t.label, fill: t.fill }));
    er.frames.push({
      id: frame.id, role: f.role, dark: !!f.dark, targets: targets.length, buttons: targets.filter(t => t.kind === 'button').length, links: targets.filter(t => t.kind === 'link').length, inlineLinks, prototypeLinks,
      under24: under24.length, under24Ex: under24.slice(0, MAX_EX), under24Crowded: crowded.length, under24CrowdedEx: crowded.slice(0, MAX_EX),
      underHouse: underHouse.length, underHouseEx: underHouse.slice(0, MAX_EX).map(t => t.kind + ' ' + t.n.id + ' (' + Math.round(t.b.width) + 'x' + Math.round(t.b.height) + ') ' + t.label),
      em26: list.slice(0, MAX_LIST), em26Total: list.length,
    });
  }
  out.emails.push(er);
}
out.ms = Date.now() - t0;
return out;
