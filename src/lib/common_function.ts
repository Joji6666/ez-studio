export const calculateSequenceDuration = (
  bpm: number,
  steps: number,
  noteValue: string
) => {
  // 음표 값에서 숫자 부분을 추출합니다. 예: "8n" -> 8
  const noteDivision = parseInt(noteValue.replace(/[^\d]/g, ""));

  // 4분 음표의 지속 시간을 계산합니다.
  const quarterNoteDuration = 60 / bpm;

  // 입력받은 음표 값에 해당하는 실제 지속 시간을 계산합니다.
  const noteDuration = quarterNoteDuration * (4 / noteDivision);

  // 전체 시퀀스 길이를 계산합니다.
  const totalDuration = noteDuration * steps;

  return totalDuration;
};
