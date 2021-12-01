import { useCallback, useEffect, useState } from "react";

import errCodes from "./errCodes";

export default function useCurrentLocation() {
  const [error, setError] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSuccess = useCallback((position) => {
    const { latitude, longitude } = position.coords;

    setCurrentPosition({ lat: latitude, lng: longitude });
    // setCurrentPosition({ lat: "33.651779879095145", lng: "73.02080154418947" });
  }, []);

  const onFailure = useCallback((posError) => {
    //error constants
    const { PERMISSION_DENIED, TIMEOUT, POSITION_UNAVAILABLE } = posError;

    switch (posError.code) {
      case PERMISSION_DENIED: {
        setError(new Error(errCodes.denied));
        break;
      }
      case TIMEOUT: {
        setError(new Error(errCodes.timeout));
        break;
      }
      case POSITION_UNAVAILABLE: {
        setError(new Error(errCodes.unknown));
        break;
      }
      default: {
        setError(new Error(posError.message));
      }
    }
  }, []);

  const getLocation = () => {
    //need to implement insecure protocol check. As on Chrome, it won't work if hosted on http
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(onSuccess, onFailure);
    } else {
      setError(new Error(errCodes.notSupported));
    }
  };

  // return { posLoading: loading, position: currentPosition, posError: error };
  return { position: currentPosition, posError: error };
}
