import React from "react";
import ReactDOM from "react-dom/client";
import IndianFoodApp from "./IndianFoodApp";
import "./styles.css";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <IndianFoodApp />
  </React.StrictMode>
);
