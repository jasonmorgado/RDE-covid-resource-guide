import React, { useState, useEffect} from 'react';
import DatePicker from 'react-date-picker';
import { Multiselect } from 'multiselect-react-dropdown';

function ChartsInput(props){
  // Function to pass data up
  var passInputData = props.passInputData;
  var passCountyList = props.setCountyList;
  var passStartDate = props.setStartDate;
  var passEndDate = props.setEndDate;

  // Local Data
  var inputData = props.inputData;

  // Multi-Select Dropdown: https://reactjsexample.com/react-multiselect-dropdown-with-search-and-various-options/
  var location_data = {
      county_list: [
        {name: 'Bergen', id: 1, state:"New Jersey"}, {name: 'Essex', id: 2, state:"New Jersey"},
        {name:"Albany", id:3, state:"New York"}, {name:"Bronx", id:4, state:"New York"},
        {name:"Fairfield", id:5, state:"Connecticut"}, {name:"Hartford", id:6, state:"Connecticut"}
      ]
  };

  var metric_data = {
    metric_options: [
      {id:1, name: "Daily Cases"}, {id:2, name:"Total Cases"},
      {id:3, name: "Daily Deaths"}, {id:4, name:"Total Deaths"},
      {id:5, name: "Daily Recoveries"}, {id:6, name:"Total Recoveries"},
    ]
  }

  function onSelectCounty(selectedList, selectedItem) {
    console.log("Selected:"+selectedItem.name);
    passCountyList(selectedList.slice());
  }

  function onRemoveCounty(selectedList, removedItem){
    console.log("Removed:"+removedItem.name);
    passCountyList(selectedList.slice());
    // inputData.countyList = selectedList;
    // passInputData(inputData); // Reloads the page for some reason
  }



  // Metric Dropdown
  function onSelectMetric(selectedList, selectedItem) {
    console.log("Selected:"+selectedItem.name);
  }


  // https://github.com/wojtekmaj/react-date-picker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  function onChangeStartDate(newDate){
    setStartDate(newDate); // For Calendar Input
    // Passing state in useEffect now
  }

  function onChangeEndDate(newDate){
    setEndDate(newDate);
    // Passing state in useEffect now
  }
  useEffect(() => {
      let startDateString = startDate.toISOString().split("T")[0];
      let endDateString = endDate.toISOString().split("T")[0];
      passStartDate(startDateString);
      passEndDate(endDateString);
      console.log("loaded chartsinput");
   });
  return (
    <div id="ChartsInput">

    <Multiselect
      options={location_data.county_list} // Options to display in the dropdown
      selectedValues={location_data.selectedValue} // Preselected value to persist in dropdown
      onSelect={onSelectCounty} // Function will trigger on select event
      onRemove={onRemoveCounty} // Function will trigger on remove event
      displayValue={"name"} // Property name to display in the dropdown options
      groupBy={"state"}
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
