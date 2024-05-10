import { v1 } from "uuid";
import { create } from "zustand";
import { instruments } from "../../../../constatns/instruments";
import type {
  ILoadedInstrument,
  IPadPattern,
  IPadStore,
  ITrack,
} from "../util/pad_interface";
import useInstrument from "../../instrumentSelector/store/useInstrument";

const usePad = create<IPadStore>((set, get) => ({
  // values
  trakcs: [],
  steps: 16,
  loadedInstrument: {},
  selectedTrack: "track1",
  // functions
  addTrack: () => {
    const steps = get().steps;
    const track = get().trakcs;

    const newTrack: ITrack = {
      id: v1(),
      trackName: `track${track.length + 1}`,
      patterns: [
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
      ],
    };

    newTrack.patterns.forEach((pattern) => {
      for (let index = 0; index < steps; index++) {
        pattern.steps.push({
          id: v1(),
          isChecked: false,
        });
      }
    });

    set((state) => ({
      trakcs: [...state.trakcs, newTrack],
    }));
  },
  initPad: () => {
    const basicPadSetup: IPadPattern[] = [
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

    const newTrack: ITrack = {
      id: v1(),
      trackName: "track1",
      patterns: basicPadSetup,
    };

    set(() => ({
      trakcs: [newTrack],
      selectedTrack: newTrack.id,
    }));
  },
  setLoadedInstrument: (loadedInstrument: ILoadedInstrument) => {
    set(() => ({
      loadedInstrument,
    }));
  },
  handleCheck: (
    trackIndex: number,
    patternIndex: number,
    stepIndex: number
  ) => {
    const selectedTrack = get().selectedTrack;
    const tempTracks = structuredClone(get().trakcs);

    if (selectedTrack === tempTracks[trackIndex].id) {
      const targetPattern = tempTracks[trackIndex].patterns[patternIndex];
      const targetStep = targetPattern.steps[stepIndex];
      if (targetStep) {
        if (targetStep.isChecked) {
          tempTracks[trackIndex].patterns[patternIndex].steps[
            stepIndex
          ].isChecked = false;
        } else {
          tempTracks[trackIndex].patterns[patternIndex].steps[
            stepIndex
          ].isChecked = true;
        }
      }
    }

    set(() => ({
      trakcs: tempTracks,
    }));
  },
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    trackIndex: number,
    patternIndex: number
  ) => {
    e.preventDefault();

    const tempTracks = structuredClone(get().trakcs);
    const selectedIns = useInstrument.getState().selectedIns;

    tempTracks[trackIndex].patterns[patternIndex].instrument = selectedIns;

    set(() => ({
      trakcs: tempTracks,
    }));
  },
  handleTrackSelect: (e: React.ChangeEvent<HTMLSelectElement>) => {
    set(() => ({
      selectedTrack: e.target.value,
    }));
  },
}));

export default usePad;
