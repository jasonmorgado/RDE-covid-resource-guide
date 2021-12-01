import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

const MenuList = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState(null);

  const menulist = [
    { name: "Heat Map", path: "/heatMap" },
    { name: "Reports", path: "/reports" },
    { name: "Testing Locations", path: "/testingLocations" },
    { name: "Vaccination Heat Map", path: "/vaccinationHeatMap" },
  ];

  return menulist.map((d) => (
    <li
      key={d.name}
      className={`py-4 px-5 cursor-pointer hover:bg-gray-100 text-gray-800 flex items-center ${
        selectedMenu === d.name && "border-b-4 border-gray-500"
      } `}
      onClick={() => {
        navigate(d.path);
        setSelectedMenu(d.name);
      }}
    >
      <span>{d.name}</span>
    </li>
  ));
};

export default function Header() {
  const navigate = useNavigate();

  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  return (
    <header className="flex justify-between shadow relative">
      <span
        className="no-underline text-2xl flex items-center px-6 py-4 cursor-pointer text-gray-800"
        onClick={() => navigate("/")}
      >
        COVID-19 Resource Guide
      </span>
      {/* Desktop Menu */}
      <ul className="hidden lg:flex">
        <MenuList />
      </ul>
      {/* Mobile Menu */}
      <div
        className={`absolute top-16 bg-white w-full shadow lg:hidden ${
          isDropdownMenuOpen ? "block" : "hidden"
        }`}
        style={{ zIndex: 4000 }}
        onClick={() => setIsDropdownMenuOpen(false)}
      >
        <MenuList />
      </div>
      <div
        className="flex lg:hidden items-center px-4 cursor-pointer"
        onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
      >
        <FiMenu size={26} />
      </div>
    </header>
  );
}
