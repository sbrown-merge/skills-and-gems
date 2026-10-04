"""Copy each tested script, minified, into its marked code block in the skill files, or check that they match.

A skill file marks each block with a line `<!-- script: NN-name.js -->` directly above a ```javascript fence.
The scripts in scripts/ are the readable, commented source; the skill files carry them minified (comments and spare
whitespace removed, nothing renamed), because Figma limits a skill's instructions to 65,536 characters.
Usage, from merge-build-readiness/:
  uv run --no-project --with rjsmin python scripts/sync_skill.py          (writes the skill files)
  uv run --no-project --with rjsmin python scripts/sync_skill.py --check  (exits 1 if a block is stale or a skill is too long)
"""
import pathlib
import re
import sys

import rjsmin

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
SKILLS = [ROOT / "SKILL.md", ROOT.parent / "merge-build-readiness-test" / "SKILL.md"]
FIGMA_LIMIT = 65536  # Figma's upload dialog: "Instructions must be 65536 characters or fewer" (2026-10-04)
BUDGET = 61000  # our own ceiling: about 4,500 characters under the limit, for fixes after test mode
# The body can never contain a fence, so a match can't run from one block into the next
BLOCK = re.compile(r"(<!-- script: (?P<name>[\w.-]+\.js) -->\n```javascript\n)(?P<body>(?:(?!```).)*)(```)", re.S)


def minified(name: str) -> str:
    return rjsmin.jsmin((HERE / name).read_text()).strip()


def render(text: str, missing: list[str]) -> str:
    def swap(m: re.Match) -> str:
        if not (HERE / m.group("name")).exists():
            missing.append(m.group("name"))
            return m.group(0)
        return m.group(1) + minified(m.group("name")) + "\n" + m.group(4)

    return BLOCK.sub(swap, text)


def instructions_length(text: str) -> int:
    # Figma counts the instructions, which is everything after the frontmatter
    return len(text.split("---", 2)[2]) if text.startswith("---") else len(text)


def main() -> int:
    check = "--check" in sys.argv
    failed = False
    for skill in SKILLS:
        if not skill.exists():
            continue
        text = skill.read_text()
        missing: list[str] = []
        new = render(text, missing)
        if missing:
            print(f"{skill.parent.name}: no script file for " + ", ".join(missing))
            failed = True
            continue
        size = instructions_length(new)
        note = "over Figma's limit" if size > FIGMA_LIMIT else "over our budget" if size > BUDGET else "within budget"
        if size > BUDGET:
            failed = True
        if check:
            if new != text:
                print(f"{skill.parent.name}: SKILL.md is out of step with scripts/")
                failed = True
            else:
                print(f"{skill.parent.name}: matches scripts/; instructions {size:,} characters, {note}")
        else:
            skill.write_text(new)
            print(f"{skill.parent.name}: synced {len(BLOCK.findall(new))} script blocks; instructions {size:,} characters, {note}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
