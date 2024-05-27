import DefaultEffector from "./DefaultEffector";
import useEffectorController from "./store/useEffectorController";
import "./style/effector_selector.scss";
const EffectorSelector = () => {
  const effectorComponents = [
    { Component: DefaultEffector, title: "DefaultEffector" },
  ];

  const { handleMountingEffector } = useEffectorController();

  return (
    <div>
      EffectorSelector
      {effectorComponents.map((option) => (
        <div
          className="effector-selector-card"
          key={option.title}
          onClick={() => handleMountingEffector(option.title)}
        >
          <div className="effector-selector-card-layer"></div>
          <div className="effector-selector-card-component">
            <option.Component />
          </div>

          {option.title}
        </div>
      ))}
    </div>
  );
};

export default EffectorSelector;
