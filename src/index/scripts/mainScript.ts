import { loadSimaiData } from "./loadSimaiData.js";
import { calculateDifference } from "./difference.js";
function onClick(textarea: HTMLTextAreaElement) {
    const rawData = textarea.value;
    // preprocess data: remove newlines and spaces
    const data = rawData
        .replace(/(\r)?\n/g, '')
        .replace(/\s+/g, '');
    const notes = loadSimaiData(data);
    const differences = calculateDifference(notes);
    differences.forEach((note) => {
        console.log(`NoteIndex: ${note.index}`);
        console.log(data.slice(note.index, note.index + note.eachNote.length));
    });
    console.log("clicked");
    console.log(notes);
    console.log(differences);
}

export function main(button: HTMLButtonElement, textarea: HTMLTextAreaElement) {
    button.addEventListener('click', () => {
        onClick(textarea);
    });
    // debug: auto click
    onClick(textarea);
}

