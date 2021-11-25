import React, { useEffect, useState } from "react";
import L from "leaflet";

import useCurrentLocation from "./useCurrentLocation";
import {
  MapContainer,
  Marker,
  TileLayer,
  // MapConsumer,
  Popup,
  ZoomControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "./MarkerCluster.css";
import "./MarkerCluster.Default.css";

// import blueMarkerImage from "./assets/blueMarker";
import greenMarkerImage from "../assets/greenMarker.png";
import redMarkerImage from "../assets/redMarker.png";
import { useContextConsumer } from "../AppContext";

const greenMarker = L.icon({
  iconUrl: greenMarkerImage,
  iconSize: [40, 44],
  iconAnchor: [10, 44],
  popupAnchor: [10, -44],
});

const redMarker = L.icon({
  iconUrl: redMarkerImage,
  iconSize: [40, 44],
  iconAnchor: [10, 44],
  popupAnchor: [10, -44],
});

export default function Map() {
  const { position } = useCurrentLocation();

  const [locationList, setLocationList] = useState([]);
  const [locationData, setLocationData] = useState([]);

  const { selectedDistance, setIsAppLoading, setLocationsWithIn10Miles } =
    useContextConsumer();

  // const { facilities } = useNearbyFacilities(position);

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const getDistanceFromLatLonInMiles = React.useCallback(
    (lat1, lon1, lat2, lon2) => {
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
      return d * 0.621371; // Distance in mile
    },
    []
  );

  const makeLocationList = React.useCallback(
    (response) => {
      const columns = response["COLUMNS"];
      const data = response["DATA"];

      let tempLocationsWithIn10Miles = [];

      const tempLocationList = data.map((d, index) => {
        const lat = d[columns.indexOf("Latitude")];
        const lng = d[columns.indexOf("Longitude")];
        const name = d[columns.indexOf("Name")];
        const fullAddress = d[columns.indexOf("FullAddress")];

        const distanceInMiles = getDistanceFromLatLonInMiles(
          position?.lat,
          position?.lng,
          lat,
          lng
        );

        if (distanceInMiles <= 10) {
          tempLocationsWithIn10Miles.push({
            id: index,
            name,
            fullAddress,
            distanceInMiles,
          });
        }

        if (distanceInMiles <= selectedDistance) {
          return {
            id: index,
            lat,
            lng,
            name,
            nearBy: true,
            fullAddress,
          };
        }
        return {
          id: index,
          lat,
          lng,
          name,
          nearBy: false,
          fullAddress,
        };
      });

      tempLocationsWithIn10Miles = tempLocationsWithIn10Miles
        .sort((a, b) => a.distanceInMiles - b.distanceInMiles)
        .slice(0, 5);

      setLocationsWithIn10Miles(tempLocationsWithIn10Miles);
      setLocationList(tempLocationList);

      setTimeout(() => {
        setIsAppLoading(false);
      }, 1000);
    },
    [
      getDistanceFromLatLonInMiles,
      position?.lat,
      position?.lng,
      selectedDistance,
      setIsAppLoading,
      setLocationsWithIn10Miles,
    ]
  );

  useEffect(() => {
    setIsAppLoading(true);
  }, [setIsAppLoading]);

  useEffect(() => {
    if (locationList.length > 0) {
      makeLocationList(locationData);
    }
  }, [locationData, locationList.length, makeLocationList]);

  useEffect(() => {
    const fetchLocations = async () => {
      fetch("/api.php")
        .then((res) => res.json())
        .then((response) => {
          setLocationData(response);
          makeLocationList(response);
        });
    };

    if (position) {
      fetchLocations();
    }
  }, [makeLocationList, position]);

  if (!position) {
    return null;
  }

  return (
    <MapContainer
      center={[position?.lat, position?.lng]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%" }}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />

      <Marker position={[position?.lat, position?.lng]}>
        <Popup>You are here</Popup>
      </Marker>
      <MarkerClusterGroup>
        {locationList?.map((d) => (
          <Marker
            key={d.id}
            position={[d.lat, d.lng]}
            icon={d.nearBy ? greenMarker : redMarker}
          >
            <Popup>{d.fullAddress}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      {/* <MapConsumer>
                {(map) => {
                  map.on("click", function (e) {
                    const { lat, lng } = e.latlng;
                    console.log(lat, lng);
                  });
                  return null;
                }}
              </MapConsumer> */}
    </MapContainer>
  );
}
