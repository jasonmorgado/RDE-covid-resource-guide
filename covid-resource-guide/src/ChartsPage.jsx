import './App.css';
import ChartsInput from "./ChartsInput.jsx";
import CovidDataChart from "./CovidDataChart.jsx";
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
        <CovidDataChart/>
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
