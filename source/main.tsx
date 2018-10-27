import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles.css";
import App from "./view/App";

const mountElement = document.getElementById("app");

ReactDOM.render(
    <App />,
    mountElement,
);
