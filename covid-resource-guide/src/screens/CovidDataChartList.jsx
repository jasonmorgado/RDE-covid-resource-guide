import CovidDataChart from "./CovidDataChart.jsx";


function getCharts(props){
  var countyList = props.countyList;
  var startDate = props.startDate;
  var endDate = props.endDate;
  var metrics = props.metrics;

  if (Array.isArray(countyList)){
    return countyList.map((countyData) =>
      <CovidDataChart
        key={countyData.COUNTY}
        fips={countyData.FIPS}
        countyName={countyData.COUNTY}
        startDate={startDate}
        endDate={endDate}
        metrics={metrics}
      />
    );
  }else{
    return("Nocountylist")
  }

}

function CovidDataChartList(countyList){
  return (
    <div>
    {getCharts(countyList)}
    </div>
  );
}

export default CovidDataChartList;