import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import shapes from './tristate_county_shapes.json';
import { ListCases } from './ListCases.js';
import { ListRecoveries } from './ListRecoveries';
import { ListDeaths } from './ListDeaths';
import DatePicker from 'react-date-picker';

require('dotenv').config();

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhaWw3Nzc3IiwiYSI6ImNrdm4zeGF2dDM5OXAzMHFmNTB2YnkyY20ifQ.QwWqhWiCOf6uC5r5fVYMPg';
//console.log(process.env);

export default function App() {
  var county_name;
  var display_data;
  const mapContainer = useRef(null);
  const lng = (-74.172310);
  const lat = (40.733125);
  const zoom = (8);
  const [error, setError] = useState(null);
  const [data, setData] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cases, setCases] = useState([]);
  const [deaths, setDeaths] = useState([]);
  const [recoveries, setRecoveries] = useState([]);
  
  const [county, setCounty] = useState([]);
  const [state, setState] = useState([]);

  const [showCases, setshowCases] = useState(true);
  const [showRecoveries, setshowRecoveries] = useState(false);
  const [showDeaths, setshowDeaths] = useState(false);
  const [showTable, setshowTable] = useState(false);

  const [max, steMax] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  
  function DisplayCases() {
    setshowCases(true);
    setshowRecoveries(false);
    setshowDeaths(false);
    document.getElementById('cases').classList.add('seleact');
    document.getElementById('recoveries').classList.remove('seleact');
    document.getElementById('deaths').classList.remove('seleact');
  }

  function DisplayRecoveries() {
    setshowCases(false);
    setshowRecoveries(true);
    setshowDeaths(false);
    document.getElementById('recoveries').classList.add('seleact');
    document.getElementById('cases').classList.remove('seleact');
    document.getElementById('deaths').classList.remove('seleact');
  }

  function DisplayDeaths() {
    setshowCases(false);
    setshowRecoveries(false);
    setshowDeaths(true);
    document.getElementById('deaths').classList.add('seleact');
    document.getElementById('recoveries').classList.remove('seleact');
    document.getElementById('cases').classList.remove('seleact');
  }

  function onChangeStartDate(newDate){
    setStartDate(newDate); // For Calendar Input
    getdata();
  }

  function onChangeEndDate(newDate){
    setEndDate(newDate);
    getdata();
  }

  //Calculate the color for layer according to the argument d
  function ColorCases(d, max) {
    let num = max/8;
    return d > max ? '#800026' :
           d > (num + num + num + num + num + num)  ? '#BD0026' :
           d > (num + num + num + num + num)  ? '#E31A1C' :
           d > (num + num + num + num)  ? '#FC4E2A' :
           d > (num + num + num)   ? '#FD8D3C' :
           d > (num + num)   ? '#FEB24C' :
           d > (num)   ? '#FED976' :
                      '#FFEDA0';
  }
  function ColorRecoveries(d, max) {
    let num = max/8;
    return d > max ? '#005824' :
           d > (num + num + num + num + num + num + num)  ? '#238b45' :
           d > (num + num + num + num + num)  ? '#41ae76' :
           d > (num + num + num + num)  ? '#66c2a4' :
           d > (num + num + num)  ? '#99d8c9' :
           d > (num + num)  ? '#ccece6' :
           d > (num)   ? '#e5f5f9' :
                      '#f7fcfd';
  }
  function ColorDeaths(d, max) {
    let num = max/8;
    return d > max ? '#99000d' :
           d > (num + num + num + num + num + num + num)  ? '#cb181d' :
           d > (num + num + num + num + num)   ? '#ef3b2c' :
           d > (num + num + num + num)  ? '#fb6a4a' :
           d > (num + num + num)   ? '#fc9272' :
           d > (num + num)  ? '#fcbba1' :
           d > (num)  ? '#fee0d2' :
                      '#fff5f0';
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
    let start = "" + startDate.toISOString().split("T")[0];
    let end = "" + endDate.toISOString().split("T")[0];


    fetch("http://localhost:8080/rest/metrics/CovidData/covid_heatmap_sums/'" + start + "'&'" + end + "'")
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
          let color;
          let show;

          let i = getindex(countyid, stateid);
          
          if(showCases === true){
            steMax(Math.max(...cases));
            color = ColorCases(cases[i], max);
            show = cases[i];
          }
          if(showRecoveries === true){
            steMax(Math.max(...recoveries));
            color = ColorRecoveries(recoveries[i], max);
            show = recoveries[i];
          }
          if(showDeaths === true){
            steMax(Math.max(...deaths));
            color = ColorDeaths(deaths[i], max);
            show = deaths[i];
          }
                    
          //If county data is found in the databse 
          if(i){
            source = stateid + countyid + "&" + show;
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
          if(cases.length !== 0){
            setshowTable(true);
          }
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
          if(showCases === true){
            document.getElementById('name').innerHTML = county_name + "<br>" + "Cases: " + display_data;
          }
          if(showRecoveries === true){
            document.getElementById('name').innerHTML = county_name + "<br>" + "Recoveries: " + display_data;
          }
          if(showDeaths === true){
            document.getElementById('name').innerHTML = county_name + "<br>" + "Deaths: " + display_data;
          }

          }
      });
    });

  });

    return (
      
          <div>
            <div className="date">
              <DatePicker
                onChange={onChangeStartDate}
                value={startDate}
              />
              <DatePicker
                onChange={onChangeEndDate}
                value={endDate}
              />
            </div>

            <div className="centerbar" id="options">
              <button id="cases" onClick={DisplayCases} className="button seleact">Cases</button>  | <button id="recoveries" onClick={DisplayRecoveries} className="button">Recoveries</button> | <button id="deaths" onClick={DisplayDeaths} className="button">Deaths</button>
            </div>

            <div className="sidebar" id="name"></div>
            <div ref={mapContainer} className="map-container" />

            {showTable === true ?(
              <div class='map-overlay' id='legend'>
                <p>
                  {showCases === true ?(
                    <ListCases max={max} getcolor={ColorCases}/>
                  ) : null}
                  {showRecoveries === true ?(
                    <ListRecoveries max={max} getcolor={ColorCases}/>
                  ) : null}
                  {showDeaths === true ?(
                    <ListDeaths max={max} getcolor={ColorCases}/>
                  ) : null}
                </p>
              </div>
            ) : null}
          </div>
       
    );
}
