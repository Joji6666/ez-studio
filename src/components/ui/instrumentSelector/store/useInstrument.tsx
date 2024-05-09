import { create } from "zustand";
import type { IInstrumentStore } from "../util/instrument_selector_interface";
import type { IInstrument } from "../../pad/util/pad_interface";

const useInstrument = create<IInstrumentStore>((set) => ({
  selectedIns: {
    url: "",
    name: "",
    group: "",
  },

  handleDragStart: (
    e: React.DragEvent<HTMLLIElement>,
    instrument: IInstrument
  ) => {
    set(() => ({ selectedIns: instrument }));
  },
}));

export default useInstrument;
