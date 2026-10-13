"""Build merge-email-check for Figma's agent and for Claude Code from one source, and check that the two agree.

What it reads, all relative to merge-email-check/:
  skill.toml     the version, the check IDs, the scripts, and each version's settings
  templates/     figma.md and claude-code.md, the skeleton of each version's SKILL.md
  shared/        text both versions carry word for word, pulled in with {{> name}}
  scripts/       the readable, commented scripts, the only copy anyone edits

What it writes:
  figma/SKILL.md            one file for Figma's agent: shared text inlined, each {{script NAME}} replaced by the
                            script minified (comments and spare whitespace removed, nothing renamed), because Figma
                            limits a skill's instructions to 65,536 characters
  claude/SKILL.md           the Claude Code hub, with shared text inlined
  claude/scripts/*.js       copies of the readable scripts, so the installed folder is complete on its own
  claude/references/*.md    copies of the reference files named in skill.toml, with relative links reduced to their text
  and, in place, the marked script blocks (`<!-- script: NN-name.js -->` above a ```javascript fence) in any skill
  listed under [[inplace]], such as merge-email-check-annotate.

{{version}} anywhere in a template or shared file becomes the version in skill.toml.

Usage, from merge-email-check/:
  uv run --no-project --with rjsmin python scripts/sync_skill.py            (builds everything)
  uv run --no-project --with rjsmin python scripts/sync_skill.py --check    (exits 1 if anything is stale or out of step)
  uv run --no-project --with rjsmin python scripts/sync_skill.py --install  (builds, then copies claude/ to the install path)
"""
import pathlib
import re
import shutil
import sys
import tomllib

import rjsmin

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
CONFIG = tomllib.loads((ROOT / "skill.toml").read_text())

INCLUDE = re.compile(r"^\{\{> ([\w-]+)\}\}", re.M)
SCRIPT = re.compile(r"^\{\{script ([\w.-]+\.js)\}\}$", re.M)
CHECK_ID = re.compile(r"\bEM-\d{2}\b")
LOCAL_LINK = re.compile(r"\[([^\]]+)\]\((?!https?:|#)[^)]+\)")
# The body can never contain a fence, so a match can't run from one block into the next
BLOCK = re.compile(r"(<!-- script: (?P<name>[\w.-]+\.js) -->\n```javascript\n)(?P<body>(?:(?!```).)*)(```)", re.S)


def minified(name: str) -> str:
    return rjsmin.jsmin((HERE / name).read_text()).strip()


def instructions_length(text: str) -> int:
    # Figma counts the instructions, which is everything after the frontmatter
    return len(text.split("---", 2)[2]) if text.startswith("---") else len(text)


def expand(template: str, scripts_inline: bool) -> str:
    text = INCLUDE.sub(lambda m: (ROOT / "shared" / f"{m.group(1)}.md").read_text().rstrip("\n"), template)
    if scripts_inline:
        text = SCRIPT.sub(lambda m: "```javascript\n" + minified(m.group(1)) + "\n```", text)
    elif SCRIPT.search(text):
        raise SystemExit("the Claude Code template must name script files in prose, not with {{script}}")
    return text.replace("{{version}}", CONFIG["version"])


def build() -> dict[pathlib.Path, str]:
    """Every file this tool owns, with the content it should have."""
    out: dict[pathlib.Path, str] = {}
    fig, cla = CONFIG["figma"], CONFIG["claude"]
    out[ROOT / fig["output"]] = expand((ROOT / fig["template"]).read_text(), scripts_inline=True)
    out[ROOT / cla["output"]] = expand((ROOT / cla["template"]).read_text(), scripts_inline=False)
    claude_dir = (ROOT / cla["output"]).parent
    for name in CONFIG["scripts"]:
        out[claude_dir / "scripts" / name] = (HERE / name).read_text()
    for name in cla.get("references", []):
        # Relative links would point at maintainers' files the installed skill doesn't have, so keep only their text
        out[claude_dir / "references" / name] = LOCAL_LINK.sub(r"\1", (ROOT / name).read_text())
    for entry in CONFIG.get("inplace", []):
        path = (ROOT / entry["skill"]).resolve()
        out[path] = BLOCK.sub(lambda m: m.group(1) + minified(m.group("name")) + "\n" + m.group(4), path.read_text())
    return out


