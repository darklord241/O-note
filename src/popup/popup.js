import { getAllNotes, importNotes } from "../storage/notes-store.js"; 
import { exportMd, exportJson } from "../storage/export.js";
import { getSettings } from "../settings/settings.js";

const noteCount = document.getElementById("note-count");
const exportBtnMd = document.getElementById("export-btn-md");
const exportBtnJson = document.getElementById("export-btn-json");
const importBtn = document.getElementById("import-btn");
const importFile = document.getElementById("import-file-input");

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
        importBtn.addEventListener("click", () => importFile.click());
        importFile.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if(!file) return;

            importBtn.disabled = true;
            try {
                const text = await file.text();
                const parsedText = JSON.parse(text);
                await handleImport(parsedText);
            } catch(err) {
                console.error("import failed : ", err);
                alert("Couldn't read that file — is it a valid DSA Notes backup?");
            } finally {
                importFile.value = "";
                importBtn.disabled = false;
            }
        })
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

function validateBackup(parsed) {
    if(!parsed || typeof parsed !== "object") return { valid: false, reason: "Not a valid JSON object" };
    if(parsed.format !== "dsa-notes-backup") return { valid: false, reason: "This is not a valid DSA notes backup file " };
    if(parsed.version !== 1) return { valid: false, reason: `Unsupported backup version ${parsed.version}` };
    if(!Array.isArray(parsed.data)) return { valid: false, reason: "Backup data has malformed" };
    return { valid: true };
}

async function handleImport(parsed) {
    const result = validateBackup(parsed);
    if(!result.valid) {
        alert(result.reason);
        return;
    }

    const confirmed = confirm(
        `This backup contains ${parsed.data.length} notes (created at ${new Date(parsed.createdAt).toLocaleString()}).\n\n
        Existing notes with matching questions will be overwritten. Continue ?`
    );
    if(!confirmed) return;

    await importNotes(parsed.data);
    alert("Import complete");
    await loadNoteCount();
}

init();