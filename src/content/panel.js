import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
    // line breaks are properly converted to <br> 
    breaks: true,
    // github flavoured markdown 
    gfm: true,
});

let shadowHost = null;
let shadowRoot = null;
let panelElements = null;
let autosaveTimer = null;
let previewTimer = null;
let isCollapsed = true;

function slugToTitle(slug) {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function ensureShadowHost() {
    if(shadowHost) return shadowRoot;
    shadowHost = document.createElement("div");
    shadowHost.id = "dsanotes-host";
    document.body.appendChild(shadowHost);
    shadowRoot = shadowHost.attachShadow({ mode: "open" });
    
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = chrome.runtime.getURL("src/content/panel.css");
    shadowRoot.appendChild(styleLink);
    
    return shadowRoot;
}

function makeDraggable(panelEl, headerEl) {
  let startX, startY, startLeft, startTop;

  function onMouseDown(e) {
    if (e.target.closest(".collapse-btn")) return;

    startX = e.clientX;
    startY = e.clientY;
    const rect = panelEl.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;

    panelEl.style.right = "auto";
    panelEl.style.left = `${startLeft}px`;
    panelEl.style.top = `${startTop}px`;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e) {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    panelEl.style.left = `${startLeft + deltaX}px`;
    panelEl.style.top = `${startTop + deltaY}px`;
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  headerEl.addEventListener("mousedown", onMouseDown);
}

export function togglePanel() {
    if(!panelElements) return;
    const container = panelElements.container;
    const collapseBtn = container.querySelector(".collapse-btn");
    isCollapsed = !isCollapsed;
    container.classList.toggle("dsanotes-collapsed",isCollapsed);
    collapseBtn.textContent = isCollapsed ? "+":"-";

    // if it is not collapsed which means it has been toggled open 
    if(!isCollapsed) {
        const textarea = panelElements.textarea;
        // if it is not an existing note then move cursor to the panel to start typing 
        if(!textarea.value.trim()) {
            // this is same utility as the click listener on previewDiv present in renderPanel function 
            // basically moves to edit mode and also move the cursor to the panel to start typing
            showEditMode();
            focusCursor();
        }
    }
}

function showPreviewMode() {
    if(!panelElements) return;
    const textarea = panelElements.textarea;
    const previewDiv = panelElements.container.querySelector(".preview");

    function renderMarkdownSafely(text) {
        return DOMPurify.sanitize(marked.parse(text));
    }   

    if(!textarea.value.trim()) {
        panelElements.status.textContent = "Ntg to preview";
        setTimeout(() => {
            if(panelElements) panelElements.status.textContent = "";
        }, 1000);
        return; // nothing to render then stay in edit mode 
    }
    previewDiv.innerHTML = renderMarkdownSafely(textarea.value);
    textarea.style.display = 'none';
    previewDiv.style.display = 'block';
}

function focusCursor() {
    const textarea = panelElements.textarea;
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
}

function showEditMode() {
    if(!panelElements) return;
    const textarea = panelElements.textarea;
    const previewDiv = panelElements.container.querySelector(".preview");

    textarea.style.display = 'block';
    previewDiv.style.display = 'none';
}

export function toggleMode() {
    if(!panelElements) return;
    const textarea = panelElements.textarea;
    if(textarea.style.display === 'none') {
        showEditMode();
        focusCursor();
    }
    else {
        showPreviewMode();
    }
}

function buildPanelHtml(questionId) {
    return `
        <div class="dsanotes-header">
            <span class="dsanotes-title">${slugToTitle(questionId)}</span>
            <div class="dsanotes-header-controls">
                <span class="status"></span>
                <button class="collapse-btn">${isCollapsed ? "+":"-"}</button>
            </div>
        </div>
        <div class="dsanotes-body">
            <div class="label-wrapper">
                <div class="label-row">
                    <div class="label-chips"></div>
                    <button class="toggle-input-btn" type="button">+</button>
                </div>
                <input type="text" class="label-input" placeholder="add label" autocomplete="off" />
            </div>
            <textarea class="dsanotes-textarea" placeholder="write your notes"></textarea>
            <div class="preview" style="display:none;"></div>
            <div class="btns">
                <button class="save-btn">Save</button>
                <button class="dlt-btn">Delete</button>
            </div>
        </div>
    `;
}

function markdownPreview(container, note) {
    const textarea = container.querySelector(".dsanotes-textarea");
    const previewDiv = container.querySelector(".preview");

    if(previewTimer) {
        clearTimeout(previewTimer);
        previewTimer = null;
    }
    
    textarea.addEventListener("input",() => {
        showEditMode();
        if(previewTimer) clearTimeout(previewTimer);
        previewTimer = setTimeout(showPreviewMode, 2000);
    });

    // repositioning of cursor through mouse 
    textarea.addEventListener("click",() => {
        if(previewTimer) clearTimeout(previewTimer);
        previewTimer = setTimeout(showPreviewMode,2000);
    });

    // repositioning of cursor throught keyboard keys 
    textarea.addEventListener("keyup",(e) => {
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"].includes(e.key)) {
            if(previewTimer) clearTimeout(previewTimer);
            previewTimer = setTimeout(showPreviewMode,2000);
        }   
    })

    previewDiv.addEventListener("click",() => {
        showEditMode();
        focusCursor();
    });

    if(note?.content) {
        showPreviewMode();
    }
}

function labelFeature(container, note, doSave) {
        
    let currentLabels = [...(note?.labels ?? [])];
    let labelInputVisible = currentLabels.length === 0;

    const toggleInputBtn = container.querySelector(".toggle-input-btn");
    const chipContainer = container.querySelector(".label-chips");
    const labelInput = container.querySelector(".label-input");

    function updateLabelInputVisibility() {
        labelInput.style.display = labelInputVisible ? "block" : "none";
        toggleInputBtn.textContent = labelInputVisible ? "-" : "+";
    }
    updateLabelInputVisibility();

    function renderChips() {
        chipContainer.innerHTML = "";
        currentLabels.forEach(label => {
            const chip = document.createElement("span");
            chip.className = "label-chip";
            chip.textContent = label;

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "x";
            removeBtn.className = "label-chip-remove";
            removeBtn.addEventListener("click", () => {
                currentLabels = currentLabels.filter(l => l !== label);
                renderChips();
                doSave();
            });

            chip.appendChild(removeBtn);
            chipContainer.appendChild(chip);
        });
    }
    renderChips();

    labelInput.addEventListener("keydown", (e) => {
        if(e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const value = labelInput.value.trim().replace(",","");
            if(value && !currentLabels.some(l => l.toLowerCase() === value.toLowerCase())) {
                currentLabels.push(value);
                renderChips();
                labelInput.value = "";
                doSave();
            }
            else {
                labelInput.value = "";
            }
        }
    });

    toggleInputBtn.addEventListener("click", () => {
        labelInputVisible = !labelInputVisible;
        updateLabelInputVisibility();
        if(labelInputVisible) labelInput.focus();
    });

    return {
        getLabels: () => currentLabels
    };
}

export function renderPanel({ site, questionId, title, note, onSave, onDelete}) {
    // console.log("renderPanel called with", questionId, title);
    const root = ensureShadowHost();
    // console.log("root reference", root, "children count", root.children.length);
    const container = document.createElement("div");
    container.className = `dsanotes-panel${isCollapsed ? " dsanotes-collapsed" : ""}`;
    
    container.innerHTML = buildPanelHtml(questionId);

    const textarea = container.querySelector(".dsanotes-textarea");
    textarea.value = note?.content ?? "";

    const existing = root.querySelector(".dsanotes-panel");
    // console.log("existing panel found?", !!existing);
    if(existing) existing.remove();
    root.appendChild(container);
    // console.log("new panel appended");

    const header = container.querySelector(".dsanotes-header");
    const collapseBtn = container.querySelector(".collapse-btn");
    const saveBtn = container.querySelector(".save-btn");
    const status = container.querySelector(".status");
    const deleteBtn = container.querySelector(".dlt-btn");

    makeDraggable(container, header);

    function doSave() {
        status.textContent = "Saving ...";
        onSave( questionId, {
            content: textarea.value,
            createdAt: note?.createdAt,
            labels: labelController.getLabels()
        });
        panelElements.lastSavedContent = textarea.value;
    }

    function delNote() {
        status.textContent = "Deleting ...";
        onDelete(questionId);
    }

    if(autosaveTimer) {
        clearTimeout(autosaveTimer);
        autosaveTimer= null;
    }

    textarea.addEventListener("input", () => {
        const isUpdated = textarea.value !== panelElements.lastSavedContent;
        status.textContent = isUpdated ? "Unsaved" : "";

        if(autosaveTimer) clearTimeout(autosaveTimer);
        if(isUpdated) {
            autosaveTimer = setTimeout(doSave, 1000);
        }
    });        

    collapseBtn.addEventListener("click", togglePanel);

    deleteBtn.addEventListener("click", delNote);

    saveBtn.addEventListener("click", () => {
        if(autosaveTimer) clearTimeout(autosaveTimer);
        doSave();
    });

    const labelController = labelFeature(container,note,doSave);

    panelElements = { container, textarea, status, lastSavedContent: note?.content ?? "" };

    markdownPreview(container,note);
}

export function updatePanel(savedRecord) {
    if(!panelElements) return;
    panelElements.status.textContent = "Saved";

    setTimeout(() => {
        if(panelElements) panelElements.status.textContent = "";
    }, 1500);
}

export function removePanel() {
    if(!shadowHost) return;
    const existing = shadowRoot.querySelector(".dsanotes-panel");
    if(existing) existing.remove();
    panelElements = null;
    if(autosaveTimer) {
        clearTimeout(autosaveTimer);
        autosaveTimer = null;
    }
    if(previewTimer) {
        clearTimeout(previewTimer);
        previewTimer = null;
    }
}

export function clearPanel() {
    if(!panelElements) return;
    
    panelElements.textarea.value = "";
    panelElements.lastSavedContent = "";

    showEditMode();
    focusCursor();

    panelElements.status.textContent = "Deleted";
    setTimeout(() => {
        if(panelElements) panelElements.status.textContent = "";
    }, 1500); 
}