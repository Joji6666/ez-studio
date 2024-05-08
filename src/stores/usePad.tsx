import { v1 } from "uuid";
import { create } from "zustand";

interface IStep {
  id: string;
}

interface ITrack {
  id: string;
  instrument: string;
  steps: IStep[];
}

interface IPadStore {
  trakcs: ITrack[];
  addTrack: () => void;
  steps: number;
}

const usePad = create<IPadStore>((set, get) => ({
  trakcs: [],

  steps: 16,

  addTrack: () => {
    const newSteps: IStep[] = [];
    const steps = get().steps;

    for (let index = 0; index < steps; index++) {
      newSteps.push({
        id: v1(),
      });
    }

    set((state) => ({
      trakcs: [...state.trakcs, { id: v1(), instrument: "", steps: newSteps }],
    }));
  },
}));

export default usePad;
