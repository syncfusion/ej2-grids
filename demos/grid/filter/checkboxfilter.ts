import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Aggregate } from '../../../src/grid/actions/aggregate'
import { AggregateColumn } from '../../../src/grid/models/aggregate'
import {Group} from '../../../src/grid/actions/group';
import { ActionEventArgs } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
import { createElement } from '.../../../node_modules/@syncfusion/ej2-base';
import {  data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page,Selection,Filter)
let grid : Grid = new Grid({
    dataSource: data,
    allowPaging: true,
    allowFiltering: true,
    filterSettings: { type: 'CheckBox' },
    columns: [
        { field: 'OrderID' ,width:100,headerText:"Order ID"},
        { field: 'CustomerID' ,width:120, headerText:"Customer ID"}, 
        { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd'}, 
        { field: 'Freight',width:110 ,format:'C2',headerText:"Freight"},
        { field: 'ShipCountry',width:130, headerText:"Ship Country" }
    ],
})
 grid.appendTo('#Grid');