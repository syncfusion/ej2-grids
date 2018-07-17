import { Page } from '../../../src/grid/actions/page';
import { Grid } from '../../../src/grid/base/grid';
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
Grid.Inject(Page);

let grid: Grid = new Grid({
dataSource: data.slice(0,8),
columns: [
    {
        headerText: 'Employee Image', textAlign: 'Center',
        template: '#template', width: 180
    },
    { field: 'OrderID', headerText: 'Employee ID', width: 125 },
    { field: 'CustomerID', headerText: 'Name', width: 120 },
    { field: 'ShipName', headerText: 'Title', width: 170 },
    {
        field: 'OrderDate', headerText: 'Hire Date',
        width: 135, format: { skeleton: 'yMd', type: 'date' }
    }
],
width: 'auto',
height: 359
});
grid.appendTo('#Grid');