import React, { useState, useEffect} from 'react';

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
  const [countyDataList, setCountyDataList] = useState([]);
  const [countyMap, setCountyMap] = useState({});

  function pad_with_zeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}

  function getCounty(fips){
    fips = fips.trim()
    fips = fips.padStart(5, "0");
    // console.log(new_fips)
    if (countyMap[fips]){
      return countyMap[fips];
    }else{
      // console.log(new_fips)
      return "SKIP";
    }
  }

  function getRow(row){
    return(
      <tr key={row[0]}>
        <td>{getCounty(row[0])}</td>
        <td>{row[1]}</td>
        <td>{row[2]}</td>
        <td>{row[3]}</td>
      </tr>
    );

  }

  function getTable(rows, countyMap){
    if(Array.isArray(rows)){
      const table_rows = rows.map((row) => (
        getCounty(row[0]) != "SKIP"
        ? (<tr key={row[0]}>
            <td>{getCounty(row[0])}</td>
            <td>{row[1]}</td>
            <td>{row[2]}</td>
            <td>{row[3]}</td>
          </tr>)
          :null
      ));
      const table = (
        <table>
          <thead>
            <tr>
              <td>County</td>
              <td>Sum Cases</td>
              <td>Sum Deaths</td>
              <td>Sum Recoveries</td>
            </tr>
          </thead>
          <tbody>
            {table_rows}
          </tbody>
        </table>
      )
      return table
    }else{
      return <div>Loading table...</div>
    }

  }
  function getCountyList(){
    // Returns a list of object/dicts containing county data
    // Format: [{"COUNTY": 'Bergen', "FIPS": "34023", "STATE":"New Jersey"}]
    fetch("http://3.92.224.99:8080/rest/metrics/CovidData/counties")
      .then(response => response.json())
      .then(
        (json_string) => {
          let json_data = JSON.parse(json_string)
          setCountyDataList(json_data);
        }
      )
  }

  useEffect(() => {
    // Onstart
    getCountyList();
  }, []);
  useEffect(() => {
    // Run when we have countyDataList
    let tempCountyMap = {};
    for (let i = 0; i < countyDataList.length; i++){
      let countyData = countyDataList[i];
      let fips = countyData.FIPS;
      let countyName = countyData.COUNTY;
      tempCountyMap[fips] = countyName;
    }
    setCountyMap(tempCountyMap);
  }, [countyDataList]);
  useEffect(() => {
    // Reformat countyList
    let fips_list = formatSQLArray(countyList);
    let parameters = "'" + startDate + "'&'" + endDate + "'&" + fips_list;
    let URI = "http://3.92.224.99:8080/rest/metrics/CovidData/covid_sums/"+parameters;
    // URI Confirmed working
    fetch(URI)
    .then(response => response.json())
    .then(
      (json_string) => {
        let json_data = JSON.parse(json_string);
        let data_rows = json_data.DATA;
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
      {getTable(rows, countyMap)}
      </div>
    );
  }
}

export default CovidDataTable;
