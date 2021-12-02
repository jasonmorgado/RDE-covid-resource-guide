import React from 'react';
import './HeatMap.css';

export function ListVaccines(props){
    var num = Math.round(props.max/15);
    return (
    <div className="map-overlay">
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(0,0,255)"}}></p> <p className="data">0 - {num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(0,255,0)"}}></p> <p className="data">{num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(255,255,0)"}}></p> <p className="data">{(num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(255,127,0)"}}></p> <p className="data">{(num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(props.max).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(255,0,0)"}}></p> <p className="data">{(props.max).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}+</p>
        </tr>
    </div>
    )
}