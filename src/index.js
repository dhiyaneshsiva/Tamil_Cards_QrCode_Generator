import React from "react";
import ReactDOM from "react-dom";

// Mantine CSS
import "@mantine/core/styles.css";

// MAntine Provider

// Pages
import QrGenerator from "./QrGenerator/QrGenerator";
import { MantineProvider } from "@mantine/core";

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider>
      <QrGenerator />
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("result")
);
