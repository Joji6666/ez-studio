import { create } from "zustand";
import { IModalStore } from "../util/modal_interface";

const useModal = create<IModalStore>((set, get) => ({
  modals: {
    Effector: {
      title: "Effector",
      path: "effector/EffectorController.tsx",
      width: 1000,
      height: 800,
      isVisible: false,
    },
    EffectorSelector: {
      title: "EffectorSelector",
      path: "effector/EffectorSelector.tsx",
      width: 1000,
      height: 700,
      isVisible: false,
    },

    DefaultEffector: {
      title: "DefaultEffector",
      path: "effector/DefaultEffector.tsx",
      width: 400,
      height: 500,
      isVisible: false,
    },
    PianoRoll: {
      title: "PianoRoll",
      path: "pianoRoll/PianoRoll.tsx",
      width: 800,
      height: 600,
      isVisible: false,
    },
  },

  handleModal: (title: string, action: string) => {
    const modals = structuredClone(get().modals);

    const targetModal = modals[title];

    if (targetModal && action === "open") {
      targetModal.isVisible = true;
    }

    if (targetModal && action === "close") {
      targetModal.isVisible = false;
    }

    set(() => ({
      modals,
    }));
  },
}));

export default useModal;
