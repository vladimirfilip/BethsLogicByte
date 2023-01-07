const SUBJECT_AUX_FILTERS = {
  Mathematics: {
    "Exam boards": ["OCR", "Edexcel", "AQA", "UKMT"],
    Exams: [
      "GCSE",
      "AS Level",
      "A Level",
      "JMC",
      "IMC",
      "SMC",
      "BMO",
      "TMUA",
      "STEP",
      "MAT",
    ],
  },
  Physics: {
    "Exam boards": ["OCR", "Edexcel", "AQA", "BPO"],
    Exams: ["GCSE", "AS Level", "A Level", "JPC", "IPC", "SPC", "BPhO", "BAAO"],
  },
};

const MATHEMATICS_FILTER = [
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

const PHYSICS_FILTER = [
  {
    name: "Experimental methods",
    subcategories: [
      { name: "The scientific process" },
      { name: "Accuracy and precision" },
      { name: "Variables" },
      { name: "Percentage and absolute uncertainty" },
      { name: "Dot and cross product" },
    ],
  },
  {
    name: "Kinematics and Mechanics",
    subcategories: [
      {
        name: "Motion",
        subcategories: [
          { name: "Speed and velocity" },
          { name: "Acceleration" },
          { name: "Projectile motion" },
          { name: "Momentum" },
          { name: "SUVAT equations" },
          { name: "Graphs of motion" },
          { name: "Experimental methods" },
        ],
      },
      {
        name: "Forces",
        subcategories: [
          { name: "Newton's Laws" },
          { name: "Types of forces" },
          { name: "Simple machines" },
          { name: "Kinetic and static friction" },
          { name: "Working with forces" },
        ],
      },
    ],
  },
  {
    name: "Electrostatics and circuits",
    subcategories: [
      {
        name: "Electricity",
        subcategories: [
          { name: "Electrostatic forces" },
          { name: "Electric fields" },
          { name: "Electric potential and electric potential energy" },
          { name: "Electrostatic phenomena" },
        ],
      },
      {
        name: "Circuits",
        subcategories: [
          { name: "Current and potential difference" },
          { name: "Kirchhoff's Laws" },
          { name: "Series and parallel circuits" },
          { name: "Resistance and Ohm's Law" },
          { name: "Potential divider circuits" },
          { name: "Circuit components" },
          { name: "Internal resistance and electromotive force" },
          { name: "Semiconductors" },
          { name: "Experimental methods" },
        ],
      },
    ],
  },
  {
    name: "Magnetism and magnetic fields",
    subcategories: [
      { name: "Magnets and magnetic forces" },
      { name: "Definition of a magnetic field" },
      { name: "Forces on moving charges in a magnetic field" },
      { name: "Lenz's Law" },
      { name: "Electromagnetic induction" },
      { name: "Motors and alternators" },
    ],
  },
  {
    name: "Waves",
    subcategories: [
      { name: "Types of waves" },
      { name: "Wavelength, frequency and wave velocity" },
      { name: "Reflection, refraction, diffraction" },
      { name: "Experimental methods" },
      {
        name: "Electromagnetic waves",
        subcategories: [
          { name: "Electromagnetic spectrum" },
          { name: "Calculation with EM waves" },
          { name: "Nature of EM waves" },
        ],
      },
    ],
  },
  {
    name: "Quantum physics",
    subcategories: [
      { name: "Young double slit experiment" },
      { name: "The Photoelectric effect" },
      { name: "Photons and Planck's relation" },
      { name: "Heisenberg's uncertainty principle" },
      { name: "Models of waves" },
    ],
  },
  {
    name: "Radioactivity",
    subcategories: [
      { name: "Nature of radioactivity" },
      { name: "Measuring radioactive activity" },
      { name: "Nuclear fission and fusion" },
      { name: "Nuclear equations" },
      { name: "Experimental methods" },
    ],
  },
  { name: "Astrophysics" },
];

export { SUBJECT_AUX_FILTERS, MATHEMATICS_FILTER, PHYSICS_FILTER };
