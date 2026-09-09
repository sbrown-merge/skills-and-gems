#!/bin/zsh
# Render every slide of a .pptx (or .key) to images using scripted Keynote.
#
#   render_pptx.sh /abs/path/deck.pptx /abs/path/outdir [png|jpeg]
#
# Why Keynote: on this Mac there is no LibreOffice, no pdftoppm and no PyObjC,
# so the LibreOffice->PDF->pdftoppm route in most skills cannot run. Keynote
# opens .pptx natively and exports slide images by AppleScript.
#
# Why the launch step: a cold `tell application "Keynote"` intermittently fails
# with -600 "Application isn't running". Launching first and waiting fixes it.
#
# Output: outdir/<basename-of-outdir>.001.<ext>, .002.<ext>, ... in slide order.
# Prints the absolute paths so they can be passed straight to an image viewer.

set -e
set -o pipefail

if [[ $# -lt 2 ]]; then
  echo "usage: $0 /abs/path/deck.pptx /abs/path/outdir [png|jpeg]" >&2
  exit 2
fi

src="$1"
out="$2"
fmt="${3:-png}"

if [[ ! -f "$src" ]]; then echo "no such file: $src" >&2; exit 1; fi
case "$src" in /*) ;; *) echo "source must be an absolute path (AppleScript needs one): $src" >&2; exit 1;; esac
case "$out" in /*) ;; *) echo "output dir must be an absolute path: $out" >&2; exit 1;; esac
case "$fmt" in
  png)  asfmt="PNG" ;;
  jpeg|jpg) asfmt="JPEG" ; fmt="jpeg" ;;
  *) echo "format must be png or jpeg" >&2; exit 1 ;;
esac

# Keynote creates the directory itself and refuses one that already exists.
rm -rf "$out"
mkdir -p "$(dirname "$out")"

# The load-bearing step.
open -a Keynote
sleep 3

# `close ... saving no` keeps Keynote from writing a .key next to the source.
osascript <<AS
set src to POSIX file "$src"
set dst to POSIX file "$out"
tell application "Keynote"
	set doc to open src
	delay 3
	export doc to dst as slide images with properties {image format:$asfmt, compression factor:0.9, skipped slides:false}
	close doc saving no
end tell
return "exported"
AS

n=$(ls -1 "$out" | wc -l | tr -d ' ')
echo "$n slides -> $out"
ls -1 "$out"/* | sort
