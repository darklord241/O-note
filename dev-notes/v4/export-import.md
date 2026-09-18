### checklist for now
- serializeDatabase() — pulls getAllNotes(), wraps in { format: "dsa-notes-backup", version: 1, createdAt, data: notes }
- Export button (or extend existing export.js) → downloads that JSON via the same Blob pattern you already have working for markdown
- importDatabase(file) — parse, check format/version, show a simple confirm() (native browser dialog is fine for v1, don't build custom diff-preview yet) with note count, then db.notes.bulkPut(...) inside a transaction
- Test it: export → clear a test note → import → confirm it's back

### commit 1 in feature/export-import branch
- basically i made another button for export as json while separating the formatting in a such manner that it is to import it back into the db 
- made a common `downloadFile()` func so that it can handle both json and md file downloads
- the settings.export toggle works on both type of exports meaning i havent individually added settings for them yet 