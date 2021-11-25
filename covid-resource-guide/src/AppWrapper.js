import React from "react";
import { AppContextProvider } from "./AppContext";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <AppContextProvider>
        <Routes />
      </AppContextProvider>
    </BrowserRouter>
  );
}
