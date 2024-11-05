import { marginProps } from "./types";

const margin: marginProps = { top: 70, right: 50, bottom: 60, left: 80 };
const width: number = 1000 - margin.left - margin.right;
const height: number = 500 - margin.top - margin.bottom;

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

export { margin, width, height, url };
