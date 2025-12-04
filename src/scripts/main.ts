import { loadSimaiData } from "./loadSimaiData.js";
import { calculateDifference } from "./calculateDifference.js";
import { NoteType, type NotesWithTime } from "../types.js";
import { cleanUpInput } from "./utils.js";
import { exportCsv } from "./exportCsv.js";

let difference: NotesWithTime[] = [];

function loadSimaiAndCalcDiff(
    textarea: HTMLTextAreaElement,
    offsets:{ bpm: HTMLInputElement; count: HTMLInputElement; center: HTMLInputElement }
) {
    // preprocess data: remove newlines and spaces
    const data = cleanUpInput(textarea.value);
    const notes = loadSimaiData(data);
    console.log("Offset inputs:", offsets);
    const preOffset = Number(offsets.count.value) * (3600 / Number(offsets.bpm.value));
    console.log("Calculated offset:", preOffset);
    const centerOffset = Number(offsets.center.value);
    difference = calculateDifference(notes, preOffset, centerOffset);
    console.log("loaded notes:", notes);
    console.log("calculated difference:", difference);
}

function showResult(
    textarea: HTMLTextAreaElement, 
    tableBody: HTMLTableSectionElement, 
    breakCheckbox: HTMLInputElement
) {
    const processedSectionStart = cleanUpInput(textarea.value.slice(0, textarea.selectionStart)).length;
    const processedSectionEnd = cleanUpInput(textarea.value.slice(0, textarea.selectionEnd)).length;
    console.log("selection in processed data:", processedSectionStart, processedSectionEnd);

    const foundNotes: NotesWithTime[] = [];
    for (let i = 0; i < difference.length; i++) {
        const note = difference[i];
        const nextNote = breakCheckbox.checked ? difference.find((n) => n.noteType.includes(NoteType.break) && n.index > note.index) : difference[i + 1];
        if (breakCheckbox.checked && !note.noteType.includes(NoteType.break)) continue;
        if (foundNotes.some((n) => n.trueTimeFrame === note.trueTimeFrame)) continue;

        let isIndexInRange: boolean = false;
        if (processedSectionStart === processedSectionEnd) 
        {
            isIndexInRange = note.index <= processedSectionStart && processedSectionStart <= (nextNote?.index ?? Infinity);
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
        <tr class=" ${note.noteType.includes(NoteType.break) ? 'bg-red-200 hover:bg-red-300' : 'hover:bg-gray-100'}">
            <td class="px-4 py-3 text-gray-700">${note.noteCount}</td>
            <td class="px-4 py-3 text-gray-700 font-mono text-sm">${note.eachNote}</td>
            <td class="px-4 py-3 text-gray-700">${note.differenceFrame === 0 ? '  ' : note.differenceFrame < 0 ? '- ' : '+ '}${(Math.round(1000 * Math.abs(note.differenceFrame)) / 1000).toFixed(3)}</td>
        </tr>
        `;
    }
    tableBody.innerHTML = bodyHtml !== '' ? bodyHtml : `
    <tr class="hover:bg-gray-50">
        <td class="px-4 py-3 text-gray-700">--</td>
        <td class="px-4 py-3 text-gray-700">--</td>
        <td class="px-4 py-3 text-gray-700">--</td>
    </tr>
    `;

}

export function main(
    radios: { edit: HTMLInputElement; select: HTMLInputElement }, 
    offsets: { bpm: HTMLInputElement; count: HTMLInputElement; center: HTMLInputElement },
    textarea: HTMLTextAreaElement,
    tableBody: HTMLTableSectionElement,
    breakCheckbox: HTMLInputElement,
    csvButton: HTMLButtonElement,
) {
    for (const input of [offsets.bpm, offsets.count, offsets.center]) {
        input.addEventListener('input', () => {
            loadSimaiAndCalcDiff(textarea, offsets);
            showResult(textarea, tableBody, breakCheckbox);
        });
    }
    // モード切り替え
    radios.edit.addEventListener('change', () => {
        if (radios.edit.checked) {
            textarea.readOnly = false;
        }
    });
    radios.select.addEventListener('change', () => {
        if (radios.select.checked) {
            textarea.readOnly = true;
            loadSimaiAndCalcDiff(textarea, offsets);
            showResult(textarea, tableBody, breakCheckbox);
        }
    });
    // テキストエリアの入力検知して計算
    textarea.addEventListener('selectionchange', () => {
        loadSimaiAndCalcDiff(textarea, offsets);
        showResult(textarea, tableBody, breakCheckbox);
    });

    breakCheckbox.addEventListener('change', () => {
        loadSimaiAndCalcDiff(textarea, offsets);
        showResult(textarea, tableBody, breakCheckbox);
    });
    
    // CSV出力機能
    csvButton.addEventListener('click', () => exportCsv(tableBody));
}

