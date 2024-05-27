import { IInstrument } from "../../instrumentSelector/util/instrument_selector_interface";
import * as Tone from "tone";
import type { IEffector } from "../../shared/modal/components/effector/util/effector_controller_interface";
export interface IStep {
  id: string;
  isChecked: boolean;
}

export interface ITrack {
  trackName: string;
  id: string;
  patterns: IPadPattern[];
  totalDuration: number;
  effector?: IEffector;
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

  handlePadPlay: () => void;
  handleEffector: (effectorIndex: number) => void;
}
