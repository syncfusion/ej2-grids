import { Page, Selection, Filter, Toolbar, Sort, Group, Aggregate } from '../../../src/index';
import { AggregateColumn } from '../../../src/grid/models/aggregate'
import { ActionEventArgs } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
import { createElement } from '.../../../node_modules/@syncfusion/ej2-base';
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page, Selection, Aggregate, Filter, Group, Sort, Toolbar)
let grid: Grid = new Grid({
    dataSource: data,
    allowPaging: true,
    allowFiltering: true,
    allowSorting: true,
    allowGrouping: true,
    gridLines: 'Both',
    toolbar: ['Print', 'Edit', 'Expand', 'Search'],
    selectionSettings: { type: "Multiple" },
    sortSettings: { columns: [{ field: "Freight", direction: "Ascending" }, { field: "ShipCountry", direction: "Ascending" }] },
    aggregates: [{ columns: [{ type: 'Sum', field: "Freight" }] }],
    columns: [
        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
        {
            headerText: 'Order Details', columns: [
                { field: 'OrderDate', headerText: 'Order Date', textAlign: 'Right', width: 135, format: 'yMd' },
                { field: 'Freight', headerText: 'Freight($)', textAlign: 'Right', width: 120, format: 'C2' },
            ]
        },
        {
            headerText: 'Ship Details', columns: [
                { field: 'ShippedDate', headerText: 'Shipped Date', textAlign: 'Right', width: 145, format: 'yMd' },
                { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
            ]
        }
    ]

})
grid.appendTo('#Grid');
