/**
 * Grid base spec 
 */
import { L10n, EmitType } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Query } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { GridLine } from '../../../src/grid/base/enum';
import { Column } from '../../../src/grid/models/column';
import { Page } from '../../../src/grid/actions/page';
import { data, filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page);

describe('Grid base module', () => {
    describe('Grid properties', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: (e?: Object) => void;
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
                    enableHover: false,
                    dataBound: dataBound,
                    actionComplete: actionComplete,
                });
            gridObj.appendTo('#Grid');
        });

        it('enable RTL testing', () => {
            gridObj.enableRtl = true;
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-rtl')).toEqual(true);
        });

        it('disable RTL testing', () => {
            gridObj.enableRtl = false;
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-rtl')).toEqual(false);
        });

        it('enable row hover testing', () => {
            gridObj.enableHover = true;
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-gridhover')).toEqual(true);
        });

        it('disable row hover testing', () => {
            gridObj.enableHover = false;
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-gridhover')).toEqual(false);
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(data.length);
        });

        it('Column count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-headercell').length).toEqual(gridObj.getColumns().length);
        });
        it('Content cell count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row')[0].childNodes.length).toEqual(gridObj.getColumns().length);
        });

        // it('datasource onproperty changed testing', (done: Function) => {
        //     actionComplete = (args: Object): void => {
        //         expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(15);
        //         done();
        //     };
        //     gridObj.dataBound = actionComplete;
        //     gridObj.dataSource = filterData;
        //     gridObj.dataBind();
        // });

        it('Disable altrow', (done: Function) => {
            let dataBound = (args: Object) => {
                expect(gridObj.getContent().querySelectorAll('.e-altrow').length).toEqual(0);
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.enableAltRow = false;
            gridObj.dataBind();
        });
        it('enable altrow', (done: Function) => {
            let dataBound = (args: Object) => {
                expect(gridObj.getContent().querySelectorAll('.e-altrow').length).toEqual(Math.floor(gridObj.currentViewData.length / 2));
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.enableAltRow = true;
            gridObj.dataBind();
        });

        afterAll(() => {
            remove(elem);
        });

    });

    describe('Method testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: (e?: Object) => void;

        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, actionComplete: actionComplete, allowPaging: false,
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

        it('getRowByIndex testing', () => {
            expect(isNullOrUndefined(gridObj.getRowByIndex(1))).toEqual(false);
        });

        it('getHeaderContent testing', () => {
            expect(isNullOrUndefined(gridObj.getHeaderContent())).toEqual(false);
        });

        it('getContentTable testing', () => {
            expect(isNullOrUndefined(gridObj.getContentTable())).toEqual(false);
        });

        it('getContent testing', () => {
            expect(isNullOrUndefined(gridObj.getContent())).toEqual(false);
        });

        it('getHeaderTable testing', () => {
            expect(isNullOrUndefined(gridObj.getHeaderTable())).toEqual(false);
        });

        it('setGridHeaderContent testing', () => {
            let element: Element = gridObj.getHeaderContent();
            gridObj.setGridHeaderContent(element);
            expect(gridObj.getHeaderContent().isEqualNode(element)).toEqual(true);
        });

        it('setGridContentTable testing', () => {
            let element: Element = gridObj.getContentTable();
            gridObj.setGridContentTable(element);
            expect(gridObj.getContentTable().isEqualNode(element)).toEqual(true);
        });

        it('setGridContent testing', () => {
            let element: Element = gridObj.getContent();
            gridObj.setGridContent(element);
            expect(gridObj.getContent().isEqualNode(element)).toEqual(true);
        });

        it('setGridHeaderTable testing', () => {
            let element: Element = gridObj.getHeaderTable();
            gridObj.setGridHeaderTable(element);
            expect(gridObj.getHeaderTable().isEqualNode(element)).toEqual(true);
        });

        it('getColumnByField testing', () => {
            let col: Column = gridObj.getColumnByField('OrderID');
            expect(col.field).toEqual('OrderID');
        });

        it('getColumnIndexByField testing', () => {
            let col: number = gridObj.getColumnIndexByField('OrderID');
            expect(col).toEqual(0);
            let col1: number = gridObj.getColumnIndexByField('OrderID1');
            expect(col1).toEqual(-1);
        });

        it('getColumnIndexByUid testing', () => {
            let col: number = gridObj.getColumnIndexByUid(gridObj.getColumnByField('OrderID').uid);
            expect(col).toEqual(0);
            col = gridObj.getColumnIndexByUid(gridObj.getColumnByField('OrderID').uid + 'test');
            expect(col).toEqual(-1);
        });

        it('getUidByColumnField testing', () => {
            expect(gridObj.getUidByColumnField('OrderID')).toEqual(gridObj.getColumnByField('OrderID').uid);
        });

        it('getColumnHeaderByIndex testing', () => {
            expect(gridObj.getColumnHeaderByIndex(1).querySelector('.e-headercelldiv').textContent).toEqual('CustomerID');
        });

        it('renderEmptyRow testing', () => {
            gridObj.renderModule.renderEmptyRow();
            expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(0);
            expect(gridObj.element.querySelectorAll('.e-emptyrow').length).toEqual(1);
        });


        afterAll(() => {
            gridObj.getPersistData();
            remove(elem);
        });
    });

    describe('Grid lines testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let header: Element;
        let content: Element;
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
                    gridLines: 'both',
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Grid line both testing', () => {
            expect(gridObj.element.classList.contains('e-horizontallines')).toEqual(false);
            expect(gridObj.element.classList.contains('e-verticallines')).toEqual(false);
            expect(gridObj.element.classList.contains('e-hidelines')).toEqual(false);
        });

        it('Grid line horizontal testing', () => {
            gridObj.gridLines = 'horizontal';
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-horizontallines')).toEqual(true);
            expect(gridObj.element.classList.contains('e-verticallines')).toEqual(false);
            expect(gridObj.element.classList.contains('e-hidelines')).toEqual(false);
        });

        it('Grid line vertical testing', () => {
            gridObj.gridLines = 'vertical';
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-horizontallines')).toEqual(false);
            expect(gridObj.element.classList.contains('e-verticallines')).toEqual(true);
            expect(gridObj.element.classList.contains('e-hidelines')).toEqual(false);
        });

        it('Grid line hide both testing', () => {
            gridObj.gridLines = 'none';
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-horizontallines')).toEqual(false);
            expect(gridObj.element.classList.contains('e-verticallines')).toEqual(false);
            expect(gridObj.element.classList.contains('e-hidelines')).toEqual(true);
        });

        afterAll(() => {
            remove(elem);
        });
    });


    describe('Grid lines testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let colHeader: Element;
        let content: Element;
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
                    allowTextWrap: true,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Text wrap testing', () => {
            expect(gridObj.element.classList.contains('e-wrap')).toEqual(true);
        });

        it('Text wrap false testing', () => {
            gridObj.allowTextWrap = false;
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-wrap')).toEqual(false);
        });

        it('Text wrap false testing', () => {
            gridObj.allowTextWrap = true;
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-wrap')).toEqual(true);
        });

        afterAll(() => {
            remove(elem);
        });
    });

    describe('Localization testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });

        beforeAll((done: Function) => {
            L10n.load({
                'de-DE': {
                    'grid': {
                        EmptyRecord: 'Geen records om te laten zien'
                    }
                }
            });
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, locale: 'de-DE', allowPaging: false,
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

        it('renderEmptyRow testing', () => {
            gridObj.renderModule.renderEmptyRow();
            expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(0);
            expect(gridObj.element.querySelectorAll('.e-emptyrow').length).toEqual(1);
        });

        it('renderEmptyRow content testing', () => {
            expect(gridObj.element.querySelector('.e-emptyrow').textContent).toEqual('Geen records om te laten zien');
        });

        it('get constant method testing', () => {
            expect(gridObj.localeObj.getConstant('True')).toEqual('true');
        });

        it('get constant method testing', () => {
            expect(gridObj.localeObj.getConstant('EmptyRecord')).toEqual('Geen records om te laten zien');
            //for coverage 
            gridObj.refreshHeader();
            gridObj.refresh();
        });

        afterAll(() => {
            remove(elem);
        });
    });

});

