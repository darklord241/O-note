import { getSettings, updateSettings } from "../settings/settings.js";

async function init() {
    const settings = await getSettings();
    console.log("settings loaded:", settings);
    const inputs = document.querySelectorAll("[data-path]");

    inputs.forEach(input => {
        const keys = input.dataset.path.split(".");
        // this is the place where you are checking the storage structure values to the DOM elements
        input.checked = keys.length === 1 ? settings[keys[0]] : settings[keys[0]][keys[1]];
    });

    function applyDependencies() {
        inputs.forEach(input => {
            const dependsOn = input.dataset.dependsOn;
            // if there is no dependency and it is inidividual feature like export then return 
            if (!dependsOn) return;
            const parentInput = document.querySelector(`[data-path="${dependsOn}"]`);
            input.disabled = !parentInput.checked;
        });
    }
    applyDependencies();

    inputs.forEach(input => {
        input.addEventListener("change", () => {
            updateSettings(input.dataset.path, input.checked);
            applyDependencies(); // re-check disabled states after every change
        });
    });
}
init();