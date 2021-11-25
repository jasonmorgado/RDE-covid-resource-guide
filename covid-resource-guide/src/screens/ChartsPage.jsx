import './Charts.css';
import ChartsInput from "./ChartsInput.jsx";
import CovidDataChartList from "./CovidDataChartList";
import CovidDataTable from "./CovidDataTable.jsx";
import { useState } from 'react';

function ChartsPage(){

  // Data from Inputs
  const [countyList, setCountyList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [metrics, setMetrics] = useState([]);


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
          setMetrics={setMetrics}
        />
        <CovidDataChartList
          countyList={countyList}
          metrics={metrics}
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
export default ChartsPage;
