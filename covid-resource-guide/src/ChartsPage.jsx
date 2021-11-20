import './App.css';
import ChartsInput from "./ChartsInput.jsx";
import CovidDataChart from "./CovidDataChart.jsx";
//import CovidDataTable from "./CovidDataTable.jsx";
import { useState, useEffect} from 'react';

function ChartsPage(){

  // Data from Inputs
  const [countyList, setCountyList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [metric, setMetric] = useState("Daily Cases");

  useEffect(() => {
      // Call API
      // fetch("http://localhost:8080/rest/metrics/CovidData/test")
      // Update Visual Elements
      console.log("loaded chartspage");
   });
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
        />
        <CovidDataChart/>
      </header>
    </div>
  );
}
// /        <CovidDataTable/>
export default ChartsPage;