def agreement(files: dict[pathlib.Path, str]) -> list[str]:
    """Problems that make the two versions disagree with each other or with skill.toml."""
    problems = []
    fig = files[ROOT / CONFIG["figma"]["output"]]
    cla = files[ROOT / CONFIG["claude"]["output"]]
    want = CONFIG["checks"]
    glance = (ROOT / "checklist.md").read_text().split("## All checks at a glance", 1)[1].split("\n## ", 1)[0]
    sources = {
        "shared/checks.md": (ROOT / "shared" / "checks.md").read_text(),
        "checklist.md (All checks at a glance)": glance,
    }
    for label, text in sources.items():
        found = list(dict.fromkeys(re.findall(r"\*\*(EM-\d{2})|^\| (EM-\d{2})", text, re.M)))
        found = [a or b for a, b in found]
        # checklist.md lists checks by number; the skill's own list must match skill.toml's order exactly
        same = found == want if label.startswith("shared") else sorted(found) == sorted(want)
        if not same:
            problems.append(f"{label} lists checks {found}, but skill.toml lists {want}")
    for label, text in (("figma", fig), ("claude", cla)):
        if f"merge-email-check {CONFIG['version']}" not in text:
            problems.append(f"{label}/SKILL.md doesn't name version {CONFIG['version']}")
        missing = [c for c in want if c not in set(CHECK_ID.findall(text))]
        if missing:
            problems.append(f"{label}/SKILL.md never mentions {', '.join(missing)}")
    for name in CONFIG["scripts"]:
        if f"scripts/{name}" not in cla:
            problems.append(f"claude/SKILL.md never names scripts/{name}")
    for entry in CONFIG.get("inplace", []):
        path = (ROOT / entry["skill"]).resolve()
        if instructions_length(files[path]) > CONFIG["figma"]["budget"]:
            problems.append(f"{path.parent.name}/SKILL.md is over our budget")
    size = instructions_length(fig)
    if size > CONFIG["figma"]["budget"]:
        over = "Figma's limit" if size > CONFIG["figma"]["limit"] else "our budget"
        problems.append(f"figma/SKILL.md is {size:,} characters, over {over}")
    lines = len(cla.split("---", 2)[2].splitlines())
    if lines > CONFIG["claude"]["max_lines"]:
        problems.append(f"claude/SKILL.md body is {lines} lines, over {CONFIG['claude']['max_lines']}")
    return problems


def main() -> int:
    check, install = "--check" in sys.argv, "--install" in sys.argv
    files = build()
    problems = agreement(files)
    stale = [p for p, text in files.items() if not p.exists() or p.read_text() != text]
    claude_dir = (ROOT / CONFIG["claude"]["output"]).parent
    owned = {p for p in files if claude_dir in p.parents}
    strays = [p for p in claude_dir.rglob("*") if p.is_file() and p not in owned] if claude_dir.exists() else []
    if check:
        problems += [f"{p.relative_to(ROOT.parent)} is out of step with its source; run sync_skill.py" for p in stale]
        problems += [f"{p.relative_to(ROOT.parent)} isn't built by this tool; remove it or add it to skill.toml" for p in strays]
    else:
        for path, text in files.items():
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
        for path in strays:
            path.unlink()
    size = instructions_length(files[ROOT / CONFIG["figma"]["output"]])
    lines = len(files[ROOT / CONFIG["claude"]["output"]].split("---", 2)[2].splitlines())
    verb = "checked" if check else "built"
    print(f"{CONFIG['name']} {CONFIG['version']}: {verb} figma/SKILL.md ({size:,} of {CONFIG['figma']['budget']:,} characters) "
          f"and claude/ ({lines} lines, {len(CONFIG['scripts'])} scripts)")
    for entry in CONFIG.get("inplace", []):
        path = (ROOT / entry["skill"]).resolve()
        print(f"{path.parent.name}: {verb}; instructions {instructions_length(files[path]):,} characters")
    for problem in problems:
        print("  problem: " + problem)
    if install and not check and not problems:
        target = pathlib.Path(CONFIG["claude"]["install"]).expanduser()
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(claude_dir, target)
        print(f"installed claude/ to {target}")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
