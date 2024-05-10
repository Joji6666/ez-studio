import { IInstrument } from "../../instrumentSelector/util/instrument_selector_interface";

export interface IStep {
  id: string;
  isChecked: boolean;
}

export interface ITrack {
  trackName: string;
  id: string;
  patterns: IPadPattern[];
}

export interface IPadPattern {
  id: string;
  instrument: IInstrument;
  steps: IStep[];
}

export interface IPadStore {
  trakcs: ITrack[];
  steps: number;

  selectedTrack: string;
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
}
