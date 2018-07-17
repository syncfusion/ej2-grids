import { Selection, Edit, Toolbar, Page, ForeignKey, Group, Filter } from '../../../src/grid/actions';
import { Sort } from '../../../src/grid/actions/sort';
import { Grid } from '../../../src/grid/base/grid';
import { data, customerData } from './datasource';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page, Sort, Filter, Edit, Toolbar, ForeignKey, Group)

let grid: Grid = new Grid(
    {
        dataSource: data.slice(0, 200),
        allowPaging: true,
        allowSorting: true,
        allowFiltering: true,
        allowGrouping: true,
        toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'],
        editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
        columns: [
            {
                field: 'OrderID', width: 120, headerText: 'Order ID', isPrimaryKey: true, textAlign: 'Right',
                validationRules: { required: true, number: true }
            },
            {
                field: 'CustomerID', foreignKeyField: 'CustomerID', foreignKeyValue: 'ContactName', dataSource: customerData,
                width: 150, headerText: 'Customer Name'
            },
            {
                field: 'Freight', textAlign: 'Right', width: 100, format: 'C2'
            },
            { field: 'ShipName', headerText: 'Ship Name', width: 170 },
            { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
        ]
    });
grid.appendTo('#Grid');