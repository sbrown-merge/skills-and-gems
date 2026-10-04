"""Copy each tested script into its marked code block in SKILL.md, or check that they match.

SKILL.md marks each block with a line `<!-- script: NN-name.js -->` directly above a ```javascript fence.
Usage, from merge-build-readiness/:  python3 scripts/sync_skill.py          (writes SKILL.md)
                                     python3 scripts/sync_skill.py --check  (exits 1 if any block is stale)
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKILL = ROOT / "SKILL.md"
# The body can never contain a fence, so a match can't run from one block into the next
BLOCK = re.compile(r"(<!-- script: (?P<name>[\w.-]+\.js) -->\n```javascript\n)(?P<body>(?:(?!```).)*)(```)", re.S)


def render(text: str) -> tuple[str, list[str]]:
    missing = []

    def swap(m: re.Match) -> str:
        path = ROOT / "scripts" / m.group("name")
        if not path.exists():
            missing.append(m.group("name"))
            return m.group(0)
        return m.group(1) + path.read_text().rstrip("\n") + "\n" + m.group(4)

    return BLOCK.sub(swap, text), missing


def main() -> int:
    text = SKILL.read_text()
    new, missing = render(text)
    if missing:
        print("No script file for: " + ", ".join(missing))
        return 1
    if "--check" in sys.argv:
        if new != text:
            print("SKILL.md is out of step with scripts/; run python3 scripts/sync_skill.py")
            return 1
        print("SKILL.md matches scripts/")
        return 0
    SKILL.write_text(new)
    print(f"Synced {len(BLOCK.findall(new))} script blocks into SKILL.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
