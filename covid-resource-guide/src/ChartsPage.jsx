import './App.css';
import ChartsInput from "./ChartsInput.jsx";
import CovidDataChart from "./CovidDataChart.jsx";
import CovidDataChartList from "./CovidDataChartList";
import CovidDataTable from "./CovidDataTable.jsx";
import { useState, useEffect} from 'react';

function ChartsPage(){

  // Data from Inputs
  const [countyList, setCountyList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [metric, setMetric] = useState("Daily Cases");

  useEffect(() => {
    console.log("Updated metrics")
  }, [countyList, startDate, endDate, metric]);

  // useEffect(() => {
  //     // Call API
  //     fetch("http://localhost:8080/rest/metrics/CovidData/test")
  //       .then(response => response.json())
  //       .then(
  //         (json_string) => {
  //           let json_data = JSON.parse(json_string);
  //           let data_rows = json_data.DATA;
  //           //setIsLoaded(true);
  //           //setRows(data_rows);
  //         },
  //         (error) => {
  //           //setIsLoaded(true);
  //           //setError(error);
  //         }
  //       )
  //
  //     // Update Visual Elements
  //     console.log("loaded chartspage");
  //  });
  return (
    <div id="ChartsPage">
      <header className="App-header">
        <p>CountyList:{countyList.length}</p>
        <p>StartDate:{startDate}</p>
        <p>EndDate:{endDate}</p>
        <ChartsInput
          setCountyList={setCountyList}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setMetric={setMetric}
        />
        <CovidDataChartList
          countyList={countyList}
          startDate={startDate}
          endDate={endDate}
        />
        <CovidDataTable
          startDate={startDate}
          endDate={endDate}
          countyList={countyList}
        />
      </header>
    </div>
  );
}
// /        <CovidDataTable/>
export default ChartsPage;
