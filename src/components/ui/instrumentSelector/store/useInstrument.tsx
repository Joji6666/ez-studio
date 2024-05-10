import { create } from "zustand";
import type {
  IInstrumentStore,
  IInstrument,
  ILoadedInstrument,
} from "../util/instrument_selector_interface";
import { instruments } from "../../../../constatns/instruments";
import * as Tone from "tone";

const useInstrument = create<IInstrumentStore>((set) => ({
  selectedIns: {
    url: "",
    name: "",
    group: "",
  },
  loadedInstrument: {},

  handleDragStart: (
    e: React.DragEvent<HTMLLIElement>,
    instrument: IInstrument
  ) => {
    set(() => ({ selectedIns: instrument }));
  },
  loadAudio: async () => {
    const loaders = instruments.map((sample) =>
      new Tone.Player(sample.url).toDestination()
    );
    const loadedMedias = await Promise.all(loaders);

    const medias = instruments.reduce((acc, sample, index) => {
      acc[sample.url] = loadedMedias[index];
      return acc;
    }, {} as ILoadedInstrument);

    await Tone.loaded().then(() => {
      // 페이지 로드 시 한 번만 초기화
      set(() => ({ loadedInstrument: medias }));
    });
  },
}));

export default useInstrument;
