import React from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import App from './App';
import Map from './Map';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Map />
  </React.StrictMode>,
  document.getElementById('root')
);
