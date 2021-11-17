import React from "react";
import App from "./App";
import { AppContextProvider } from "./AppContext";

export default function AppWrapper() {
  return (
    <AppContextProvider>
      <App />
    </AppContextProvider>
  );
}
