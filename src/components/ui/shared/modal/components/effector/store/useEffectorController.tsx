import { create } from "zustand";
import type {
  IEffector,
  IEffectorController,
  IEffectorSlot,
} from "../util/effector_controller_interface";
import { v1 } from "uuid";
import useModal from "../../../store/useModal";

const useEffectorController = create<IEffectorController>((set, get) => ({
  // values

  effectorList: [],
  selectedEffectorIndex: null,
  selectedSlotIndex: null,
  // functions

  initEffectorList: () => {
    const newEffectorList: IEffector[] = [];
    for (let index = 0; index < 10; index++) {
      const newEffector: IEffector = {
        effectorName: `Effector${index + 1}`,
        id: v1(),
        slots: [],
      };

      for (let index = 0; index < 10; index++) {
        const newSlot: IEffectorSlot = {
          id: v1(),
          connectedEffector: null,
          value: {},
        };
        newEffector.slots.push(newSlot);
      }

      newEffectorList.push(newEffector);
    }

    set(() => ({
      effectorList: newEffectorList,
      selectedEffectorIndex: 0,
    }));
  },
  handleSlotClick: (slotIndex: number) => {
    const handleModal = useModal.getState().handleModal;

    set(() => ({
      selectedSlotIndex: slotIndex,
    }));

    handleModal("EffectorSelector", "open");
  },
  handleMountingEffector: (effectorName: string) => {
    const effectorList = structuredClone(get().effectorList);
    const selectedEffectorIndex = get().selectedEffectorIndex;
    const selectedSlotIndex = get().selectedSlotIndex;
    const handleModal = useModal.getState().handleModal;

    if (selectedEffectorIndex !== null && selectedSlotIndex !== null) {
      effectorList[selectedEffectorIndex].slots[
        selectedSlotIndex
      ].connectedEffector = effectorName;

      set(() => ({
        effectorList,
      }));
    }
    handleModal(effectorName, "open");
    handleModal("EffectorSelector", "close");
  },
  handleEffectorValue: (effectorValue: {
    [key: string]: { [key: string]: string | number };
  }) => {
    const effectorList = structuredClone(get().effectorList);
    const selectedEffectorIndex = get().selectedEffectorIndex;
    const selectedSlotIndex = get().selectedSlotIndex;

    if (selectedEffectorIndex !== null && selectedSlotIndex !== null) {
      (effectorList[selectedEffectorIndex].slots[selectedSlotIndex].value = {
        ...effectorList[selectedEffectorIndex].slots[selectedSlotIndex].value,
        ...effectorValue,
      }),
        set(() => ({
          effectorList,
        }));
    }
  },
}));

export default useEffectorController;
