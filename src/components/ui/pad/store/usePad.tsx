import { v1 } from "uuid";
import { create } from "zustand";
import { instruments } from "../../../../constatns/instruments";
import type {
  ILoadedInstrument,
  IPadStore,
  IStep,
  ITrack,
} from "../util/pad_interface";

const usePad = create<IPadStore>((set, get) => ({
  // values
  trakcs: [],
  steps: 16,
  loadedInstrument: {},

  // functions
  addTrack: () => {
    const newSteps: IStep[] = [];
    const steps = get().steps;

    for (let index = 0; index < steps; index++) {
      newSteps.push({
        id: v1(),
        isChecked: false,
      });
    }

    set((state) => ({
      trakcs: [
        ...state.trakcs,
        {
          id: v1(),
          instrument: {
            url: "",
            name: "",
            group: "",
          },
          steps: newSteps,
        },
      ],
    }));
  },
  initPad: () => {
    const basicPadSetup: ITrack[] = [
      {
        id: v1(),
        instrument: instruments[0],
        steps: [],
      },
      {
        id: v1(),
        instrument: instruments[1],
        steps: [],
      },
      {
        id: v1(),
        instrument: instruments[2],
        steps: [],
      },
      {
        id: v1(),
        instrument: instruments[3],
        steps: [],
      },
    ];

    basicPadSetup.forEach((pad) => {
      const steps = get().steps;
      for (let index = 0; index < steps; index++) {
        pad.steps.push({ id: v1(), isChecked: false });
      }
    });

    set(() => ({
      trakcs: basicPadSetup,
    }));
  },
  setLoadedInstrument: (loadedInstrument: ILoadedInstrument) => {
    set(() => ({
      loadedInstrument,
    }));
  },
  handleCheck: (trackIndex: number, stepIndex: number) => {
    const tempTracks = structuredClone(get().trakcs);

    const targetStep = tempTracks[trackIndex].steps[stepIndex];
    if (targetStep) {
      if (targetStep.isChecked) {
        tempTracks[trackIndex].steps[stepIndex].isChecked = false;
      } else {
        tempTracks[trackIndex].steps[stepIndex].isChecked = true;
      }
    }

    set(() => ({
      trakcs: tempTracks,
    }));
  },
}));

export default usePad;
