import Dexie from "dexie";

const db = new Dexie("DsaNotesDB");

db.version(1).stores({
    notes: "[site+questionId], site, questionId, updatedAt"
});

db.version(2).stores({
    notes: "[site+questionId], site, questionId, updatedAt, *labels"
}).upgrade(tx => {
    return tx.table('notes').toCollection().modify(note => {
        note.labels = note.label?.text ? [note.label.text] : [];
        delete note.label;
    })
});

export async function getNote(site, questionId) {
    const record =  await db.notes.get({ site, questionId });
    return record ?? null;
}

export async function saveNote(site, questionId, noteData) {
    const existing = await getNote(site, questionId);
    
    const record = {
        site,
        questionId,
        labels: noteData.labels ?? existing?.labels ?? [],
        content: noteData.content,
        updatedAt: Date.now(),
        createdAt: noteData.createdAt ?? existing?.createdAt ?? Date.now()
    };
    await db.notes.put(record);
    return record;    
}

export async function deleteNote(site, questionId) {
    await db.notes.delete([ site, questionId ]);
}

export async function getAllNotes() {
    return await db.notes.toArray();
}

export async function importNotes(records) {
    await db.notes.bulkPut(records);
}