# Dalex Studio mockup

[Play the public demo](https://danielvaughan.com/dalex-studio-mockup/)

A native 640 × 480 adventure-style interface for a 1987 Manchester games studio.

- Click the cassette shelf at the back left, then a cassette cover to play its Spectrum game.
- Archived media-kit builds: Mower Mayhem M6, Antigravity M4, Tiger Gorilla M4. Artwork and tapes come from matching kits; tape SHA-256 is checked before loading.
- Click the game picture for keyboard input. Controls appear beside the screen. For Tiger Gorilla select 2 (keyboard), then Space. Wait for the game's title screen before starting.
- Pause, sound, restart (two clicks) and Back are pixel controls. Escape returns to the library. Leaving or switching tabs pauses emulation and releases keys. Reopening the same cassette resumes it.
- Click the rear computer to reopen the selected game. Its room screen retains the last game frame.
- Click Ken's leather ledger on the left desk for four accounts pages. These figures are **sample API estimates**, not private accounts or actual bills. STALE demonstrates an outage.
- Click Percy for his character detail. His new native sprites follow the owner's photographic reference.
- Click the production board, then a card. Demo Update moves a sample milestone between Playtest and Sign-off. The eight stages end in Release and independent Magazine review.
- Pause Motion / Play Motion or A toggles ambient animation; A belongs to the Spectrum game during play.

## Native assets

All visible text and controls render into a 640 × 480 canvas using bitmap glyphs.
The complete bordered JSSpeccy picture is 320 × 240, shown without cropping inside a Microvitec Cub 14-inch RGB monitor sprite (360 × 304).
Percy's cells are 40 × 32; ledger states 64 × 40; cassette cases 24 × 40; loose tape 56 × 32.
See `sprites/manifest.json` for sizes and palette limits, and `library/manifest.json` for game/art provenance.
Generated scenery remains concept art; this is not a compiled ScummVM game or a verified indexed room palette.

## Hosting

GitHub Pages publishes the root of `main`; `.nojekyll` disables Jekyll. No build step is needed.
For local play use an HTTP server (for example `python3 -m http.server 8000`), rather than opening a file URL.
No Python bridge, live GitHub connection, private ledger, microphone or AI service is required by this public demo.

## Emulator and source

JSSpeccy 3.2 by Matt Westcott is GPL-3.0. Its [license](jsspeccy/COPYING), bundled notices,
[Studio patches](jsspeccy/PATCH.md), [source notes](jsspeccy/SOURCE.md),
[upstream source archive](jsspeccy/source-v3.2.tar.gz) and
[patched source archive](jsspeccy/source-studio.tar.gz) are included beside the runnable emulator.
[Upstream project](https://github.com/gasman/jsspeccy3).
The emulator and ROM/tape-loader assets are reused from the existing Studio playtest harness.

This independent concept is not an official ScummVM release. The original Percy photograph is not part of this public repository.
