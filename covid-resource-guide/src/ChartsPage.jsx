import './App.css';
import ChartsInput from "./ChartsInput.jsx";
import CovidDataChart from "./CovidDataChart.jsx";
import CovidDataTable from "./CovidDataTable.jsx";

function ChartsPage(){

  return (
    <div id="ChartsPage">
      <header className="App-header">
        <ChartsInput/>
        <CovidDataChart/>
        <CovidDataTable/>
      </header>

    </div>
  );
}

export default ChartsPage;
