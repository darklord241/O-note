import { getAllNotes } from "../storage/notes-store.js";

let allNotes = [];
const noteCount = document.getElementById("note-count");
const notesContainer = document.getElementById("notes-container");
const siteFilter = document.getElementById("site-filter");
const labelFilter = document.getElementById("label-filter");
const searchFilter = document.getElementById("search-input");
const sortFilter = document.getElementById("sort-filter");

function createNoteCard(note) {
    const searchInput = searchFilter.value;
    const noteCard = document.createElement("div");
    noteCard.className = "note-card";
    noteCard.innerHTML = `
        <div class="note-card-header">
            <div class="note-title">${searchInput === "" ? note.questionId : highlightMatch(note.questionId,searchInput)}</div>
            <div class="note-site ${note.site}">${note.site}</div>
        </div>
        <div class="note-labels">
            ${note.labels.map(label => `
                <span class="note-label">${searchInput === "" ? label : highlightMatch(label,searchInput)}</span>
            `).join("")}
        </div>
        <div class="note-content">${searchInput === "" ? note.content : highlightMatch(note.content,searchInput)}</div>
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
    const selectedSort = sortFilter.value;

    let filteredNotes = [...allNotes];

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
                note.content.toLowerCase().includes(searchInput.toLowerCase()) ||
                note.labels.some(label => label.toLowerCase().includes(searchInput.toLowerCase()));
        });
    }

    const compareDate = (x,y) => (x < y ? -1 : (x > y ? 1 : 0));

    if(selectedSort === "updated-desc") {
        filteredNotes = filteredNotes.sort((a,b) => compareDate(b.updatedAt,a.updatedAt));
    }

    if(selectedSort === "updated-asc") {
        filteredNotes = filteredNotes.sort((a,b) => compareDate(a.updatedAt,b.updatedAt));
    }

    renderNotes(filteredNotes);
}

function highlightMatch(text, target) {
    const escapedSearch = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedSearch, "gi");

    return text.replace(regex, match => {
        return `<span class="search-match">${match}</span>`;
    });
}

function populateLabelFilter() {
    const labels = new Set();

    allNotes.forEach(note => {
        note.labels.forEach(label => {
            labels.add(label);
        });
    });

    labels.forEach(label => {
        const option = document.createElement("option");
        option.value = label;
        option.textContent = label;
        labelFilter.appendChild(option);
    });
}

async function renderPage() {
    allNotes = await getAllNotes();
    noteCount.textContent = `Notes : ${allNotes.length}`;
    
    populateLabelFilter();
    applyFilters();
    
    siteFilter.addEventListener("change",applyFilters);
    labelFilter.addEventListener("change",applyFilters);
    searchFilter.addEventListener("input",applyFilters);
    sortFilter.addEventListener("change",applyFilters);
}

renderPage();