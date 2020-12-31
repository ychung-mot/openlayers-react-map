import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

export const styles = {
  Point: new Style({
    image: new CircleStyle({
      radius: 10,
      fill: null,
      stroke: new Stroke({
        color: "magenta",
      }),
    }),
  }),
  Polygon: new Style({
    stroke: new Stroke({
      color: "blue",
      lineDash: [4],
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
  MultiPolygon: new Style({
    stroke: new Stroke({
      color: "blue",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
  }),
};

export const geojsonObject = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        kind: "county",
        name: "Wyandotte",
        state: "KS",
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-94.8627, 39.202],
              [-94.901, 39.202],
              [-94.9065, 38.9884],
              [-94.8682, 39.0596],
              [-94.6053, 39.0432],
              [-94.6053, 39.1144],
              [-94.5998, 39.1582],
              [-94.7422, 39.1691],
              [-94.7751, 39.202],
              [-94.8627, 39.202],
            ],
          ],
        ],
      },
    },
  ],
};

export const geojsonObject2 = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        kind: "county",
        name: "Johnson",
        state: "KS",
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-94.9065, 38.9884],
              [-95.0544, 38.9829],
              [-95.0544, 38.7365],
              [-94.9668, 38.7365],
              [-94.6108, 38.7365],
              [-94.6108, 38.846],
              [-94.6053, 39.0432],
              [-94.8682, 39.0596],
              [-94.9065, 38.9884],
            ],
          ],
        ],
      },
    },
  ],
};
