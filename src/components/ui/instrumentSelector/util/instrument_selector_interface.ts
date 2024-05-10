import * as Tone from "tone";

export interface ILoadedInstrument {
  [key: string]: Tone.Player;
}

export interface IInstrument {
  url: string;
  name: string;
  group: string;
}

export interface IInstrumentStore {
  selectedIns: IInstrument;
  loadedInstrument: ILoadedInstrument;
  handleDragStart: (
    e: React.DragEvent<HTMLLIElement>,
    instrument: IInstrument
  ) => void;
  loadAudio: () => void;
  setLoadedInstrument: (loadedInstrument: ILoadedInstrument) => void;
}
