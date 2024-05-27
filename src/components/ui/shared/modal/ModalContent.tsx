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
          Close
        </button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicComponent />
      </Suspense>
    </div>
  );
};

export default ModalContent;
