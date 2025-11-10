export interface LoadedNote {
    bpm: number;
    beat: number;
    note: string;
    index: number;
 }

export interface NotesWithTime extends LoadedNote {
    noteCount: number;
    noteType: typeof NoteType[keyof typeof NoteType][];
    eachNote: string;
    trueTimeFrame: number;
    actualTimeFrame: number; // maybe int
    differenceFrame: number;
    trueTimeSec: number;
    actualTimeSec: number;
    differenceMs: number;
 }

export const NoteType = {
    tap: 'tap',
    each: 'each',
    hold: 'hold',
    slide: 'slide',
    break: 'break',
    ex: 'ex',
 } as const;