<cfscript>
run_aggregator();
function run_aggregator(){
  cffile(action="write", file="last_ran_aggregator.log" output=#Now()#);
  fetch_covid_data();
  // More aggregation scripts here
}
function fetch_covid_data(){
  // Fetches csv file containing today's Covid Cases/Deaths by county.
  fileURL = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv";
  cfhttp(url=fileURL, method="GET", file="us-counties.csv");
}

</cfscript>
