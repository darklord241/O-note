import { getAllNotes } from "../storage/notes-store.js";

let allNotes = [];
const noteCount = document.getElementById("note-count");
const notesContainer = document.getElementById("notes-container");
const siteFilter = document.getElementById("site-filter");
const labelFilter = document.getElementById("label-filter");
const searchFilter = document.getElementById("search-input");

function createNoteCard(note) {
    const noteCard = document.createElement("div");
    noteCard.className = "note-card";
    noteCard.innerHTML = `
        <div class="note-card-header">
            <div class="note-title">${note.questionId}</div>
            <div class="note-site ${note.site}">${note.site}</div>
        </div>
        <div class="note-labels">
            ${note.labels.map(label => `
                <span class="note-label">${label}</span>
            `).join("")}
        </div>
        <div class="note-content">${note.note}</div>
        <div class="note-meta">
            <span>Updated: ${new Date(note.updatedAt).toLocaleString()}</span>
            <button class="open-question-btn">Open Question →</button>
        </div>
    `;
    return noteCard;
}

function renderNotes(notes) {
    notesContainer.innerHTML = "";
    notes.forEach(note => {
        notesContainer.appendChild(createNoteCard(note));
    });
}

function applyFilters() {
    const selectedSite = siteFilter.value;
    const selectedLabel = labelFilter.value;
    const searchInput = searchFilter.value;

    let filteredNotes = allNotes;

    if(selectedSite !== "all") {
        filteredNotes = filteredNotes.filter(note => {
            return note.site === selectedSite;
        });
    }

    if(selectedLabel !== "all") {
        filteredNotes = filteredNotes.filter(note => {
            return note.labels.includes(selectedLabel);
        });
    }

    if(searchInput !== "") {
        filteredNotes = filteredNotes.filter(note => {
            return note.questionId.toLowerCase().includes(searchInput.toLowerCase()) || 
                note.note.toLowerCase().includes(searchInput.toLowerCase()) ||
                note.labels.some(label => label.toLowerCase().includes(searchInput.toLowerCase()));
        });
    }

    renderNotes(filteredNotes);
}

async function renderPage() {
    allNotes = await getAllNotes();
    noteCount.textContent = allNotes.length;
    applyFilters();
    siteFilter.addEventListener("change",applyFilters);
    labelFilter.addEventListener("change",applyFilters);
    searchFilter.addEventListener("input",applyFilters);
}

renderPage();