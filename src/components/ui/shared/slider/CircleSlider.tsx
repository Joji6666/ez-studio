import { useCallback, useRef, useState } from "react";
import "./style/circle_slider.scss";

interface ICircleSliderProps {
  type: string;
  onChange: (type: string, value: number) => void;
}

const CircleSlider = ({ type, onChange }: ICircleSliderProps) => {
  const [isRotating, setIsRotating] = useState(false);
  const [value, setValue] = useState(0);
  const knobRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsRotating(true);
  };

  const handleMouseUp = () => {
    setIsRotating(false);
  };

  const handleRotate = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isRotating && knobRef.current) {
        const knobX =
          knobRef.current.getBoundingClientRect().left +
          knobRef.current.clientWidth / 2;
        const knobY =
          knobRef.current.getBoundingClientRect().top +
          knobRef.current.clientHeight / 2;

        const deltaX = e.clientX - knobX;
        const deltaY = e.clientY - knobY;

        const angleRad = Math.atan2(deltaY, deltaX);
        const angleDeg = (angleRad * 180) / Math.PI;

        const rotationAngle = (angleDeg - 135 + 360) % 360;

        if (rotationAngle <= 270) {
          if (pointerRef.current) {
            pointerRef.current.style.transform = `rotate(${
              rotationAngle - 45
            }deg)`;
          }

          const progressPercent = rotationAngle / 270;

          if (circleRef.current) {
            circleRef.current.style.strokeDashoffset = `${
              176 - 132 * progressPercent
            }`;
          }

          setValue(Math.round(progressPercent * 100));
          onChange(type, Math.round(progressPercent * 100));
        }
      }
    },
    [isRotating, onChange, type]
  );

  return (
    <div className="circle-slider-container">
      <div className="circle-slider-wrapper">
        <div
          className="circle-slider-knob"
          ref={knobRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleRotate}
          onMouseUp={handleMouseUp}
        >
          <div className="circle-slider-rotator"></div>
          <div className="circle-slider-pointer" ref={pointerRef}>
            <span className="circle-slider-pointer-icon">{`-`}</span>
          </div>
        </div>
        <svg width={60} height={60}>
          <circle cx={30} cy={30} r={28}></circle>
          <circle ref={circleRef} cx={30} cy={30} r={28}></circle>
        </svg>
      </div>
      <div className="circle-slider-value-text">{value}</div>
    </div>
  );
};

export default CircleSlider;
