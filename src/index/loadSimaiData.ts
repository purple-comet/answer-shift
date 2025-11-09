import { type LoadedNotes } from "./types.js";
export function loadSimaiData (data: string) {
    // preprocess data: remove newlines and spaces
    const onelineData = data
    .replace(/(\r)?\n/g, '')
    .replace(/\s+/g, '');
    const bpmRegex = /\((\d+)\)([^(]+)/g;
    const notesByBpm: LoadedNotes[] = [];
    // extract notes grouped by BPM
    for (const match of onelineData.matchAll(bpmRegex)) {
        const rawNotes = match[2];
        const beatRegex = /\{(\d+)\}([^{]+)/g;
        const notesByBeat = [];
        // extract notes grouped by beat
        for (const beatMatch of rawNotes.matchAll(beatRegex)) {
            notesByBeat.push({
                beat: Number(beatMatch[1]),
                notes: beatMatch[2].split(',').slice(0, -1), // remove last empty element
            });
        }
        notesByBpm.push({
            bpm: Number(match[1]),
            notes: notesByBeat,
            rawNotes: match[2],
        });
    }
    return notesByBpm
}