import { IInstrument } from "../../instrumentSelector/util/instrument_selector_interface";
import * as Tone from "tone";
import type { IEffector } from "../../shared/modal/components/effector/util/effector_controller_interface";
export interface IStep {
  id: string;
  isChecked: boolean;
}

export interface IPattern {
  patternName: string;
  id: string;
  instruments: IPatternInstrument[];
  totalDuration: number;
  effector?: IEffector;
}

export interface IPatternInstrument {
  id: string;
  instrument: IInstrument;
  steps: IStep[];
}

export interface IPadStore {
  patterns: IPattern[];
  steps: number;
  selectedPatternId: string;
  selectedPattern: IPattern;

  padSequence: Tone.Sequence<number> | undefined;
  isPadPlaying: boolean;
  initPad: () => void;
  addPattern: () => void;

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
  handlePatternSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;

  handlePadPlay: () => void;
  handleEffector: (effectorIndex: number) => void;
}
