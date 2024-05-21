import * as Tone from "tone";

export interface ITopToolbar {
  bpm: number;
  analyzer: null | Tone.Analyser;
  noteValue: string;
  handleBpm: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNoteValue: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
