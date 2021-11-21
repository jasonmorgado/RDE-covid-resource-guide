import React, { useState, useEffect} from 'react';

// From https://reactjs.org/docs/faq-ajax.html

function getTable(rows){
  console.log("getTable")
  console.log(rows);
  if(rows){
    const table_rows = rows.map((row) =>
      <tr key={row[2]}>
        <td>{row[0]}</td>
        <td>{row[1]}</td>
        <td>{row[2]}</td>
        <td>{row[3]}</td>
      </tr>
    );
    const table = (
      <table>
        <tr>
          <td>FIPS</td>
          <td>Cases</td>
          <td>Deaths</td>
          <td>Recoveries</td>
        </tr>
        {table_rows}
      </table>
    )
    return table
  }else{
    return <div>Loading table...</div>
  }

}

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

function CovidDataTable(props) {
  var startDate = props.startDate;
  var endDate = props.endDate;
  var countyList = props.countyList;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    console.log("Table printing startDate: " + startDate);
  }, [startDate]);
  useEffect(() => {
    // Reformat countyList
    console.log("Calling useeffect");
    let fips_list = formatSQLArray(countyList);
    let parameters = "'" + startDate + "'&'" + endDate + "'&" + fips_list;
    console.log(parameters);
    let URI = "http://localhost:8080/rest/metrics/CovidData/covid_sums/"+parameters;
    console.log(URI);
    // URI Confirmed working
    fetch(URI)
      .then(response => response.json())
      .then(
        (json_string) => {
          let json_data = JSON.parse(json_string);
          let data_rows = json_data.DATA;
          console.log("datarows");
          console.log(json_data);
          setIsLoaded(true);
          setRows(data_rows);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [startDate, endDate, countyList]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
      {getTable(rows)}
      </div>
    );
  }
}

export default CovidDataTable;
