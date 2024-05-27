import { useState } from "react";
import "./style/default_effector.scss";
import CircleSlider from "../../../slider/CircleSlider";

import useEffectorController from "./store/useEffectorController";

const DefaultEffector = () => {
  const { handleEffectorValue } = useEffectorController();

  const [reverbValue, setReverbValue] = useState({
    decay: 0,
    preDelay: 0,
  });

  const handleOnChange = (type: string, value: number) => {
    console.log(type, "type", value, "value");

    switch (type) {
      case "reverb":
        {
          const tempReverbValue = structuredClone(reverbValue);
          tempReverbValue.decay = value / 10;
          setReverbValue(tempReverbValue);
          handleEffectorValue({ reverb: tempReverbValue });
        }

        break;

      default:
        break;
    }
  };

  return (
    <div className="default-effector-container">
      <div className="default-effector-reverb-wrapper">
        <p>Reverb</p>
        <div className="reverb-slider-wrapper">
          <CircleSlider type="reverb" onChange={handleOnChange} />
          <CircleSlider type="reverb-preDelay" onChange={handleOnChange} />
        </div>
      </div>
      <div className="default-effector-distortion-wrapper">
        <p> Distortion</p>
        <CircleSlider type="distostion" onChange={handleOnChange} />
      </div>

      <div className="default-effector-delay-wrapper">
        <p>Delay</p>
        <CircleSlider type="delay" onChange={handleOnChange} />
      </div>
    </div>
  );
};

export default DefaultEffector;
