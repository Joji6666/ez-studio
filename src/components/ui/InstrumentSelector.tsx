import React from "react";
import { instruments } from "../../utils/instruments";
import useInstrument from "../../stores/useInstrument";

const InstrumentSelector = () => {
  const groups: string[] = ["kicks", "hats", "claps", "snares"];
  const { selectedIns, selectIns } = useInstrument();
  return (
    <section>
      <article>
        {groups.map((group) => {
          const groupItems = instruments.filter(
            (instrument) => instrument.group === group
          );

          return (
            <div key={group}>
              <label>{group}</label>
              <ul>
                {groupItems.map((item) => (
                  <li key={item.name}>{item.name}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </article>
    </section>
  );
};

export default InstrumentSelector;
