import { useEffect, useState } from "react";

import * as Tone from "tone";
import usePlayList from "../../../../playList/store/usePlayList";
import "./style/piano_roll.scss";
import { v1 } from "uuid";
import usePad from "../../../../pad/store/usePad";

const generateNotes = () => {
  const notes: string[] = [];
  const pitches: string[] = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  for (let octave = 0; octave <= 10; octave++) {
    for (const pitch of pitches) {
      notes.push(`${pitch}${octave}`);
    }
  }
  return notes;
};

const notes = generateNotes().reverse();

const closestMultipleOfSeven = (x: number) => {
  const base = Math.floor(x / 7);

  return base * 7;
};

interface INoteStatus {
  [note: string]: INoteValue[];
}

interface INoteValue {
  noteValue: string;
  x: number;
  duration: number;
  id: string;
}

const PianoRoll = () => {
  const [scrollX, setScrollX] = useState(0);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [synth, setSynth] = useState<Tone.Synth<Tone.SynthOptions> | null>(
    null
  );
  const [noteStatus, setNoteStatus] = useState<INoteStatus>({});
  const [isMove, setIsMove] = useState(false);
  const [isIncrease, setIsIncrease] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>("");
  const [selectedOctave, setSelectedOctave] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);

  const { measureWidth } = usePlayList();
  const { selectedPatternId, patterns, selectedInstrumentId } = usePad();

  const handleActivePiano = (note: string) => {
    if (synth) {
      synth.triggerAttackRelease(note, "8n");
      setActiveNote(note);
    }
  };

  const handleGridClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    note: string
  ) => {
    if (!isMove && !isIncrease) {
      let pass = true;

      const targetElement = document.querySelector(`#note-grid-${note}`);

      let xPosition = 0;
      if (targetElement) {
        const childNodes = targetElement.childNodes;
        const rect = targetElement.getBoundingClientRect();
        const x = e.clientX - rect.left; // 마우스 클릭 위치의 x 좌표

        xPosition = closestMultipleOfSeven(x);

        childNodes.forEach((childNode) => {
          const childElement = childNode as HTMLElement;
          const childRect = childElement.getBoundingClientRect();
          const childX = childRect.left - rect.left; // childNode의 상대적인 x 좌표
          const childWidth = childRect.width;

          // 클릭한 x 좌표가 childNode의 범위 내에 있는지 확인
          if (x >= childX && x <= childX + childWidth) {
            pass = false;
          }
        });
      }

      if (pass) {
        const tempPatterns = structuredClone(patterns);
        const targetPattern = tempPatterns.find(
          (pattern) => pattern.id === selectedPatternId
        );

        if (targetPattern) {
          const targetInstrument = targetPattern.instruments.find(
            (instrument) => instrument.id === selectedInstrumentId
          );
          if (
            targetInstrument &&
            targetInstrument.pianoSteps &&
            targetInstrument.isPiano
          ) {
            const targetNote = targetInstrument.pianoSteps.notes.find(
              (targetNote) => targetNote.noteName === note
            );

            if (targetNote) {
              targetNote.noteValues.push("16n");
            }
            usePad.setState(() => ({ patterns: tempPatterns }));
          }
        }

        const targetNote = note.includes("minor")
          ? note.replace("minor", "#")
          : note;

        noteStatus[targetNote].push({
          noteValue: "16n",
          x: xPosition,
          duration: 0,
          id: v1(),
        });
      }
    }
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string,
    key: string,
    targetNote: INoteValue
  ) => {
    const targetNoteElement = document.querySelector(`#${id}`);
    setSelectedNoteId(id);
    setSelectedOctave(key);

    if (targetNoteElement) {
      const rect = targetNoteElement.getBoundingClientRect();
      const clickX = e.clientX;
      const elementRightX = rect.right;
      setDragStartX(e.clientX - targetNote.x);
      // 요소의 오른쪽 끝에서 10px 이내를 클릭한 경우로 간주
      const threshold = 2;
      if (clickX >= elementRightX - threshold) {
        setIsIncrease(true);
        setIsMove(false);
        console.log("Clicked near the right edge of the element");
      } else {
        setIsIncrease(false);
        setIsMove(true);
        console.log("Clicked inside the element but not near the right edge");
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMove && selectedNoteId && selectedOctave) {
      const tempNoteStatus = structuredClone(noteStatus);
      const targetNote = tempNoteStatus[selectedOctave].find(
        (note) => note.id === selectedNoteId
      );

      const newElementX = e.clientX - dragStartX; // 새로운 x 위치 계산

      if (targetNote) {
        targetNote.x = newElementX;

        setNoteStatus(tempNoteStatus);
      }
    }

    if (isIncrease && selectedNoteId && selectedOctave) {
      const tempNoteStatus = structuredClone(noteStatus);
      const targetNote = tempNoteStatus[selectedOctave].find(
        (note) => note.id === selectedNoteId
      );

      const newElementX = e.clientX - dragStartX; // 새로운 x 위치 계산

      if (newElementX > dragStartX + 7) {
        if (targetNote) {
          targetNote.noteValue = "8n";

          setNoteStatus(tempNoteStatus);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setSelectedNoteId(null);
    setSelectedOctave(null);
    setIsMove(false);
    setIsIncrease(false);
  };

  useEffect(() => {
    const synch = new Tone.Synth().toDestination();
    setSynth(synch);

    const pianoRollMeasureBarWrapper = document.querySelector(
      ".piano-roll-measure-bar-wrapper"
    );

    if (pianoRollMeasureBarWrapper) {
      pianoRollMeasureBarWrapper.addEventListener("scroll", () => {
        setScrollX(pianoRollMeasureBarWrapper.scrollLeft);
      });
    }

    const newNotes: INoteStatus = {};

    notes.forEach((note) => {
      newNotes[note] = [];
    });

    setNoteStatus(newNotes);
  }, []);

  useEffect(() => {
    if (activeNote) {
      setActiveNote(null);
    }
  }, [activeNote]);

  return (
    <div className="piano-roll-container">
      <div className="piano-roll-top-wrapper">
        <div className="piano-roll-toolbar">
          <button>
            <img
              src={"icons/recording.svg"}
              width={15}
              height={15}
              alt="recording"
            />
          </button>
          <button>
            <img
              src={"icons/play.svg"}
              width={15}
              height={15}
              alt="piano-start"
            />
          </button>
        </div>
        <div className="piano-roll-measure-bar-wrapper">
          <div
            className="piano-roll-measure-bar"
            style={{
              width: `${measureWidth * 12}px`,
            }}
          >
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="measure"
                style={{
                  minWidth: `${measureWidth}px`,
                  maxWidth: `${measureWidth}px`,
                  borderRight: "1px solid black",
                }}
              >
                <p style={{ width: "100%", height: "100%" }}>{index}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="piano-roll-contents-wrapper">
        <div className="piano-roll-note-wrapper">
          {notes.map((note) => (
            <div
              key={note}
              style={{
                color: `${note.includes("#") ? "white" : "black"}`,
                width: "100%",
                height: "20px",
                borderRight: `1px solid black`,
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => handleActivePiano(note)}
            >
              <p
                style={{
                  height: "100%",
                  width: `100%`,
                  backgroundColor: `${
                    activeNote === note
                      ? "red"
                      : note.includes("#")
                      ? "black"
                      : "white"
                  }`,
                  borderTop: `${
                    note.includes("E") || note.includes("B")
                      ? "1px solid black"
                      : "none"
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: `${note.includes("#") ? "start" : "end"}`,
                }}
              >
                {note}
              </p>
              {note.includes("#") && (
                <div
                  style={{
                    width: "50%",
                    height: "100%",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      height: "1px",
                      width: "100%",
                      backgroundColor: "black",
                    }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="piano-roll-step-wrapper" style={{ right: scrollX }}>
          <div
            style={{
              width: `${measureWidth * 12}px`,
            }}
          >
            {Object.entries(noteStatus).map(([key, value]) => (
              <div
                onClick={(e) =>
                  handleGridClick(
                    e,
                    key.includes("#") ? `${key.replace("#", "minor")}` : key
                  )
                }
                className="note-grid"
                key={`${key}${v1()}`}
                id={`note-grid-${
                  key.includes("#") ? `${key.replace("#", "minor")}` : key
                }`}
                onMouseMove={(e) => handleMouseMove(e)}
                onMouseUp={handleMouseUp}
              >
                {value.map((noteValue) => (
                  <div
                    id={noteValue.id}
                    key={noteValue.id}
                    style={{
                      width: `${
                        noteValue.noteValue === "16n" ? "7px" : "14px"
                      }`,
                      height: "20px",
                      backgroundColor: "lime",
                      position: "absolute",
                      left: noteValue.x,
                      zIndex: 888,
                    }}
                    onMouseDown={(e) =>
                      handleMouseDown(e, noteValue.id, key, noteValue)
                    }
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PianoRoll;
