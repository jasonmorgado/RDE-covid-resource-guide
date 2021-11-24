import React from 'react';
import './index.css';

export function ListRecoveries(props){
    var num = Math.round(props.max/8);
    return (
    <div className="map-overlay">
        <tr>
            <p className="color-box" style={{backgroundColor: "rgb(247, 252, 253)" }}></p> <p className="data">0 - {num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(229, 245, 249)"}}></p> <p className="data">{num} - {num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(204, 236, 230)"}}></p> <p className="data">{num + num} - {num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(153, 216, 201)"}}></p> <p className="data">{num + num + num} - {num + num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(102, 194, 164)"}}></p> <p className="data">{num + num + num + num} - {num + num + num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(65, 174, 118)"}}></p> <p className="data">{num + num + num + num + num} - {num + num + num + num + num + num}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(35, 139, 69)"}}></p> <p className="data">{num + num + num + num + num + num} - {props.max}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(0, 88, 36)"}}></p> <p className="data">{props.max}+</p>
        </tr>
    </div>
    )
}