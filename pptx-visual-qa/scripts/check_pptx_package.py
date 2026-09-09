#!/usr/bin/env python3
"""Structural check of a .pptx package, complementary to a render.

    check_pptx_package.py deck.pptx

Verifies the four things that must agree after any structural edit:
  1. every <p:sldId r:id> in ppt/presentation.xml resolves in presentation.xml.rels
  2. every slide part those relationships name exists in the archive
  3. every slide part in the archive is reachable from the slide list
  4. every part has a [Content_Types].xml override or a matching default

and lists ORPHANED PARTS: anything in ppt/ that no .rels file references.
That last check is the one the pptx skill's clean.py does not cover for
ppt/comments/commentN.xml, and an orphaned comment part makes the schema
validator report the deck as corrupt. Remove the part and its override.

Also reports comments and non-empty speaker notes, because both are content a
reviewer cares about and a slide-text extraction misses.

Exit code 0 when clean, 1 when anything needs attention. Read-only.
"""
import re
import sys
import zipfile
import posixpath


def rels_targets(z, rels_path):
    """Return {rId: absolute-part-path} for one .rels file."""
    if rels_path not in z.namelist():
        return {}
    base = posixpath.dirname(posixpath.dirname(rels_path))  # strip "_rels"
    out = {}
    for m in re.finditer(r'<Relationship\b([^>]*)/?>', z.read(rels_path).decode("utf-8", "replace")):
        attrs = dict(re.findall(r'(\w+)="([^"]*)"', m.group(1)))
        if attrs.get("TargetMode") == "External":
            continue
        tgt = attrs.get("Target", "")
        out[attrs.get("Id", "")] = posixpath.normpath(posixpath.join(base, tgt)).lstrip("/")
    return out


def main(path):
    z = zipfile.ZipFile(path)
    names = set(z.namelist())
    problems = []

    pres = z.read("ppt/presentation.xml").decode("utf-8", "replace")
    sld_ids = re.findall(r'<p:sldId\b[^>]*r:id="(rId\d+)"', pres)
    pres_rels = rels_targets(z, "ppt/_rels/presentation.xml.rels")

    # 1 + 2: list -> rels -> parts
    ordered_slides = []
    for rid in sld_ids:
        tgt = pres_rels.get(rid)
        if not tgt:
            problems.append(f"sldId {rid} has no relationship in presentation.xml.rels")
            continue
        if tgt not in names:
            problems.append(f"sldId {rid} -> {tgt} is missing from the archive")
            continue
        ordered_slides.append(tgt)

    # 3: parts -> list
    slide_parts = sorted(n for n in names if re.fullmatch(r"ppt/slides/slide\d+\.xml", n))
    unlisted = [s for s in slide_parts if s not in ordered_slides]
    for s in unlisted:
        problems.append(f"{s} exists but is not in <p:sldIdLst> (clean.py would delete it)")

    # 4: content types
    ct = z.read("[Content_Types].xml").decode("utf-8", "replace")
    overrides = set(re.findall(r'<Override\b[^>]*PartName="/([^"]+)"', ct))
    defaults = set(e.lower() for e in re.findall(r'<Default\b[^>]*Extension="([^"]+)"', ct))
    for n in sorted(names):
        if n.endswith("/") or n == "[Content_Types].xml" or n.endswith(".rels"):
            continue
        ext = n.rsplit(".", 1)[-1].lower() if "." in n else ""
        if n not in overrides and ext not in defaults:
            problems.append(f"{n} has neither a Content_Types override nor a default for .{ext}")

    # orphans: every ppt/ part must be referenced by some .rels
    referenced = set()
    for rels in (n for n in names if n.endswith(".rels")):
        referenced.update(rels_targets(z, rels).values())
    orphans = sorted(
        n for n in names
        if n.startswith("ppt/") and not n.endswith("/") and not n.endswith(".rels")
        and n not in referenced and n != "ppt/presentation.xml"
    )
    for o in orphans:
        problems.append(f"ORPHANED PART (unreferenced by any .rels): {o}")

    # content a slide-text extraction misses
    comments = sorted(n for n in names if re.fullmatch(r"ppt/comments/comment\d+\.xml", n))
    notes_with_text = []
    for n in sorted(x for x in names if re.fullmatch(r"ppt/notesSlides/notesSlide\d+\.xml", x)):
        txt = " ".join(re.findall(r"<a:t>(.*?)</a:t>", z.read(n).decode("utf-8", "replace")))
        txt = re.sub(r"[\s‹#›\d]", "", txt)
        if txt:
            notes_with_text.append(n)

    print(f"{path}")
    print(f"  slides in list: {len(sld_ids)}   slide parts: {len(slide_parts)}   order: {', '.join(s.split('/')[-1] for s in ordered_slides)}")
    print(f"  comment parts: {len(comments)}" + (f"  <- read these: {', '.join(c.split('/')[-1] for c in comments)}" if comments else ""))
    print(f"  notes slides with real text: {len(notes_with_text)}" + (f"  ({', '.join(n.split('/')[-1] for n in notes_with_text)})" if notes_with_text else ""))
    if problems:
        print(f"  {len(problems)} problem(s):")
        for p in problems:
            print(f"    - {p}")
        return 1
    print("  package structure: OK")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
