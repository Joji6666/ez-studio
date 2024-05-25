import { useRef, useEffect } from "react";
import { IPlayListStep } from "./util/play_list_interface";
import * as Tone from "tone";

interface IWaveVisuallizerProps {
  step: IPlayListStep;
  player: Tone.Player;
}

const WaveVisualizer = ({ step, player }: IWaveVisuallizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (player.buffer && step.isChecked && canvasRef.current) {
      const canvas = canvasRef.current;
      if (canvas) {
        const canvasContext = canvas.getContext("2d");
        if (canvasContext) {
          drawWaveform(canvasContext, player.buffer);
        }
      }
    }
  }, [player, step.isChecked]);

  const drawWaveform = (
    canvasContext: CanvasRenderingContext2D,
    buffer: Tone.ToneAudioBuffer
  ) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rawData = buffer.getChannelData(0); // 채널 데이터 가져오기 (모노)
      const samples = 1000; // 캔버스에 그릴 샘플의 수
      const blockSize = Math.floor(rawData.length / samples); // 각 블록의 크기
      const filteredData = [];
      for (let i = 0; i < samples; i++) {
        const blockStart = blockSize * i; // 블록 시작점
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j]); // 블록 내의 샘플 값들의 절대값 합
        }
        filteredData.push(sum / blockSize); // 블록 내의 평균 값
      }

      const multiplier = Math.max(...filteredData); // 최대 값 구하기
      const normalizedData = filteredData.map((n) => n / multiplier); // 값 정규화

      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.beginPath();
      canvasContext.moveTo(0, canvas.height / 2);

      for (let i = 0; i < normalizedData.length; i++) {
        const x = (i / normalizedData.length) * canvas.width;
        const y = ((1 - normalizedData[i]) * canvas.height) / 2;
        canvasContext.lineTo(x, y);
      }

      canvasContext.lineTo(canvas.width, canvas.height / 2);
      canvasContext.strokeStyle = "lime";
      canvasContext.stroke();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={100}
      height={50}
      className="pattern-step"
    ></canvas>
  );
};

export default WaveVisualizer;
