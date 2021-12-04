<cfscript>
run_aggregator();
function run_aggregator(){
  // Main Aggregator Script, this gets called daily.
  ONCE_A_DAY = true;
  cffile(action="write", file="last_ran_aggregator.log" output=#dateTimeFormat(now(), "yyyy.MM.dd HH:nn:ss ") #);

  /*
  if(days_since_update() < 1 AND ONCE_A_DAY){
    cfdump(var="Aggregator already ran today!");
    show_covid_data();
    return;
  }
  */
  cfdump(var="Running Aggregator...");
  cffile(action="write", file="last_ran_aggregator.log" output=#dateTimeFormat(now(), "yyyy.MM.dd HH:nn:ss ") #);
  //clear_covid_data();
  fetch_covid_data();
  insert_covid_data();
  calculate_covid_stats();
  update_county_data();
  // fetch_vaccine_data();
  // More aggregation scripts here
}

function days_since_update(){
  // Returns number of days since the aggregator has run.
  if(NOT FileExists("last_ran_aggregator.log")){
    yesterday = DateAdd('d', -1, now())
    cffile(action="write", file="last_ran_aggregator.log" output=#dateTimeFormat(yesterday, "yyyy.MM.dd HH:nn:ss ") #);
  }
  cffile(action="read", file="last_ran_aggregator.log", variable="last_ran_string");
  last_ran_datetime = parseDateTime(last_ran_string);
  days_since_update = DateDiff("d", last_ran_datetime, now());
  cfdump(var="Days since last update: " & days_since_update);
  return days_since_update
}

function clear_covid_data(){
  writeOutput("<br>Clearing Covid table:");
  sql_query = "DELETE FROM coviddatabase.dbo.counties";
  myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
  cfdump(var=myQuery);
}

function fetch_covid_data(){
  // Fetches csv file containing today's Covid Cases/Deaths by county.
  // Sourced from NYTimes' GitHub repo.
  fileURL = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";
  cfhttp(url=fileURL, method="GET", file="us-counties(all).csv");
}

function update_county_data(){
  // Takes counties from county_data.csv and uploads to DB
  // Only called once to ready the DB.
  county_data_file = FileOpen("us-counties(all).csv", "read");
  values = []
  while (NOT FileisEOF(county_data_file)){
    line = FileReadLine(county_data_file);
    line_data = listToArray(line, ',', true);
    //cfdump(var=line_data);
    fips = line_data[4];
    county = line_data[2];
    state = line_data[3];
    //population = line_data[3]
    // Don't forget quotation marks on strings! Not passed over like Python.
    //value = "(#fips#, '#county#', '#population#')";
    

    in_target_area = arrayContains(["New Jersey", "New York", "Connecticut"], state);
    if (in_target_area AND fips != ""){
      value = "(#fips#, '#county#')";
      values.Append(value);
    }
  
    if(ArrayLen(values) == 999 OR FileisEOF(county_data_file)){
    // Send it up
    // item,item,item as a string
      writeOutput("<br>Writing counties to DB:");

      list = values.ToList();
      //query values have to correlate with database
      sql_query = "INSERT INTO coviddatabase.dbo.counties (fips, countyname) VALUES " & list;
      cfdump(var=myQuery);
      myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
      values = [];
      list = [];
    }
  }

}

function show_covid_data(){
  // Dumps a readable version of the table.
  // Can't seem to use LIMIT on this, so it'll be 9999 rows.
  WriteOutput("Current Table: <br>")
  sql_query = "SELECT * FROM covid_data"
  myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
  cfdump(var=myQuery);
}

function insert_covid_data(){
  // Uses data from NYTimes' Repo "us-counties.csv"
  // Inserts rows into DB with cases, deaths
  // Table is currently configured to ignore duplicate values
  covid_data_file = FileOpen("us-counties(all).csv", "read");
  values = []
  while (NOT FileisEOF(covid_data_file)){
    line = FileReadLine(covid_data_file);
    line_data = listToArray(line, ',', true);
    state = line_data[3];
    fips = line_data[4];
    date = line_data[1];
    cases = line_data[5];
    deaths = line_data[6];

    in_target_area = arrayContains(["New Jersey", "New York", "Connecticut"], state);
    if (in_target_area AND fips != ""){
      value = "(#fips#, '#date#', '#cases#', '#deaths#')";
      values.Append(value);
    }

    
    if(ArrayLen(values) == 999 OR FileisEOF(covid_data_file)){
      // Send it up
      // item,item,item as a string
      list = values.ToList();
      sql_query = "INSERT INTO coviddatabase.dbo.CovidData (fips, date, total_cases, total_deaths) VALUES " & list
      WriteOutput("Inserting this many rows:");
      cfdump(var=ArrayLen(values))
      myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
      values = [];
      list = [];
    }
    
  }

  // Entire file sent to DB
  FileClose(covid_data_file);
}

function calculate_covid_stats(){
  // Perform Calculations on covid_data table, After cases/deaths are stored.
  // Computes sum_cases, sum_deaths, sum_recoveries, and recoveries.
  // Takes A LONG TIME to run (Several minutes), needs optimization in the future.
  sql_query = FileRead("covid_db_calculations.sql");
  myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
  show_covid_data();
}


function fetch_vaccine_data(){
  // Fetches json file containing yesterday's Vaccine data by county for NJ/NY/CT
  fileURL = "https://data.cdc.gov/resource/8xkx-amqh.json?";
  fileURL &= "$where=recip_state in('NJ', 'NY', 'CT')";
  yesterday = DateAdd('d',-1,Now())
  fileURL &= "&date=" & dateTimeFormat(yesterday, "yyyy-MM-dd");
  cfhttp(url=fileURL, method="GET", file="8xkx-amqh.json");
}

</cfscript>
