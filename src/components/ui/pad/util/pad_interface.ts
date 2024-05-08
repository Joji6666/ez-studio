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
  id: string;
  instrument: IInstrument;
  steps: IStep[];
}

export interface IPadStore {
  trakcs: ITrack[];
  steps: number;
  loadedInstrument: ILoadedInstrument;
  initPad: () => void;
  addTrack: () => void;
  setLoadedInstrument: (loadedInstrument: ILoadedInstrument) => void;
  handleCheck: (trackIndex: number, stepIndex: number) => void;
}
