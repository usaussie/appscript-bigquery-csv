/**
 * DO NOT CHANGE ANYTHING IN THIS FILE. JUST RUN THE FUNCTIONS PER INSTRUCTIONS
 */

/**
 * Only run this once to create the intitial tables to hold the CSV data.
 */

function create_tables_one_time() {
  
  var my_tables = tables_to_create();

  for (i = 0; i < my_tables.length; i++) {
    
    // generate correct function / table info from detected string
    var tableFunction;
    tableFunction = new Function('return ' + my_tables[i]);
    var thisTable = tableFunction()();

    var tableJson = constructTableJson(thisTable, BQ_PROJECT_ID, BQ_DATASET_ID);
    createTable(thisTable.tableId, BQ_PROJECT_ID, BQ_DATASET_ID, tableJson);

  }
  
}

/**
 * 
 * Run this to process all the CSV files in the pending director.
 * 
*/

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

    var detectedTableFunction = detect_csv_type(firstRowFirstColumn)
    
    if(detectedTableFunction === false) {
      Logger.log('CSV Type: Unknown File Type. Skipping File Name: ' + file.getName());
      doLoad = false;
    }
    
    // if we detected the file type correctly, go ahead and load the file, and then move it to the processed folder
    if(doLoad) {

      // generate correct function / table info from detected string
      var tableFunction;
      tableFunction = new Function('return ' + detectedTableFunction);
      var thisTable = tableFunction()();

      Logger.log('Attempt to load CSV file -> BQ Job. File ID: ' + file.getName());
      
      Logger.log('Project: ' + BQ_PROJECT_ID + ' --- Data Set: ' + BQ_DATASET_ID + ' --- Table ID: ' + thisTable.tableId + ' --- File ID: ' + file.getId())
      
      bqLoadCsv(BQ_PROJECT_ID, BQ_DATASET_ID, thisTable.tableId, file.getId());

      Logger.log('Loaded CSV file -> BQ Job. File ID: ' + file.getName());

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


