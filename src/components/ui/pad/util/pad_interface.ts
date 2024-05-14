import { IInstrument } from "../../instrumentSelector/util/instrument_selector_interface";
import * as Tone from "tone";
export interface IStep {
  id: string;
  isChecked: boolean;
}

export interface ITrack {
  trackName: string;
  id: string;
  patterns: IPadPattern[];
  totalDuration: number;
}

export interface IPadPattern {
  id: string;
  instrument: IInstrument;
  steps: IStep[];
}

export interface IPadStore {
  tracks: ITrack[];
  steps: number;
  selectedTrackId: string;
  selectedTrack: ITrack;
  noteValue: string;
  padSequence: Tone.Sequence<number> | undefined;
  isPadPlaying: boolean;
  initPad: () => void;
  addTrack: () => void;

  handleCheck: (
    trackIndex: number,
    patternIndex: number,
    stepIndex: number
  ) => void;
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    trackIndex: number,
    patternIndex: number
  ) => void;
  handleTrackSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleNoteValue: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handlePadPlay: () => void;
}
