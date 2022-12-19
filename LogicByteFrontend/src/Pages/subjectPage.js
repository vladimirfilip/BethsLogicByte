import React from "react";
import PropTypes from "prop-types";
import ProfileDisplay from "../Components/ProfileDisplay";
import MainNavBar from "../Components/MainNavBar";
import ProblemOfDay from "../Components/ProblemOfDay";
import QuestionPicker from "../Components/QuestionPicker";

const data = [
  {
    name: "Algebra",
    subcategories: [
      { name: "Proofs" },
      {
        name: "Algebraic techniques",
        subcategories: [
          { name: "Factorisation" },
          { name: "Simplification" },
          { name: "Expansions" },
          { name: "Factor and Remainder theorems" },
          { name: "Partial fractions" },
          { name: "Other algebraic methods" },
        ],
      },
      {
        name: "Graphs",
        subcategories: [
          { name: "Linear graphs" },
          { name: "Curved graphs" },
          { name: "Transformations of graphs" },
        ],
      },
      {
        name: "Functions",
        subcategories: [
          { name: "General functions" },
          { name: "Inverse functions" },
          { name: "Piecewise functions" },
          { name: "Functional equations" },
        ],
      },
      {
        name: "Inequalities",
        subcategories: [
          { name: "Fundamental inequalities" },
          { name: "AM-GM inequality" },
          { name: "Cauchy-Schwarz inequality" },
          { name: "Other Olympiad inequalities" },
        ],
      },
      { name: "Sequences" },
    ],
  },
  {
    name: "Geometry",
    subcategories: [
      { name: "Area and perimeter" },
      { name: "Constructions" },
      { name: "Angles" },
      {
        name: "Properties of 3D shapes",
        subcategories: [{ name: "Volume" }, { name: "Surface area" }],
      },
      { name: "Triangles" },
      {
        name: "Circles",
        subcategories: [
          { name: "Elementary circle theorems" },
          { name: "Olympiad circle theorems" },
        ],
      },
      { name: "Similarity and congruency" },
      { name: "Coordinate geometry" },
      {
        name: "Trigonometry",
        subcategories: [
          { name: "sin cos and tan" },
          { name: "Other trigonometric functions" },
          { name: "Trigonometric identities" },
        ],
      },
    ],
  },
  {
    name: "Number Theory",
    subcategories: [
      { name: "Elementary theorems" },
      { name: "Arithmetic" },
      { name: "Factors multiples and primes" },
      { name: "Modular arithmetic" },
      { name: "Modulus function" },
      { name: "Set theory" },
      { name: "Diophantine equations" },
    ],
  },
  { name: "Probability" },
];

function SubjectPage(props) {
  let subject = window.location.pathname.slice(1);
  subject = subject[0].toUpperCase() + subject.slice(1);

  if (subject == "Informatics") {
    return (
      <>
        <MainNavBar link={props.changePage} />
        <h1>Coming soon!</h1>
      </>
    );
  }
  return (
    <>
      <MainNavBar link={props.changePage} />
      <ProblemOfDay
        data={[
          {
            title: `${subject} Problem of the Day`,
            description:
              "Description for any random question for some subject.",
          },
        ]}
      />
      <ProfileDisplay link={props.changePage} />
      <QuestionPicker changePage={props.changePage} data={data} />
    </>
  );
}

SubjectPage.propTypes = {
  changePage: PropTypes.func,
};

export default SubjectPage;
