# O(note)

A Chromium browser extension for taking notes on DSA questions <br>
Detects when you're on a single question page (LeetCode or Codeforces) <br>
Supports Markdown notes, labels, autosave, export/import, and browsing all saved notes in one place.

## Features

- Detects question pages on LeetCode and Codeforces
- Take notes directly on the question page
- Markdown editing with live preview
- Autosaves notes with a debounced save
- Labels for organizing notes
- Draggable, resizable, and collapsible notes panel
- Keyboard shortcuts for toggling the panel and switching between edit/preview mode
- Export notes to Markdown
- Export and import notes as JSON backups
- View, search, filter, and sort all saved notes from the View page
- Search highlighting for matching text

## Requirements

- [Node.js](https://nodejs.org/) (includes npm) — only needed if you want to build from source
- A Chromium-based browser (Chrome, Brave, Edge, etc.)

## Installing without building

If you'd rather not build from source, download a pre-built zip from the
(have to updates still so just use the dist directory uploaded) [Releases page](https://github.com/darklord241/O-note/releases):

1. Download the zip for the version you want.
2. Extract it:
   - **Windows**: right-click the zip → **Extract All**
   - **macOS**: double-click the zip — Finder extracts it into a new folder automatically
   - **Linux**: `unzip <file>.zip -d <folder>`

## Setup (build from source)

```bash
npm install
npm run build
```

This produces a `dist/` folder — the actual loadable extension.

## Loading into the browser

1. Open `chrome://extensions`
2. Enable **Developer mode** (toggle, top-right)
3. Click **Load unpacked**
4. Select the `dist/` folder or unzipped folder
5. Open a question page, e.g. `https://leetcode.com/problems/two-sum/`
   or `https://codeforces.com/problemset/problem/2256/A`

## Using O(note)

When you open a supported question page, O(note) detects the question and
provides a floating notes panel.

Use the panel to write and save notes while solving the problem. Notes are
autosaved and stored locally in the extension's IndexedDB database.

The extension popup provides quick access to:

- Your current note count
- Markdown export
- JSON export/import
- The **View all notes** page

The View page lets you search through saved notes and filter them by site or
label. Notes can also be sorted by when they were last updated.

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Alt + L` | Toggle the panel open/closed. Opening focuses the note and moves the cursor to the end of existing text (or the start, for a fresh question). |
| `Alt + K` | Switch between edit mode (raw markdown) and preview mode (rendered). |

Shortcuts can be changed at `chrome://extensions/shortcuts`.

## Inspecting stored notes

Notes are stored in IndexedDB, owned by the extension's background
service worker.

1. Go to `chrome://extensions`
2. Click the **"service worker"** link on this extension's card
3. In the DevTools window that opens, go to **Application → IndexedDB → DsaNotesDB → notes**

You will **not** see note data under a LeetCode or Codeforces tab's own
Application panel — IndexedDB opened from a page is scoped to that page's
origin, not the extension. The service worker is the one place with a
consistent view of all stored notes across every supported site.

## Supported Sites

- LeetCode
- Codeforces
