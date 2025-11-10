import { type LoadedNote, type NotesWithTime, NoteType } from "../types.js";

export function calculateDifference(loadedNotes: LoadedNote[], offset: number) {
    console.log(loadedNotes);
    const notesWithTime: NotesWithTime[] = [];
    let noteCount = 0;
    let currentFrame = offset;

    for (const noteItem of loadedNotes) {

        // 時刻情報を計算
        const trueTimeFrame = currentFrame
        const actualTimeFrame = Math.round(trueTimeFrame);
        const differenceFrame = actualTimeFrame - trueTimeFrame;
        // 空ノーツを処理（タイミング合わせのためだけのカンマ）
        if (noteItem.note === "") {
            // do nothing
        }
        // スラッシュなしタップのイーチを処理
        else if (noteItem.note.match(/^\d{2,}$/)) {
            noteCount += noteItem.note.length;
            for (const _ of noteItem.note) {
                notesWithTime.push({
                    bpm: noteItem.bpm,
                    beat: noteItem.beat,
                    noteCount: noteCount,
                    noteType: [NoteType.tap, NoteType.each],
                    note: noteItem.note,
                    eachNote: noteItem.note,
                    index: noteItem.index,
                    trueTimeFrame: currentFrame,
                    actualTimeFrame: actualTimeFrame,
                    differenceFrame: differenceFrame,
                    trueTimeSec: trueTimeFrame / 60,
                    actualTimeSec: actualTimeFrame / 60,
                    differenceMs: differenceFrame * (1000 / 60),
                });
            }
        } 
        else {
            // その他のノーツを処理
            // 単ノーツの場合は要素数1の配列になる
            const splitNotes = noteItem.note.split('/');
            noteCount += splitNotes.length;
            for (const splitNote of splitNotes) {
                const noteTypes: typeof NoteType[keyof typeof NoteType][] = [];
                // スラッシュで分割した各ノーツについて種類を判別
                if (splitNote.includes('x')) noteTypes.push(NoteType.ex);
                if (splitNote.includes('h')) noteTypes.push(NoteType.hold);
                if (splitNote.includes('b')) noteTypes.push(NoteType.break);
                if (splitNote.match(/[-\^v<>Vpqszw]/) !== null) {
                    noteTypes.push(NoteType.slide);
                    noteCount += (splitNote.match(/\*/g) || []).length + 1;
                }
                if (noteTypes.length === 0) noteTypes.push(NoteType.tap);
                notesWithTime.push({
                    bpm: noteItem.bpm,
                    beat: noteItem.beat,
                    noteCount: noteCount,
                    noteType: noteTypes,
                    note: splitNote,
                    eachNote: noteItem.note,
                    index: noteItem.index,
                    trueTimeFrame: currentFrame,
                    actualTimeFrame: actualTimeFrame,
                    differenceFrame: differenceFrame,
                    trueTimeSec: trueTimeFrame / 60,
                    actualTimeSec: actualTimeFrame / 60,
                    differenceMs: differenceFrame * (1000 / 60),
                });
            }
        }

        // 次のノーツの真の時刻を計算
        const nextTrueTimeFrame = currentFrame
            + (3600 / noteItem.bpm) * (4 / noteItem.beat);
        
        currentFrame = nextTrueTimeFrame;
    }
    return notesWithTime;
}

/* memo
必要なもの
- ノーツの種類
  - これはnoteItem.notesから判別
  - x: ex, h: hold, b: break, -^v<>Vpqszwppqq: slide

- ノーツが置かれてる真の時刻（フレーム, 60fps）
  - 四分音符一個あたりのフレーム数：(3600 / bpm)
  - 四分音符何個分か：(4 / noteItem.beat)
  - 計算式：(3600 / bpm) * (4 / noteItem.beat)
- ノーツが来る実際の時刻（フレーム）
  - ノーツがフレームに乗る関係上、四捨五入が必要
  - 上の真の時刻を四捨五入
- ノーツの差分（フレーム）
  - 上２つのフレーム時刻の差分

- 以下はフレーム数×60で計算可能
    - ノーツが置かれてる真の時刻（秒）
    - ノーツが来る実際の時刻（秒）
    - 上２つの時刻の差分（ミリ秒）
*/
