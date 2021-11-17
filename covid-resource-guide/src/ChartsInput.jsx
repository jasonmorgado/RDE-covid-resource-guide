import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import { Multiselect } from 'multiselect-react-dropdown';
import Dropdown from 'react-dropdown';

function ChartsInput(){
  // TODO County Dropdown
  // TODO Metric Dropdown
  // TODO Date Selectors

  // Multi-Select Dropdown: https://reactjsexample.com/react-multiselect-dropdown-with-search-and-various-options/
  var location_data = {
      county_list: [{name: 'Bergen', id: 1, state:"New Jersey"},{name: 'Essex', id: 2, state:"New Jersey"}, {name:"Albany", id:3, state:"New York"}]
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
  }

  function onRemoveCounty(selectedList, removedItem){
    console.log("Removed:"+removedItem.name);
  }



  // Metric Dropdown
  function onSelectMetric(selectedList, selectedItem) {
    console.log("Selected:"+selectedItem.name);
  }

  const metricOptions = [
    "Daily Cases", "Total Cases", "Daily Deaths", "Total Deaths", "Daily Recoveries", "Total Recoveries"
  ];
  const defaultMetric = metricOptions[0];


  // https://github.com/wojtekmaj/react-date-picker
  const [startDate, onChangeStartDate] = useState(new Date());
  const [endDate, onChangeEndDate] = useState(new Date());

//<Dropdown options={metricOptions} onChange={onSelectMetric} value={defaultMetric} placeholder="Select a metric" />;

  return (
    <div id="ChartsInput">

    <Multiselect
      options={location_data.county_list} // Options to display in the dropdown
      selectedValues={location_data.selectedValue} // Preselected value to persist in dropdown
      onSelect={onSelectCounty} // Function will trigger on select event
      onRemove={onRemoveCounty} // Function will trigger on remove event
      displayValue="name" // Property name to display in the dropdown options
      groupBy="state"
      showCheckbox="true"
      closeOnSelect="false"
    />
    <Multiselect
      options={metric_data.metric_options} // Options to display in the dropdown
      selectedValues={metric_data.selectedValue} // Preselected value to persist in dropdown
      onSelect={onSelectMetric} // Function will trigger on select event
      displayValue="name" // Property name to display in the dropdown options
      showCheckbox="false"
      closeOnSelect="true"
      singleSelect="true"

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
