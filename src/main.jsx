import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home.jsx";

// The home page is React. Every other page is still plain HTML + script.js,
// which owns the hash router and shows/hides the views.
const mount = document.getElementById("home-root");
if (mount) {
  createRoot(mount).render(
    <StrictMode>
      <Home />
    </StrictMode>
  );
}

import "../script.js";
