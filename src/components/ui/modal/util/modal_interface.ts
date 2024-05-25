export interface IModalStore {
  modals: IModalOption[];
  handleModal: (title: string, action: string) => void;
}

export interface IModalOption {
  title: string;
  path: string;
  isVisible: boolean;
  width?: number;
  height?: number;
}
