import { type LoadedNotes, type NotesWithTime, type NoteType } from "./types.js";
import { loadSimaiData } from "./loadSimaiData.js";

function calculateDifference() {
    
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

