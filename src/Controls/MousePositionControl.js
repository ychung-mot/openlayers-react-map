import { useContext, useEffect } from "react";
import { MousePosition } from "ol/control";
import MapContext from "../Map/MapContext";

const MousePositionControl = ({ options, events }) => {
  const { map } = useContext(MapContext);

  useEffect(() => {
    if (!map) return;

    let mousePositionControl = new MousePosition(options);
    map.controls.push(mousePositionControl);

    for (let eventName in events) {
      if (events[eventName])
        mousePositionControl.on(eventName, events[eventName]);
    }

    return () => map.controls.remove(mousePositionControl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};

export default MousePositionControl;
