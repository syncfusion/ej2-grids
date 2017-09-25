/**
 * Grid base spec 
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Page } from '../../../src/grid/actions/page';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page);

describe('auto wrap testing', () => {
    describe('auto wrap properties', () => {
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
                    allowTextWrap: true,
                    textWrapSettings: {wrapMode: 'header'},
                    dataBound: dataBound,
                    actionComplete: actionComplete,
                });
            gridObj.appendTo('#Grid');
        });

        it('class testing for header', () => {
            expect(gridObj.element.classList.contains('e-wrap')).toBeFalsy();
            expect(gridObj.element.querySelector('.e-columnheader').classList.contains('e-wrap')).toBeTruthy();
            expect(gridObj.getContent().classList.contains('e-wrap')).toBeFalsy();
        });
        it('class testing for content', () => {
            gridObj.textWrapSettings.wrapMode = 'content';
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-wrap')).toBeFalsy();
            expect(gridObj.element.querySelector('.e-columnheader').classList.contains('e-wrap')).toBeFalsy();
            expect(gridObj.getContent().classList.contains('e-wrap')).toBeTruthy();
        });
        it('class testing for both', () => {
            gridObj.textWrapSettings.wrapMode = 'both';
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-wrap')).toBeTruthy();
            expect(gridObj.element.querySelector('.e-columnheader').classList.contains('e-wrap')).toBeFalsy();
            expect(gridObj.getContent().classList.contains('e-wrap')).toBeFalsy();
        });
        it('class testing for auto wrap property as false', () => {
            gridObj.allowTextWrap = false;
            gridObj.textWrapSettings.wrapMode = 'both';
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-wrap')).toBeFalsy();
            expect(gridObj.element.querySelector('.e-columnheader').classList.contains('e-wrap')).toBeFalsy();
            expect(gridObj.getContent().classList.contains('e-wrap')).toBeFalsy();
        });
        afterAll(() => {
            remove(elem);
        });
    });
    describe('auto wrap properties for stacked headercolumns', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [{headerText: 'Detail of the order', columns:[ { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' }
                        ]},
                        {headerText: 'Details of shipping', columns: [ { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' }]}
                        ],
                    allowTextWrap: true,
                    textWrapSettings: {wrapMode: 'header'},
                    dataBound: dataBound,
                    actionComplete: actionComplete,
                });
            gridObj.appendTo('#Grid');
        });

        it('class testing for header in stackedheadercolumns', () => {
            expect(gridObj.element.classList.contains('e-wrap')).toBeFalsy();
            let headerRows: Element[] = [].slice.call(gridObj.element.querySelectorAll('.e-columnheader'));
            for ( let i: number = 0; i < headerRows.length; i++ ) {
                   expect(headerRows[i].classList.contains('e-wrap')).toBeTruthy();
                  }
            expect(gridObj.getContent().classList.contains('e-wrap')).toBeFalsy();
        });
        afterAll(() => {
            remove(elem);
        });
    });
    describe('auto wrap properties for GroupedColumns', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [{headerText: 'Detail of the order', columns:[ { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' }
                        ]},
                        {headerText: 'Details of shipping', columns: [ { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' }]}
                        ],
                    allowTextWrap: true,
                    textWrapSettings: {wrapMode: 'header'},
                    dataBound: dataBound,
                    actionComplete: actionComplete,
                });
            gridObj.appendTo('#Grid');
        });
        it('class testing for header with GroupedColumns', () => {
            gridObj.allowGrouping = true;
            gridObj.groupSettings.columns = ['CustomerID'];
            expect(gridObj.element.classList.contains('e-wrap')).toBeFalsy();
            let headerRows: Element[] = [].slice.call(gridObj.element.querySelectorAll('.e-columnheader'));
            for ( let i: number = 0; i < headerRows.length; i++ ) {
                   expect(headerRows[i].classList.contains('e-wrap')).toBeTruthy();
                  }
            expect(gridObj.getContent().classList.contains('e-wrap')).toBeFalsy();
        });
        afterAll(() => {
            remove(elem);
        });
    });
});