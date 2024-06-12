export interface IPianoStore {
  notes: string[];

  generateNotes: () => string[];
  calculateTotalDuration: (
    bpm: number,
    timeSignature: string,
    width: number
  ) => number;
}

export interface INoteStatus {
  [note: string]: INoteValue[];
}

export interface INoteValue {
  noteValue: string;
  x: number;
  duration: number;
  id: string;
  width: number;
}
