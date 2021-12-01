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
      
      fetch_covid_data();
      insert_vax_data();
      //calculate_covid_stats();
      
      
      fetch_vaccine_data();
      // More aggregation scripts here
    }
    
    function days_since_update(){
      // Returns number of days since the aggregator has run.
      cffile(action="read", file="last_ran_aggregator.log", variable="last_ran_string");
      last_ran_datetime = parseDateTime(last_ran_string);
      days_since_update = DateDiff("d", last_ran_datetime, now());
      cfdump(var="Days since last update: " & days_since_update);
      return days_since_update
    }
    
    
    function fetch_covid_data(){
      // Fetches csv file containing today's Covid Cases/Deaths by county.
      // Sourced from NYTimes' GitHub repo.
      fileURL = "https://data.cdc.gov/resource/8xkx-amqh.csv";
      cfhttp(url=fileURL, method="GET", file="vaccinedatathings.csv");
    }
    
    function update_county_data(){
      // Takes counties from county_data.csv and uploads to DB
      // Only called once to ready the DB.
      county_vaccine_file = FileOpen("vax_data.csv", "read");
      values = []
      while (NOT FileisEOF(county_vaccine_file)){
        line = FileReadLine(county_vaccine_file);
        line_data = listToArray(line, ',');
        //cfdump(var=line_data);
        fips = line_data[1];
        county = line_data[2];
        state = line_data[3];
        population = line_data[4]
        // Don't forget quotation marks on strings! Not passed over like Python.
        value = "(#fips#, '#county#', '#state#', '#population#')";
        values.Append(value);
      }
    
      writeOutput("<br>Writing counties to DB:");
      sql_query = "INSERT INTO counties (fips, county_name, state, population) VALUES " & list
      myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
      cfdump(var=myQuery);
    }
    
    function show_covid_data(){
      // Dumps a readable version of the table.
      // Can't seem to use LIMIT on this, so it'll be 9999 rows.
      WriteOutput("Current Table: <br>")
      sql_query = "SELECT * FROM covid_data"
      myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
      cfdump(var=myQuery);
    }
    
    function insert_vax_data(){
      // Uses data from NYTimes' Repo "us-counties.csv"
      // Inserts rows into DB with cases, deaths
      // Table is currently configured to ignore duplicate values
      covid_data_file = FileOpen("vaccinedatathings.csv", "read");
      values = []
      while (NOT FileisEOF(covid_data_file)){
        line = FileReadLine(covid_data_file);
        line_data = listToArray(line, ',', true);
        //try naming values as stated in csv
        state = line_data[5];
        fips = line_data[2];
        date = line_data[1];
        Series_Complete_Yes = line_data[7];
        Administered_Dose1_Recip = line_data[15];
    
        in_target_area = arrayContains(["New Jersey", "New York", "Connecticut"], state);
        if (in_target_area AND fips != ""){
          value = "(#fips#, '#date#', '#Series_Complete_Yes#', '#Administered_Dose1_Recip#')";
          values.Append(value);
        }
    
        if(ArrayLen(values) == 999 OR FileisEOF(covid_data_file)){
          // Send it up
          // item,item,item as a string
          list = values.ToList();
          //query values have to correlate with database
          sql_query = "INSERT INTO coviddatabase.dbo.VaccineData (fips, date, series_complete, total_doses) VALUES " & list;
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

    function catch_vaccine_data(){
      fileURL = "https://data.cdc.gov/resource/8xkx-amqh.csv";
      cfhttp(url=fileURL, method="GET", file="vaccinedatathings.csv");
    }

    function insert_vaccine_data(){

    }
    
    </cfscript>
    