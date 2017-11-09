/**
 * Freeze Renderer spec
 */
import { Grid } from '../../../src/grid/base/grid';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { data } from '../base/datasource.spec';
import { Freeze } from '../../../src/grid/actions/freeze';

Grid.Inject(Freeze);

describe('Freeze render module', () => {
    describe('Freeze Row and Column', () => {
        let gridObj: any;
        let elem: Element = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    frozenColumns: 2,
                    frozenRows: 2,
                    height: 400,
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

        it('check scroll left header/content sync', () => {
            let ele: HTMLElement = gridObj.getContent().querySelector('.e-movablecontent') as HTMLElement;
            (<HTMLElement>ele).scrollLeft = 10;
            raise(gridObj, 'scroll', ele);
            (<HTMLElement>ele).scrollTop = 10;
            raise(gridObj, 'scroll', ele);
            (<HTMLElement>ele).scrollTop = 10;
            raise(gridObj, 'scroll', ele);
            (<HTMLElement>gridObj.getContent().querySelector('.e-frozencontent')).scrollTop = 20;
            raise(gridObj, 'wheel', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
            gridObj.isDestroyed = true;
            (<HTMLElement>ele).scrollTop = 10;
            raise(gridObj, 'scroll', ele);
            (<HTMLElement>gridObj.getContent().querySelector('.e-frozencontent')).scrollTop = 20;
            raise(gridObj, 'wheel', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
            raise(gridObj, 'touchstart', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
            (<HTMLElement>gridObj.getContent().querySelector('.e-frozencontent')).scrollTop = 30;
            raise(gridObj, 'touchmove', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
            let args = { target: gridObj.getContent().querySelector('.e-frozencontent'), touches: [{ pageY: 200 }] };
            gridObj.scrollModule.getPointY(args);
            let arg = { target: gridObj.getContent().querySelector('.e-frozencontent')};
            gridObj.scrollModule.getPointY(arg);
            remove(gridObj.getContent().querySelector('tbody'));
            remove(gridObj.getContent().querySelector('tbody'));
            (<HTMLElement>ele).scrollTop = 10;
            raise(gridObj, 'scroll', ele);
            (<HTMLElement>gridObj.getContent().querySelector('.e-frozencontent')).scrollTop = 20;
            raise(gridObj, 'wheel', <HTMLElement>gridObj.getContent().querySelector('.e-frozencontent'));
        });

        let raise: Function = (gridObj: Grid, type: string, ele: HTMLElement) => {
            let evt: Event = document.createEvent('HTMLEvents');
            evt.initEvent(type, true, true);
            ele.dispatchEvent(evt);
        };

        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj);
            remove(elem);
        });
    });

    let destroy: EmitType<Object> = (grid: Grid) => {
        if (grid) {
            grid.destroy();
            document.getElementById('Grid').remove();
        }
    };

    describe('Freeze Row', () => {
        let gridObj: Grid;
        let elem: Element = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    frozenRows: 2,
                    height: 400,
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

        it('header content rendering', () => {
            // Test case for header content rendering
        });

        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj);
            remove(elem);
        });
    });

    describe('Freeze Column', () => {
        let gridObj: Grid;
        let elem: Element = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    frozenColumns: 2,
                    height: 400,
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

        it('header content rendering', () => {
            // Test case for header content rendering
        });

        afterAll(() => {
            gridObj['freezeModule'].destroy();
            destroy(gridObj);
            remove(elem);
        });
    });

    describe('Without Freeze', () => {
        let gridObj: Grid;
        let elem: Element = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    frozenColumns: 0,
                    frozenRows: 0,
                    height: 400,
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

        it('header content rendering', () => {
            // Test case for header content rendering
        });

        afterAll(() => {
            remove(elem);
        });
    });

});