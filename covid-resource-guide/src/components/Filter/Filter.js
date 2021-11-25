import React from "react";
import { useContextConsumer } from "../../AppContext";

export default function Filter() {
  const { selectedDistance, setsSlectedDistance, setIsAppLoading } =
    useContextConsumer();

  return (
    <div
      style={{
        zIndex: 3000,
      }}
      className="bg-white px-2 pt-1 w-64 h-20 rounded shadow-md border border-gray-300"
    >
      <p>Select Area</p>
      <select
        className="mt-2 w-full py-1 border border-gray-300"
        value={selectedDistance}
        onChange={(e) => {
          setIsAppLoading(true);
          setsSlectedDistance(e.target.value);
        }}
      >
        <option value={5}>5 Miles</option>
        <option value={10}>10 Miles</option>
        <option value={15}>15 Miles</option>
      </select>
    </div>
  );
}
