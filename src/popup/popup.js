import { getAllNotes } from "../storage/notes-store.js"; 
import { getSettings } from "../settings/settings.js";
import { setupExportHandler } from "./handlers/export-handler.js";
import { setupImportHandler } from "./handlers/import-handler.js";

const noteCount = document.getElementById("note-count");
const exportBtnMd = document.getElementById("export-btn-md");
const exportBtnJson = document.getElementById("export-btn-json");
const importBtn = document.getElementById("import-btn");
const viewBtn = document.getElementById("view-html");

let cachedNotes = [];
let settings = null;

async function init() {
    settings = await getSettings();
    await loadNoteCount();

    viewBtn.addEventListener("click", () => {
        chrome.tabs.create({
            url: chrome.runtime.getURL("src/view/view.html")
        });
    });

    if(settings?.export) {
        setupExportHandler(cachedNotes);
        setupImportHandler(cachedNotes);
        importBtn.addEventListener("click", async () => { await loadNoteCount(); });
    }
    else {
        exportBtnMd.disabled = true;
        exportBtnJson.disabled = true;
        importBtn.disabled = true;
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