import {Grid} from 'ag-grid-community';
import 'ag-grid-enterprise';

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const gridOptions = {

    rowModelType: 'serverSide',

    columnDefs: [
        {field: 'athlete',headerName:'ТТ'},
        {field: 'country', rowGroup: true, hide: true, headerName:'Группа 1'},
        {field: 'sport', rowGroup: true, hide: true, headerName:'Филиал'},
        {field: 'year', filter: 'number', filterParams: {newRowsAction: 'keep'},headerName:'Месяц'},
        {field: 'gold', aggFunc: 'sum', headerName:'Количество чеков с позицией'},
        {field: 'silver', aggFunc: 'sum', headerName:'Количество дней с продажами или остатками'},
        {field: 'bronze', aggFunc: 'sum', headerName:'Количество дней с продажами и остатками'},
        {field: 'total', aggFunc: 'sum', headerName:'Потери. руб'}
    ],

    defaultColDef: {
        sortable: true
    }

    // debug: true,
    // cacheBlockSize: 20,
    // maxBlocksInCache: 3,
    // purgeClosedRowNodes: true,
    // maxConcurrentDatasourceRequests: 2,
    // blockLoadDebounceMillis: 1000
};

const gridDiv = document.querySelector('#myGrid');
new Grid(gridDiv, gridOptions);

const datasource = {
    getRows(params) {
         console.log(JSON.stringify(params.request, null, 1));

         fetch('./olympicWinners/', {
             method: 'post',
             body: JSON.stringify(params.request),
             headers: {"Content-Type": "application/json; charset=utf-8"}
         })
         .then(httpResponse => httpResponse.json())
         .then(response => {
             params.successCallback(response.rows, response.lastRow);
         })
         .catch(error => {
             console.error(error);
             params.failCallback();
         })
    }
};

gridOptions.api.setServerSideDatasource(datasource);
