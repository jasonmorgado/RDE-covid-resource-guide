<cfscript>
// Using function so var can be used
test_database();
function test_database(){
  var qry = queryExecute( sql='SELECT @@version;', options={ datasource : "covid_database" } );
  cfdump(var = qry);
}
</cfscript>
