import "./style.css";
import * as d3 from "d3";

//TODO: Import dimensions from "/constants.ts"
import { margin, width, height, url } from "./constants/constants";
import { data } from "./constants/types";

const barChart = d3.select("#bar-chart");

//TODO: Create SVG container for chart
const svg = barChart
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//TODO: Create tooltip
const tooltip = barChart
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

const tooltipBG = barChart
  .append("div")
  .attr("class", "overlay")
  .style("opacity", 0);

//TODO: Load and process data
fetch(url)
  .then((res) => res.json())
  .then((obj) => {
    const { data } = obj;
    data.forEach((d: data) => {
      d[1] = +d[1];
    });

    //TODO: Sort data (by date?)

    data.sort((a: Date[], b: Date[]) => d3.ascending(a[0], b[0]));

    //TODO: Set x and y scales
    const xScale = d3
      .scaleUtc()
      .domain([new Date(data[0][0]), new Date(data[data.length - 1][0])])
      .range([0, width]);

    const yDomainMax: number = d3.max(data, (d: data) => d[1]);
    const yScale = d3.scaleLinear().domain([0, yDomainMax]).range([height, 0]);

    //TODO: Create x and y axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    //TODO: Add x and y axis to chart
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    svg.append("g").attr("id", "y-axis").call(yAxis);

    //TODO: Create bars for chart
    const iterDate = data.map((d: string) => new Date(d[0]));

    const marks = svg.selectAll(".bar").data(data);

    marks
      .enter()
      .append("rect")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .style("fill", "pink")
      .attr("class", "bar")
      .attr("x", (_, i) => xScale(iterDate[i]))
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => height - yScale(d[1]))
      .attr("width", width / data.length)
      .on("mouseover", (e, d) => {
        const [mx, my] = d3.pointer(e);

        tooltipBG;

        const tooltipText = `
          <strong>Date:</strong> ${d[0].split("-").reverse().slice(1).join(", ")}
          <br>
          <strong>GDP:</strong> $${Math.floor(d[1]).toLocaleString()}B`;

        tooltip
          .style("top", `${my + 30}px`)
          .style("left", `${mx}px`)
          .attr("data-date", d[0])
          .html(tooltipText)
          .transition()
          .duration(50)
          .style("opacity", 1)
      })
      .on("mouseout", () => tooltip.transition().duration(50).style("opacity", 0));
  });
