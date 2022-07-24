import React, { useState, useEffect } from "react";
import { getStroke } from "perfect-freehand";
import "./canvas.css";
import MultiSelect from "./multiSelect";
import PropTypes from "prop-types";
import getURL from "../helpers/getUrl";

function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}

var options = {
  size: 9,
  smoothing: 0.01,
  thinning: 0.5,
  streamline: 0.46,
  easing: (t) => t,
  start: {
    taper: 7,
    cap: true,
  },
  end: {
    taper: 7,
    cap: true,
  },
};

function getClassNameForColour(colour) {
  switch (colour) {
    case "Black":
      return "filter-black";
    case "Blue":
      return "filter-blue";
    case "Green":
      return "filter-green";
    case "Red":
      return "filter-red";
    case "Yellow":
      return "filter-yellow";
  }
}

function CurrentLine(props) {
  const [points, setPoints] = useState({ points: [] });

  function handlePointerDown(e) {
    if (props.isDrawing) {
      setPoints({
        colour: props.colour,
        thickness: props.thickness,
        points: [[e.clientX, e.clientY, e.pressure]],
      });
    }
  }
  function handlePointerMove(e) {
    if (e.buttons !== 1 || props.isDrawing == false) return;
    setPoints({
      colour: props.colour,
      thickness: props.thickness,
      points: [...points.points, [e.clientX, e.clientY, e.pressure]],
    });
  }

  function handlePointerUp() {
    if (props.isDrawing) {
      props.setStrokes(points);
      setPoints({ points: [] });
    }
  }

  useEffect(() => {
    document.onpointerdown = handlePointerDown;
    document.onpointermove = handlePointerMove;
    document.onpointerup = handlePointerUp;

    return () => {
      document.onpointerdown = null;
      document.onpointermove = null;
      document.onpointerup = null;
    };
  });

  options.size = points.thickness;
  const stroke = getStroke(points.points, options);

  const pathData = getSvgPathFromStroke(stroke);
  let colourClassName = getClassNameForColour(points.colour);

  return <path d={pathData} className={colourClassName}></path>;
}

CurrentLine.propTypes = {
  isDrawing: PropTypes.bool,
  colour: PropTypes.string,
  thickness: PropTypes.string,
  setStrokes: PropTypes.func,
};

function Canvas() {
  const colours = ["Black", "Blue", "Green", "Red", "Yellow"];

  // Strokes contains all of the lines that the user has drawn
  const [strokes, setStrokes] = useState(restoreLocalStorage());
  const [isDrawing, setIsDrawing] = useState(false);
  // The slider returns a string, this keeps types consistent
  const [thickness, setThickness] = useState("4");
  const [colour, setColour] = useState(colours[0]);

  function restoreLocalStorage() {
    if (localStorage.canvas != undefined) {
      let data = JSON.parse(localStorage.canvas);
      let key = getURL().join("/");

      if (data[key] != undefined) {
        let x = data[key];
        return x;
      }
    }
    return [];
  }

  function saveLocalStorage() {
    if (localStorage.canvas != undefined) {
      let data = JSON.parse(localStorage.canvas);
      let key = getURL().join("/");
      data[key] = strokes;
      localStorage.canvas = JSON.stringify(data);
    } else {
      let data = {};
      let key = getURL().join("/");
      data[key] = strokes;
      localStorage.canvas = JSON.stringify(data);
    }
  }

  function clearCanvas() {
    setStrokes([]);
  }

  function undo() {
    setStrokes(strokes.slice(0, strokes.length - 2));
  }

  function handleSetStrokes(points) {
    setStrokes([...strokes, points]);
  }

  // Only saves sketch to localstorage when strokes is updated
  useEffect(() => saveLocalStorage(), [strokes]);

  let i = 0;
  const otherStrokes = strokes.map((x) => {
    i++;
    options.size = x.thickness;
    let stroke = getStroke(x.points, options);

    let className = getClassNameForColour(x.colour);

    let pathData = getSvgPathFromStroke(stroke);
    return <path key={i - 1} d={pathData} className={className}></path>;
  });

  return (
    <>
      <input
        type="range"
        min="1"
        max="20"
        value={thickness}
        onChange={(e) => setThickness(e.target.value)}
      ></input>
      <MultiSelect
        values={colours}
        selectedValue={colour}
        setSelectedValue={setColour}
      />
      <button
        onClick={(e) => {
          if (isDrawing) {
            setIsDrawing(false);
            e.target.innerHTML = "Start Drawing";
          } else {
            setIsDrawing(true);
            e.target.innerHTML = "Stop Drawing";
          }
        }}
      >
        Start Drawing
      </button>
      <button onClick={clearCanvas}> Clear</button>
      <button onClick={undo}> Undo</button>
      <svg>
        {otherStrokes}
        <CurrentLine
          isDrawing={isDrawing}
          colour={colour}
          thickness={thickness}
          setStrokes={handleSetStrokes}
        />
      </svg>
    </>
  );
}

export default Canvas;
