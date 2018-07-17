import { CommandColumn } from '../../../src/grid/actions/command-column';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Group } from '../../../src/grid/actions/group';
import { Grid } from '../../../src/grid/base/grid';
import {QueryCellInfoEventArgs } from '../../../src/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { columnSpanData, ColumnSpanDataType } from './datasource';
import '../../../node_modules/es6-promise/dist/es6-promise';
/**
 * 
 */

Grid.Inject(Page, Selection, Group, Sort,Reorder)

let grid: Grid = new Grid({
            dataSource: columnSpanData,
            queryCellInfo: QueryCellEvent,
            gridLines: 'Both',
            columns: [
                { field: 'EmployeeID', headerText: 'Employee ID', isPrimaryKey: true, textAlign: 'Right', width: 120 },
                { field: 'EmployeeName', headerText: 'Employee Name', width: 200 },
                { field: '9:00', headerText: '9.00 AM', width: 100 },
                { field: '9:30', headerText: '9.30 AM', width: 100 },
                { field: '10:00', headerText: '10.00 AM', width: 100 },
                { field: '10:30', headerText: '10.30 AM', width: 100 },
                { field: '11:00', headerText: '11.00 AM', width: 100 },
            ],
            width: 'auto',
            height: 'auto',
            allowTextWrap: true
});
grid.appendTo('#Grid');

function QueryCellEvent(args: QueryCellInfoEventArgs): void {
    let data: ColumnSpanDataType = args.data as ColumnSpanDataType;
    switch (data.EmployeeID) {
        case 10001:
            if (args.column.field === '9:00') {
                args.colSpan = 2;
            } else if (args.column.field === '11:00') {
                args.colSpan = 3;
            }
            break;
        case 10002:
            if (args.column.field === '9:30') {
                args.colSpan = 3;
            } else if (args.column.field === '11:00') {
                args.colSpan = 4;
            }
            break;
        case 10007:
            if (args.column.field === '9:00' || args.column.field === '3:00' || args.column.field === '10:30') {
                args.colSpan = 2;
            } else if (args.column.field === '11:30' || args.column.field === '4:00') {
                args.colSpan = 3;
            }
            break;
    }
}