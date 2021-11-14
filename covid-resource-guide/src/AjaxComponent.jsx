import React, { useState, useEffect} from 'react';

// From https://reactjs.org/docs/faq-ajax.html

function getTable(rows){
  if(rows){
    const table_rows = rows.map((row) =>
      <tr key={row[2]}>
        <td>{row[0]}</td>
        <td>{row[1]}</td>
        <td>{row[2]}</td>
        <td>{row[4]}</td>
        <td>{row[6]}</td>
      </tr>
    );
    const table = (<table>{table_rows}</table>)
    return table
  }else{
    return <div>Loading table...</div>
  }

}

function AjaxComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("http://localhost:61043/rest/metrics/CovidData/test")
      .then(response => response.json())
      .then(
        (json_string) => {
          let json_data = JSON.parse(json_string);
          console.log(json_data);

          let data_rows = json_data.DATA;
          setIsLoaded(true);
          setRows(data_rows);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

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

export default AjaxComponent;
