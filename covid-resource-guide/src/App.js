import logo from './logo.svg';
import './App.css';
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
