import React from 'react';
import './Map.css';

export function ListDeaths(props){
    var num = Math.round(props.max/8);
    return (
    <div className="map-overlay">
        <tr>
            <p className="color-box" style={{backgroundColor: "rgb(255, 245, 240)" }}></p> <p className="data">0 - {num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(254, 224, 210)"}}></p> <p className="data">{num} - {num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(252, 187, 161)"}}></p> <p className="data">{num + num} - {num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(252, 146, 114)"}}></p> <p className="data">{num + num + num} - {num + num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(251, 106, 74)"}}></p> <p className="data">{num + num + num + num} - {num + num + num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(239, 59, 44)"}}></p> <p className="data">{num + num + num + num + num} - {num + num + num + num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(203, 24, 29)"}}></p> <p className="data">{num + num + num + num + num + num} - {props.max}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(153, 0, 13)"}}></p> <p className="data">{props.max}+</p>
        </tr>
    </div>
    )
}