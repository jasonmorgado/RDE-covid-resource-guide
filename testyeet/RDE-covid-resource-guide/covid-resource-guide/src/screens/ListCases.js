import React from 'react';
import './HeatMap.css';

export function ListCases(props){
    var num = Math.round(props.max/22);
    return (
    <div className="map-overlay">
        <tr>
            <p className="color-box" style={{backgroundColor: "rgb(254,237,222)" }}></p> <p className="data">0 - {num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(253,190,133)"}}></p> <p className="data">{num} - {num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(253,141,60)"}}></p> <p className="data">{num + num} - {num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(230,85,13)"}}></p> <p className="data">{num + num + num} - {props.max}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(166,54,3)"}}></p> <p className="data">{props.max}+</p>
        </tr>
    </div>
    )
}