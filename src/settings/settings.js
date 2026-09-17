const DEFAULT_SETTINGS = {
    labelInput: {
        enabled: true,
        toggleButton: true
    },
    mdRender: {
        enabled: true,
        shortcut: true,        // Alt+K manual toggle
        autoRenderOnPause: true // automatic preview after typing pause
    },
    togglePanelShortcut: true,   // standalone, no children — stays a flat boolean
    export: true,                 // standalone, no children
    sites: {
        leetcode: true,
        codeforces: true
    }
};

export async function getSettings() {
    const stored = await chrome.storage.sync.get("settings");
    const storedSettings = stored.settings || {};
    const merged = {};

    for(const key in DEFAULT_SETTINGS) {
        const defaultVal = DEFAULT_SETTINGS[key];
        const isGroup = typeof defaultVal === "object" && defaultVal !== null;
        merged[key] = isGroup ? { ...defaultVal, ...storedSettings[key] }:(storedSettings[key] !== undefined?storedSettings[key]:defaultVal);
    }
    return merged;
}

export async function updateSettings(path, value) {
    const current = await getSettings();
    const keys = path.split(".");

    if(keys.length === 1) {
        current[keys[0]] = value
    }
    else {
        const [group, key] = keys;
        current[group][key] = value
    }

    await chrome.storage.sync.set({ settings: current});
}