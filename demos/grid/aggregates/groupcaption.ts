import { Page } from '../../../src/grid/actions/page';
import { Selection, Edit, Toolbar } from '../../../src/grid/actions';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Aggregate } from '../../../src/grid/actions/aggregate'
import { Group } from '../../../src/grid/actions/group';
import { Grid } from '../../../src/grid/base/grid';
import { rData } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

/**
 * 
 */

Grid.Inject(Grid,Group, Edit, Toolbar,Aggregate, Page)
let grid: Grid = new Grid({
    dataSource: rData,
    allowPaging: true,
    pageSettings: {pageSize: 5},
    allowGrouping: true,
    groupSettings: { showDropArea: false, columns: ['CategoryName'] },
    columns: [
        { field: 'CategoryName', headerText: 'Category Name', width: 160 },
        { field: 'ProductName', headerText: 'Product Name', width: 170 },
        { field: 'QuantityPerUnit', headerText: 'Quantity Per Unit', width: 170, textAlign: 'Right' },
        { field: 'UnitsInStock', headerText: 'Units In Stock', width: 170, textAlign: 'Right' },
        {
            field: 'Discontinued', headerText: 'Discontinued', width: 150,
            textAlign: 'Center', displayAsCheckBox: true, type: 'boolean'
        }
    ],
    aggregates: [{
            columns: [{
                type: 'Sum',
                field: 'UnitsInStock',
                groupFooterTemplate: 'Total units: ${Sum}'
            },
            {
                type: 'Truecount',
                field: 'Discontinued',
                groupFooterTemplate: 'Discontinued: ${Truecount}'
            },
            {
                type: 'Max',
                field: 'UnitsInStock',
                groupCaptionTemplate: 'Maximum: ${Max}'
            }]
        }]
});
grid.appendTo('#Grid');
