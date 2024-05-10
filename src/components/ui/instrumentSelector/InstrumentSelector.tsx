import { useEffect, useState } from "react";
import { instruments } from "../../../constatns/instruments";

import "./style/instrument_selector.scss";
import useInstrument from "./store/useInstrument";

const groups: string[] = ["kicks", "hats", "claps", "snares"];

const InstrumentSelector = () => {
  const { handleDragStart, loadAudio } = useInstrument();

  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const handleSelect = (groupName: string) => {
    if (expandedGroups.includes(groupName)) {
      const filteredGroup = expandedGroups.filter(
        (group) => group !== groupName
      );
      setExpandedGroups(filteredGroup);
    } else {
      setExpandedGroups((prev) => [...prev, groupName]);
    }
  };

  useEffect(() => {
    loadAudio();
  }, []);

  return (
    <section className="instrument-selector-section">
      <article className="instrument-selector-article">
        <span>Instrument Files</span>
        {groups.map((group) => {
          const groupItems = instruments.filter(
            (instrument) => instrument.group === group
          );

          const isOpen = expandedGroups.includes(group);

          return (
            <div className="panel-wrapper" key={group}>
              <span className="group-title" onClick={() => handleSelect(group)}>
                {group}
              </span>

              {isOpen && (
                <ul>
                  {groupItems.map((item) => (
                    <li
                      draggable
                      key={item.name}
                      onDragStart={(e) => handleDragStart(e, item)}
                    >
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </article>
    </section>
  );
};

export default InstrumentSelector;
