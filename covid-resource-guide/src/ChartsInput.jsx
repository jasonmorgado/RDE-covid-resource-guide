import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import { Multiselect } from 'multiselect-react-dropdown';

function ChartsInput(){
  // TODO County Dropdown
  // TODO Metric Dropdown
  // TODO Date Selectors
  state = {
      options: [{name: 'Srigar', id: 1},{name: 'Sam', id: 2}]
  };

  function onSelect(selectedList, selectedItem) {
    console.log("Selected:"+selectedItem);
  }

  function onRemove(selectedList, removedItem){
    console.log("Removed:"+removedItem);
  }

  return (
    <div id="ChartsInput">
    <Multiselect
      options={state.options} // Options to display in the dropdown
      selectedValues={state.selectedValue} // Preselected value to persist in dropdown
      onSelect={onSelect} // Function will trigger on select event
      onRemove={onRemove} // Function will trigger on remove event
      displayValue="name" // Property name to display in the dropdown options
    />
    </div>
  );
}
