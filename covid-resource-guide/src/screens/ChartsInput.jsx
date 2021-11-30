import React, { useState, useEffect} from 'react';
import DatePicker from 'react-date-picker';
import { Multiselect } from 'multiselect-react-dropdown';

function ChartsInput(props){
  // Function to pass data up
  const passCountyList = props.setCountyList;
  const passStartDate = props.setStartDate;
  const passEndDate = props.setEndDate;
  const passMetrics = props.setMetrics;

  // Multi-Select Dropdown: https://reactjsexample.com/react-multiselect-dropdown-with-search-and-various-options/
  const [countyList, setCountyList] = useState([
    {"COUNTY": 'Bergen', "FIPS": "34023", "STATE":"New Jersey"},
  ]);
  var location_data = {
      county_list: countyList,
      selected_values: [{"COUNTY": 'Bergen', "FIPS": "34023", "STATE":"New Jersey"}]
  };

  var metric_data = {
    metric_options: [
      {id:0, name: "Daily Cases"}, {id:1, name:"Total Cases"},
      {id:2, name: "Daily Deaths"}, {id:3, name:"Total Deaths"},
      {id:4, name: "Daily Recoveries"}, {id:5, name:"Total Recoveries"},
    ],
    selected_values : [{id:0, name: "Daily Cases"}]
  }

  function onSelectCounty(selectedList, selectedItem) {
    passCountyList(selectedList.slice());
  }

  function onRemoveCounty(selectedList, removedItem){
    passCountyList(selectedList.slice());
  }



  // Metric Dropdown
  function onSelectMetric(selectedList, selectedItem) {
    passMetrics(selectedList.slice());
  }
  function onRemoveMetric(selectedList, removedItem) {
    passMetrics(selectedList.slice());
  }


  // https://github.com/wojtekmaj/react-date-picker
  const [startDate, setStartDate] = useState(new Date("01 January 2020 12:00 UTC"));
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
    fetch("https://localhost:8080/rest/metrics/CovidData/counties")
      .then(response => response.json())
      .then(
        (json_string) => {
          let json_data = JSON.parse(json_string);
          setCountyList(json_data);
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
    passMetrics(metric_data.selected_values.slice());
  }, [startDate, endDate, passStartDate, passEndDate]);
  // Multi-Select Dropdown: https://reactjsexample.com/react-multiselect-dropdown-with-search-and-various-options/

  return (
    <div id="ChartsInput">

    <Multiselect // Multi-Select Dropdown: https://reactjsexample.com/react-multiselect-dropdown-with-search-and-various-options/
      options={location_data.county_list} // Options to display in the dropdown
      selectedValues={location_data.selected_values} // Preselected value to persist in dropdown
      onSelect={onSelectCounty} // Function will trigger on select event
      onRemove={onRemoveCounty} // Function will trigger on remove event
      displayValue={"COUNTY"} // Property name to display in the dropdown options
      groupBy={"STATE"}
      showCheckbox={true}
      closeOnSelect={false}
    />
    <Multiselect
      options={metric_data.metric_options} // Options to display in the dropdown
      selectedValues={metric_data.selected_values} // Preselected value to persist in dropdown
      onSelect={onSelectMetric}
      onRemove={onRemoveMetric}
      displayValue={"name"} // Property name to display in the dropdown options
      showCheckbox={false}
      closeOnSelect={true}
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
