/**
 * Service Locator spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Grid } from '../../../src/grid/base/grid';
import { ICellRenderer } from '../../../src/grid/base/interface';
import { Cell } from '../../../src/grid/models/cell';
import { CellRendererFactory } from '../../../src/grid/services/cell-render-factory';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('CellRendererFactory module', () => {
    describe('Register and get service', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, allowPaging: false,
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

        it('Check fallback', () => {
            expect(() => gridObj.serviceLocator.getService<CellRendererFactory>('cellRendererFactory')
                .getCellRenderer('hi')).toThrow('The cellRenderer hi is not found');
        });

        it('Check string register', () => {
            class CellMock implements ICellRenderer<{}> {
                public render(cell: Cell<{}>, data: Object, attributes?: { [x: string]: string }): Element {
                    return createElement('td');
                }
            }

            class DupCellMock extends CellMock { }
            let factory: CellRendererFactory = gridObj.serviceLocator.getService<CellRendererFactory>('cellRendererFactory');
            factory.addCellRenderer('hi', new CellMock);
            factory.addCellRenderer('hi', new DupCellMock);
            expect('hi' in factory.cellRenderMap).toBeTruthy();
            expect(factory.getCellRenderer('hi') instanceof CellMock).toBeTruthy();
        });

        afterAll(() => {
           remove(elem);
        });
    });

});