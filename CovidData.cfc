component restpath="/CovidData"  rest="true" {
    // Test API function, returns the server's OS
    remote struct function getOS() httpmethod="GET" restpath="os" {
      // CORS header
      cfheader(name="Access-Control-Allow-Origin", value="*");

        return server.os;
    }

    // Test API function 2, returns the text after echo/
    // Call with
    remote string function echo(
            required string text restargsource="Path",
            ) httpmethod="GET" restpath="echo/{text}"
    { // Quite the function declaration syntax

      // CORS header
      cfheader(name="Access-Control-Allow-Origin", value="*");
      returnString = "You said: " & text
      return returnString
    }

    remote string function getCovidData() httpmethod="GET" restpath="test" {
      sql_query = "SELECT TOP 100 * FROM covid_data";
      myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
      record_count = myQuery.recordcount;
      query_string = SerializeJSON(myQuery, false);
      // When False, returns a list of rows like {"COLUMNS":["fips", "date" , ...], DATA:[row1, row2]}
      // When True returns a json with {ROWCOUNT: NUM, "COLUMNS":["col1", "col2"], DATA: {"col1:[All items of col1]"}}

      // CORS header
      cfheader(name="Access-Control-Allow-Origin", value="*");
      // If your packet does not have this header React WILL NOT TAKE IT
      // Change to the web domain once it's in production


      return query_string;
    }

    remote string function getCounties()
    httpmethod="GET" restpath="counties/"
    {
      county_data_file = FileOpen("CountyList.txt", "read");
      county_list = []
      while (NOT FileisEOF(county_data_file)){
        line = FileReadLine(county_data_file);
        line_data = listToArray(line, ',');
        county_data = StructNew();

        county_data.fips = line_data[1];
        county_data.county = line_data[2];
        county_data.state = line_data[3];

        county_list.append(county_data)
      }
    //dict = {county_list=county_list}
    returnVal = SerializeJSON(county_list);

    // CORS header
    cfheader(name="Access-Control-Allow-Origin", value="*");

    return returnVal;
  }


    remote string function getCovidSums(
            required string start_date restargsource="Path",
            required string end_date restargsource="Path",
            required string county_list restargsource="Path",
            ) httpmethod="GET" restpath="covid_sums/{start_date}&{end_date}&{county_list}"
    {
      // URL is: "http://localhost:8080/rest/metrics/CovidData/covidsums/{start_date}&{end_date}&{county_list}
      // Dates are in YYYY-MM-DD format, fips_list is in ('00000', '12345')
      // Leave fips_list as () to disable filtering
      // Now the REST API for Covid Charts page' Table

      // Generate SQL Query
      cffile(action="read", file="covid_sum_query.sql", variable="sql_query");
      sql_query = Replace(sql_query, "{START_DATE}", start_date);
      sql_query = Replace(sql_query, "{END_DATE}", end_date);

      // If we passed a non-empty county_list, filter by that too
      if (county_list != "()"){
        sql_query = Replace(sql_query, "1=1", "covid_data.fips IN " & county_list);
      }

      // Get rows
      myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
      query_string = SerializeJSON(myQuery, false);

      // CORS header
      cfheader(name="Access-Control-Allow-Origin", value="*");
      return query_string
    }

    remote string function getChartData(
        required string start_date restargsource="Path",
        required string end_date restargsource="Path",
        required string county_list restargsource="Path",
    ) httpmethod="GET" restpath="chart_data/{start_date}&{end_date}&{county_list}"
    {
      cffile(action="read", file="covid_chart_query.sql", variable="sql_query");
      sql_query = Replace(sql_query, "{START_DATE}", start_date);
      sql_query = Replace(sql_query, "{END_DATE}", end_date);

      // If we passed a non-empty county_list, filter by that too
      if (county_list != "()"){
        sql_query = Replace(sql_query, "1=1", "covid_data.fips IN " & county_list);
      }

      // Get rows
      myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
      query_string = SerializeJSON(myQuery, true);

      // CORS header
      cfheader(name="Access-Control-Allow-Origin", value="*");
      return query_string
    }

    remote string function getHeatmapSums(
            required string start_date restargsource="Path",
            required string end_date restargsource="Path",
            ) httpmethod="GET" restpath="covid_heatmap_sums/{start_date}&{end_date}"
    {
      // URL is: "http://localhost:8080/rest/metrics/CovidData/covid_heatmap_sums/{start_date}&{end_date}
      // Dates are in YYYY-MM-DD format, fips_list is in ('00000', '12345')
      // Leave fips_list as () to disable filtering

      // Generate SQL Query
      cffile(action="read", file="heatmap_query.sql", variable="sql_query");
      sql_query = Replace(sql_query, "{START_DATE}", start_date);
      sql_query = Replace(sql_query, "{END_DATE}", end_date);


      // Get rows
      myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
      query_string = SerializeJSON(myQuery, true);

      // CORS header
      cfheader(name="Access-Control-Allow-Origin", value="*");
      return query_string
    }
}
