import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Reorder } from '../../../src/grid/actions/reorder';
import { CommandColumn } from '../../../src/grid/actions/command-column';
import { ActionEventArgs } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
import { createElement } from '.../../../node_modules/@syncfusion/ej2-base';
import {  data } from '../../../spec/grid/base/datasource.spec';
import {employeeData} from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
let isReordered : boolean = false;

Grid.Inject(Page,Selection,Reorder, CommandColumn)
let grid: Grid = new Grid({
        dataSource: employeeData,
        dataBound: dataBound,
        allowReordering:true,
        columns: [
            {
                headerText: 'Employee Image', textAlign: 'Center',
                template: '#template', width: 200
            },
            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
            { field: 'FirstName', headerText: 'Name', width: 120 },
            { field: 'Title', headerText: 'Title', width: 170, visible:false },
            {
                field: 'HireDate', headerText: 'Hire Date', textAlign: 'Right',
                width: 135, format: { skeleton: 'yMd', type: 'date' }
            },
            { field: 'ReportsTo', headerText: 'Reports To', width: 150, textAlign: 'Right' }
        ],
        width: 'auto',
        height: 359
    });
    grid.appendTo('#Grid');

    function dataBound(args: any): void{
        if(!isReordered)
            this.reorderColumns("FirstName","HireDate");
        isReordered= true;
    }