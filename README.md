# Loading CSVs into BigQuery from Google Drive

### OVERVIEW

This provides an easy method to look for CSV files in a specified Google Drive directory, then parse them and load into their relative/correct BigQuery table. These CSVs can be different types, intended to be loaded into different tables.

Premise: 
You want an easy method to allow someone to drop CSVs into a directory and have them loaded into BQ without having to worry about dataflow or dataprep, or cloud functions, or pubsub. You just want a low-code way to get data into BQ.

### ASSUMPTIONS:
 - The CSVs are stored in Google Drive, not Google Shared Drives (there's a limitation on moving those files around as of right now - 11/25/20)
 - This likely won't work for massive files, or things over a certain (unknown at this time) file size.
 - You will need to update the code / table functions if the CSVs change structure at any point.
 - Error handling needs to be improved of course, but that's for a later phase. Most of the time, the expectation is that you'd check the job history, or the execution history, and default error notifications to determine if you have an issue with the process described here.
 
### INSTRUCTIONS
 - Create a folder in Google Drive to store your CSV files that are pending processing, and then another folder to store processed CSV files.
 - Create a new project in google appscript (script.google.com)
 - Copy the files from this repo appscript
 - Make a copy of config.sample.gs and rename as config.gs...then make all your variable/customizations for your BQ project in there. You will NOT make any changes to any other files.
 - Update/write some functions to set up the tables you want. Follow the examples provided, ie: table_characters() and table_places(). Just change what's there, and copy/paste to create new table definitions based on what the CSV file(s) will contain.
 - Look in the Jobs.gs file -- it is the one you'll use to run the jobs / schedule executions for loads.
 - Run the create_tables_one_time() function once, which will prompt for permissions, and then create your BQ tables (if you did the above steps correctly).
 - Accept the permissions (asking for access for your script to read/write to google drive, bigquery etc)
 - Make sure there are some CSV files into the PENDING google drive folder you set up.
 - Run the process_all_pending_csv_files() function (once, or set a trigger)
 - Look in BigQuery at the jobs, and then the datasets and tables, and you should see data in there pretty quickly.

### RECOMMENDATION:
 - If you run this using a triggered schedule, then all you need to do, is move any CSVs into your pending folder, and they'll automatically get aggregated.
 - This is then easy to add as a source to a Data Studio Dashboard.
