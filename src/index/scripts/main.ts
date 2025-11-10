import { loadSimaiData } from "./loadSimaiData.js";
import { calculateDifference } from "./calculateDifference.js";
import { NoteType, type NotesWithTime } from "../types.js";
import { cleanUpInput } from "./utils.js";
import { exportCsv } from "./exportCsv.js";

let difference: NotesWithTime[] = [];

function loadSimaiAndCalcDiff(textarea: HTMLTextAreaElement) {
    const rawData = textarea.value;
    // preprocess data: remove newlines and spaces
    const data = cleanUpInput(rawData);
    const notes = loadSimaiData(data);
    difference = calculateDifference(notes);
    difference.forEach((note) => {
        console.log(`NoteIndex: ${note.index}`);
        console.log(data.slice(note.index, note.index + note.eachNote.length));
    });
    console.log("clicked");
    console.log(notes);
    console.log(difference);
}

function showResult(textarea: HTMLTextAreaElement, tableBody: HTMLTableSectionElement, breakCheckbox: HTMLInputElement) {
    const processedSectionStart = cleanUpInput(textarea.value.slice(0, textarea.selectionStart)).length;
    const processedSectionEnd = cleanUpInput(textarea.value.slice(0, textarea.selectionEnd)).length;
    console.log("selection in processed data:", processedSectionStart, processedSectionEnd);

    const foundNotes: NotesWithTime[] = [];
    for (let i = 0; i < difference.length; i++) {
        const note = difference[i];
        const nextNote = difference[i + 1];
        if (breakCheckbox.checked && !note.noteType.includes(NoteType.break)) continue;
        if (foundNotes.some((n) => n.trueTimeFrame === note.trueTimeFrame)) continue;

        let isIndexInRange: boolean = false;
        if (processedSectionStart === processedSectionEnd) 
        {
            isIndexInRange = note.index <= processedSectionStart && processedSectionStart < nextNote?.index;
        } 
        else 
        {
            isIndexInRange = processedSectionStart <= note.index && note.index <= processedSectionEnd;
        }

        if (!isIndexInRange) continue;
        foundNotes.push(note);
    }
    console.log("found notes:", foundNotes)
    let bodyHtml = ''; 
    for (const note of foundNotes) {
        bodyHtml += `
        <tr>
            <td>${note.noteCount}</td>
            <td>${note.eachNote}</td>
            <td>${note.differenceFrame === 0 ? '  ' : note.differenceFrame < 0 ? '- ' : '+ '}${(Math.round(1000 * Math.abs(note.differenceFrame)) / 1000).toFixed(3)}</td>
        </tr>
        `;
    }
    tableBody.innerHTML = bodyHtml;

}

export function main(
    radios: { edit: HTMLInputElement; select: HTMLInputElement }, 
    textarea: HTMLTextAreaElement,
    tableBody: HTMLTableSectionElement,
    breakCheckbox: HTMLInputElement,
    csvButton: HTMLButtonElement,
) {
    // モード切り替え
    radios.edit.addEventListener('change', () => {
        if (radios.edit.checked) {
            textarea.readOnly = false;
        }
    });
    radios.select.addEventListener('change', () => {
        if (radios.select.checked) {
            textarea.readOnly = true;
            loadSimaiAndCalcDiff(textarea);
        }
    });
    // テキストエリアの入力検知して計算
    textarea.addEventListener('keyup', () => {
        console.log("keyup detected");
        loadSimaiAndCalcDiff(textarea);
        showResult(textarea, tableBody, breakCheckbox);
    });
    // クリックで選択範囲のノートを抽出して表示
    textarea.addEventListener('click', () => showResult(textarea, tableBody, breakCheckbox));
    breakCheckbox.addEventListener('change', () => showResult(textarea, tableBody, breakCheckbox));
    
    // CSV出力機能
    csvButton.addEventListener('click', () => exportCsv(tableBody));
    
    // debug: auto click
    loadSimaiAndCalcDiff(textarea);
}

