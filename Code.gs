// BigQuery Project ID - all lowercase
const BQ_PROJECT_ID = 'my-project-id';
// Create a dataset in the BigQuery UI (https://bigquery.cloud.google.com)
  // and enter its ID below.
const BQ_DATASET_ID = 'my-data-set';
// folder ID for where to look for CSV files to process - CANNOT BE A SHARED DRIVE (as of November 25, 2020)
// IE: the last part of the folder URL, like: https://drive.google.com/drive/u/0/folders/1fzw_Vx8uoidshda_B6SOFjEI_Co
const PENDING_CSV_DRIVE_FOLDER_ID = "my-pending-id";
// trash files after processing, or just move to another drive
const TRASH_FILES_AFTER_MOVE = false;
// if TRASH_FILES_AFTER_MOVE  is false, then put them into this folder ID
const PROCESSED_CSV_DRIVE_FOLDER_ID = "my-processed-id";

/**
 * DEFINE TABLES & SCHEMAS
 */
function table_characters()
{
  
  table = {};
  table.tableId = 'characters';
  table.schema = {
      fields: [
        {name: 'name', type: 'STRING'},
        {name: 'hair_color', type: 'STRING'},
        {name: 'rating', type: 'FLOAT'},
        {name: 'some_numeric_thing', type: 'INTEGER'}
      ]
    };
  
  return table;
  
}

function table_places()
{
  
  table = {};
  table.tableId = 'places';
  table.schema = {
      fields: [
        {name: 'place_name', type: 'STRING'},
        {name: 'place_foo', type: 'STRING'},
        {name: 'place_value', type: 'FLOAT'},
        {name: 'place_numeric_thing', type: 'INTEGER'}
      ]
    };
  
  return table;
  
}

function process_all_pending_csv_files(){
  var folder = DriveApp.getFolderById(PENDING_CSV_DRIVE_FOLDER_ID);
  var files = folder.getFiles();
  while (files.hasNext()){
    var file = files.next();
    
    // need to figure out what kind of file it is using first column name in CSV
    var csv = file.getBlob().getDataAsString();
    var csvData = CSVToArray(csv, 1); // see below for CSVToArray function

    var firstRowFirstColumn = csvData[0][0].toString().trim();
    //Logger.log(firstRowFirstColumn);
    
    var doLoad = true;

    switch(firstRowFirstColumn)  {
        case "Name":
            Logger.log('CSV Type: Characters');

            var thisTable = table_characters();


            break;
        case "Place Name":
            Logger.log('CSV Type: Places');

            var thisTable = table_places();

            break;
        default:
            Logger.log('CSV Type: Unknown File Type. Skipping File Name: ' + file.getName());
            doLoad = false;
            break;
    }

    // if we detected the file type correctly, go ahead and load the file, and then move it to the processed folder
    if(doLoad) {

      Logger.log('Loading CSV file -> BQ Job. File ID: ' + file.getName());
      
      Logger.log('Project: ' + BQ_PROJECT_ID + ' --- Data Set: ' + BQ_DATASET_ID + ' --- Table ID: ' + thisTable.tableId + ' --- File ID: ' + file.getId())
      
      bqLoadCsv(BQ_PROJECT_ID, BQ_DATASET_ID, thisTable.tableId, file.getId());

      if(TRASH_FILES_AFTER_MOVE) {

        // trash the file
        file.setTrashed(true);

      } else {
        // remove the CSV file from the "Pending" folder 
        file.getParents().next().removeFile(file);
        // add the removed CSV file to the "Processed" folder
        DriveApp.getFolderById(PROCESSED_CSV_DRIVE_FOLDER_ID).addFile(file);
        Logger.log('Moving CSV file to Processed folder. File ID: ' + file.getName());
        
      }

    }

  } 

}

/**
 * Only run this once to create the intitial tables to hold the CSV data.
 */

function doCreateTables() {
  
  var thisTable = table_characters();
  var tableJson = constructTableJson(thisTable, BQ_PROJECT_ID, BQ_DATASET_ID);
  createTable(thisTable.tableId, BQ_PROJECT_ID, BQ_DATASET_ID, tableJson);

  var thisTable = table_places();
  var tableJson = constructTableJson(thisTable, BQ_PROJECT_ID, BQ_DATASET_ID);
  createTable(thisTable.tableId, BQ_PROJECT_ID, BQ_DATASET_ID, tableJson);

}

/**
* DO NOT CHANGE ANYTHING BELOW THIS
*/

function constructTableJson(thisTableData, thisProjectId, thisDatasetId) {

  return{
      tableReference: {
        projectId: thisProjectId,
        datasetId: thisDatasetId,
        tableId: thisTableData.tableId
      },
      schema: thisTableData.schema
    };

}

/**
 * Create Tables
 */
function createTable(thisTableId, thisProjectId, thisDataSetId, tableReferenceJson) {

  table = BigQuery.Tables.insert(tableReferenceJson, thisProjectId, thisDataSetId);
  Logger.log('Table created: %s', thisTableId);

}


/**
 * Loads a CSV into BigQuery
 */
function bqLoadCsv(thisProjectId, thisDatasetId, thisTableId, csvFileId) {
  
  // Load CSV data from Drive and convert to the correct format for upload.
  var file = DriveApp.getFileById(csvFileId);
  var data = file.getBlob().setContentType('application/octet-stream');

  // Create the data upload job.
  var myJob = {
    configuration: {
      load: {
        destinationTable: {
          projectId: thisProjectId,
          datasetId: thisDatasetId,
          tableId: thisTableId
        },
        skipLeadingRows: 1,
        writeDisposition: 'WRITE_APPEND',
      }
    }
  };
  loadJob = BigQuery.Jobs.insert(myJob, thisProjectId, data);
  Logger.log('Load job started. Check on the status of it here: ' +
      'https://console.cloud.google.com/bigquery?project=%s&page=jobs', BQ_PROJECT_ID);
}

function CSVToArray(strData, rowLimit, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to COMMA.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );

    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [
        []
    ];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.

    var i = 0;

    while (arrMatches = objPattern.exec(strData)|| i < rowLimit) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];

        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);

        i++;
    }

    // Return the parsed data.
    return (arrData);
}
