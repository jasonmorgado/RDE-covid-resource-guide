import React, { useState, useEffect} from 'react';
import DatePicker from 'react-date-picker';
import { Multiselect } from 'multiselect-react-dropdown';

function ChartsInput(props){
  // Function to pass data up
  const passCountyList = props.setCountyList;
  const passStartDate = props.setStartDate;
  const passEndDate = props.setEndDate;
  const passMetric = props.setMetric;

  // Multi-Select Dropdown: https://reactjsexample.com/react-multiselect-dropdown-with-search-and-various-options/

  const [countyList, setCountyList] = useState([
    {"COUNTY": 'Bergen', "FIPS": "34023", "STATE":"New Jersey"},
  ]);
  var location_data = {
      county_list: countyList,
  };

  var metric_data = {
    metric_options: [
      {id:1, name: "Daily Cases"}, {id:2, name:"Total Cases"},
      {id:3, name: "Daily Deaths"}, {id:4, name:"Total Deaths"},
      {id:5, name: "Daily Recoveries"}, {id:6, name:"Total Recoveries"},
    ]
  }

  function onSelectCounty(selectedList, selectedItem) {
    console.log("Selected:"+selectedItem.FIPS);
    passCountyList(selectedList.slice());
  }

  function onRemoveCounty(selectedList, removedItem){
    console.log("Removed:"+removedItem.name);
    passCountyList(selectedList.slice());
  }



  // Metric Dropdown
  function onSelectMetric(selectedList, selectedItem) {
    console.log("Selected:"+selectedItem.name);
    passMetric(selectedItem.name);
  }


  // https://github.com/wojtekmaj/react-date-picker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  function onChangeStartDate(newDate){
    setStartDate(newDate); // For Calendar Input
    passStartDate(newDate.toISOString().split("T")[0]);
  }

  function onChangeEndDate(newDate){
    setEndDate(newDate);
    passEndDate(newDate.toISOString().split("T")[0]);

  }

  function getCountyList(){
    fetch("http://localhost:8080/rest/metrics/CovidData/counties")
      .then(response => response.json())
      .then(
        (json_string) => {
          let json_data = JSON.parse(json_string);
          // console.log(json_data);
          setCountyList(json_data);
          // let data_rows = json_data.DATA;
          // setRows(data_rows);
        }
      )
  }

  useEffect(() => {
    // Now runs once
    // Pass up current Input Data
    let startDateString = startDate.toISOString().split("T")[0];
    let endDateString = endDate.toISOString().split("T")[0];
    passStartDate(startDateString);
    passEndDate(endDateString);
    // Fetch County list
    getCountyList();
    console.log("loaded chartsinput");
  }, [startDate, endDate, passStartDate, passEndDate]);
  return (
    <div id="ChartsInput">

    <Multiselect
      options={location_data.county_list} // Options to display in the dropdown
      selectedValues={location_data.selectedValue} // Preselected value to persist in dropdown
      onSelect={onSelectCounty} // Function will trigger on select event
      onRemove={onRemoveCounty} // Function will trigger on remove event
      displayValue={"COUNTY"} // Property name to display in the dropdown options
      groupBy={"STATE"}
      showCheckbox={true}
      closeOnSelect={false}
    />
    <Multiselect
      options={metric_data.metric_options} // Options to display in the dropdown
      selectedValues={metric_data.selectedValue} // Preselected value to persist in dropdown
      onSelect={onSelectMetric} // Function will trigger on select event
      displayValue={"name"} // Property name to display in the dropdown options
      showCheckbox={false}
      closeOnSelect={true}
      singleSelect={true}

    />
    <DatePicker
      onChange={onChangeStartDate}
      value={startDate}
    />
    <DatePicker
      onChange={onChangeEndDate}
      value={endDate}
    />

    </div>
  );
}

export default ChartsInput;
