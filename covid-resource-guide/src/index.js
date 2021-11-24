import React from 'react';
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import App from './App';
import HeatMap from './HeatMap';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <HeatMap />
  </React.StrictMode>,
  document.getElementById('root')
);
