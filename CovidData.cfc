component restpath="/CovidData"  rest="true" {
    // System.cfc
    /**
    * @hint returns server operating system by accessing the path /rest/metrics/CovidData/os
    */
    remote struct function getOS() httpmethod="GET" restpath="os" {
        return server.os;
    }
    /**
    * @hint returns specific timezone struct values by passing the timezones struct key name
    *  with the path /rest/mappedRESTServiceName/system/timezone/{timezone-struct-keyName}
    *  e.g. /rest/mappedRESTServiceName/system/timezone/name
    *  or   /rest/mappedRESTServiceName/system/timezone/id
    */
    // remote string function getTimeZone(
    //             required string key restargsource="Path",
    //             string locale="en_US" restargsource="url")
    //             httpmethod="GET" restpath="timezone/{key}" {
    //     setLocale(arguments.locale);
    //     var tzInfo=getTimeZoneInfo();
    //     return tzInfo[arguments.key];
    // }

    remote string function getCovidData() httpmethod="GET" restpath="test" {
      sql_query = "SELECT TOP 10 * FROM covid_data";
      myQuery = queryExecute(sql=sql_query, options={datasource="covid_database"});
      record_count = myQuery.recordcount;
      query_string = SerializeJSON(myQuery, true);
      // When False, returns a list of rows like {"COLUMNS":["fips", "date" , ...]}
      // When True returns a json with {ROWCOUNT: NUM, "COLUMNS":["col1", "col2"], DATA: {"col1:[All items of col1]"}}
      return query_string;
    }
}
