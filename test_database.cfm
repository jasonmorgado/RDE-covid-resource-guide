<cfscript>
// Using function so var can be used
test_database();
view_covid_data();
function test_database(){
  var qry = queryExecute( sql='SELECT @@version;', options={ datasource : "covid_database" } );
  cfdump(var = qry);
}
function view_covid_data(){
  var qry = queryExecute( sql="SELECT *
  FROM covid_data
  WHERE covid_data.fips = '34013'
  ORDER BY date ASC", options={ datasource : "covid_database" } );
  cfdump(var = qry);
}
</cfscript>
