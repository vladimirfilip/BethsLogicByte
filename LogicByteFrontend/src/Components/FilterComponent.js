import React, { useState, useRef, useEffect } from "react";
import FilterDisplay from "./FilterDisplay";
import FilterDropDown from "./FilterDropDown";
import PropTypes from "prop-types";

const MATHEMATICS = {
  Algebra: {
    Proofs: {},
    "Algebraic techniques": {
      Factorisation: {},
      Simplification: {},
      Expansions: {},
      "Factor and Remainder Theorem": {},
    },
    Graphs: { "Linear graphs": {}, "Curved graphs": {} },
  },
  Geometry: {
    "Area and perimeter": {},
    Triangles: {
      "Pythagoras' Theorem": {},
      "Incentre, orthocentre, medial line": {},
    },
  },
};

function FilterComponent(props) {
  const [showQuestions, setShowQuestions] = useState(false);
  const current_topic = useRef();
  const [filterTree, setFilterTree] = useState([]);

  const generate_filter = () => {
    for (const topic of Object.keys(MATHEMATICS)) {
      setFilterTree((prev) => [
        ...prev,
        <FilterDropDown
          title={topic}
          key={topic}
          topicList={MATHEMATICS[topic]}
          checked={false}
          changeTopic={changeTopic}
          updateChildSelected={null}
        />,
      ]);
    }
  };

  const changeTopic = (new_topic) => {
    setShowQuestions(true);
    if (new_topic != current_topic.current) {
      current_topic.current = new_topic;
    }
  };

  useEffect(() => {
    generate_filter(props.subject);
  }, []);

  return (
    <>
      {
        <table>
          {filterTree.map((comp) => (
            <tr key={filterTree.indexOf(comp)}>{comp}</tr>
          ))}
        </table>
      }
      {showQuestions && <FilterDisplay topic={current_topic} />}
    </>
  );
}

FilterComponent.propTypes = {
  subject: PropTypes.string,
};

export default FilterComponent;
