import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import { Multiselect } from 'multiselect-react-dropdown';

function ChartsInput(){
  // TODO County Dropdown
  // TODO Metric Dropdown
  // TODO Date Selectors
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

  function onSelectMetric(selectedList, selectedItem) {
    console.log("Selected:"+selectedItem.name);
  }
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
      options={metric_data.metric_options}
      selectedValues={metric_data.selectedValue}
      onSelect={onSelectMetric} // Function will trigger on select event
      displayValue="name" // Property name to display in the dropdown options
      singleSelect="true"
    />
    </div>
  );
}

export default ChartsInput;
