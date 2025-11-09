export interface LoadedNotes {
    bpm: number;
    notes: {
        beat: number;
        notes: string[];
    }[];
    rawNotes: string;
 }

export interface NotesWithTime {
    noteCount: number;
    noteType: typeof NoteType[keyof typeof NoteType][];
    timeSec: number;
    timeFrame: number; // maybe int
    differenceMs: number;
    differenceFrame: number;
 }

export const NoteType = {
    tap: 'tap',
    hold: 'hold',
    slide: 'slide',
    break: 'break',
    ex: 'ex',
 } as const;