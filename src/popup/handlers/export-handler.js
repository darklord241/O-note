import { exportMd, exportJson } from "../../storage/export.js";

const exportBtnMd = document.getElementById("export-btn-md");
const exportBtnJson = document.getElementById("export-btn-json");

export function setupExportHandler(cachedNotes) {
    exportBtnMd.addEventListener("click", () => {
        if(cachedNotes.length === 0) return;

        // this boolean change prevents repeated button clicks from firing the exportAllNotes function while one is still running 
        exportBtnMd.disabled = true;
        exportBtnMd.textContent = "Exporting started";
        try {
            exportMd(cachedNotes);
        } catch (err) {
            console.error("failed to export notes", err);
        } finally {
            exportBtnMd.textContent = "Export to Md";
            exportBtnMd.disabled = false;
        }
    });
    exportBtnJson.addEventListener("click", async () => {
        if(cachedNotes.length === 0) return;

        // this boolean change prevents repeated button clicks from firing the exportAllNotes function while one is still running 
        exportBtnJson.disabled = true;
        exportBtnJson.textContent = "Exporting started";
        try {
            await exportJson(cachedNotes);
        } catch (err) {
            console.error("failed to export notes", err);
        } finally {
            exportBtnJson.textContent = "Export to Json";
            exportBtnJson.disabled = false;
        }
    });
}