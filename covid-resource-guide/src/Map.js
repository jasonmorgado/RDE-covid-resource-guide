import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import shapes from './tristate_county_shapes.json';
//import DatePicker from 'react-date-picker';

require('dotenv').config();

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhaWw3Nzc3IiwiYSI6ImNrdm4zeGF2dDM5OXAzMHFmNTB2YnkyY20ifQ.QwWqhWiCOf6uC5r5fVYMPg';
//console.log(process.env);

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

  //const county = [];
  //const state = [];

  const [startDate, onChangeStartDate] = useState(new Date());
  const [endDate, onChangeEndDate] = useState(new Date());


  function getColor(d) {
    return d > 140 ? '#800026' :
           d > 120  ? '#BD0026' :
           d > 100  ? '#E31A1C' :
           d > 80  ? '#FC4E2A' :
           d > 60   ? '#FD8D3C' :
           d > 40   ? '#FEB24C' :
           d > 20   ? '#FED976' :
                      '#FFEDA0';
  }
  
  function getindex(countyid, stateid){
    let index = 0;
    //console.log(countyid);
    //console.log(stateid);
    //console.log(county);

    for(let i = 0; i < county.length; i++){
      if(county[i] === countyid){
        if(state[i] === stateid){
          index = i;
          //console.log(index);
          //console.log(cases[i]);
          return index;
        }
      }
    }
    //console.log("No match found");
    return
  }

  function getdata(){
    fetch("http://localhost:8080/rest/metrics/CovidData/covid_sums/%272021-10-05%27&%272021-10-05%27&()")
      .then(response => response.json())
      .then(
        (json_string) => {
          let json_data = JSON.parse(json_string);

          let data_rows = json_data.DATA;
          const fips = data_rows.FIPS;
          
          for (let i = 0; i < fips.length; i++) {

            let x = String(fips[i].slice(0,2));
            let y = String(fips[i].slice(2));

            //state.push(x);
            //county.push(y);
            setState(prevArray => [...prevArray, x]);
            setCounty(prevArray => [...prevArray, y]);
          }
          
          //console.log(county);
          setCases(data_rows.SUM_CASES);
          setRecoveries(data_rows.SUM_RECOVERIES);
          setDeaths(data_rows.SUM_DEATHS);
          setIsLoaded(true);
          return;
        },
        (error) => {
          setIsLoaded(false);
          setError(error);
          return;
        }
      )
  }

  function style(feature) {
    const countyid = feature.properties.COUNTY;
    const stateid = feature.properties.STATE;
        
    let i = getindex(countyid, stateid);
    console.log("cases");
    console.log(cases[i]);
    
    return {
        fillColor: getColor(cases[i]),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

  useEffect(() => {
    
    if(data === false){
      getdata();
      setData(true);
    }
    
    //console.log(cases);

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom
    });

    //Getting the shapes of the county from mapbox studio 
    map.on('load', async () => {

      /*map.addSource('shapes', {
        'type': 'geojson',
        'data': shapes
      });*/

      if(isLoaded === true){
        for (const feature of shapes.features) {
          const countyid = feature.properties.COUNTY;
          const stateid = feature.properties.STATE;
        

          let i = getindex(countyid, stateid);
          //console.log("cases");
          //console.log(cases[i]);
          let color = getColor(cases[i]);
          //console.log(color);

          let source = stateid + countyid;

          map.addSource(source, {
            type: "geojson",
              data: {
                  "type": "Feature",
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": feature.geometry.coordinates,
                  }
              }
          });

          map.addLayer({
            'id': stateid + countyid + "_shape",
            'type': 'fill',
            'source': source,
            'layout': {},
            'paint': {
              'fill-color': color, 
              'fill-opacity': 0.5
              }
          });

          map.addLayer({
            'id': stateid + countyid + "_outline",
            'type': 'line',
            'source': sou,
            'layout': {},
            'paint': {
              'line-color': '#000',
              'line-width': 2
            }
          });
        }
      }
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
          document.getElementById('name').innerHTML = county_name;
          }
      });
    });
  });

    return (
      
          <div>
            <div className="sidebar" id="name"></div>
            <div ref={mapContainer} className="map-container" />
          </div>
       
    );
}