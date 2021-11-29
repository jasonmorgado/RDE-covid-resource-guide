import { Line } from "react-chartjs-2";
import React, { useState, useEffect} from 'react';


function CovidDataChart(props){
  const startDate = props.startDate;
  const endDate = props.endDate;
  const metrics = props.metrics;
  const fips = props.fips;
  const countyName = props.countyName;
  const [rows, setRows] = useState([]);
  useEffect(() => {
    let params = `/'${startDate}'&'${endDate}'&('${fips}')`
    fetch("http://3.92.224.99:8080/rest/metrics/CovidData/chart_data" + params)
      .then(response => response.json())
      .then(
        (json_string) => {
          let json_data = JSON.parse(json_string);
          let data_rows = json_data.DATA;
          setRows(data_rows);
        }
      )
  }, [startDate, endDate, fips, metrics]);

  var datasets = [
    {
      label: "Daily Cases",
      data: rows.DAILY_CASES,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132, 0.2)",
      fill: false,
      lineTension: 0, // Disables Bezier curves
    },
    {
      label: "Total Cases",
      data: rows.TOTAL_CASES,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132, 0.2)",
      fill: false,
      lineTension: 0, // Disables Bezier curves
    },
    {
      label: "Daily Deaths",
      data: rows.DAILY_DEATHS,
      backgroundColor: "rgb(25, 25, 25)",
      borderColor: "rgba(25, 25, 25, 0.2)",
      fill: false,
      lineTension: 0, // Disables Bezier curves
    },
    {
      label: "Total Deaths",
      data: rows.TOTAL_DEATHS,
      backgroundColor: "rgb(25, 25, 25)",
      borderColor: "rgba(25, 25, 25, 0.2)",
      fill: false,
      lineTension: 0, // Disables Bezier curves
    },
    {
      label: "Daily Recoveries",
      data: rows.DAILY_RECOVERIES,
      backgroundColor: "rgb(132, 99, 255)",
      borderColor: "rgba(132, 99, 255, 0.2)",
      fill: false,
      lineTension: 0, // Disables Bezier curves
    },
    {
      label: "Total Recoveries",
      data: rows.TOTAL_RECOVERIES,
      backgroundColor: "rgb(132, 99, 255)",
      borderColor: "rgba(132, 99, 255, 0.2)",
      fill: false,
      lineTension: 0, // Disables Bezier curves
    },
  ]

  var data = {
      labels: rows.DATE,
      datasets : []
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
          type: "time",
          time: {
            unit: "day"
          }
        },

      ],
      yAxes: [
        {
          ticks: {
            beginAtZero:true,
            min: 0,
          }
        }
      ]
    },
    title:{
      display:true,
      text: countyName + " County"
    },
  };
  // Map Selected metrics to their datasets, put in graph
  for(let i = 0; i < metrics.length; i++){
    let metric = metrics[i];
    let metric_id = metric.id;
    let dataset = datasets[metric_id];
    data.datasets.push(dataset);
  }
  return <Line data={data} legend={legend} options={options} />;

}
export default CovidDataChart;
