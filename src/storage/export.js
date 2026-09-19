function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function slugToTitle(slug) {
    return slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export async function generateChecksum(data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));

    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

function downloadFile(content, type, filename) {
    const blob = new Blob([content], { type: `application/${type};charset=utf-8`});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function buildMd(records) {
    const grouped = {};
    for(const record of records) {
        if(!grouped[record.site]) grouped[record.site] = [];
        grouped[record.site].push(record);
    }

    const exportDate = formatDate(Date.now());
    let output = `# DSA Notes Export\n*Exported on : ${exportDate}* \n\n---\n\n`;
    const sites = Object.keys(grouped).sort();

    for(const site of sites) {
        output += `# ${slugToTitle(site)}\n\n`;

        const notes  = grouped[site].sort((a,b) => 
            a.questionId.localeCompare(b.questionId)
        );

        for(const note of notes) {
            const title = slugToTitle(note.questionId);
            const lastUpdatedAt = formatDate(note.updatedAt);
            output += `### ${title}\n`;
            output += `*Last Updated: ${lastUpdatedAt}*\n\n`;
            output += `${note.content.trim()}\n\n`;
            output += `---\n\n`;
        }
    }
    return output;
}

export function exportMd(allRecords) {
    const mdText = buildMd(allRecords);
    const datestamp = new Date().toLocaleDateString('en-IN');
    downloadFile(mdText, "markdown",`dsa-notes-export-${datestamp}.md`);
}

export async function buildJson(records) {
    return JSON.stringify({
        format: "dsa-notes-backup",
        version: 1,
        createdAt: Date.now(),
        checksumAlgorithm: "SHA-256",
        checksum: await generateChecksum(records),
        data: records
    },null,2);
}

export async function exportJson(allRecords) {
    const jsonText = await buildJson(allRecords);
    const datestamp = new Date().toLocaleDateString('en-IN');
    downloadFile(jsonText, "json", `dsa-notes-export-${datestamp}.json`);
}