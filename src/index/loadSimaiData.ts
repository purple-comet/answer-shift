import { type LoadedNote } from "./types.js";
export function loadSimaiData (data: string) {
    // preprocess data: remove newlines and spaces
    const onelineData = data
    .replace(/(\r)?\n/g, '')
    .replace(/\s+/g, '');
    const bpmRegex = /\((\d+)\)([^(]+)/g;
    const notesArray: LoadedNote[] = [];

    let currentBeat = -1;
    // extract notes grouped by BPM
    for (const bpmMatch of onelineData.matchAll(bpmRegex)) {
        console.log(bpmMatch)
        const bpmIndex = bpmMatch.index!;
        const rawNotes = bpmMatch[2];
        const beatRegex = /([^){]*)\{(\d+)\}([^{]+)/g;
        // extract notes grouped by beat
        
        for (const beatMatch of rawNotes.matchAll(beatRegex)) {
            console.log(beatMatch)
            const beatIndex = beatMatch.index!;
            if (currentBeat !== -1 && beatMatch[1].length > 0) {
                for (const [index, note] of beatMatch[1].split(',').slice(0, -1).entries()) {
                    notesArray.push({
                        bpm: Number(bpmMatch[1]),
                        beat: currentBeat,
                        note: note,
                        // TODO: simaiデータ全体で何文字目かのインデックスを計算する（今のロジックは間違い）
                        index: bpmIndex + beatIndex + Number(index),
                    });
                }
            }
            currentBeat = Number(beatMatch[2]);
            for (const [index, note] of beatMatch[3].split(',').slice(0, -1).entries())
            {
                notesArray.push({
                    bpm: Number(bpmMatch[1]),
                    beat: Number(beatMatch[2]),
                    note: note,
                    // TODO: simaiデータ全体で何文字目かのインデックスを計算する（今のロジックは間違い）
                    index: bpmIndex + beatIndex + Number(index),
                });
            }
        }
    }
    return notesArray
}