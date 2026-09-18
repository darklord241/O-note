### checklist for now
- serializeDatabase() — pulls getAllNotes(), wraps in { format: "dsa-notes-backup", version: 1, createdAt, data: notes }
- Export button (or extend existing export.js) → downloads that JSON via the same Blob pattern you already have working for markdown
- importDatabase(file) — parse, check format/version, show a simple confirm() (native browser dialog is fine for v1, don't build custom diff-preview yet) with note count, then db.notes.bulkPut(...) inside a transaction
- Test it: export → clear a test note → import → confirm it's back
<br>
- **Do modularize the popup.js cuz it is getting crowded with many unrelated function definitions and calls** 

### commit 1 in feature/export-import branch
- basically i made another button for export as json while separating the formatting in a such manner that it is to import it back into the db 
- made a common `downloadFile()` func so that it can handle both json and md file downloads
- the settings.export toggle works on both type of exports meaning i havent individually added settings for them yet 

### commit 2 : import done 
- one more button and input element where the button calls the input element of file type only 
- this input element has a `accept=".json"` attribute which is a UI features for filtering json files within the system and does not restrict the files of other types 
- due to the gap shown above the `typeof parsed !== object` in `validateBackup()` func works together with `JSON.parse(text)` to indicate if the given file added is of type json or not and this is the actual gate 
- `e.target.files[0]` in the change event listener of import input can be described as follows :
    - `e` : the change 
    - `e.target`: DOM element on which the event happened which the file input element here 
    - `e.target.files[]` : files is a special property that exists specifically on file-type inputs: it's a FileList — plural, because <input type="file"> supports selecting multiple files at once if you add the multiple attribute (which yours doesn't).
    - hence `files[0]` is used to take the first file only 

