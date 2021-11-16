import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhaWw3Nzc3IiwiYSI6ImNrdm4zeGF2dDM5OXAzMHFmNTB2YnkyY20ifQ.QwWqhWiCOf6uC5r5fVYMPg';

export default function App() {
  var county_name;
  const mapContainer = useRef(null);
  const lng = (-74.0483);
  const lat = (40.3046);
  const zoom = (7);

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
        url: 'mapbox://shail7777.95gdgmi2'
      });

      //adding layer of county shapes into the map
      map.addLayer({
        'id': 'county-layer',
        'type': 'fill',
        'source': 'county-shapes',
        'source-layer': 'tristate_county_shapes-7kpkz1',
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
        'source-layer': 'tristate_county_shapes-7kpkz1',
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
          console.log(county_name);
          document.getElementById('name').innerHTML = county_name;
          }
        else{
          console.log("undefined");
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
