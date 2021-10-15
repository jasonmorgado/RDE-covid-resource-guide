# RDE-covid-resource-guide

## Setup
### Setting up Lucee with Commandbox.
Download Commandbox from here https://www.ortussolutions.com/products/commandbox

1. On windows, add CommandBox to the environment variables.

1. In this directory, run `box server start` to start the Lucee server.

This will open the directory viewer in your web browser. Any CFML files in this directory can will be ran using Lucee.

Note that, if you open the box CLI with `box`, you can omit the "box" from any of its commands.

### Setting up DataSource for MS SQL
1. Run `box install commandbox-cfconfig` to install cfconfig.

1. Run `box cfconfig set AdminPassword=NEW_PASSWORD`
where NEW_PASSWORD is replaced with a password of your choice.

  This will allow you to access the Lucee admin panel, which can be accessed by going to your system tray.

1. Restart the Lucee server if it's still running, either by running `box server restart` or by right clicking the Lucee icon and clicking "Restart Server".

1. Right click the Lucee icon in the system tray, and click Open > Server Admin.

1. Enter your password to access the admin panel.

  Note - If the password is not set, you won't be able to access the Admin panel.

1. Click Datasource

 - Type covid_database as the name of the datasource, and Microsoft SQL Server as the Type.

 - Fill out fields using the Datasource_credentials.secret file.

 This will add the Microsoft SQL Database to the datasources usable in the CFML code.

 You can run `test_database.cfm` to verify the connection.

## Scheduling the Data Aggregator

This application depends on a data aggregator that runs once a day.

The current implementation involves running `schedule_aggregator.cfm` to start the scheduled task, and that will schedule `data_aggregator.cfm` to be ran once a day.


From there we will need to set up the Datasource, which tells Lucee how to connect to the database.

To run `schedule_aggregator`, you'll need to open it from the directory viewer that opens with the server.

You may also use Lucee > Open > Site Home > schedule_aggregator.cfm

This window will show all scripts previously scheduled to run, followed by scripts that are now scheduled to run. The data aggregator should be on this list.
