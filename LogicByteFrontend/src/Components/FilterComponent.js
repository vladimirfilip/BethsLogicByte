import React from "react";
import FilterDisplay from "../../FilterDisplay";
import FilterDropDown from "./FilterDropDown";

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
  let filter_tree = null;

  function* generate_filter(sub_level, last_topic) {
    for (const topic of sub_level) {
      //
      // Base case: no more sublevels
      //
      const current_topic = last_topic + "\\" + topic;
      if (sub_level[topic].length == 0) {
        yield (
          <FilterDropDown
            children={null}
            title={current_topic}
            selectTopic={changeTopic}
          />
        );
      } else {
        // Until list comprehensions...
        let sub_comps = [];
        for (const sub_comp of generate_filter(
          sub_level[topic],
          current_topic
        )) {
          sub_comps.push(sub_comp);
        }
        yield (
          <FilterDropDown
            children={sub_comps}
            title={current_topic}
            selectTopic={null}
          />
        );
      }
    }
  }

  const changeTopic = (new_topic) => {
    if (new_topic != current_topic.current) {
      current_topic.current = new_topic;
    }
  };

  if (props.subject == "Mathematics") {
    for (const comp of generate_filter(MATHEMATICS, "")) {
      filter_tree.push(comp);
    }
  }
  return (
    <>
      {filter_tree}
      <FilterDisplay topic={current_topic} />
    </>
  );
}

export default FilterComponent;
