import logo from './logo.svg';
import './App.css';
import ChartsInput from "./ChartsInput.jsx";
import AjaxComponent from "./AjaxComponent.jsx";
import { Line } from "react-chartjs-2";
import ChartsPage from "./ChartsPage.jsx";


function App() {


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ChartsPage/>

      </header>

    </div>
  );
}

export default App;
