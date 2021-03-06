import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import "./Map/Map.css";
import { osm, vector } from "./Source";
import { fromLonLat, toLonLat } from "ol/proj";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  Container,
  FormGroup,
  Label,
} from "reactstrap";
import { createStringXY } from "ol/coordinate";
import { Style, Icon } from "ol/style";
//import { styles } from "./Source/Constants";
import MaterialCard from "./Source/MaterialCard";
import UIHeader from "./UIHeader";
import { FormInput } from "./FormInputs";
import { Point } from "ol/geom";
import * as ol from "ol";
import OLTileLayer from "ol/layer/Tile";
import { MousePosition } from "ol/control";
import OLVectorLayer from "ol/layer/Vector";

const WIZARD_STATE = {
  SEARCH: 1,
  SET_START: 2,
  SET_END: 3,
  FINISH: 4,
};

const Search = ({ setWizardState, toggle }) => {
  return (
    <>
      <ModalBody>
        <Row>
          <Col>
            <FormGroup>
              <Label for="rfisegment">RFI Segment</Label>
              <FormInput type="text" name="rfisegment"></FormInput>
            </FormGroup>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" size="sm" type="button" onClick={toggle}>
          Cancel
        </Button>
        <Button
          color="primary"
          type="button"
          size="sm"
          onClick={() => {
            setWizardState(WIZARD_STATE.SET_START);
          }}
        >
          Next
        </Button>
      </ModalFooter>
    </>
  );
};

const removeLayerByName = (map, name) => {
  if (!map) return;

  let layers = map.getLayers().getArray();
  const len = layers.length - 1;
  for (let i = len; i >= 0; i--) {
    const layer = layers[i];
    if (layer.get("name") === name) map.removeLayer(layer);
  }
};

const SetPoint = ({
  map,
  setWizardState,
  center,
  name,
  preState,
  postState,
}) => {
  const mapRef = useRef();
  const [lonlat, setLonlat] = useState(center);

  const clickHandler = (e) => {
    e.stopPropagation();
    setLonlat(toLonLat(e.coordinate));

    removeLayerByName(map, name);

    const source = vector({
      features: [
        new ol.Feature({
          geometry: new Point(e.coordinate),
        }),
      ],
    });

    const style = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        color: name === "start" ? "rgba(255, 0, 0, .5)" : "rgba(0, 0, 255, .5)",
        src: "https://openlayers.org/en/latest/examples/data/icon.png",
      }),
    });

    const vectorLayer = new OLVectorLayer({
      source,
      style,
    });

    vectorLayer.set("name", name);
    vectorLayer.set("coordinate", e.coordinate);

    map.addLayer(vectorLayer);
  };

  useEffect(() => {
    map.setTarget(mapRef.current);
    map.getView().setCenter(fromLonLat(lonlat));
    map.on("click", clickHandler);

    return () => map.un("click", clickHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <>
      <ModalBody>
        <h3>Add {name} point</h3>
        {`Longitude: ${lonlat[0]}, Latitude: ${lonlat[1]}`}
        <div ref={mapRef} className="ol-map"></div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          type="button"
          size="sm"
          onClick={() => setWizardState(preState)}
        >
          Back
        </Button>
        <Button
          color="primary"
          type="button"
          size="sm"
          onClick={() => {
            setWizardState(postState);
          }}
        >
          {postState === WIZARD_STATE.SET_END ? "Next" : "Finish"}
        </Button>
      </ModalFooter>
    </>
  );
};

const getLine = (map) => {
  if (!map) return;

  let line = {};

  let layers = map.getLayers().getArray();
  const len = layers.length - 1;
  for (let i = len; i >= 0; i--) {
    const layer = layers[i];

    const name = layer.get("name");
    const coordinate = layer.get("coordinate");
    if (name === "start" || name === "end") {
      line[name] = coordinate;
    }
  }

  return line;
};

const AddLineWizard = ({ map, isOpen, toggle, center, setLine }) => {
  const [wizardState, setWizardState] = useState(WIZARD_STATE.SEARCH);
  const renderState = () => {
    switch (wizardState) {
      default: {
        return <Search setWizardState={setWizardState} toggle={toggle} />;
      }
      case WIZARD_STATE.SET_START: {
        return (
          <SetPoint
            setWizardState={setWizardState}
            map={map}
            name="start"
            center={center}
            preState={WIZARD_STATE.SEARCH}
            postState={WIZARD_STATE.SET_END}
          />
        );
      }
      case WIZARD_STATE.SET_END: {
        return (
          <SetPoint
            setWizardState={setWizardState}
            map={map}
            name="end"
            center={center}
            preState={WIZARD_STATE.SET_START}
            postState={WIZARD_STATE.FINISH}
          />
        );
      }
      case WIZARD_STATE.FINISH: {
        setLine(getLine(map));
        toggle();
        return <></>;
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      backdrop="static"
      className="modal-lg"
    >
      <ModalHeader toggle={toggle}>Add Line</ModalHeader>
      {renderState()}
    </Modal>
  );
};

const App = () => {
  const zoom = 9;

  const [isOpen, setIsOpen] = useState(false);
  const [map, setMap] = useState();
  const center = [-94.9065, 38.9884];
  const [line, setLine] = useState(null);

  // on component mount
  useEffect(() => {
    let options = {
      view: new ol.View({ zoom, center }),
      layers: [],
      controls: [],
      overlays: [],
    };

    let mapObject = new ol.Map(options);
    setMap(mapObject);

    const source = osm();
    const zIndex = 0;

    const tileLayer = new OLTileLayer({
      source,
      zIndex,
    });

    mapObject.addLayer(tileLayer);
    tileLayer.setZIndex(zIndex);

    let mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: "EPSG:4326",
      // comment the following two lines to have the mouse position
      // be placed within the map.
      className: "custom-mouse-position",
      target: document.getElementById("mouse-position"),
      undefinedHTML: "&nbsp;",
    });
    mapObject.controls.push(mousePositionControl);

    return () => {
      mapObject.controls.remove(mousePositionControl);
      mapObject.setTarget(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Container>
        <MaterialCard>
          <UIHeader>Add Line from Map</UIHeader>
        </MaterialCard>
        <Row>
          <Col>
            <Button
              size="sm"
              color="primary"
              className="float-right mb-3"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Add Line
            </Button>
          </Col>
        </Row>
        <MaterialCard>
          {line &&
            `Start: [${line.start[0]}, ${line.start[1]}], End: [${line.end[0]}, ${line.end[1]}]`}
        </MaterialCard>
      </Container>
      {isOpen && (
        <AddLineWizard
          isOpen={isOpen}
          toggle={handleClose}
          map={map}
          center={center}
          setLine={setLine}
        />
      )}
    </>
  );
};

export default App;
