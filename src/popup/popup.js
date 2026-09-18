import { getAllNotes } from "../storage/notes-store.js"; 
import { exportMd, exportJson } from "../storage/export.js";
import { getSettings } from "../settings/settings.js";

const noteCount = document.getElementById("note-count");
const exportBtnMd = document.getElementById("export-btn-md");
const exportBtnJson = document.getElementById("export-btn-json");

let cachedNotes = [];
let settings = null;

async function init() {
    settings = await getSettings();
    await loadNoteCount();

    if(settings?.export) {
        exportBtnMd.addEventListener("click", () => {
            if(cachedNotes.length === 0) return;

            // this boolean change prevents repeated button clicks from firing the exportAllNotes function while one is still running 
            exportBtnMd.disabled = true;
            exportBtnMd.textContent = "Exporting started";
            try {
                exportMd(cachedNotes);
            } 
            catch (err) {
                console.error("failed to export notes", err);
            }
            finally {
                exportBtnMd.textContent = "Export to Md";
                exportBtnMd.disabled = false;
            }
        });
        exportBtnJson.addEventListener("click", () => {
            if(cachedNotes.length === 0) return;

            // this boolean change prevents repeated button clicks from firing the exportAllNotes function while one is still running 
            exportBtnJson.disabled = true;
            exportBtnJson.textContent = "Exporting started";
            try {
                exportJson(cachedNotes);
            } 
            catch (err) {
                console.error("failed to export notes", err);
            }
            finally {
                exportBtnJson.textContent = "Export to Json";
                exportBtnJson.disabled = false;
            }
        });
    }
    else {
        exportBtnMd.disabled = true;
        exportBtnJson.disabled = true;
    }
}

async function loadNoteCount() {
    try {
        cachedNotes = await getAllNotes();
        const count = cachedNotes.length;

        if(count === 0) {
            noteCount.textContent = "Go solve some questions first da";
            exportBtnMd.disabled = true;
            exportBtnJson.disabled = true;
        }
        else {
            noteCount.textContent = `${count} note${count === 1 ? "" : "s"} saved`;
            exportBtnMd.disabled = false;
            exportBtnJson.disabled = false;
        }
    }
    catch (err) {
        // console.error("failed to load notes", err);
        noteCount.textContent = "errorara";
        exportBtnMd.disabled = true;
        exportBtnJson.disabled = true;
    }
}

init();