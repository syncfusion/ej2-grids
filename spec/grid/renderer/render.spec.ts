/**
 * Render spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models/column';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('Render module', () => {
    describe('Grid render', () => {
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
                        { headerText: 'OrderDate', field: 'OrderDate', format: 'long', type: 'datetime' },
                    ],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(data.length);
            //for coverage
            (gridObj.getColumns() as Column[])[0].type = undefined;
            (gridObj.getColumns() as Column[])[1].type = undefined;
            (gridObj.getColumns() as Column[])[2].type = undefined;
            (gridObj.getColumns() as Column[])[3].type = undefined;
            (gridObj.getColumns() as Column[])[4].type = undefined;
            (<any>gridObj.renderModule).updateColumnType({
                OrderID: new Date(2017, 2, 13, 0, 0, 0, 10),
                EmployeeID: new Date(2017, 2, 13, 0, 0, 10, 0), CustomerID: new Date(2017, 2, 13, 0, 10, 0, 0),
                ShipCity: new Date(2017, 2, 13, 10, 0, 0, 0), ShipCountry: new Date(2017, 2, 13, 0, 0, 0, 0), OrderDate: new Date(2017, 2, 13, 0, 10, 0, 10)
            });
            (<any>gridObj.renderModule).data.removeRows({ indexes: [4, 5] });
            gridObj.ariaService.setOptions(null, { role: 'grid' });
        });

        afterAll(() => {
            remove(elem);
        });

    });

    describe('Grid render without columns testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, allowPaging: false, dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Column count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-headercell').length).toBe(gridObj.getColumns().length);
        });

        it('Content cell count testing', () => {
            let cols = gridObj.getColumns();
            expect(gridObj.element.querySelectorAll('.e-row')[0].childNodes.length).toBe(cols.length);
            cols = [];
            (<any>gridObj.renderModule).dataManagerSuccess({ result: {}, count: 0 });//for coverage
			gridObj.isDestroyed = true;
			(<any>gridObj.renderModule).addEventListener();
			gridObj.isDestroyed = false;
        });

        afterAll(() => {
            remove(elem);
        });

    });


    describe('Column type testing with empty data source', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: [], allowPaging: false, dataBound: dataBound,
                    columns: [
                        { field: 'Column1', type: 'string' },
                        { field: 'Column2' }
                    ]
                });
            gridObj.appendTo('#Grid');
        });

        it('Column type testing', () => {
            expect((<Column>gridObj.columns[0]).type).toBe('string');
            expect((<Column>gridObj.columns[1]).type).toBeNull();
        });

        afterAll(() => {
            remove(elem);
        });
    });


});