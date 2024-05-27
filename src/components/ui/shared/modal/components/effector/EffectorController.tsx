import { useEffect } from "react";

import useEffectorController from "./store/useEffectorController";
import "./style/effector_controller.scss";
const EffectorController = () => {
  const {
    effectorList,
    selectedEffectorIndex,
    initEffectorList,
    handleSlotClick,
  } = useEffectorController();

  useEffect(() => {
    if (effectorList.length === 0) {
      initEffectorList();
    }
  }, []);

  return (
    <div className="effector-controller-container">
      <div className="effector-controller-effector-list-wrapper">
        {effectorList.map((effector) => (
          <div key={effector.id}>{effector.effectorName}</div>
        ))}
      </div>

      <div className="effector-controller-effector-slot-list-wrapper">
        {effectorList.map(
          (effector, effectorIndex) =>
            effectorIndex === selectedEffectorIndex &&
            effector.slots.map((slot, index) => (
              <div key={slot.id} className="effector-slot-wrapper">
                {slot.connectedEffector ?? `slot${index + 1}`}
                <p onClick={() => handleSlotClick(index)}>{`>`}</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default EffectorController;
