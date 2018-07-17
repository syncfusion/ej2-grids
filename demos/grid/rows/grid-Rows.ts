import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Grid } from '../../../src/grid/base/grid';
import { employeeData } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Internationalization } from '@syncfusion/ej2-base';
/**
 * 
 */
let isExpended : boolean = false;
let instance: Internationalization = new Internationalization();
Grid.Inject(Page, Selection )
 let grid: Grid = new Grid({
    dataSource: employeeData,
    rowTemplate: '#rowtemplate',
    height: 335,
    width: 'auto',
    columns: [
        { headerText: 'Employee Image', width: 180, textAlign: 'Center', field: 'OrderID' },
        { headerText: 'Employee Details', width: 300, field: 'EmployeeID', textAlign: 'Left' }
    ]
});
grid.appendTo('#Grid');

(window as DateFormat).format = (value: Date) => {
return instance.formatDate(value, { skeleton: 'yMd', type: 'date' });
};

interface DateFormat extends Window {
format?: Function;
}