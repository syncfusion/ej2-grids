/**
 * Grid Paging spec document
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Grid } from '../../../src/grid/base/grid';
import { PageEventArgs } from '../../../src/grid/base/interface';
import { Page } from '../../../src/grid/actions/page';
import { Sort } from '../../../src/grid/actions/sort';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page, Sort);

describe('Paging module', () => {
    describe('Paging functionalities', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: (e: PageEventArgs) => void;
        let actionComplete: (e: PageEventArgs) => void;
        let preventDefault: Function = new Function();

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => {
                setTimeout(() => { done(); }, 100);
            };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 2, currentPage: 2, pageCount: 4,
                        totalRecordsCount: 10, enableQueryString: true
                    },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('page size testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(2);
        });
        it('current page testing', () => {
            expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toEqual('2');
        });
        it('page count testing', () => {
            expect(gridObj.getPager().getElementsByClassName('e-numericcontainer')[0].childNodes.length).toEqual(4);
            expect((<Element>gridObj.getPager().getElementsByClassName('e-numericcontainer')[0].childNodes[0]).hasAttribute('aria-owns')).toBeTruthy();
        });
        it('totalRecordsCount testing', () => {
            expect(gridObj.pageSettings.totalRecordsCount).toEqual(15);
        });
        it('querystring testing', () => {
            gridObj.goToPage(3);
            expect(window.location.href.indexOf('?page=3')).toBeGreaterThan(-1);
        });
        it('class testing', () => {
            expect(gridObj.element.querySelectorAll('.e-pager').length).toEqual(1);
        });
        it('navigate page', (done: Function) => {
            let row: string = JSON.stringify(gridObj.currentViewData[0]);
            actionComplete = (args: PageEventArgs): void => {
                expect(row !== JSON.stringify(gridObj.currentViewData[0])).toEqual(true);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.getPager().getElementsByClassName('e-numericcontainer')[0].childNodes[0] as HTMLElement).click();
        });
        it('pageDown shortcut testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toEqual('2');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.element.focus();
            let args: any = { action: 'pageDown', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });
        it('pageUp shortcut testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toEqual('1');
                done();
            };
            gridObj.actionComplete = actionComplete;
            let args: any = { action: 'pageUp', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });
        it('ctrlAltPageDown shortcut testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toEqual('8');
                done();
            };
            gridObj.actionComplete = actionComplete;
            let args: any = { action: 'ctrlAltPageDown', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });
        it('ctrlAltPageUp shortcut testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toEqual('1');
                done();
            };
            gridObj.actionComplete = actionComplete;
            let args: any = { action: 'ctrlAltPageUp', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });
        it('altPageDown shortcut testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toEqual('5');
                done();
            };
            gridObj.actionComplete = actionComplete;
            let args: any = { action: 'altPageDown', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });
        it('altPageUp shortcut testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toEqual('1');
                done();
            };
            gridObj.actionComplete = actionComplete;
            let args: any = { action: 'altPageUp', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
        });
        it('updateExternalmessage method false testing', () => {
            gridObj.updateExternalMessage('extmsg');
            expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].textContent).toEqual('extmsg');
        });

        it('updateExternalmessage method true testing', () => {
            gridObj.updateExternalMessage('extmsg1');
            expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].textContent).toEqual('extmsg1');
        });

        it('current page onproperty changed testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toEqual('4');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 4;
            gridObj.dataBind();

        });

        //set model and default properties model check

        afterAll(() => {
            remove(elem);
        });
    });

    describe('Disabled paging', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            gridObj = new Grid(
                {
                    allowPaging: false,
                    dataSource: data, dataBound: dataBound,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    pageSettings: {
                        pageSize: 2, currentPage: 2, pageCount: 4,
                        totalRecordsCount: 10, enableQueryString: true
                    },
                });
            gridObj.appendTo('#Grid');
        });
        it('class testing', () => {
            expect(gridObj.element.querySelectorAll('.e-pager').length).toEqual(0);
        });
        it('allowpaging true setmodel testing', () => {
            gridObj.allowPaging = true;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-pager').length).toEqual(1);
        });
        it('allowpaging false setmodel testing', () => {
            gridObj.allowPaging = false;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-pager').length).toEqual(0);
        });
        it('allowpaging true setmodel testing', (done: Function) => {
            let dataBound = (args: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-pager').length).toEqual(1);
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.allowPaging = true;
            gridObj.dataBind();
        });
        //set model and default properties model check

        it('change pageCount', () => {
            gridObj.pageSettings.pageCount = 3;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-link.e-numericitem.e-spacing.e-pager-default').length).toEqual(3);
        });
        //check query string
        it('Check enableQueryString', (done: Function) => {
            let actionComplete = (args?: Object): void => {
                expect(document.location.href).toMatch('page=1');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 1;
            gridObj.dataBind();

        });
        //set model and default properties model check

        afterAll(() => {
            remove(elem);
        });
    });
    describe('paging without pageSettings', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    allowPaging: true,
                    dataSource: data, dataBound: dataBound,
                    allowSorting: true,
                    height: 300,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                });
            gridObj.appendTo('#Grid');
        });
        it('class testing', () => {
            expect(gridObj.element.querySelectorAll('.e-pager').length).toEqual(1);
            gridObj.pageSettings = { currentPage: 3 };
            gridObj.dataBind();
            gridObj.pagerModule.refresh();

            //for coverage
            gridObj.getContent().firstElementChild.scrollTop = 10;
            let args: any = { action: 'pageDown', preventDefault: () => { } };
            gridObj.keyboardModule.keyAction(args);
        });
        //set model and default properties model check

        afterAll(() => {
            remove(elem);
        });
    });

    describe('Paging & Scrolling - PageDown case', () => {
        let grid: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: Function;
        let actionComplete: Function;
        let preventDefault: Function = new Function();
        let which: string = 'which';
        let content: HTMLElement;
        let raiseEvt: Function = (code: number) => {
            let p: Object = { '34': 'pageDown', '33': 'pageUp' };
            (<any>grid.keyboardModule).keyAction({ action: p[code + ''], preventDefault: () => 0 });
        };


        describe('pageDown case', () => {
            beforeAll((done: Function) => {
                let dataBound: EmitType<Object> = () => {
                    done();
                };
                document.body.appendChild(elem);
                grid = new Grid(
                    {
                        dataSource: data,
                        columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                        allowPaging: true,
                        pageSettings: {
                            pageSize: 12
                        },
                        height: 300,
                        dataBound: () => { setTimeout(() => done(), 100); }
                    });
                grid.appendTo('#Grid');
                content = (<HTMLElement>grid.getContent().firstChild);
            });

            it('pageDown check - no page trigger', () => {
                content.focus();
                raiseEvt(34, grid);
                expect(grid.pageSettings.currentPage).toEqual(1);
            });

            it('pageDown check - page trigger', () => {
                content.scrollTop = (content.scrollHeight - content.clientHeight) + 1;
                raiseEvt(34);
                expect(grid.pageSettings.currentPage).toEqual(2);
            });

            afterAll(() => {
                remove(elem);
            });
        });
        describe('pageUp case', () => {
            beforeAll((done: Function) => {
                elem = createElement('div', { id: 'Grid' });
                document.body.appendChild(elem);
                grid = new Grid(
                    {
                        dataSource: data,
                        columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                        allowPaging: true,
                        pageSettings: {
                            pageSize: 12
                        },
                        height: 300,
                        dataBound: () => { setTimeout(() => done(), 100); }
                    });
                grid.appendTo(elem);
                content = (<HTMLElement>grid.getContent().firstChild);
            });

            it('pageUp check - no page trigger', () => {
                content.focus();
                grid.goToPage(2);
                content.scrollTop = 10;
                raiseEvt(33, grid);
                expect(grid.pageSettings.currentPage).toEqual(2);
            });

            it('pageUp check - page trigger', () => {
                content.scrollTop = 0;
                raiseEvt(33, grid);
                expect(grid.pageSettings.currentPage).toEqual(1);
            });

            afterAll(() => {
                remove(elem);
            });
        });
    });
});