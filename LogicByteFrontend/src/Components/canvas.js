import React, { useState, useEffect } from "react";
import { getStroke } from "perfect-freehand";
import "./canvas.css";
import MultiSelect from "./multiSelect";
import PropTypes from "prop-types";

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
  smoothing: 0,
  thinning: 0,
  streamline: 0.9,
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
      points: [...points.points, [e.clientX, e.clientY]],
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
  const [strokes, setStrokes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  // The slider returns a string, this keeps types consistent
  const [thickness, setThickness] = useState("4");
  const [colour, setColour] = useState(colours[0]);

  console.log(strokes);

  function clearCanvas() {
    setStrokes([]);
  }

  function undo() {
    setStrokes(strokes.slice(0, strokes.length - 2));
  }

  function handleSetStrokes(points) {
    setStrokes([...strokes, points]);
  }

  function handlePointerMove(e) {
    if (isErasing && e.buttons) {
      for (let i = 0; i < strokes.length; i++) {
        for (let j = 0; j < strokes[i].points.length; j++) {
          let dx = strokes[i].points[j][0] - e.clientX;
          let dy = strokes[i].points[j][1] - e.clientY;

          let dist = Math.sqrt(dx * dx + dy * dy);
          if (strokes[i].thickness < 4) {
            // Room for error
            dist -= 20;
          }
          if (dist / 1.5 < strokes[i].thickness) {
            let newStrokes = [...strokes];
            newStrokes.splice(i, 1);
            setStrokes(newStrokes);
            return;
          }
        }
      }
    }
  }

  if (isDrawing) {
    document.body.classList.add("pen");
    document.body.classList.remove("eraser");
  } else if (isErasing) {
    document.body.classList.remove("pen");
    document.body.classList.add("eraser");
  } else {
    document.body.classList.remove("pen");
    document.body.classList.remove("eraser");
  }

  useEffect(() => {
    if (isErasing) {
      document.onpointermove = handlePointerMove;
    }
    // I don't know why strokes has to be here but it is
  }, [isErasing, strokes]);

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
        data-html2canvas-ignore
        type="range"
        min="1"
        max="20"
        value={thickness}
        onChange={(e) => {
          setThickness(e.target.value);
          setIsDrawing(false);
        }}
      ></input>
      <MultiSelect
        values={colours}
        selectedValue={colour}
        setSelectedValue={setColour}
      />
      <button
        data-html2canvas-ignore
        onClick={() => {
          if (isDrawing) {
            setIsDrawing(false);
          } else {
            setIsDrawing(true);
            setIsErasing(false);
          }
        }}
      >
        {isDrawing ? "Stop Drawing" : "Start Drawing"}
      </button>
      <button
        data-html2canvas-ignore
        onClick={() => {
          if (isErasing) {
            setIsErasing(false);
          } else {
            setIsErasing(true);
            setIsDrawing(false);
          }
        }}
      >
        {isErasing ? "Stop Erasing" : "Start Erasing"}
      </button>

      <button data-html2canvas-ignore onClick={clearCanvas}>
        {" "}
        Clear
      </button>
      <button data-html2canvas-ignore onClick={undo}>
        {" "}
        Undo
      </button>
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
