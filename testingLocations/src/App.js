import React, { useState } from "react";
import {
  MenuButton,
  //  Topbar,
  Sidebar,
} from "./components";
import Map from "./Map";

import "./MarkerCluster.css";
import "./MarkerCluster.Default.css";

import "./App.css";
import "react-pro-sidebar/dist/css/styles.css";

export default function App() {
  const [showSideBar, setShow] = useState(false);

  return (
    <div className="app-container">
      <MenuButton
        change={showSideBar}
        onClick={() => setShow((prev) => !prev)}
      />
      <Sidebar showSideBar={showSideBar} />
      <div className="content">
        {/* <Topbar /> */}
        <div style={{ flex: 1 }}>
          <Map />
        </div>
        {/* <Topbar /> */}
      </div>
    </div>
  );
}
