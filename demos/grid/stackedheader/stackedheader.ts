import { CommandColumn } from '../../../src/grid/actions/command-column';
import { Page } from '../../../src/grid/actions/page';
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

Grid.Inject(Page, Selection, Group, Sort,Reorder)
let grid: Grid = new Grid({
    dataSource: data,
     allowPaging: true,
     allowReordering:true,
            pageSettings: { pageCount: 5 },
            columns: [
                { field: 'OrderID', headerText: 'Order ID', width: 120 },
                {
                    headerText: 'Order Details', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', width: 120, format: 'C2' },
                    ]
                },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipAddress', headerText: 'Ship Address', width: 145, format: 'yMd' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
})
grid.appendTo('#Grid');
