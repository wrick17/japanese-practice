import React from "react";
import ReactDOM from "react-dom/client";
import AppV2 from "./app/AppV2";
import { unregisterServiceWorkers } from "./utils/pwaCleanup";
import "./index.css";

void unregisterServiceWorkers();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppV2 />
  </React.StrictMode>,
);
