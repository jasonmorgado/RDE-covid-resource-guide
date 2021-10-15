<!-- List all previously scheduled tasks -->
<cfschedule action="list" result="res">
<cfdump var=#res#>

<!-- Schedule Data Aggregator to run every midnight -->
 <cfschedule
  action="update"
  task="Data Aggregator"
  operation="HTTPRequest"
  startDate="10/10/2021"
  startTime="12:00 AM"
  url="http://127.0.0.1:64493/data_aggregator.cfm"
  interval="daily" />


  <!-- List all currently scheduled tasks -->
<cfschedule
  action="list"
  result="res"
>
<cfdump var=#res#>
