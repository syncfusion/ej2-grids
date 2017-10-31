/**
 * Grid Sorting spec document
 */
import { Browser, ChildProperty, EmitType } from '@syncfusion/ej2-base';
import { getValue } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Page } from '../../../src/grid/actions/page';
import { Group } from '../../../src/grid/actions/group';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Sort, Page, Filter, Group);

describe('Sorting module', () => {

    let getActualProperties: Function = (obj: any): any => {
        if (obj instanceof ChildProperty) {
            return <any>getValue('properties', obj);
        } else {
            return obj;
        }
    };

    let getString: Function = (obj: any) => {
        return JSON.stringify(obj, (key: string, value: Object) => {
            return getActualProperties(value);
        });
    };

    describe('Sorting functionalities', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: (e?: Object) => void;
        let actionComplete: (e?: Object) => void;
        let colHeader: Element;
        let col1: Element;
        let col2: Element;

        let evt: MouseEvent = document.createEvent('MouseEvent');
        evt.initMouseEvent(
            'click',
            true /* bubble */, true /* cancelable */,
            window, null,
            0, 0, 0, 0, /* coordinates */
            true, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    allowSorting: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('Single sort orderID asc testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col1.querySelectorAll('.e-ascending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"OrderID","direction":"ascending"}]');
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            col1 = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[0];
            col2 = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[1];
            (col1 as HTMLElement).click();
        });
        it('Single sort orderID des testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col1.querySelectorAll('.e-descending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBeTruthy('[{"field":"OrderID","direction":"descending"}]');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            (col1 as HTMLElement).click();
        });
        it('Single sort CustomerID asc testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col2.querySelectorAll('.e-ascending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"CustomerID","direction":"ascending"}]');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            (col2 as HTMLElement).click();
        });
        it('Single sort CustomerID des testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col2.querySelectorAll('.e-descending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"CustomerID","direction":"descending"}]');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            (col2 as HTMLElement).click();
        });
        it('clear sorting', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-ascending').length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-descending').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.clearSorting();
        });
        it('Disabled sort asc testing', () => {
            gridObj.allowSorting = false;
            gridObj.dataBind();
            colHeader = col1;
            (colHeader as HTMLElement).click();
            expect(colHeader.querySelectorAll('.e-ascending').length).toBe(0);
            expect(gridObj.sortSettings.columns.length).toBe(0);
        });
        it('Disabled sort des testing', () => {
            colHeader = col1;
            (colHeader as HTMLElement).click();
            expect(colHeader.querySelectorAll('.e-descending').length).toBe(0);
            expect(gridObj.sortSettings.columns.length).toBe(0);
        });
        it('Multisort OrderID asc testing', (done: Function) => {
            gridObj.allowSorting = true;
            gridObj.dataBind();
            actionComplete = (args: Object): void => {
                expect(col1.querySelectorAll('.e-ascending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"OrderID","direction":"ascending"}]');
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            (col1 as HTMLElement).click();
        });
        it('Multisort OrderID and CustomerID testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col1.querySelectorAll('.e-ascending').length).toBe(1);
                expect(col2.querySelectorAll('.e-ascending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"OrderID","direction":"ascending"},{"field":"CustomerID","direction":"ascending"}]');
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            (col2 as HTMLElement).dispatchEvent(evt);
        });
        it('Multisort OrderID and CustomerID des testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col1.querySelectorAll('.e-ascending').length).toBe(1);
                expect(col2.querySelectorAll('.e-descending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"OrderID","direction":"ascending"},{"field":"CustomerID","direction":"descending"}]');
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            (col2 as HTMLElement).dispatchEvent(evt);
        });
        it('Multisort OrderID, CustomerID des, EmployeeID testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col1.querySelectorAll('.e-ascending').length).toBe(1);
                expect(col2.querySelectorAll('.e-descending').length).toBe(1);
                expect(colHeader.querySelectorAll('.e-ascending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"OrderID","direction":"ascending"},{"field":"CustomerID","direction":"descending"},' +
                    '{"field":"EmployeeID","direction":"ascending"}]');
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(3);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            colHeader = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[2];
            (colHeader as HTMLElement).dispatchEvent(evt);
        });
        it('Disable multisort des testing', (done: Function) => {
            gridObj.allowSorting = true;
            gridObj.allowMultiSorting = false;
            actionComplete = (args: Object): void => {
                expect(col1.querySelectorAll('.e-ascending').length).toBe(0);
                expect(col2.querySelectorAll('.e-descending').length).toBe(0);
                expect(colHeader.querySelectorAll('.e-descending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"EmployeeID","direction":"descending"}]');
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            colHeader = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[2];
            (colHeader as HTMLElement).dispatchEvent(evt);
        });
        it('Clear sorting', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-ascending').length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-descending').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.clearSorting();
        });
        it('Single sort column method testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col1.querySelectorAll('.e-ascending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"OrderID","direction":"ascending"}]');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.sortColumn('OrderID', 'ascending', false);
        });
        it('Multisort column method testing', (done: Function) => {
            gridObj.allowMultiSorting = true;
            actionComplete = (args: Object): void => {
                expect(col1.querySelectorAll('.e-ascending').length).toBe(1);
                expect(col2.querySelectorAll('.e-descending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"OrderID","direction":"ascending"},{"field":"CustomerID","direction":"descending"}]');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.sortColumn('CustomerID', 'descending', true);
        });
        it('Remove sorted column by field method testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(col2.querySelectorAll('.e-descending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"CustomerID","direction":"descending"}]');
                gridObj.actionComplete = (e?: Object) => undefined;
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.removeSortColumn('OrderID');
        });

        afterAll(() => {
            remove(elem);
        });
    });

    describe('sort inital settings', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    allowSorting: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    sortSettings: { columns: [{ field: 'OrderID', direction: 'ascending' }, { field: 'CustomerID', direction: 'ascending' }] },
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        it('Initial sort settings testing', () => {
            let col1: Element = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[0];
            let col2: Element = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[1];
            expect(col1.querySelectorAll('.e-ascending').length).toBe(1);
            expect(col2.querySelectorAll('.e-ascending').length).toBe(1);
            expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"OrderID","direction":"ascending"},{"field":"CustomerID","direction":"ascending"}]');
            expect(col1.querySelectorAll('.e-sortnumber').length).toBe(1);
            expect(col2.querySelectorAll('.e-sortnumber').length).toBe(1);
            gridObj.sortModule.removeSortColumn('Freight');
        });
        //set model and default properties model check
        afterAll(() => {
            remove(elem);
        });
    });

    describe('Sort with Grouping', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowGrouping: true,
                    groupSettings: { showGroupedColumn: true },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });
        // sort set model testing
        it('Sort a Column', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                expect(getString(gridObj.sortSettings.columns)).toBe('[{"field":"Freight","direction":"ascending"}]');
                expect((<any>gridObj.currentViewData[0]).Freight).toBe(3.05);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.sortColumn('Freight', 'ascending', false);
        });
        it('Disable Allow Sorting', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending.e-icon-ascending').length).toBe(0);
                expect(getString(gridObj.sortSettings.columns)).toBe('[]');
                expect((<any>gridObj.currentViewData[0]).OrderID).toBe(10248);
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.allowSorting = false;
            gridObj.dataBind();

        });
        it('Enable Allow Sorting', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.allowSorting).toBeTruthy();
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.allowSorting = true;
            gridObj.dataBind();

        });
        //check with sort and grouping - sort, group, sort, clear sort and group 
        it('Sort Column', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                expect((<any>gridObj.currentViewData[0]).Freight).toBe(3.05);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.sortColumn('Freight', 'ascending', false);
        });
        it('Sort and Group testing', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending.e-icon-ascending').length).toBe(2);
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-sortnumber').length).toBe(2);
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('EmployeeID');
            gridObj.dataBind();

        });
        it('Group with sort testing', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending.e-icon-ascending').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-sortnumber').length).toBe(2);
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('Freight', 'descending');
            gridObj.dataBind();

        });
        it('Clear sorting', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-descending').length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-sortnumber').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSorting();
            gridObj.dataBind();
        });

        it('remove Grouping', (done: Function) => {
            let actionComplete = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(0);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-descending.e-icon-descending').length).toBe(0);
                done();
            }
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('EmployeeID');
            gridObj.dataBound();
        });

        it('tri-state Sorting testing - first', (done) => {
            let actionComplete = () => {
                expect(gridObj.sortSettings.columns.length).toBe(1);
                expect((<HTMLTableCellElement>gridObj.getHeaderTable().querySelector('.e-headercell')).querySelector('.e-ascending')).not.toBeUndefined();
                done();
            };
            gridObj.actionComplete = actionComplete;
            (<HTMLTableCellElement>gridObj.getHeaderTable().querySelector('.e-headercell')).click();
        });

        it('tri-state Sorting testing - second', (done) => {
            let actionComplete = () => {
                expect(gridObj.sortSettings.columns.length).toBe(1);
                expect((<HTMLTableCellElement>gridObj.getHeaderTable().querySelector('.e-headercell')).querySelector('.e-descending')).not.toBeUndefined();
                done();
            };
            gridObj.actionComplete = actionComplete;
            (<HTMLTableCellElement>gridObj.getHeaderTable().querySelector('.e-headercell')).click();
        });

        it('tri-state Sorting testing - third', (done) => {
            let actionComplete = () => {
                expect(gridObj.sortSettings.columns.length).toBe(0);
                expect((<HTMLTableCellElement>gridObj.getHeaderTable().querySelector('.e-headercell')).querySelector('.e-ascending')).not.toBeUndefined();
                done();
            };
            gridObj.actionComplete = actionComplete;
            (<HTMLTableCellElement>gridObj.getHeaderTable().querySelector('.e-headercell')).click();
        });


        //set model and default properties model check
        afterAll(() => {
            remove(elem);
        });
    });

    describe('Grid popup testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let gridPopUp: HTMLElement;
        let spanElement: Element;
        let col1: Element;
        let actionComplete: (e?: Object) => void;
        let col2: Element;
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            Browser.userAgent = androidPhoneUa;
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    allowSorting: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity', allowSorting: false }],
                    dataBound: dataBound, actionComplete: actionComplete
                });
            gridObj.appendTo('#Grid');
        });

        it('gridPopUp display testing', () => {
            gridPopUp = gridObj.element.querySelector('.e-gridpopup') as HTMLElement;
            spanElement = gridPopUp.querySelector('span');
            col1 = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[0];
            col2 = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[1];
            expect(gridPopUp.style.display).toBe('none');
        });

        it('single sort testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridPopUp.style.display).toBe('');
                expect(spanElement.classList.contains('e-sortdirect')).toBeTruthy();
                expect(col1.querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            (col1 as HTMLElement).click();
        });


        it('multi sort testing', (done: Function) => {
            actionComplete = (args: Object): void => {
                expect(gridPopUp.style.display).toBe('');
                expect(spanElement.classList.contains('e-sortdirect')).toBeTruthy();
                expect(col1.querySelectorAll('.e-ascending').length).toBe(1);
                expect(col2.querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (spanElement as HTMLElement).click();
            expect(spanElement.classList.contains('e-spanclicked')).toBeTruthy();
            (col2 as HTMLElement).click();
        });

        it('gridpopup hide testing', () => {
            (spanElement as HTMLElement).click();
            expect(gridPopUp.style.display).toBe('none');

            //for coverage
            (<any>gridObj.sortModule).showPopUp({ target: gridObj.element });
            (<any>gridObj.sortModule).popUpClickHandler({ target: gridObj.element });
            (<any>gridObj.sortModule).getSortedColsIndexByField('OrderID', [{ field: 'OrderID' }]);
            gridObj.sortModule.sortColumn('ShipCity', 'ascending', false);
            gridObj.isDestroyed = true;
            (<any>gridObj.sortModule).addEventListener();
        });

        afterAll(() => {
            remove(elem);
        });
    });
});
