/**
 * Header renderer spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Query } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { CellType } from '../../../src/grid/base/enum';
import { HeaderCellRenderer } from '../../../src/grid/renderer/header-cell-renderer';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('header renderer module', () => {

    describe('grid header element testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement;
        if (document.body.querySelectorAll('#Grid').length) {
            elem = (document.body.querySelectorAll('#Grid')[0] as HTMLElement);
            remove(elem);
        } else {
            elem = createElement('div', { id: 'Grid' });
        }
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    query: new Query().take(5), allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', headerTemplate: 'template' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Header div testing', () => {
            expect(gridObj.element.querySelectorAll('.e-gridheader').length).toEqual(1);
        });

        it('Header table testing', () => {
            expect(gridObj.headerModule.getPanel().querySelectorAll('.e-table').length).toEqual(1);
        });

        it('Column header testing', () => {
            expect(gridObj.headerModule.getPanel().querySelectorAll('.e-columnheader').length).toEqual(1);
        });

        it('Column count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-headercell').length).toEqual(gridObj.getColumns().length);
            //for coverage
            let hRender = (<any>gridObj).renderModule.locator.getService('cellRendererFactory').getCellRenderer(CellType.Header);
            hRender.refresh({column: gridObj.getColumns()[1]} as any, createElement('div'));
        });

        afterAll(() => {
          remove(elem);
        });

    });

});
