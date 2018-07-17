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

Grid.Inject(Grid, Edit, Toolbar, Page)
let grid: Grid = new Grid({
    dataSource: data,
    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' },
    allowPaging: true,
    gridLines:'Vertical',
    pageSettings: { pageCount: 5 },
    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
    columns: [
        {
            field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right',
            validationRules: { required: true }, width: 120
        },
        {
            field: 'CustomerID', headerText: 'Customer ID',
            validationRules: { required: true }, width: 140
        },

        { field: 'ShipName', headerText: 'Ship Name', width: 170 },
        {
            field: 'ShipCountry', headerText: 'Ship Country', width: 150,
            edit: { params: { popupHeight: '300px' } }
        }
    ],
});
grid.appendTo('#Grid');
