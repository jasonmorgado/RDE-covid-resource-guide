<cfscript>
run_aggregator();
function run_aggregator(){
  // Main Aggregator Script, this gets called daily.
  ONCE_A_DAY = true;
  if(days_since_update() < 1 AND ONCE_A_DAY){
    cfdump(var="Aggregator already ran today!");
    return;
  }
  cfdump(var="Running Aggregator...");
  cffile(action="write", file="last_ran_aggregator.log" output=#dateTimeFormat(now(), "yyyy.MM.dd HH:nn:ss ") #);
  fetch_covid_data();
  fetch_vaccine_data();
  // More aggregation scripts here
}

function days_since_update(){
  cffile(action="read", file="last_ran_aggregator.log", variable="last_ran_string");
  last_ran_datetime = parseDateTime(last_ran_string);
  days_since_update = DateDiff("d", last_ran_datetime, now());
  cfdump(var="Days since last update: " & days_since_update);
  return days_since_update
}


function fetch_covid_data(){
  // Fetches csv file containing today's Covid Cases/Deaths by county.
  fileURL = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv";
  cfhttp(url=fileURL, method="GET", file="us-counties.csv");
}


function fetch_vaccine_data(){
  fileURL = "https://data.cdc.gov/resource/8xkx-amqh.json?";
  fileURL &= "$where=recip_state in('NJ', 'NY', 'CT')"
  cfhttp(url=fileURL, method="GET", file="8xkx-amqh.json");
}

</cfscript>
