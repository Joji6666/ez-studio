export interface IModalStore {
  modals: IModals;
  handleModal: (title: string, action: string) => void;
}

export interface IModalOption {
  title: string;
  path: string;
  isVisible: boolean;
  width?: number;
  height?: number;
}

export interface IModals {
  [title: string]: IModalOption;
}
