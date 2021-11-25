import React from "react";
import Map from "./Map";
import { Filter, Footer, NearLocationsTable } from "../components";

export default function App() {
  return (
    <div className="flex-1 relative">
      <div className="absolute left-0 right-0 m-4 flex justify-between flex-col md:flex-row">
        <Filter />
        <NearLocationsTable />
      </div>
      <Map />
      <Footer />
    </div>
  );
}
