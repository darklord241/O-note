import { getAllNotes } from "../storage/notes-store.js";

const noteCount = document.getElementById("note-count");
const notesContainer = document.getElementById("notes-container");

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

async function renderPage() {
    const allNotes = await getAllNotes();
    noteCount.textContent = allNotes.length;
    notesContainer.innerHTML = "";
    allNotes.forEach(note => {
        notesContainer.appendChild(createNoteCard(note));
    });
}

renderPage();