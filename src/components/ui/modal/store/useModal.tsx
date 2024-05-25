import { create } from "zustand";
import { IModalStore } from "../util/modal_interface";

const useModal = create<IModalStore>((set, get) => ({
  modals: [
    {
      title: "Effector",
      path: "effector/EffectorSelector.tsx",
      width: 400,
      height: 500,
      isVisible: false,
    },
  ],
  handleModal: (title: string, action: string) => {
    const modals = structuredClone(get().modals);

    const targetModal = modals.find((modal) => modal.title === title);

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
