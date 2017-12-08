/**
 * Grid print spec document
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { PrintMode } from '../../../src/grid/base/enum';
import { Grid } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Page } from '../../../src/grid/actions/page';
import { Print } from '../../../src/grid/actions/print';
import { Group } from '../../../src/grid/actions/group';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Sort, Page, Filter, Print, Group, Toolbar);

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
                // expect(args.element.querySelectorAll('.e-gridpager').length).toBe(0);
                // expect(args.element.querySelectorAll('.e-filterbar').length).toBe(0);
                // expect(args.element.querySelectorAll('.e-row').length).toBe(15);
                done();
            };
            window.print = () => { };
            (<any>Window).print = () => { };
            gridObj.beforePrint = beforePrint;
            gridObj.dataBind();
            gridObj.print();
        });

        afterAll(() => {
            gridObj.destroy();
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
                // expect(args.element.querySelectorAll('.e-gridpager').length).toBe(0);
                // expect((args.element.querySelector('.e-filterbar') as HTMLElement).style.display).toBe('none');
                done();
            };
            gridObj.beforePrint = beforePrint;
            gridObj.dataBind();
            gridObj.print();
        });

        it('Print current page testing', (done: Function) => {
            beforePrint = (args?: { element: Element }): void => {
                expect((args.element.querySelector('.e-gridpager') as HTMLElement).style.display).toBe('none');
                done();
            };
            gridObj.printModule.destroy(); //for coverage
            gridObj.printMode = 'currentpage';
            gridObj.beforePrint = beforePrint;
            gridObj.dataBind();
            gridObj.print();
        });

        afterAll(() => {
            gridObj.destroy();
            elem.remove();
        });
    });

    describe('Print two column grouping', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let beforePrint: () => void;
        let actionComplete: EmitType<Object>;

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
                    allowGrouping: true,
                    pageSettings: { pageSize: 8 },
                    groupSettings: { columns: ['OrderID', 'EmployeeID'] },
                    beforePrint: beforePrint,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('Print with two grouped column', (done: Function) => { // print with more than one grouped columns 
            let flag: boolean = false;
            beforePrint = (args?: { element: Element }): void => {
                expect(args.element.querySelectorAll('.e-groupcaption').length).toBeGreaterThan(1);
                //expect((args.element.querySelectorAll('.e-groupcaption')[0] as HTMLTableCellElement).colSpan).toBe(3);
                expect(args.element.querySelectorAll('.e-grouptopleftcell').length).toBe(0);
                expect(args.element.querySelectorAll('.e-recordpluscollapse').length).toBe(0);
                expect(args.element.querySelectorAll('.e-indentcell').length).toBe(0);
                expect(args.element.querySelectorAll('.e-recordplusexpand').length).toBe(0);
                expect((args.element.querySelector('.e-groupdroparea') as HTMLElement).style.display).toBe('');
            };
            //data bound hit twice 
            //one for disable paging for print allpages
            //another for enable paging after printing allpages 
            let dataBound: EmitType<Object> = () => {
                if (flag) {
                    done();
                }
                flag = true;
            };
            gridObj.dataBound = dataBound;
            gridObj.beforePrint = beforePrint;
            gridObj.dataBind();
            gridObj.print();
        });

        it('Print current page testing', (done: Function) => { //print current page with grouped columns
            beforePrint = (args?: { element: Element }): void => {
                expect((args.element.querySelector('.e-gridpager') as HTMLElement).style.display).toBe('none');
                //expect(args.element.querySelectorAll('.e-row').length).toBe(8);
                done();
            };
            gridObj.dataBound = undefined;
            gridObj.printMode = 'currentpage';
            gridObj.beforePrint = beforePrint;
            gridObj.dataBind();
            gridObj.print();

        });

        // it ('Print Grid using toolbar items', (done: Function) => {
        //     beforePrint = (args?: { element: Element }): void => {
        //         expect((args.element.querySelector('.e-toolbar') as HTMLElement).style.display).toBe('none');
        //         done();
        //     };
        //     gridObj.beforePrint = beforePrint;
        //     gridObj.toolbar = ['print'];
        //     gridObj.dataBind();
        //     (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_print')).click();
        // });
        
        // it('UnGroup the columns', (done: Function) => {
        //     actionComplete = () => {
        //         expect(gridObj.groupSettings.columns.length).toBe(0);
        //         done();
        //     };
        //     gridObj.actionComplete = actionComplete;
        //     gridObj.groupModule.clearGrouping();//need to fix
        //     gridObj.dataBind();
        // });

        // it('Print no grouped column', (done: Function) => {
        //     beforePrint = (args?: { element: Element }): void => {
        //         expect((args.element.querySelector('.e-groupdroparea') as HTMLElement).style.display).toBe('none');
        //         done();
        //     };
        //     gridObj.beforePrint = beforePrint;
        //     gridObj.dataBind();
        //     gridObj.print();
        // });


        afterAll(() => {
            gridObj.destroy();
            elem.remove();
        });
    });


});
