import { useState } from "react";
import { useEffect } from "react";

const REQUEST_URL = "/api.php";
const MIN_DISTANCE = 5; //KM

export default function useNearbyFacilities(position) {
  const [loading, setLoading] = useState(false);
  const [allFacilities, setAllFacilities] = useState(null);
  const [facilities, setFecilities] = useState([]);

  useEffect(() => {
    getFacilitiesLocations();
  }, []);

  useEffect(() => {
    if (position && allFacilities) {
      let nearByFound = 0;

      let loc = [];
      const columns = allFacilities["COLUMNS"];
      const data = allFacilities["DATA"];
      //loop over the returned result and filter

      for (let index = 0; index < data.length; index++) {
        // if (loc.length >= 5) break;
        const lat = data[index][columns.indexOf("Latitude")];
        const lng = data[index][columns.indexOf("Longitude")];
        const name = data[index][columns.indexOf("Name")];

        const distanceInKm = getDistanceFromLatLonInKm(
          position.lat,
          position.lng,
          lat,
          lng
        );

        if (distanceInKm <= MIN_DISTANCE && nearByFound < 5) {
          loc.push({
            id: lat + "" + lng + "" + index,
            lat,
            lng,
            name,
            nearBy: true,
          });
          nearByFound += 1;
        } else {
          loc.push({
            id: lat + "" + lng + "" + index,
            lat,
            lng,
            name,
            nearBy: false,
          });
        }
      }

      setFecilities(loc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, loading, allFacilities]);

  const getFacilitiesLocations = async () => {
    try {
      setLoading(true);
      const result = await fetch(REQUEST_URL);
      if (result.ok) {
        const all = await result.json();
        console.log(1, all);
        setAllFacilities(all);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return { facilities };
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
