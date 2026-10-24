# Dalex Studio mockup

[Open the interactive mockup](https://danielvaughan.github.io/dalex-studio-mockup/)

A 1987 Manchester game-development office, presented as a 640 × 480 point-and-click adventure UI.

- Click the wall board, then a milestone card to see its detail.
- Use Go Back or Escape to return.
- Click Mo or Gareth for talking gestures.
- Use Pause Motion / Play Motion or A to toggle character animation.
- Demo Update moves a sample card; no GitHub ticket is changed.

This is a browser concept, not a compiled ScummVM game. It contains illustrative records, generated concept artwork and small animated gestures over painted characters. It has no live GitHub connection, AI service, microphone or speech audio. The issue link opens the source project's issues page, not an individual sample ticket.

The current visual prototype still uses the earlier Fix / Gate / Media Kit stage labels. The intended lifecycle is Design → Assets → Build → Verify → Playtest → Sign-off → Release (including media kit) → independent Magazine review; updating the prototype to that lifecycle is pending.

## Hosting

GitHub Pages publishes the root of `main`. `.nojekyll` keeps this a plain static site. No build step or dependencies are needed. Open `index.html` locally or serve this directory with any static server.

## Artwork

The original room and board concept art were generated for this project. Characters are based on the Dalex cast; the rear worker is provisional. All interface text and animation render on native-resolution canvases. This is an independent project, not an official ScummVM release.
