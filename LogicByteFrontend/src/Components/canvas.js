import React, { useState, useEffect } from "react";
import { getStroke } from "perfect-freehand";
import "./canvas.css";
import MultiSelect from "./multiSelect";

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

// var options = {
//   size: 10,
//   thinning: 0.5,
//   smoothing: 0.5,
//   streamline: 0.5,
//   easing: (t) => t,
//   start: {
//     taper: 0,
//     easing: (t) => t,
//     cap: true,
//   },
//   end: {
//     taper: 100,
//     easing: (t) => t,
//     cap: true,
//   },
// };

var options = {
  size: 16,
  smoothing: 0.5,
  thinning: 0.5,
  streamline: 0.5,
  easing: (t) => t,
  start: {
    taper: 0,
    cap: true,
  },
  end: {
    taper: 0,
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

function Canvas() {
  const colours = ["Black", "Blue", "Green", "Red", "Yellow"];

  // points is the line the user is currently drawing
  const [points, setPoints] = useState({ points: [] });
  // Strokes contains all of the lines that the user has drawn
  const [strokes, setStrokes] = useState(restoreLocalStorage());
  const [isDrawing, setIsDrawing] = useState(false);
  const [thickness, setThickness] = useState(20);
  const [colour, setColour] = useState(colours[0]);

  function handlePointerDown(e) {
    if (isDrawing) {
      // setPoints([[e.clientX, e.clientY, e.pressure]]);
      setPoints({
        colour: colour,
        thickness: thickness,
        points: [[e.clientX, e.clientY, e.pressure]],
      });
    }
  }

  function restoreLocalStorage() {
    if (localStorage.canvas != undefined) {
      let x = JSON.parse(localStorage.canvas);
      return x;
    } else {
      // console.log("No data");
      return [];
    }
  }

  function saveLocalStorage() {
    let data = JSON.stringify(strokes);
    console.log("saving");
    localStorage.canvas = data;
  }

  function handlePointerMove(e) {
    if (e.buttons !== 1 || isDrawing == false) return;
    // setPoints([...points, [e.clientX, e.clientY, e.pressure]]);
    setPoints({
      colour: colour,
      thickness: thickness,
      points: [...points.points, [e.clientX, e.clientY, e.pressure]],
    });
  }

  function handlePointerUp() {
    if (isDrawing) {
      setStrokes([...strokes, points]);
      setPoints({ points: [] });
    }
  }

  function clearCanvas() {
    setStrokes([]);
    setPoints({ points: [] });
  }

  function undo() {
    setStrokes(strokes.slice(0, strokes.length - 2));
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

  options.size = points.thickness;
  const stroke = getStroke(points.points, options);

  const pathData = getSvgPathFromStroke(stroke);
  let colourClassName = getClassNameForColour(points.colour);

  return (
    <>
      <input
        type="range"
        min="1"
        max="40"
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
        <path d={pathData} className={colourClassName}></path>
      </svg>
    </>
  );
}

export default Canvas;
