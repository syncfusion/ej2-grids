import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Filter } from '../../../src/grid/actions/filter';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Sort } from '../../../src/grid/actions/sort';
import { Group } from '../../../src/grid/actions/group';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import { Aggregate } from '../../../src/grid/actions/aggregate'
import { AggregateColumn } from '../../../src/grid/models/aggregate'
import { ActionEventArgs } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
import { createElement } from '.../../../node_modules/@syncfusion/ej2-base';
import { data } from '../../../spec/grid/base/datasource.spec';
import { employeeData } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Internationalization } from '@syncfusion/ej2-base';
let isExpended : boolean = false;
let instance: Internationalization = new Internationalization();
Grid.Inject(Page, Selection, Aggregate, Filter, Group, Sort, Toolbar, DetailRow )
 let grid: Grid = new Grid({
        dataSource: employeeData,
        detailTemplate: '#detailtemplate',
        height: 335,
        width: 'auto',
        columns: [
            { field: 'FirstName', headerText: 'First Name', width: 110 },
            { field: 'LastName', headerText: 'Last Name', width: 110 },
            { field: 'Title', headerText: 'Title', width: 150 },
            { field: 'Country', headerText: 'Country', width: 110 }
        ]
    });
    grid.appendTo('#Grid');

    (window as DateFormat).format = (value: Date) => {
    return instance.formatDate(value, { skeleton: 'yMd', type: 'date' });
};

interface DateFormat extends Window {
    format?: Function;
}