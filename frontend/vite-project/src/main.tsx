import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./src/routes";
import "./index.css";
import Navbar from "./components/Navbar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>,
);
