import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Column } from '../../../src/grid/models/column'
import { Aggregate } from '../../../src/grid/actions/aggregate'
import { AggregateColumn } from '../../../src/grid/models/aggregate'
import {Group} from '../../../src/grid/actions/group';
import { ActionEventArgs } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
import { createElement } from '.../../../node_modules/@syncfusion/ej2-base';
import {  data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page,Selection,Filter)
let grid : Grid = new Grid({
    dataSource: data,
    allowPaging: true,
    allowFiltering: true,
    filterSettings:{mode:'Immediate'},
    columns: [
        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 100 },
        {
            field: 'EmployeeID', filterBarTemplate: {
                create: (args: { element: Element, column: Column }) => {
                    let dd: HTMLSelectElement = document.createElement('select');
                    dd.id = 'EmployeeID';
                    let dataSource: string[] = ['All', '1', '3', '4', '5', '6', '8', '9'];
                    for (let i: number = 0; i < dataSource.length; i++) {
                        let option: HTMLOptionElement = document.createElement('option');
                        option.value = dataSource[i];
                        option.innerHTML = dataSource[i];
                        dd.appendChild(option);
                    }
                    return dd;
                },
                write: (args: { element: Element, column: Column }) => {
                    args.element.addEventListener('input',
                    (args: Event): void => {
                        let target: HTMLInputElement = <HTMLInputElement>args.currentTarget;
                        if (target.value !== 'All') {
                            let value: Number = +target.value;
                            grid.filterByColumn(target.id, 'equal', value as any);
                        } else {
                        grid.removeFilteredColsByField(target.id);
                        }
                    });
                },
            },
            textAlign: 'Right', width: 70
        },
        { field: 'ShipCity', headerText: 'Ship City', width: 100 },
        { field: 'ShipName', headerText: 'Ship Name', width: 100 }]
});
 grid.appendTo('#Grid');