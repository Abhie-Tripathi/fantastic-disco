//@ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface IProps {
  predictedData: any;
  selectedEventType?: string;
}

const D3AreaChart = ({ predictedData, selectedEventType }: IProps) => {
  const chartRef = useRef(null);

  const [thresholdValues, setThresholdValues] = useState<string[]>([]);

  useEffect(() => {
    if (!predictedData) return;
    const margin = { top: 20, right: 350, bottom: 50, left: 90 };
    let width = window.innerWidth - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

    // Remove the existing chart if it already exists
    d3.select(chartRef.current).selectAll("*").remove();
    // d3.selectAll("path,line").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("viewBox", `0 0 300 600`)
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the date and total
    // Parse the date
    const parseDate = d3.timeParse("%Y-%m-%d"); // Assuming your date format is "YYYY-MM-DD"
    const data =
      predictedData &&
      predictedData.map((d) => ({
        ...d,
        date: parseDate(d.date), // Ensure the date is a valid Date object
      }));

    // const parseDate = d3.timeParse("%d %b");
    // const data = predictedData
    //   .filter((d) => d.total !== undefined) // Filter out data points with no total
    //   .map((d) => ({ ...d, date: parseDate(d.date), total: +d.total }));

    // let threshold = (d3.max(data, (d) => d.total) + 0) / 2;
    let threshold =
      (d3.max(data, (d) => d.total) + d3.min(data, (d) => d.total)) / 2;

    let upperThreshold: string | undefined | number =
      threshold + threshold * 0.25;
    let lowerThreshold: string | undefined | number =
      threshold - threshold * 0.25;
    const thresholdArea = [
      upperThreshold, // 25% above threshold
      lowerThreshold, // 25% below threshold
    ];

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.total)])
      .range([height, 0]);

    // X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "xAxisLine") // Add class
      .call(
        d3
          .axisBottom(x)
          .ticks(d3.timeDay.every(Math.round(data.length / 10)))
          .tickFormat(d3.timeFormat("%d %b"))
      )
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    // svg.append("g").call(d3.axisLeft(y));

    const yAxis = d3.axisLeft(y);

    svg
      .append("g")
      .call(yAxis)
      .attr("class", "yAxisLine") // Add class
      .selectAll("path") // Select the Y-axis line (which is an SVG path)
      .style("display", "none"); // Hide the Y-axis line

    // Y-axis label (Predicted Attendance)
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      // .style("font-weight", "bold")
      .style("fill", "#333")
      .text(selectedEventType);

    // Add Cartesian Grid
    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .tickFormat("" as any) // No text labels on gridlines
      )
      .selectAll(".tick line")
      .attr("stroke", "#e0e0e0") // Set the grid line color
      .attr("stroke-dasharray", "0,0"); // Optional: Dashed grid lines

    // Define the gradient you provided
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "eventChange")
      .attr("x1", "0")
      .attr("y1", "0")
      .attr("x2", "0")
      .attr("y2", "1");

    gradient
      .append("stop")
      .attr("offset", "5%")
      .attr("stop-color", "#6750a4")
      .attr("stop-opacity", 0.8);

    gradient
      .append("stop")
      .attr("offset", "95%")
      .attr("stop-color", "#6750a4")
      .attr("stop-opacity", 0);

    const tickValues = d3
      .select(chartRef.current)
      .selectAll(".tick")
      .data()
      .map((tick) => new Date(tick)); // Convert ticks to Date objects

    // Filter data points based on whether they match the x-axis ticks
    const filteredData = data.filter((d) =>
      tickValues.some((tick) => tick.getTime() === d.date.getTime())
    );

    // Area generator (using straight lines, no curve)
    const area = d3
      .area()
      .x((d) => x(d.date))
      .y0(height)
      .y1((d) => y(d.total));

    // Add the area to the chart with the provided gradient
    svg
      .append("path")
      .datum(data)
      .attr("class", "area")
      .attr("fill", "url(#eventChange)") // Use the gradient here
      .attr("d", area);

    // Add the line on top of the area
    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.total));

    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#6750a4")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Assuming thresholdArea is an array like [upperThreshold, lowerThreshold]
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("g") // Append a group element to contain two circles (for larger and smaller circles)
      .each(function (d, i) {
        const cx = x(d.date);
        const cy = y(d.total || 0);
        const isInFilteredData = filteredData.some(
          (fd) => fd.date.getTime() === d.date.getTime()
        );

        // Condition for dots below the lower threshold
        if (d.total < thresholdArea[1] && isInFilteredData) {
          d3.select(this)
            .append("circle")
            .attr("class", "outer-circle lower-threshold-circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 8) // Outer larger circle
            .attr("fill", "#E1313A1F")
            .attr("stroke", "#E1313A")
            .attr("stroke-width", 2);

          d3.select(this)
            .append("circle")
            .attr("class", "inner-circle lower-threshold-circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 4) // Inner smaller circle
            .attr("fill", "#E1313A")
            .attr("stroke", "#E1313A")
            .attr("stroke-width", 2);
        }

        // Condition for dots above the upper threshold
        else if (d.total > thresholdArea[0]) {
          d3.select(this)
            .append("circle")
            .attr("class", "outer-circle upper-threshold-circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 8) // Outer larger circle
            .attr("fill", "#D2E7BF")
            .attr("stroke", "#16A54F")
            .attr("stroke-width", 2);

          d3.select(this)
            .append("circle")
            .attr("class", "inner-circle upper-threshold-circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 4) // Inner smaller circle
            .attr("fill", "#16A54F")
            .attr("stroke", "#16A54F")
            .attr("stroke-width", 2);
        }

        // You can add additional conditions or leave it empty if no dot is rendered.
      });

    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0px 2px 4px rgba(0, 0, 0, 0.1)")
      .style("visibility", "hidden")
      .style("z-index", "999")
      .style("pointer-events", "none");

    // Add mouseover, mousemove, and mouseout events for the tooltip
    svg.selectAll("circle").on("click", (event, d) => {
      // Tooltip dimensions (adjust based on actual size)
      const tooltipWidth = 300; // Approximate width of the tooltip
      const tooltipHeight = 200; // Approximate height of the tooltip

      // Calculate initial tooltip position
      let left = event.pageX - 50; // Offset by 10px from the clicked point
      let top = 0; // Offset by 10px above the point

      // Get the window dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Adjust horizontal position if the tooltip overflows on the right side
      if (left + tooltipWidth > windowWidth) {
        left = event.pageX - tooltipWidth - 10; // Adjust to the left by 10px from the right edge
      }

      // Adjust vertical position if the tooltip overflows on the bottom side
      if (top + tooltipHeight > windowHeight) {
        top = event.pageY - tooltipHeight - 10; // Adjust to be above the clicked point
      }

      // Adjust position if the tooltip overflows on the left side
      if (left < 0) {
        left = 10; // Add a small margin if it overflows on the left
      }

      // Adjust position if the tooltip overflows on the top side
      if (top < 0) {
        top = 10; // Add a small margin if it overflows on the top
      }
      tooltip
        .style("visibility", "visible")
        .style("top", `${top}px`) // Adjusted top position
        .style("left", `${left}px`) // Adjusted left position
        .html(
          `<div class="border-none shadow-sm bg-[var(--primary-foreground)] w-72 z-10">
            <div class="px-4 py-2 flex text-lg font-medium border-b">${d3.timeFormat(
              "%d %b"
            )(d.date)} 2024</div>
            <div class="px-4 py-2 border-b">
              <p class="font-semibold text-[var(--primary-color)]">${
                d.total
              }</p>
              <p class="text-sm text-[var(--secondary-color)]">${selectedEventType}</p>
            </div>
            <div class="flex flex-col px-4 py-2 gap-2 border-b">
              <div class="flex justify-between">
                <div class="flex gap-2">
                  <div class="bg-[var(--social-color)] w-1 rounded-lg h-5"></div>
                  <p class="font-semibold text-[var(--social-color)]">Social Events</p>
                </div>
                <p class="font-semibold text-[var(--social-color)]">${
                  d.social
                }</p>
              </div>
              <div class="flex justify-between">
                <div class="flex gap-2">
                  <div class="bg-[var(--business-color)] w-1 rounded-lg h-5"></div>
                  <p class="font-semibold text-[var(--business-color)]">Business Events</p>
                </div>
                <p class="font-semibold text-[var(--business-color)]">${
                  d.business
                }</p>
              </div>
            </div>
            <div class="px-4 py-2">
              <p class="text-sm font-medium">TOP EVENTS</p>
              <div class="flex flex-col gap-2 mt-4">
                <div class="flex gap-4">
                  <div class="flex flex-col items-center">
                    <span class="text-[12px] text-[#D92D20] font-semibold">64</span>
                    <span class="text-[12px] text-[#79747E]">EIS</span>
                  </div>
                  <p class="text-[#79747E] text-[12px] truncate">The Deli, Dairy & Bakery, Spring movemnent</p>
                </div>
                <div class="flex gap-4">
                  <div class="flex flex-col items-center">
                    <span class="text-[12px] text-[#C65C10] font-semibold">44</span>
                    <span class="text-[12px] text-[#79747E]">PHQ</span>
                  </div>
                  <p class="text-[#79747E] text-[12px] truncate">NCA HLC Annual Conference on public</p>
                </div>
                <div class="flex gap-4">
                  <div class="flex flex-col items-center">
                    <span class="text-[12px] text-[#D92D20] font-semibold">80</span>
                    <span class="text-[12px] text-[#79747E]">PHQ</span>
                  </div>
                  <p class="text-[#79747E] text-[12px] truncate whitespace-nowrap">ACC Legal Operations Show</p>
                </div>
                <div class="flex gap-4">
                  <div class="flex flex-col items-center">
                    <span class="text-[12px] text-[#008743] font-semibold">34</span>
                    <span class="text-[12px] text-[#79747E]">PHQ</span>
                  </div>
                  <p class="text-[#79747E] text-[12px] truncate whitespace-nowrap">Pride Festival</p>
                </div>
              </div>
            </div>
            <div class="px-4 py-2 flex items-center gap-2 text-sm font-semibold text-[var(--primary-color)] cursor-pointer">
              VIEW ALL
              
            </div>
          </div>`
        );

      tooltip.on("click", (e) => {
        e.stopPropagation();
      });
    });

    // Hide the tooltip when clicking anywhere outside the circle or tooltip
    document.addEventListener("click", function (event) {
      // Hide the tooltip only if the click is outside the tooltip and circles
      if (
        !event.target.closest("circle") &&
        !event.target.closest("div.tooltip-content")
      ) {
        tooltip.style("visibility", "hidden");
      }
    });
    // .on("mousemove", (event) => {
    //   tooltip
    //     .style("top", `${event.pageY - 0}px`)
    //     .style("left", `${event.pageX + 10}px`);
    // })
    // .on("mouseout", () => {
    //   tooltip.style("visibility", "hidden");
    // });

    const updateThresholdArea = () => {
      svg
        .select(".reference-area")
        .attr("y", y(upperThreshold))
        .attr("height", y(lowerThreshold) - y(upperThreshold));
    };

    // Add upper threshold line
    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y(thresholdArea[0]))
      .attr("y2", y(thresholdArea[0]))
      .attr("stroke", "#398E4A")
      .attr("stroke-dasharray", "12,12")
      .attr("stroke-width", 2)
      .attr("class", "upper-threshold-line");

    svg
      .append("text")
      .attr("x", width - 10)
      .attr("y", y(thresholdArea[0]) + 20)
      .attr("text-anchor", "end")
      .attr("fill", "#398E4A")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .attr("class", "upper-threshold-label")
      .text("UPPER THRESHOLD");

    // Add lower threshold line
    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y(thresholdArea[1]))
      .attr("y2", y(thresholdArea[1]))
      .attr("stroke", "#FF990A")
      .attr("stroke-dasharray", "12,12")
      .attr("stroke-width", 2)
      .attr("class", "lower-threshold-line");

    svg
      .append("text")
      .attr("x", width - 10)
      .attr("y", y(thresholdArea[1]) + 20)
      .attr("text-anchor", "end")
      .attr("fill", "#FF990A")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .attr("class", "lower-threshold-label")
      .text("LOWER THRESHOLD");

    // Add middle threshold line
    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y(threshold))
      .attr("y2", y(threshold))
      .attr("stroke", "#DF2670")
      .attr("stroke-width", 1)
      .attr("class", "mid-threshold-line");

    svg
      .append("text")
      .attr("x", width - 10)
      .attr("y", y(threshold) + 20)
      .attr("text-anchor", "end")
      .attr("fill", "#DF2670")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .attr("class", "mid-threshold-label")
      .text("THRESHOLD");

    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", y(thresholdArea[0]))
      .attr("width", width)
      .attr("height", y(thresholdArea[1]) - y(thresholdArea[0]))
      .attr("fill", "#FAEFE2")
      .attr("opacity", 0.5)
      .style("z-index", 1)
      .attr("class", "reference-area")
      .lower();

    const minY = 50; // Minimum Y position (upper boundary)
    const maxY = height - 50; // Maximum Y position (lower boundary)

    const dragUpperThreshold = d3
      .drag<SVGCircleElement, unknown>()
      .on("drag", function (event) {
        // Ensure upperThreshold stays above the middle threshold and within the graph's top boundary
        const newY = Math.max(0, Math.min(event.y, y(threshold) - 0));
        upperThreshold = y.invert(newY).toFixed(2);

        d3.select(this).attr("cy", newY);
        d3.select(".upper-threshold-line").attr("y1", newY).attr("y2", newY);
        d3.select(".upper-threshold-label").attr("y", newY + 20);

        updateThresholdArea(); // Update the reference area based on the new upper threshold
      });

    const dragLowerThreshold = d3
      .drag<SVGCircleElement, unknown>()
      .on("drag", function (event) {
        // Ensure lowerThreshold stays below the middle threshold and within the graph's bottom boundary
        const newY = Math.min(height, Math.max(event.y, y(threshold) + 0));
        lowerThreshold = y.invert(newY).toFixed(2);

        d3.select(this).attr("cy", newY);
        d3.select(".lower-threshold-line").attr("y1", newY).attr("y2", newY);
        d3.select(".lower-threshold-label").attr("y", newY + 20);

        updateThresholdArea(); // Update the reference area based on the new lower threshold
      });

    svg
      .append("circle")
      .attr("class", "draggable-threshold draggable-upper") // Add class
      .attr("cx", width - 150) // Position at the right end of the threshold line
      .attr("cy", y(thresholdArea[0])) // Set initial position based on the threshold
      .attr("r", 6) // Size of the draggable button
      .attr("fill", "#398E4A")
      .style("cursor", "pointer")
      .call(dragUpperThreshold); // Attach the drag behavior
    svg
      .append("circle")
      .attr("class", "draggable-threshold draggable-lower") // Add class
      .attr("cx", width - 150) // Position at the right end of the threshold line
      .attr("cy", y(thresholdArea[1])) // Set initial position based on the threshold
      .attr("r", 6) // Size of the draggable button
      .attr("fill", "#FF990A")
      .style("cursor", "pointer")
      .call(dragLowerThreshold); // Attach the drag behavior

    const resizeChart = () => {
      // Update width and height based on window size
      width = window.innerWidth - margin.left - margin.right;
      height = 400 - margin.top - margin.bottom;

      // Update the scales with new width and height
      x.range([0, width]);
      y.range([height, 0]);

      // Update the svg dimensions
      d3.select(chartRef.current)
        .select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        );

      // Update X and Y axes
      svg
        .select(".xAxisLine")
        .attr("transform", `translate(0,${height})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(d3.timeDay.every(Math.round(data.length / 10)))
            .tickFormat(d3.timeFormat("%d %b"))
        );

      // Update the grid lines
      svg
        .select(".grid")
        .call(
          d3
            .axisLeft(y)
            .tickSize(-width) // Ensure gridlines extend across new width
            .tickFormat("" as any)
        )
        .selectAll(".tick line")
        .attr("stroke", "#e0e0e0");

      svg.select(".area").attr("d", area);

      svg.select(".line").attr("d", line);

      svg
        .selectAll(".outer-circle")
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d.total))
        .attr("r", 8); // Adjust radius if needed

      svg
        .selectAll(".inner-circle")
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d.total))
        .attr("r", 4); // Adjust radius if needed

      // Update threshold lines, labels, and reference area (same as before)
      svg
        .select(".upper-threshold-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(thresholdArea[0]))
        .attr("y2", y(thresholdArea[0]));

      svg
        .select(".lower-threshold-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(thresholdArea[1]))
        .attr("y2", y(thresholdArea[1]));

      svg
        .select(".mid-threshold-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(threshold))
        .attr("y2", y(threshold));

      svg
        .select(".reference-area")
        .attr("x", 0)
        .attr("width", width)
        .attr("y", y(thresholdArea[0]))
        .attr("height", y(thresholdArea[1]) - y(thresholdArea[0]));

      svg
        .select(".upper-threshold-label")
        .attr("x", width - 10)
        .attr("y", y(thresholdArea[0]) + 20);

      svg
        .select(".lower-threshold-label")
        .attr("x", width - 10)
        .attr("y", y(thresholdArea[1]) + 20);

      svg
        .select(".mid-threshold-label")
        .attr("x", width - 10)
        .attr("y", y(threshold) + 20);

      // Update draggable threshold circles (same as before)
      svg
        .selectAll(".draggable-threshold")
        .attr("cx", width - 150)
        .attr("cy", (d, i) =>
          i === 0 ? y(thresholdArea[0]) : y(thresholdArea[1])
        );
    };

    window.addEventListener("resize", resizeChart);

    return () => {
      window.removeEventListener("resize", resizeChart);
    };
  }, [predictedData]);

  return (
    <div>
      <div
        className="relative overflow-x-hidden overflow-y-hidden"
        ref={chartRef}
      ></div>
    </div>
  );
};

export default D3AreaChart;
