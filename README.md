# Word Builder: Listen and Spell

A static, no-build English spelling game for kids. The child hears a word, then drags (or taps) letters into the answer slots. Pure HTML, CSS and vanilla JavaScript.

## Run locally
Browsers block `fetch()` on `file://`, so serve the folder:
```
cd wordbuilder
python3 -m http.server 8000     # then open http://localhost:8000
```

## Deploy on GitHub Pages
1. Create a repository and upload all files (keep `index.html` at the root).
2. Repository **Settings → Pages → Build and deployment**: Source "Deploy from a branch", Branch `main`, folder `/ (root)`.
3. Open `https://<user>.github.io/<repo>/`. All paths are relative, so subdirectory hosting works.

## Files
`index.html`, `styles.css`, `app.js` (game) · `admin.html`, `admin.js` (word editor) · `common.js` (shared logic) · `data/words.json` (word library) · `assets/audio/`, `assets/images/`.

## Adding words
**Option A (edit file):** add an entry to `data/words.json`:
```json
{"word":"FROG","category":"Animals","level":3,"audio":"assets/audio/frog.mp3","image":"assets/images/frog.png","sentence":"The frog can jump.","notes":"","active":true}
```
**Option B (admin panel, `admin.html`):** add/edit/delete/duplicate, search, filter, preview, import and export. Then **Export JSON** and replace `data/words.json` in the repository to publish for everyone.

Levels: 1 = easy 3-letter, 2 = more 3-letter, 3 = 4-letter, 5 = custom. Level 4 mixes levels 1-3 automatically. Slots and tiles are generated from the word: four tiles always appear (required letters + distractors). Repeated letters (EGG) show a ×2 badge. Words with more than 4 different letters (PLANT) refresh the tiles as the child plays, so they stay solvable.

## Audio and images
Put recordings in `assets/audio/` (MP3/WAV) and reference them like `assets/audio/cat.mp3`. Store files in the repo rather than linking to outside URLs, which can disappear. No recordings are included. Without an audio file, the browser's speech voice (SpeechSynthesis) is used, and voice quality varies by device. Record short, clear clips for consistent pronunciation.

## Static hosting limits (important)
GitHub Pages has no server. The admin panel saves to **this browser's localStorage only**: other visitors do not see those changes, and clearing browser data removes them. The admin page is **not password protected**. To publish changes, export and commit `words.json`.
For true online administration you need a backend with authentication (for example Firebase Auth + Firestore with rules that allow writes only to your admin account, or Supabase with row-level security), plus file storage for audio. This project does not include one.

## Scoring
Defaults: 10 / 7 / 5 points and 3 / 2 / 1 stars for 1st / 2nd / later attempts, +3 bonus without hints. Points are editable in the admin panel (stored locally).

## Controls
Drag a tile to a slot, or tap a tile to fill the next slot. Tap a filled slot to remove it. Keyboard: type letters to place, Backspace to remove, Tab/Enter for buttons. Wrong answers clear only the wrong letters; the answer is never revealed early.

## Testing checklist
- [ ] Home loads, all levels with words are enabled
- [ ] Word plays on start (or the speaker prompt appears), replay works
- [ ] Slots match word length; four tiles show; EGG allows two G
- [ ] Drag, tap, keyboard placement; remove and Reset
- [ ] Wrong answer: gentle message, retry; Hint glows a tile
- [ ] Right answer: stars, points, confetti, word shown, Next
- [ ] Refresh keeps total stars and level bests
- [ ] Admin: add, edit, duplicate, delete, search, filter, import, export, preview, reset
- [ ] Phone width: no horizontal scroll; Calm animations toggle works
