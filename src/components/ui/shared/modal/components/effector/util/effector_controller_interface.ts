export interface IEffectorController {
  effectorList: IEffector[];
  selectedEffectorIndex: number | null;
  selectedSlotIndex: number | null;
  initEffectorList: () => void;
  handleSlotClick: (slotIndex: number) => void;
  handleMountingEffector: (effectorName: string) => void;
  handleEffectorValue: (effectorValue: {
    [key: string]: { [key: string]: string | number };
  }) => void;
}

export interface IEffector {
  effectorName: string;
  id: string;
  slots: IEffectorSlot[];
}

export interface IEffectorSlot {
  id: string;
  connectedEffector: string | null;
  value: {
    [key: string]: { [key: string]: string | number };
  };
}
