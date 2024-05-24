import { useRef, useEffect } from "react";
import usePad from "../pad/store/usePad";
import useTopToolbar from "./store/useTopToolbar";
import usePlayList from "../playList/store/usePlayList";

let animationFrameId: number = 0;

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlayListPlaying } = usePlayList();
  const { isPadPlaying } = usePad();
  const { analyzer } = useTopToolbar();

  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas && analyzer) {
      const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
      const values = analyzer.getValue();

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00ff00";
        values.forEach((value, index) => {
          const height = (Number(value) + 100) * 2; // 스케일 조정
          const x = (canvas.width / values.length) * index;
          const y = canvas.height - height;
          ctx.fillRect(x, y, canvas.width / values.length, height);
        });
      }
    }
    animationFrameId = requestAnimationFrame(draw);
  };

  useEffect(() => {
    if (isPadPlaying || isPlayListPlaying) {
      draw();
    } else {
      cancelAnimationFrame(animationFrameId);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }, [isPadPlaying, isPlayListPlaying]);

  return <canvas ref={canvasRef} width="100" height="100" />;
};

export default AudioVisualizer;
