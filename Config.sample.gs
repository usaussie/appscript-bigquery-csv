/**
 * THIS IS YOUR CUSTOM CONFIG -- ONLY CHANGE THINGS IN THIS FILE
 * 
 * TO USE, MAKE A COPY OF THIS FILE AND RENAME AS CONFIG.GS
 * 
 * FUNCTIONS ARE COMMENTED OUT TO AVOID CONFLICTS WITH ACTUAL DEPLOYMENT OF THIS PROJECT.
 * IE: CONFLICTS BETWEEN CONFIG.GS AND CONFIG.SAMPLE.GS
 * 
 */


/**
 * SET UP YOUR PROJECT VARIABLES
 */

/*
// BigQuery Project ID - all lowercase
const BQ_PROJECT_ID = 'my-bq-project-id';
// Create a dataset in the BigQuery UI (https://bigquery.cloud.google.com)
  // and enter its ID below.
const BQ_DATASET_ID = 'my-bq-dataset-id';
// folder ID for where to look for CSV files to process - CANNOT BE A SHARED DRIVE (as of November 25, 2020)
// IE: the last part of the folder URL, like: https://drive.google.com/drive/u/0/folders/1fzw_Vx8uoidshda_B6SOFjEI_Co
const PENDING_CSV_DRIVE_FOLDER_ID = "1oM0skC98eiosahjfndsflsdaNY8mnhkyea";
// trash files after processing, or just move to another drive
const TRASH_FILES_AFTER_MOVE = false;
// if TRASH_FILES_AFTER_MOVE  is false, then put them into this folder ID
const PROCESSED_CSV_DRIVE_FOLDER_ID = "1k89yfudhsgbfdasMHwdXpr";
*/

/**
 * DEFINE TABLES & SCHEMAS
 */

/**
 * Returns an array used to create the tables needed.
 * References the table functions you've set up below.
 */

/*
function tables_to_create() {

  // these must be the exact names of the functions you will define below
  return table_functions = [
    "table_characters",
    "table_places"
  ];

}
*/

/**
 * 
 * DEFINE TABLE FUNCTIONS
 * Example:
 * 
 * function table_characters()
    {
      
      table = {};
      table.tableId = 'characters';
      table.schema = {
          fields: [
            {name: 'Character_Name', type: 'STRING'},
            {name: 'Age', type: 'FLOAT'},
            {name: 'Eyes', type: 'INTEGER'}
          ]
        };
      
      return table;
      
    }
 * 
 */
/*
function table_characters()
    {
      
      table = {};
      table.tableId = 'characters';
      table.schema = {
          fields: [
            {name: 'Character_Name', type: 'STRING'},
            {name: 'Age', type: 'FLOAT'},
            {name: 'Eyes', type: 'INTEGER'}
          ]
        };
      
      return table;
      
    }
*/
/**
 * 
 * END DEFINITIONS FOR TABLE FUNCTIONS
 */


/**
 * 
 * DEFINE DETECTION OF CSVs
 * 
 * You'll define the first column/first row information here for each CSV "type"
 * which tells the code which BQ table to a particular CSV into.
 * 
 */
/*
function detect_csv_type(firstRowFirstColumn) {

  switch(firstRowFirstColumn)  {
        case "Session Name":
            Logger.log('CSV Type: Sessions Created or Edited');

            var thisTableFunction = 'table_sessionsCreatedOrEdited';


            break;
        case "Folder Name":
            Logger.log('CSV Type: Folder Usage');

            var thisTableFunction = 'table_folderusage';

            break;
        case "UserName":
            Logger.log('CSV Type: Last Login');

            var thisTableFunction = 'table_lastLogin';

            break;
        case "Recorder Name":
            Logger.log('CSV Type: Remote Recorder Usage');

            var thisTableFunction = 'table_remoteRecorderUsage';

            break;
        default:
            return false;
    }

    return thisTableFunction;

}
*/
