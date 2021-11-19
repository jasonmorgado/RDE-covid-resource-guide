import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

require('dotenv').config();

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhaWw3Nzc3IiwiYSI6ImNrdm4zeGF2dDM5OXAzMHFmNTB2YnkyY20ifQ.QwWqhWiCOf6uC5r5fVYMPg';
//console.log(process.env);

function getColor(d) {
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
}

export default function App() {
  var county_name;
  const mapContainer = useRef(null);
  const lng = (-74.0483);
  const lat = (40.3046);
  const zoom = (7);
  const [error, setError] = useState(null);
  const [data, setData] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cases, setCases] = useState([]);
  const [deaths, setDeaths] = useState([]);
  const [recoveries, setRecoveries] = useState([]);
  const [county, setCounty] = useState([]);
  const [state, setState] = useState([]);

  function getdata(){
    fetch("http://localhost:8080/rest/metrics/CovidData/test")
      .then(response => response.json())
      .then(
        (json_string) => {
          let json_data = JSON.parse(json_string);

          let data_rows = json_data.DATA;
          
          for (let i = 0; i < data_rows.length; i++) {
            setCases((oldArray => [...oldArray, data_rows[i][2]]));         //daily cases
            setRecoveries((oldArray => [...oldArray, data_rows[i][6]]));    //daily recoveries
            setRecoveries((oldArray => [...oldArray, data_rows[i][4]]));    //daily deaths
            
            let x = String(data_rows[i][0]).slice(0,2);
            let y = String(data_rows[i][0]).slice(2);

            setState((oldArray => [...oldArray, x]));    //county id
            setCounty((oldArray => [...oldArray, y]));    //state id
          }

          setIsLoaded(true);
          console.log(data_rows);
          return;
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
          return;
        }
      )
  }

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom
    });

    //Getting the shapes of the county from mapbox studio 
    map.on('load', () => {
      map.addSource('county-shapes', {
        type: 'vector',
        url: 'mapbox://shail7777.b5zhf6am'
      });

      if(data === false){
        getdata();
        setData(true);
      }
      //adding layer of county shapes into the map
      map.addLayer({
        'id': 'county-layer',
        'type': 'fill',
        'source': 'county-shapes',
        'source-layer': 'tristate_county_shapes-19hgor',
        'layout': {},
        'paint': {
          'fill-color': '#0080ff', 
          'fill-opacity': 0.5
          }
      });

      //adding a outline around each county
      map.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'county-shapes',
        'source-layer': 'tristate_county_shapes-19hgor',
        'layout': {},
        'paint': {
        'line-color': '#000',
        'line-width': 3
        }
      });
      
    });

    map.on('mousemove', (event) => {
      const county = map.queryRenderedFeatures(event.point);
      const display = ['properties', 'state'];

      const displayFeatures = county.map((feat) => {
        const displayFeat = {};
        display.forEach((prop) => {
          displayFeat[prop] = feat[prop];
        });
        county_name = displayFeat.properties.NAME + "";

        if(county_name.toString() !== 'undefined'){
          //console.log(county_name);
          document.getElementById('name').innerHTML = county_name;
          }
        //else{
          //console.log("undefined");
        //}
      });
    });
  });

  /*if (error) {
    return <div>Error: {error.message}</div>;
  } 
  else if (!isLoaded) {
    return <div>Loading...</div>;
  } 
  else {*/
    return (
      <div>
        <div className="sidebar" id="name"></div>
        <div ref={mapContainer} className="map-container" />
      </div>
    );
  //}
}
