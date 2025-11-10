import { type LoadedNote } from "../types.js";
export function loadSimaiData (data: string) {
    const notesArray: LoadedNote[] = [];

    // bpm変化前後で音符の長さを保持するための変数
    let currentBeat = -1;

    // bpm変化・音符の長さに関する表記の長さを記録、index計算に使用
    let bpmChangeStringLength = 0;
    let beatChangeStringLength = 0;
    // extract notes grouped by BPM
    // bpmMatch[0]: whole match
    // bpmMatch[1]: bpm value
    // bpmMatch[2]: notes under this bpm
    const bpmRegex = /\((\d+(?:\.\d+)?)\)([^(]+)/g;
    for (const bpmMatch of data.matchAll(bpmRegex)) {
        const bpmIndex = bpmMatch.index!;
        const bpmNotes = bpmMatch[2];
        bpmChangeStringLength = bpmMatch[1].length + 2; // +2 for parentheses
        
        // extract notes grouped by beat
        // beatMatch[0]: whole match
        // beatMatch[1]: notes before beat change
        // beatMatch[2]: beat value
        // beatMatch[3]: notes after beat change
        const beatRegex = /([^){]*)\{(\d+(?:\.\d+)?)\}([^{]+)/g;
        for (const beatMatch of bpmNotes.matchAll(beatRegex)) {
            const beatIndex = beatMatch.index!;
            // handle notes before beat change
            if (currentBeat !== -1 && beatMatch[1].length > 0) {
                for (const match of beatMatch[1].matchAll(/([^,]*),/g)) {
                    notesArray.push({
                        bpm: Number(bpmMatch[1]),
                        beat: currentBeat,
                        note: match[1],
                        index: bpmIndex + bpmChangeStringLength + beatIndex + beatChangeStringLength + Number(match.index),
                    });
                }
            }
            currentBeat = Number(beatMatch[2]);
            beatChangeStringLength = beatMatch[2].length + 2; // +2 for braces
            // handle notes after beat change
            for (const match of beatMatch[3].matchAll(/([^,]*),/g)){
                notesArray.push({
                    bpm: Number(bpmMatch[1]),
                    beat: Number(beatMatch[2]),
                    note: match[1],
                    index: bpmIndex + bpmChangeStringLength + beatIndex + beatChangeStringLength + Number(match.index),
                });
            }
        }
    }
    return notesArray
}