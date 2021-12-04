import React from 'react';
import './HeatMap.css';

export function ListVaccines(props){
    var num = Math.round(props.max/9);
    return (
    <div className="map-overlayvax">
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(255,255,217)"}}></p> <p className="data">0 - {num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(237,248,177)"}}></p> <p className="data">{num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(199,233,180)"}}></p> <p className="data">{(num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(127,205,187)"}}></p> <p className="data">{(num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(num + num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(65,182,196)"}}></p> <p className="data">{(num + num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(num + num + num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(29,145,192)"}}></p> <p className="data">{(num + num + num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(num + num + num + num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(34,94,168)"}}></p> <p className="data">{(num + num + num + num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(num + num + num + num + num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(37,52,148)"}}></p> <p className="data">{(num + num + num + num + num + num + num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {(props.max).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
        </tr>
        <br/><br/>
        <tr> 
            <p className="color-box" style={{backgroundColor: "rgb(8,29,88"}}></p> <p className="data">{(props.max).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}+</p>
        </tr>
    </div>
    )
}