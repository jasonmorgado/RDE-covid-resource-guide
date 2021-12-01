import React, { useRef, useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import shapes from './tristate_county_shapes.json';
import { ListRecoveries } from './ListRecoveries';
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
  const [recoveries, setRecoveries] = useState([]);
  
  const [county, setCounty] = useState([]);
  const [state, setState] = useState([]);
  const [showTable, setshowTable] = useState(false);

  const [max, steMax] = useState(0);

  const [startDate, setStartDate] = useState(new Date("01 January 2020 12:00 UTC"));
  const [endDate, setEndDate] = useState(new Date());

  //Calculate the color for layer according to the argument d
  function ColorRecoveries(d, max) {
    let num = max/22;
    return d > max ? '#006d2c' :
           d > (num + num + num)  ? '#31a354' :
           d > (num + num)  ? '#74c476' :
           d > (num)  ? '#bae4b3' :
                      '#edf8e9';
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

    fetch("http://localhost:8080/rest/metrics/CovidData/covid_heatmap_sums/'" + start + "'&'" + end + "'")
      .then(response => response.json())
      .then(
        (json_string) => {
          let json_data = JSON.parse(json_string);
          let data_rows = json_data.DATA;
          setCounty(data_rows.COUNTY_CODE);
          setState(data_rows.STATE_CODE);
          setRecoveries(data_rows.SUM_RECOVERIES);        //vaccniation array here
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
          
          steMax(Math.max(...recoveries));                //vaccination array here
          color = ColorRecoveries(recoveries[i], max);    //vaccination array here
          show = recoveries[i];                           //vaccination array here
          
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

          if(recoveries.length !== 0){
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
            document.getElementById('name').innerHTML = county_name + "<br>" + "Recoveries: " + display_data;
          }
      });
    });

  });

    return (
      
          <div>
            <div>
              <div ref={mapContainer} className="map-container" />
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
                    <ListRecoveries max={max} />
                </p>
              </div>
            ) : null}
          </div>
       
    );
}