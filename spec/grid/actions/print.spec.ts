/**
 * Grid print spec document
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base/dom';
import { PrintMode } from '../../../src/grid/base/enum';
import { Grid } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Page } from '../../../src/grid/actions/page';
import { Print } from '../../../src/grid/actions/print';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Sort, Page, Filter, Print);

describe('Print module', () => {
    describe('Print without paging, filterbar testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let beforePrint: () => void;
        let actionComplete: Function;
        (<any>window).open = () => {
            return {
                document: { write: () => { }, close: () => { } },
                close: () => { }, print: () => { }, focus: () => { }, moveTo: () => { }, resizeTo: () => { }
            };
        };

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowSelection: false,
                    beforePrint: beforePrint,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('Print all pages testing', (done: Function) => {
            beforePrint = (args?: { element: Element }): void => {
                expect(args.element.querySelectorAll('.e-gridpager').length).toEqual(0);
                expect(args.element.querySelectorAll('.e-filterbar').length).toEqual(0);
                expect(args.element.querySelectorAll('.e-row').length).toEqual(15);
                done();
            };
            window.print = () => { };
            (<any>Window).print = () => { };
            gridObj.beforePrint = beforePrint;
            gridObj.dataBind();
            gridObj.print();
        });

        afterAll(() => {
            elem.remove();
        });
    });

    describe('Print with paging, filterbar testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let beforePrint: () => void;
        let actionComplete: Function;

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowFiltering: true,
                    allowPaging: true,
                    height: 600,
                    pageSettings: { pageSize: 5 },
                    allowGrouping: true,
                    groupSettings: { columns: ['OrderID'] },
                    beforePrint: beforePrint,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('Print all pages testing', (done: Function) => {
            beforePrint = (args?: { element: Element }): void => {
                expect(args.element.querySelectorAll('.e-gridpager').length).toEqual(0);
                expect((args.element.querySelector('.e-filterbar') as HTMLElement).style.display).toEqual('none');
                done();
            };
            gridObj.beforePrint = beforePrint;
            gridObj.dataBind();
            gridObj.print();
        });

        it('Print current page testing', (done: Function) => {
            beforePrint = (args?: { element: Element }): void => {
                expect((args.element.querySelector('.e-gridpager') as HTMLElement).style.display).toEqual('none');
                done();
            };
            gridObj.printModule.destroy(); //for coverage
            gridObj.printMode = 'currentpage';
            gridObj.dataBind();
            gridObj.beforePrint = beforePrint;
            gridObj.dataBind();
            gridObj.print();
        });

        afterAll(() => {
            elem.remove();
        });
    });

});
