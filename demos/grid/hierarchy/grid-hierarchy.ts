import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { DetailRow } from '../../../src/grid/actions/detail-row'
import { Aggregate } from '../../../src/grid/actions/aggregate'
import { AggregateColumn } from '../../../src/grid/models/aggregate'
import {Group} from '../../../src/grid/actions/group';
import { ActionEventArgs } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
import { createElement } from '.../../../node_modules/@syncfusion/ej2-base';
import {  data } from '../../../spec/grid/base/datasource.spec';
import {  employeeData } from '../../../spec/grid/base/datasource.spec';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import '../../../node_modules/es6-promise/dist/es6-promise';
Grid.Inject(Page, Selection, DetailRow,Filter,Group,Aggregate,Sort);

let dataManger: Object = new DataManager({
        url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
        adaptor: new ODataV4Adaptor,
        crossDomain: true
    });
    let dataManger2: Object = new DataManager({
        url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Customers',
        adaptor: new ODataV4Adaptor,
        crossDomain: true
    });

    let grid: Grid = new Grid({
        dataSource: employeeData,
        allowSorting: true,
        allowGrouping:true,
        allowFiltering:true,
        columns: [
            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
            { field: 'FirstName', headerText: 'Name', width: 125 },
            { field: 'Title', headerText: 'Title', width: 180 },
            { field: 'City', headerText: 'City', width: 110 },
            { field: 'Country', headerText: 'Country', width: 110 }
        ],

        childGrid: {
            dataSource: dataManger,
            queryString: 'EmployeeID',
            allowSorting:true,
            allowGrouping:true,
            allowFiltering:true,
            allowPaging: true,
            columns: [
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                { field: 'ShipCity', headerText: 'Ship City', width: 120 },
                { field: 'Freight', headerText: 'Freight', width: 120 },
                { field: 'ShipName', headerText: 'Ship Name', width: 150 }
            ],
            childGrid: {
                dataSource: dataManger2,
                queryString: 'CustomerID',
                allowSorting:true,
                allowFiltering:true,
                allowGrouping:true,
                columns: [
                    { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right', width: 75 },
                    { field: 'Phone', headerText: 'Phone', width: 100 },
                    { field: 'Address', headerText: 'Address', width: 120 },
                    { field: 'Country', headerText: 'Country', width: 100 }
                ],
                load: function() { window['childGrid2'] = this; }
            },
        },
    });
    grid.appendTo('#Grid');
