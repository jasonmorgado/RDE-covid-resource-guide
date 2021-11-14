component restpath="/CovidData"  rest="true" {
    // Test API function, returns the server's OS
    remote struct function getOS() httpmethod="GET" restpath="os" {
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
      sql_query = "SELECT TOP 10 * FROM covid_data";
      myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
      record_count = myQuery.recordcount;
      query_string = SerializeJSON(myQuery, true);
      // When False, returns a list of rows like {"COLUMNS":["fips", "date" , ...]}
      // When True returns a json with {ROWCOUNT: NUM, "COLUMNS":["col1", "col2"], DATA: {"col1:[All items of col1]"}}

      // CORS header
      cfheader(name="Access-Control-Allow-Origin", value="*");
      // If your packet does not have this header React WILL NOT TAKE IT
      // Change to the web domain once it's in production


      return query_string;
    }
}
