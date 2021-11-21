import CovidDataChart from "./CovidDataChart.jsx";


function getCharts(props){
  var countyList = props.countyList;
  var startDate = props.startDate;
  var endDate = props.endDate;
  console.log(typeof countyList)
  console.log(countyList)

  if (Array.isArray(countyList)){
    return countyList.map((countyData) =>
      <CovidDataChart
        key={countyData.COUNTY}
        fips={countyData.FIPS}
        countyName={countyData.COUNTY}
        startDate={startDate}
        endDate={endDate}
      />
    );
  }else{
    return("Nocountylist")
  }

}

function CovidDataChartList(countyList){
  console.log("Chartlistcountylist");
  console.log(countyList);
  console.log(countyList)
  return (
    <div>
    {getCharts(countyList)}
    </div>
  );
}

export default CovidDataChartList;
