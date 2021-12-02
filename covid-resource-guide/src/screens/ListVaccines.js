import React from 'react';
import './HeatMap.css';

export function ListVaccines(props){
    var num = Math.round(props.max/22);
    return (
    <div className="map-overlay">
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(237,248,233)"}}></p> <p className="data">0 - {num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(186,228,179)"}}></p> <p className="data">{num} - {num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(116,196,118)"}}></p> <p className="data">{num + num} - {num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(49,163,84)"}}></p> <p className="data">{num + num + num} - {props.max}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(0,109,44)"}}></p> <p className="data">{props.max}+</p>
        </tr>
    </div>
    )
}