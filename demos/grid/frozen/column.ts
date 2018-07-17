import { Page, Freeze } from '../../../src/grid/actions';
import { Grid } from '../../../src/grid/base/grid';
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
Grid.Inject(Page, Freeze);

let grid: Grid = new Grid({
    dataSource: data,
    frozenColumns: 2,
    columns: [
        { field: 'OrderID', headerText: 'Employee ID', width: 125 },
        { field: 'CustomerID', headerText: 'Name', width: 120 },
        { field: 'ShipName', headerText: 'Title', width: 170 },
        {
            field: 'OrderDate', headerText: 'Hire Date',
            width: 135, format: { skeleton: 'yMd', type: 'date' }
        },
        { field: 'Freight', headerText: 'Freight', width: 120 }
    ],
    width: 'auto',
    height: 410
});
grid.appendTo('#Grid');