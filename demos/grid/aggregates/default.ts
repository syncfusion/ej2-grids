import { Page } from '../../../src/grid/actions/page';
import { Selection, Edit, Toolbar } from '../../../src/grid/actions';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Aggregate } from '../../../src/grid/actions/aggregate'
import { Group } from '../../../src/grid/actions/group';
import { Grid } from '../../../src/grid/base/grid';
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

/**
 * 
 */

Grid.Inject(Grid, Edit, Toolbar,Aggregate, Page)
let grid: Grid = new Grid({
    dataSource: data,
    aggregates: [{
        columns: [{
            type: 'Sum',
            field: 'Freight',
            format: 'C2',
            footerTemplate: 'Sum: ${sum}'
        }]
    },
    {
        columns: [{
            type: 'Average',
            field: 'Freight',
            format: 'C2',
            footerTemplate: 'Average: ${average}'
        }]
    }],
    allowPaging: true,
    width: 'auto',
    pageSettings: { pageSize: 5 },
    columns: [
        {
            field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right',
            width: 120
        },
        {
            field: 'CustomerID', headerText: 'Customer ID',
            width: 140
        },

        { field: 'ShipName', headerText: 'Ship Name', width: 170 },
        { field: 'Freight', headerText: 'Freight', width: 120 },
        {
            field: 'ShipCountry', headerText: 'Ship Country', width: 150,
        }],
});
grid.appendTo('#Grid');
