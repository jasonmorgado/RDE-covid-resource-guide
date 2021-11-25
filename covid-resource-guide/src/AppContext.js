import React, { useState, useContext } from "react";
import { LoadingIndicator } from "./components";

const Context = React.createContext();

export const AppContextProvider = ({ children }) => {
  const [isAppLoading, setIsAppLoading] = useState(false);
  const [selectedDistance, setsSlectedDistance] = useState(5);

  const [locationsWithIn10Miles, setLocationsWithIn10Miles] = useState(null);

  return (
    <Context.Provider
      value={{
        selectedDistance,
        setsSlectedDistance,
        isAppLoading,
        setIsAppLoading,
        locationsWithIn10Miles,
        setLocationsWithIn10Miles,
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
