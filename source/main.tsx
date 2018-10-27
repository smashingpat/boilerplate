import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./view/App";
import "./styles.css";

const mountElement = document.getElementById("app");

ReactDOM.render(
    <App />,
    mountElement,
);
