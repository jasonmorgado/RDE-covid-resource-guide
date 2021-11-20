import './App.css';
import ChartsInput from "./ChartsInput.jsx";
import CovidDataChart from "./CovidDataChart.jsx";
//import CovidDataTable from "./CovidDataTable.jsx";
import { useState, useEffect} from 'react';

function ChartsPage(){

  //const [data, setData] = useState('No changes detected.');
  // const [numCounties, setNum] = useState(0);
  const [inputData, setInputData] = useState({
      countyList:[],
      startDate:"2021-10-04",
      endDate:"2021-10-4",
  });
  const [countyList, setCountyList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [metric, setMetric] = useState("Daily Cases");

  const passInputData = (inputData) => {
    setInputData(inputData) //For dates
    // setNum(inputData.countyList.length); // For countylist Len
    console.log("Updated input data");
    console.log(inputData.startDate);
    console.log(countyList)
  }
  useEffect(() => {
      // Call API
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
          passInputData={passInputData}
          inputData={inputData}
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
