import { CommandColumn } from '../../../src/grid/actions/command-column';
import { Page,ColumnMenu ,Resize,Filter} from '../../../src/grid/actions';
import { Selection } from '../../../src/grid/actions/selection';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Group } from '../../../src/grid/actions/group';
import { Grid } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

/**
 * 
 */

Grid.Inject( Grid,Resize, Sort, Group, Filter, ColumnMenu, Page)
let grid: Grid = new Grid({
    dataSource: data,
          allowGrouping: true,
            allowSorting: true,
            allowFiltering: true,
            filterSettings: { type: 'CheckBox' },
            allowPaging: true,
            groupSettings: { showGroupedColumn: true },
            showColumnMenu: true,
            columns: [
                { field: 'OrderID', headerText: 'Order ID', width: 200 },
                { field: 'CustomerID', headerText: 'Customer Name', width:200},
                { field: 'Freight', format: 'C2',width:200 },
                { field: 'ShipName', headerText: 'Ship Name', width: 300 },
                { field: 'ShipCountry', visible: false, headerText: 'Ship Country', width: 200 },
                { field: 'ShipCity', headerText: 'Ship City', width: 200 }
            ]
})
grid.appendTo('#Grid');
