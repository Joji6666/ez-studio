import "./style/modal.scss";
import useModal from "./store/useModal";
import ModalContent from "./ModalContent";

const Modal = () => {
  const { modals } = useModal();

  return (
    <div className="modal-container">
      {modals.map(
        (option) =>
          option.isVisible && <ModalContent key={option.path} option={option} />
      )}
    </div>
  );
};

export default Modal;
