import { importNotes } from "../../storage/notes-store.js"; 
import { generateChecksum } from "../../storage/export.js";

const importBtn = document.getElementById("import-btn");
const importFile = document.getElementById("import-file-input");

let notesInDb = null;

export function setupImportHandler(cachedNotes) {
    notesInDb = cachedNotes;
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
    });
}

function validateBackup(parsed) {
    if(!parsed || typeof parsed !== "object") return { valid: false, reason: "Not a valid JSON object" };
    if(parsed.format !== "dsa-notes-backup") return { valid: false, reason: "This is not a valid DSA notes backup file " };
    if(parsed.version !== 1) return { valid: false, reason: `Unsupported backup version ${parsed.version}` };
    if(generateChecksum(notesInDb) === parsed.checksum ) return { valid: false, reason: "the notes in db are same as imported files"};
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
}