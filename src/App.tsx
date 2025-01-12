import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Recipe from "./pages/Recipe";
import Liked from "./pages/Liked";
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      <NavBar />
      <div id="body-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:idMeal" element={<Recipe />} />
          <Route path="/liked" element={<Liked />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
