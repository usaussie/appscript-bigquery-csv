// BigQuery Project ID
const BQ_PROJECT_ID = 'my-project-id';
// Create a dataset in the BigQuery UI (https://bigquery.cloud.google.com)
  // and enter its ID below.
const BQ_DATASET_ID = 'my-data-set-id';

/**
 * DEFINE TABLES & SCHEMAS
 */
function table_folderusage()
{
  
  table = {};
  table.tableId = 'my-table-id';
  table.schema = {
      fields: [
        {name: 'Field_A', type: 'STRING'},
        {name: 'Field_B', type: 'STRING'},
        {name: 'Field_C', type: 'FLOAT'},
        {name: 'Field_D', type: 'FLOAT'},
        {name: 'Field_E', type: 'FLOAT'},
        {name: 'Field_F', type: 'FLOAT'}
      ]
    };
  
  return table;
  
}


/**
 * DO NOT CHANGE ANYTHING UNDER THIS
 */

function doCreateTable() {

  var thisTable = table_folderusage();

  var tableJson = constructTableJson(thisTable, BQ_PROJECT_ID, BQ_DATASET_ID);

  createTable(thisTable.tableId, BQ_PROJECT_ID, BQ_DATASET_ID, tableJson);

}

function doLoadCSV() {

  // Sample CSV file of Google Trends data conforming to the schema below.
  // https://docs.google.com/file/d/0BwzA1654gdfsgdsZ1p2UDg/edit
  var csvFileId = 'your-file-id';

  var thisTable = table_folderusage();

  bqLoadCsv(BQ_PROJECT_ID, BQ_DATASET_ID, csvFileId)
  bqLoadCsv(BQ_PROJECT_ID, BQ_DATASET_ID, thisTable.tableId, csvFileId)

}

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
  loadJob = BigQuery.Jobs.insert(myJob, projectId, data);
  Logger.log('Load job started. Check on the status of it here: ' +
      'https://console.cloud.google.com/bigquery?project=%s&page=jobs', BQ_PROJECT_ID);
}
