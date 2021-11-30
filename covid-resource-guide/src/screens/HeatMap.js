import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import shapes from './tristate_county_shapes.json';
import { ListCases } from './ListCases.js';
import { ListRecoveries } from './ListRecoveries';
import { ListDeaths } from './ListDeaths';
import DatePicker from 'react-date-picker';
import './HeatMap.css';

const ck = require('ckey');
mapboxgl.accessToken = ck.REACT_APP_access_token;

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

  const [startDate, setStartDate] = useState(new Date("01 January 2020 12:00 UTC"));
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

  //Calculate the color for layer according to the argument d
  function ColorCases(d, max) {
    let num = max/22;
    return d >= max ? '#a63603' :
           d > (num + num + num)  ? '#e6550d' :
           d > (num + num)   ? '#fd8d3c' :
           d > (num)   ? '#fdbe85' :
                      '#feedde';
  }
  function ColorRecoveries(d, max) {
    let num = max/22;
    return d > max ? '#006d2c' :
           d > (num + num + num)  ? '#31a354' :
           d > (num + num)  ? '#74c476' :
           d > (num)  ? '#bae4b3' :
                      '#edf8e9';
  }
  function ColorDeaths(d, max) {
    let num = max/22;
    return d > max ? '#a50f15' :
           d > (num + num + num)  ? '#de2d26' :
           d > (num + num)  ? '#fb6a4a' :
           d > (num)  ? '#fcae91' :
                      '#fee5d9';
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
  function getdata(start_date, end_date){
    let start;
    let end;
    if(start_date !== null){
      start = "" + start_date.toISOString().split("T")[0];
    }
    else{
      start = new Date();
      start = "" + start.toISOString().split("T")[0];
    }

    if(end_date !== null){
      end = "" + end_date.toISOString().split("T")[0];
    }
    else{
      end = new Date();
      end = "" + end.toISOString().split("T")[0];
    }

    fetch("https://54.224.113.88:8080/rest/metrics/CovidData/covid_heatmap_sums/'" + start + "'&'" + end + "'")
      .then(response => response.json())
      .then(
        (json_string) => {
          let json_data = JSON.parse(json_string);
          let data_rows = json_data.DATA;
          
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

  function onChangeStartDate(newDate){
    setIsLoaded(false);
    if(newDate === null){
      let date = new Date();
      setStartDate(date);
    }
    else{
      setStartDate(newDate);
    }
    getdata(newDate, endDate);
  }

  function onChangeEndDate(newDate){
    setIsLoaded(false);
    if(newDate === null){
      let date = new Date();
      setEndDate(date);
    }
    else{
      setEndDate(newDate);
    }
    getdata(startDate, newDate);
  }

  useEffect(() => {
    
    //Getting the data for the first time when the page is loaded
    if(data === false){
      getdata(startDate, endDate);
      setData(true);
    }

    //Creatinng the map
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom
    });

    // disable map rotation using right click + drag
    map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    
    map.on('load', async () => {

      //Checking if data from database is loaded 
      if(isLoaded === true){
        //Looping through the json file
        for (const feature of shapes.features) {
          const countyid = feature.properties.COUNTY;
          const stateid = feature.properties.STATE;
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
          if(i !== undefined){
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
              'fill-opacity': 1
              }
          });

          //Adding a outline around the layer
          map.addLayer({
            'id': stateid + countyid + "_outline",
            'type': 'line',
            'source': source,
            'layout': {},
            'paint': {
              'line-color': 'black',
              'line-width': 2,
            }
          });

          if(cases.length !== 0){
            setshowTable(true);
          }
          //if no data is avalable dont show the table
          else{
            setshowTable(false);
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
            <div>
              <div ref={mapContainer} className="map-container" />
            </div>
            
            <div className="centerbar" id="options">
              <button id="cases" onClick={DisplayCases} className="button seleact">Cases</button>  | <button id="recoveries" onClick={DisplayRecoveries} className="button">Recoveries</button> | <button id="deaths" onClick={DisplayDeaths} className="button">Deaths</button>
            </div>

            <div className="sidebar" id="name"></div>

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

            {showTable === true ?(
              <div id='legend'>
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