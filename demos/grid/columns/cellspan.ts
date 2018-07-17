import { ActionEventArgs, QueryCellInfoEventArgs } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
import { createElement } from '.../../../node_modules/@syncfusion/ej2-base';
import {  gridCellSpanData } from './grid-cell-merge-data';
import '../../../node_modules/es6-promise/dist/es6-promise';

let grid: Grid = new Grid({
        dataSource: gridCellSpanData,
        queryCellInfo: QueryCellEvent,
        columns: [
            { field: "EmployeeID", headerText: "Employee ID", isPrimaryKey: true, textAlign: 'Right', width: 120 },
            { field: "EmployeeName", headerText: "Employee Name", width: 160 },
            { field: "9-10", headerText: "9.00 AM", width: 120 },
            { field: '10-11', headerText: "10.00 AM", width: 120  },
            { field: "11-12", headerText: "11.00 AM", width: 120  },
            { field: "12-1", headerText: "12.00 PM", width: 120  },
            { field: "2-3", headerText: "2.00 PM ", width: 120  },
            { field: "3-4", headerText: "3.00 PM", width: 120  },
            { field: "4-5", headerText: "4.00 PM", width: 120  },
            { field: "5-6", headerText: "5.00 PM" , width: 120 }   
        ],
        width: 'auto',
        height: 'auto',
        allowTextWrap: true,
    });
    grid.appendTo('#Grid');

    function QueryCellEvent(args: QueryCellInfoEventArgs): void {
        
        if (args.data['EmployeeID'] == 10001 || args.data['EmployeeID'] == 10007) {
            if (args.column.field == "11-12")
                args.colSpan = 2 ;
            else if (args.column.field == "2-3")
                args.colSpan = 2;
            else if (args.column.field == "4-5")
                args.colSpan = 2;           
        }
        else if (args.data['EmployeeID'] == 10002 || args.data['EmployeeID'] == 10005) {
            if (args.column.field == "10-11")
                args.colSpan = 3;
            else if (args.column.field == "2-3")
                args.colSpan = 2;        
        }
        else if (args.data['EmployeeID'] == 10003 || args.data['EmployeeID'] == 10006) {
            if (args.column.field == "9-10")
                args.colSpan = 4;
            else if (args.column.field == "4-5")
                args.colSpan = 2;          
        }
        else if (args.data['EmployeeID'] == 10004 || args.data['EmployeeID'] == 10008) {
            if (args.column.field == "9-10")
                args.colSpan = 2;
            else if (args.column.field == "11-12")
                args.colSpan = 3;
            else if (args.column.field == "4-5")
                args.colSpan = 2;
        }       
    }