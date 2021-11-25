import React from 'react';
import './Map.css';

export function ListCases(props){
    var num = Math.round(props.max/8);
    return (
    <div className="map-overlay">
        <tr>
            <p className="color-box" style={{backgroundColor: "rgb(255, 237, 160)" }}></p> <p className="data">0 - {num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(254, 217, 118)"}}></p> <p className="data">{num} - {num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(254, 178, 76)"}}></p> <p className="data">{num + num} - {num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(253, 141, 60)"}}></p> <p className="data">{num + num + num} - {num + num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(252, 78, 42)"}}></p> <p className="data">{num + num + num + num} - {num + num + num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(227, 26, 28)"}}></p> <p className="data">{num + num + num + num + num} - {num + num + num + num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(189, 0, 38)"}}></p> <p className="data">{num + num + num + num + num + num} - {props.max}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(128, 0, 38)"}}></p> <p className="data">{props.max}+</p>
        </tr>
    </div>
    )
}