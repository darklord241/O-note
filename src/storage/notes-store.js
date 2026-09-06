import Dexie from "dexie";

const db = new Dexie("DsaNotesDB");

db.version(1).stores({
    notes: "[site+questionId], site, questionId, updatedAt"
});

export async function getNote(site, questionId) {
    const record =  await db.notes.get({ site, questionId });
    return record ?? null;
}

export async function saveNote(site, questionId, noteData) {
    const existing = await getNote(site, questionId);
    const labelChanged = noteData.label !== undefined && noteData.label !== existing?.label?.text;

    const record = {
        site,
        questionId,
        label: {
            text: noteData.label ?? existing?.label?.text ?? "",
            updatedAt: labelChanged ? Date.now() : (existing?.label?.updatedAt ?? null)
        },
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

