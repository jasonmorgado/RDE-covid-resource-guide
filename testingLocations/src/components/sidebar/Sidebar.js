import React from "react";
import {
  ProSidebar,
  SidebarContent,
  // SidebarFooter,
  SidebarHeader,
  MenuItem,
  Menu,
} from "react-pro-sidebar";
import { useContextConsumer } from "../../AppContext";

export default function Sidebar({ showSideBar }) {
  const { selectedKm, setSelectedKm, setIsAppLoading } = useContextConsumer();

  return (
    <ProSidebar toggled={showSideBar} className="sidebar" breakPoint="md">
      <SidebarHeader>
        <div className="header">COVID-19</div>
		<div className="header">Resource Guide</div>
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="square">
          <MenuItem>Heatmap</MenuItem>
          <MenuItem>Reports</MenuItem>
          <MenuItem>Testing Locations</MenuItem>
		  <MenuItem>Vaccination Heatmap</MenuItem>
        </Menu>
        <div
          style={{
            margin: "10px",
            backgroundColor: "#fff",
            padding: "8px 10px",
            color: "black",
          }}
        >
          <div>Select area</div>
          <select
            style={{ marginTop: 10, width: "100%", padding: "4px 0" }}
            value={selectedKm}
            onChange={(e) => {
              setIsAppLoading(true);
              setSelectedKm(e.target.value);
            }}
          >
            <option value={5}>5 miles</option>
            <option value={10}>10 miles</option>
            <option value={15}>15 miles</option>
          </select>
        </div>
      </SidebarContent>
      {/* <SidebarFooter style={{ textAlign: "center", padding: 10 }}>
        Copyrights 2021,
      </SidebarFooter> */}
    </ProSidebar>
  );
}
