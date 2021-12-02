import React from 'react';
import './HeatMap.css';

export function ListDeaths(props){
    var num = Math.round(props.max/22);
    return (
    <div className="map-overlay">
        <tr>
            <p className="color-box" style={{backgroundColor: "rgb(254,229,217)" }}></p> <p className="data">0 - {num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(252,174,145)"}}></p> <p className="data">{num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(251,106,74)"}}></p> <p className="data">{(num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(222,45,38)"}}></p> <p className="data">{(num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(props.max).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(165,15,21)"}}></p> <p className="data">{(props.max).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}+</p>
        </tr>
    </div>
    )
}