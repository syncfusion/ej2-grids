/**
 * Content renderer spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Query } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('Content renderer module', () => {

    describe('grid content element testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    query: new Query().take(5), allowPaging: false, enableAltRow: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Content div testing', () => {
            expect(gridObj.element.querySelectorAll('.e-gridcontent').length).toBe(1);
        });

        it('Content table testing', () => {
            expect(gridObj.contentModule.getPanel().querySelectorAll('.e-table').length).toBe(1);
        });

        it('Content cell count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row')[0].childNodes.length).toBe(gridObj.getColumns().length);
        });

        it('getRows', () => {
            expect(gridObj.contentModule.getRows().length).toBe(5);
            //for coverage 
            (<any>gridObj.contentModule).setColGroup(undefined);
            (<any>gridObj.contentModule).colGroupRefresh();
        });
        afterAll(() => {
            remove(elem);
        });

    });

});