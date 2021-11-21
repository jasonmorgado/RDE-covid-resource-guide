import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import shapes from './tristate_county_shapes.json';
//import DatePicker from 'react-date-picker';

require('dotenv').config();

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhaWw3Nzc3IiwiYSI6ImNrdm4zeGF2dDM5OXAzMHFmNTB2YnkyY20ifQ.QwWqhWiCOf6uC5r5fVYMPg';
//console.log(process.env);

export default function App() {
  var county_name;
  var display_data;
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

  const [startDate, onChangeStartDate] = useState(new Date());
  const [endDate, onChangeEndDate] = useState(new Date());


  //Calculate the color for layer according to the argument d
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
  
  //Find which index is county data is stored in the array 
  function getindex(countyid, stateid){
    let index = 0;
    for(let i = 0; i < county.length; i++){
      if(county[i] === countyid){
        if(state[i] === stateid){
          index = i;
          return index;
        }
      }
    }
    return
  }

  //Getting data from the database 
  function getdata(){
    fetch("http://localhost:8080/rest/metrics/CovidData/covid_heatmap_sums/'2021-10-10'&'2021-10-10'")
      .then(response => response.json())
      .then(
        (json_string) => {
          let json_data = JSON.parse(json_string);

          let data_rows = json_data.DATA;
          const fips = data_rows.FIPS;
          
          console.log(data_rows);
          setCounty(data_rows.COUNTY_CODE);
          setState(data_rows.STATE_CODE);
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

  useEffect(() => {
    
    if(data === false){
      getdata();
      setData(true);
    }

    //Creatinng the map
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom
    });

    
    map.on('load', async () => {

      //Checking if data from database is loaded 
      if(isLoaded === true){
        //Looping through the json file
        for (const feature of shapes.features) {
          const countyid = feature.properties.COUNTY;
          const stateid = feature.properties.STATE;
          const county_name = feature.properties.NAME;
          let source;

          let i = getindex(countyid, stateid);        
          let color = getColor(cases[i]);
          let county_cases = cases[i];

          //If county data is found in the databse 
          if(i){
            source = stateid + countyid + "&" + county_cases;
          }
          //No county data is found 
          else{
            source = stateid + countyid + "&" + 0;
          }

          //Adding the source from which the layer will be created 
          map.addSource(source, {
            type: "geojson",
            data: {
              "type": "Feature",
              "properties": feature.properties,
              "geometry": feature.geometry,
            }
          });

          //Adding the layer to the map
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

          //Adding a outline around the layer
          map.addLayer({
            'id': stateid + countyid + "_outline",
            'type': 'line',
            'source': source,
            'layout': {},
            'paint': {
              'line-color': '#000',
              'line-width': 2
            }
          });
        }
      }
    });

    //When user moves mouse on a certain layer diaply the data of that county
    map.on('mousemove', (event) => {
      const county = map.queryRenderedFeatures(event.point);
      const display = ['source', 'layer', 'properties',];

      const displayFeatures = county.map((feat) => {
        const displayFeat = {};
        display.forEach((prop) => {
          displayFeat[prop] = feat[prop];
        });
        
        var data = displayFeat.source;
        data = data.split("&");
        display_data = data[1];
        county_name = displayFeat.properties.NAME + "";

        if(county_name.toString() !== 'undefined'){
          document.getElementById('name').innerHTML = county_name + "<br>" + "Cases: " + display_data;
          }
      });
    });
  });

    return (
      
          <div>
            <div ref={mapContainer} className="map-container" />

            <div className="centerbar" id="options">
              <button onclick="activateLasers()" className="button">Cases |</button>
              <button onclick="activateLasers()" className="button">Recoveries |</button>
              <button onclick="activateLasers()" className="button">Deaths</button>
            </div>

            <div className="sidebar" id="name"></div>
          </div>
       
    );
}