import { useState } from "react";
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
    <div>
      DefaultEffector
      <div>
        Reverb
        <CircleSlider type="reverb" onChange={handleOnChange} />
        <CircleSlider type="reverb-preDelay" onChange={handleOnChange} />
      </div>
      <div>Distostion</div>
      <CircleSlider type="distostion" onChange={handleOnChange} />
      <div>
        Delay
        <CircleSlider type="delay" onChange={handleOnChange} />
      </div>
    </div>
  );
};

export default DefaultEffector;
