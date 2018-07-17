import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Filter } from '../../../src/grid/actions/filter';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Sort } from '../../../src/grid/actions/sort';
import { Group } from '../../../src/grid/actions/group';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import { Aggregate } from '../../../src/grid/actions/aggregate'
//import { AggregateColumn } from '../../../src/grid/models/aggregate'
//import { ActionEventArgs } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
//import { createElement } from '.../../../node_modules/@syncfusion/ej2-base';
//import { data } from '../../../spec/grid/base/datasource.spec';
import { employeeData } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Internationalization } from '@syncfusion/ej2-base';
/**
 * 
 */
let isExpended : boolean = false;
let instance: Internationalization = new Internationalization();
Grid.Inject(Page )
 let grid: Grid = new Grid({
        dataSource: employeeData,
         columns: [
                { field: 'EmployeeID', headerText: 'Employee ID', width: 120, textAlign: 'Right', headerTemplate: '#employeetemplate' },
                { field: 'FirstName', headerText: 'First Name', width: 140 },
                {
                    field: 'BirthDate', headerText: 'Birth Date', width: 130, format: 'yMd',
                    textAlign: 'Right', headerTemplate: '#datetemplate'
                },
                { field: 'City', width: 120 },
                { field: 'Country', headerText: 'Country', width: 140, format: 'yMd', textAlign: 'Right' },
            ]
    });
    grid.appendTo('#Grid');

