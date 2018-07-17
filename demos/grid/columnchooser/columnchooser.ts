import { Page } from '../../../src/grid/actions/page';
import { Selection,Toolbar,ColumnChooser } from '../../../src/grid/actions';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Group } from '../../../src/grid/actions/group';
import { Grid } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';


/**
 * 
 */

Grid.Inject(Page, Selection, Group, Sort,Toolbar, ColumnChooser)
let grid: Grid = new Grid({
    dataSource:data,
    showColumnChooser: true,
    allowPaging: true,
    toolbar: ['ColumnChooser'],
    columns: [
        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
        { field: 'CustomerID', headerText: 'Customer Name', width: 150, showInColumnChooser: false },
        { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
        { field: 'ShipCountry', visible: false, headerText: 'Ship Country', width: 150 },
        { field: 'ShipCity', visible: false, headerText: 'Ship City', width: 150 }
     ],
})
grid.appendTo('#Grid');
