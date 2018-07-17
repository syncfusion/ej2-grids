import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Group} from '../../../src/grid/actions/group';
import { ActionEventArgs } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
import {Sort} from '../../../src/grid/actions/sort';
import { createElement } from '.../../../node_modules/@syncfusion/ej2-base';
import {  data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page,Selection,Sort,Group)
let grid : Grid = new Grid({
    dataSource: data,
    allowPaging:true,
    allowSorting:true,
    allowGrouping:true,
    groupSettings:{showToggleButton:true},
    sortSettings: {columns:[{field:"CustomerID",direction:"Descending"},{field:"Freight",direction:"Descending"}]},
    dataBound: dataBound,
     columns: [{ field: 'OrderID' ,textAlign: 'Right',width:100,headerText:"Order ID"},
             { field: 'CustomerID' ,width:120, headerText:"Customer ID"}, 
             { field: 'EmployeeID' ,textAlign: 'Right',width:100,headerText:"Employee ID"},
             { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' }, 
             { field: 'Freight',textAlign: 'Right',width:110 ,format:'C2',headerText:"Freight"},
             { field: 'ShipCountry',width:130, headerText:"Ship Country Name List" },   
              { field: 'Verified', headerText: 'Verified', width: 190 }   

            ],
})
 grid.appendTo('#Grid');

 function dataBound(args:any): void {
     var instance =  document.getElementById("Grid")['ej2_instances'][0];
     instance.groupModule.groupColumn("OrderID");
 }