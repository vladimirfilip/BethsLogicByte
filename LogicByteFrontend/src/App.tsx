import "./App.css";

import { Router } from "./router";
import { MathJaxContext } from "better-react-mathjax";

function App() {
  return (
    <MathJaxContext>
      <Router />
    </MathJaxContext>
  );
}

export default App;
