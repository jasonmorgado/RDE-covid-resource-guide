import { Line } from "react-chartjs-2";
import React, { useState, useEffect} from 'react';

function formatSQLArray(countyList){
  // Takes array countyList, returns string containing SQL formatted array

  var countyListString = "(";
  for (var i = 0; i < countyList.length; i++){
    let county = countyList[i];
    if (i < countyList.length - 1){
      countyListString = countyListString + "'" + county.FIPS + "',";
    } else {
      countyListString = countyListString + "'" + county.FIPS + "'";
    }
  }
  countyListString = countyListString + ")";
  return countyListString;
}

function CovidDataChart(props){
  const startDate = props.startDate;
  const endDate = props.endDate;
  const fips = props.fips;
  const countyName = props.countyName;
  const [rows, setRows] = useState([]);
  useEffect(() => {
    let params = `/'${startDate}'&'${endDate}'&('${fips}')`
    console.log("params:"+params)
    console.log(startDate)
    fetch("http://localhost:8080/rest/metrics/CovidData/chart_data" + params)
      .then(response => response.json())
      .then(
        (json_string) => {
          let json_data = JSON.parse(json_string);
          let data_rows = json_data.DATA;
          // setIsLoaded(true);
          setRows(data_rows);
          console.log("got datarows:")
          console.log(data_rows);
        }
      )
  }, [startDate, endDate]);



  //var dataObject = JSON.parse(jsonString);
  var data = {
      labels: rows.DATE, //List of dates
      datasets: [
        {
          label: "Daily Cases",
          data: rows.DAILY_CASES,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 0.2)",
          fill: false,
        }
      ]
    };
    const legend = {
      display: true,
      position: "bottom",
      labels: {
        fontColor: "#323130",
        fontSize: 14
      }
    };
    var options = {
      scales: {
        xAxes: [
          {
            type: "time"
          },

        ],
        yAxes: [
          {
            ticks: {
              beginAtZero:true,
              min: 0,
              max: 1000
            }
          }
        ]
      },

      title:{
        display:true,
        text: countyName
      },

    };
  return <Line data={data} legend={legend} options={options} />;

}
export default CovidDataChart;
