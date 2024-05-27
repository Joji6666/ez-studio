import type { IModalOption } from "./util/modal_interface";
import useModal from "./store/useModal";
import "./style/modal.scss";
import { lazy, Suspense } from "react";
interface IModalContentProps {
  option: IModalOption;
}

const ModalContent = ({ option }: IModalContentProps) => {
  const { handleModal } = useModal();

  const DynamicComponent = lazy(() => import(`./components/${option.path}`));

  return (
    <div
      key={option.path}
      className="modal-content"
      style={{
        width: option.width ? `${option.width}px` : "600px",
        height: option.height ? `${option.height}px` : "500px",
      }}
    >
      <div className="modal-toolbar">
        <span>{option.title}</span>
        <button onClick={() => handleModal(option.title, "close")}>
          <img src="/icons/close.svg" width={15} height={15} />
        </button>
      </div>
      <div className="modal-content-wrapper">
        <Suspense fallback={<div>Loading...</div>}>
          <DynamicComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default ModalContent;
