import { CommandColumn } from '../../../src/grid/actions/command-column';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Group } from '../../../src/grid/actions/group';
import { Grid } from '../../../src/grid/base/grid';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import {QueryCellInfoEventArgs } from '../../../src/grid';
import { PageEventArgs } from '../../../src/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
Grid.Inject(Page);
let updateTemplate: Function = () => {
    let numeric: NumericTextBox;
    this.numeric = new NumericTextBox({
        min: 1,
        max: 3,
        step: 1,
        format: '###.##',
        change: (args) => {
            let value: number = args.value;
            grid.goToPage(value);
        }
    });
    this.numeric.appendTo('#currentPage');
};
let flag: boolean = true;
let grid: Grid = new Grid({
    dataSource: data,
    allowPaging: true,
    columns: [
        { field: 'OrderID', headerText: 'Order ID', width: 120 },
        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
        { field: 'ShipCity', headerText: 'Ship City', width: 150 },
        { field: 'ShipName', headerText: 'Ship Name', width: 150 }
    ],
    pageSettings: { template: '#template', pageSize: 10 },
    dataBound: () => {
        if (flag) {
            flag = false;
            updateTemplate();
        }
    },
    actionComplete: (args: PageEventArgs) => {
        if (args.requestType === 'paging') {
            updateTemplate();
        }
    }
});
grid.appendTo('#Grid');