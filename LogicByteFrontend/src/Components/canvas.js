import React, { useState, useEffect } from "react";
import { getStroke } from "perfect-freehand";
import "./canvas.css";
import MultiSelect from "./multiSelect";
import PropTypes from "prop-types";
import pen from "./pen.png";
import eraser from "./eraser.png";
import undo_img from "./undo.png";
import clear from "./clear.png";
import save_icon from "../Components/save.png";
import exportAsImage from "../helpers/exportAsImage";

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
  smoothing: 0.5,
  thinning: 0,
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

function pytag(x_1, y_1, x_2, y_2) {
  const dx = x_2 - x_1;
  const dy = y_2 - y_1;
  return Math.sqrt(dx * dx + dy * dy);
}

function CurrentLine(props) {
  const [points, setPoints] = useState({ points: [] });

  function handlePointerDown(e) {
    if (props.isDrawing) {
      setPoints({
        colour: props.colour,
        thickness: props.thickness,
        points: [[e.clientX, e.clientY + window.scrollY, e.pressure]],
      });
    }
  }

  function handlePointerMove(e) {
    if (e.buttons !== 1 || props.isDrawing == false) return;
    const interpolateDist = 20;
    const dist = pytag(
      points.points[points.points.length - 1][0],
      points.points[points.points.length - 1][1],
      e.clientX + window.scrollX,
      e.clientY + window.scrollY
    );
    const interpolatePoints = [];
    if (dist > interpolateDist && props.linearInterpolation) {
      const dx =
        e.clientX + window.scrollX - points.points[points.points.length - 1][0];
      const dy =
        e.clientY + window.scrollY - points.points[points.points.length - 1][1];

      for (let i = 0; i < Math.floor(dist / interpolateDist); i++) {
        interpolatePoints.push([
          points.points[points.points.length - 1][0] +
            window.scrollX +
            (dx / Math.floor(dist / interpolateDist)) * i,
          points.points[points.points.length - 1][1] +
            window.scrollY +
            (dy / Math.floor(dist / interpolateDist)) * i,
        ]);
      }
    }
    setPoints({
      colour: props.colour,
      thickness: props.thickness,
      points: [
        ...points.points,
        ...interpolatePoints,
        [e.clientX + window.scrollX, e.clientY + window.scrollY],
      ],
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

  let debug = [];
  if (props.debug) {
    debug = points.points.map((x, i) => {
      const stroke = getStroke([x], options);
      const pathData = getSvgPathFromStroke(stroke);
      let colourClassName = getClassNameForColour("Red");
      return <path d={pathData} key={i} className={colourClassName}></path>;
    });
  }
  const pathData = getSvgPathFromStroke(stroke);
  let colourClassName = getClassNameForColour(points.colour);

  return (
    <>
      <path d={pathData} className={colourClassName}></path>
      {debug}
    </>
  );
}

CurrentLine.propTypes = {
  isDrawing: PropTypes.bool,
  colour: PropTypes.string,
  thickness: PropTypes.string,
  setStrokes: PropTypes.func,
  debug: PropTypes.bool,
  linearInterpolation: PropTypes.bool,
};

function Canvas(props) {
  const colours = ["Black", "Blue", "Green", "Red", "Yellow"];

  // Strokes contains all of the lines that the user has drawn
  const [strokes, setStrokes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  // The slider returns a string, this keeps types consistent
  const [thickness, setThickness] = useState("4");
  const [colour, setColour] = useState(null);

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
          let dist = pytag(
            strokes[i].points[j][0],
            strokes[i].points[j][1],
            e.clientX + window.scrollX,
            e.clientY + window.scrollY
          );

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

  useEffect(() => {
    if (colour == null) {
      setIsDrawing(false);
    } else {
      setIsDrawing(true);
      setIsErasing(false);
    }
  }, [colour]);

  let i = 0;
  const otherStrokes = strokes.map((x) => {
    i++;
    options.size = x.thickness;
    let stroke = getStroke(x.points, options);

    let className = getClassNameForColour(x.colour);

    let pathData = getSvgPathFromStroke(stroke);
    return <path key={i - 1} d={pathData} className={`${className}`}></path>;
  });

  return (
    <>
      <span className="canvas-select">
        <div>
          <input
            data-html2canvas-ignore
            type="range"
            min="1"
            max="20"
            value={thickness}
            onChange={(e) => {
              setThickness(e.target.value);
            }}
          ></input>
        </div>
        <img
          src={pen}
          alt={"Pen"}
          className={`option-icon ${isDrawing ? "selected-icon" : ""}`}
          onClick={() => {
            if (isDrawing) {
              setIsDrawing(false);
            } else {
              if (colour == null) {
                setColour("Black");
              }
              setIsDrawing(true);
              setIsErasing(false);
            }
          }}
          data-html2canvas-ignore
        />
        <MultiSelect
          values={colours}
          selectedValue={colour}
          setSelectedValue={setColour}
        />
        <img
          src={eraser}
          alt={"Eraser"}
          className={`option-icon ${isErasing ? "selected-icon" : ""}`}
          onClick={() => {
            if (isErasing) {
              setIsErasing(false);
            } else {
              setIsErasing(true);
              setIsDrawing(false);
            }
          }}
          data-html2canvas-ignore
        />
        <img
          src={clear}
          alt="Clear"
          className={`option-icon`}
          data-html2canvas-ignore
          onClick={() => {
            clearCanvas();
            setIsDrawing(false);
            setIsErasing(false);
          }}
        />
        <img
          src={undo_img}
          alt="Undo"
          className={`option-icon`}
          data-html2canvas-ignore
          onClick={undo}
        />
        <img
          src={save_icon}
          className="option-icon"
          data-html2canvas-ignore
          onClick={() => exportAsImage(document.body, "sketch")}
        />
      </span>
      <div className="canvas_container">
        <div className="question">{props.questionComponent}</div>
        {(isDrawing || isErasing) && (
          <svg className="path">
            {otherStrokes}
            <CurrentLine
              isDrawing={isDrawing}
              colour={colour}
              thickness={thickness}
              setStrokes={handleSetStrokes}
              debug={false}
              linearInterpolation={true}
            />
          </svg>
        )}
      </div>
    </>
  );
}

Canvas.propTypes = {
  questionComponent: PropTypes.object,
  setCanvasSvg: PropTypes.func,
};

export default Canvas;
