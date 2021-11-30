import React, { useState } from "react";
import { useContextConsumer } from "../../AppContext";
import { IoChevronDownSharp, IoChevronUpSharp } from "react-icons/io5";

export default function NearLocationsTable() {
  const { locationsWithIn10Miles } = useContextConsumer();

  const [isOpen, setIsOpen] = useState(false);

  if (!locationsWithIn10Miles) {
    return null;
  }

  if (locationsWithIn10Miles.length === 0) {
    return (
      <div
        style={{ zIndex: 3000, maxWidth: 440 }}
        className="bg-white bg-opacity-90 rounded p-2 shadow-md mt-2 md:mt-0 self-start text-sm md:text-base"
      >
        Testing locations within 10 miles will be shown here. Currently, you
        don’t have any testing locations near you.
      </div>
    );
  }

  return (
    <div
      style={{
        zIndex: 3000,
        maxWidth: 440,
        overflow: "hidden",
      }}
      className="bg-white bg-opacity-90 rounded p-2 shadow-md mt-2 md:mt-0 self-start"
    >
      <div className="flex cursor-pointer " onClick={() => setIsOpen(!isOpen)}>
        <p className="flex-1 text-base">
          Five nearest testing locations within 10 miles.
        </p>
        <div className="ml-2 w-8 h-8 flex justify-center items-center">
          {isOpen ? (
            <IoChevronUpSharp size={22} />
          ) : (
            <IoChevronDownSharp size={22} />
          )}
        </div>
      </div>
      {isOpen && (
        <table className="table-auto w-full border-collapse border border-gray-600 mt-3">
          <thead>
            <tr>
              <th className="border border-gray-600">Name</th>
              <th className="border border-gray-600">Address</th>
            </tr>
          </thead>
          <tbody>
            {locationsWithIn10Miles.map(({ id, name, fullAddress }) => (
              <tr key={id}>
                <td className="border border-gray-600 text-center">{name}</td>
                <td className="border border-gray-600 text-center">
                  {fullAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
