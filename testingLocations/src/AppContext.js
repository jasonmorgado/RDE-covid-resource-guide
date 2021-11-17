import React, { useState, useContext } from "react";
import { LoadingIndicator } from "./components";

const Context = React.createContext();

export const AppContextProvider = ({ children }) => {
  const [selectedKm, setSelectedKm] = useState(5);
  const [isAppLoading, setIsAppLoading] = useState(true);

  return (
    <Context.Provider
      value={{
        selectedKm,
        setSelectedKm,
        isAppLoading,
        setIsAppLoading,
      }}
    >
      {children}
      {isAppLoading && <LoadingIndicator />}
    </Context.Provider>
  );
};

export const useContextConsumer = () => {
  return useContext(Context);
};
