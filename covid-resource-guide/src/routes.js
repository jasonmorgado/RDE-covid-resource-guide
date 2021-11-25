import React from "react";
import { Header } from "./components";
import { Routes, Route, useNavigate } from "react-router-dom";
import TestingLocations from "./screens/TestingLocations";
import HeatMap from "./screens/HeatMap.js";
import Reports from "./screens/ChartsPage.jsx";


const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col flex-1 justify-center items-center text-xl text-gray-800">
      404 | No Found
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 mt-4 rounded-full bg-gray-200 shadow-md text-base hover:bg-gray-300"
      >
        Go Home
      </button>
    </div>
  );
};

export default function routes() {
  return (
    <div className="h-full flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<HeatMap />} />
        <Route path="/heatMap" element={<HeatMap />} />
        <Route path="/testingLocations" element={<TestingLocations />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
