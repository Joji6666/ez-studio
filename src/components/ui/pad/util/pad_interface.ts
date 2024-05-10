import * as Tone from "tone";

export interface IStep {
  id: string;
  isChecked: boolean;
}
export interface IInstrument {
  url: string;
  name: string;
  group: string;
}

export interface ILoadedInstrument {
  [key: string]: Tone.Player;
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
  loadedInstrument: ILoadedInstrument;
  selectedTrack: string;
  initPad: () => void;
  addTrack: () => void;
  setLoadedInstrument: (loadedInstrument: ILoadedInstrument) => void;
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
