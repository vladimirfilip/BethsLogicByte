import React, { useState, useEffect } from "react";
import { getStroke } from "perfect-freehand";
import "./canvas.css";

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
  size: 10,
  thinning: 0.5,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (t) => t,
  start: {
    taper: 0,
    easing: (t) => t,
    cap: true,
  },
  end: {
    taper: 100,
    easing: (t) => t,
    cap: true,
  },
};

function Canvas() {
  // points is the line the user is currently drawing
  const [points, setPoints] = useState([]);
  // Strokes contains all of the lines that the user has drawn
  const [strokes, setStrokes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [thickness, setThickness] = useState(20);

  function handlePointerDown(e) {
    if (isDrawing) {
      setPoints([[e.clientX, e.clientY, e.pressure]]);
    }
  }

  function handlePointerMove(e) {
    if (e.buttons !== 1 || isDrawing == false) return;
    setPoints([...points, [e.clientX, e.clientY, e.pressure]]);
  }

  function handlePointerUp() {
    setStrokes([...strokes, points]);
    setPoints([]);
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

  let i = 0;
  const otherStrokes = strokes.map((x) => {
    i++;
    let stroke = getStroke(x, options);

    let pathData = getSvgPathFromStroke(stroke);
    return <path key={i - 1} d={pathData}></path>;
  });

  const stroke = getStroke(points, options);

  const pathData = getSvgPathFromStroke(stroke);

  return (
    <>
      <input
        type="range"
        min="1"
        max="40"
        value={thickness}
        onChange={(e) => setThickness(e.target.value)}
      ></input>
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
        Drawing
      </button>
      <svg>
        <path d={pathData} className="filter-green"></path>
        {otherStrokes}
      </svg>
    </>
  );
}

export default Canvas;
