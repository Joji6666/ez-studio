import { useRef } from "react";
import "./main.scss";
import { useNavigate } from "react-router-dom";
const Main = () => {
  const logoRef = useRef<HTMLImageElement>(null);
  const nav = useNavigate();

  const handleNav = (key: string) => {
    nav(`/${key}`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (logoRef.current) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;

      const rotateY = (-1 / 10) * x + 20;
      const rotateX = (4 / 40) * y - 20;

      logoRef.current.style.transform = `perspective(350px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    }
  };

  const handleMouseLeave = () => {
    if (logoRef.current) {
      logoRef.current.style.transform = `perspective(350px) rotateY(0deg) rotateX(0deg)`;
    }
  };

  return (
    <main>
      <h1>EZ STUDIO</h1>
      <div className="main-logo-wrapper">
        <img
          ref={logoRef}
          src="logo.png"
          width={500}
          height={500}
          alt="logo"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      <div className="main-button-wrapper">
        <button type="button" onClick={() => handleNav("login")}>
          Login
        </button>
        <button type="button" onClick={() => handleNav("studio")}>
          Start
        </button>
        <button type="button" onClick={() => handleNav("tutorial")}>
          Tutorial
        </button>
      </div>

      <div className="main-update-release-wrapper">
        <p>Update Release</p>
      </div>
    </main>
  );
};

export default Main;
