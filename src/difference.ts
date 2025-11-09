import { type LoadedNotes, type NotesWithTime, type NoteType } from "./types.js";

function calculateDifference() {

}

function loadSimaiData (data: string) {
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
export class Main {
    private button: HTMLButtonElement;
    private notes: any[] = [];
    // (number) in simai
    private currentBpm: number = -1;
    // {number} in simai
    private currentBeat: number = -1;
    private bpmChanges: {position: number, bpm: number}[] = [];
    private beatChanges: {position: number, beat: number}[] = [];
    private currentTime: number = -1;
    

    constructor() {
       this.button = document.querySelector('button')!;
       this.button.addEventListener('click', () => this.onClick());
       // debug: auto click
       this.onClick();
    }

    private onClick() {
        const textarea = document.querySelector('textarea')!;
        const data = textarea.value;
        const notes = loadSimaiData(data);
        console.log("clicked")
        console.log(notes);
        // const difference = calculateDifference();
        // console.log(difference);
    }
}

