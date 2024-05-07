import { create } from "zustand";

interface IInstrumentStore {
  selectedIns: string;
  selectIns: (newInsId: string) => void;
}

const useInstrument = create<IInstrumentStore>((set) => ({
  selectedIns: "",
  selectIns: (newInsId: string) => set(() => ({ selectedIns: newInsId })),
}));

export default useInstrument;
