import type { IInstrument } from "../../pad/util/pad_interface";

export interface IInstrumentStore {
  selectedIns: IInstrument;
  handleDragStart: (
    e: React.DragEvent<HTMLLIElement>,
    instrument: IInstrument
  ) => void;
}
