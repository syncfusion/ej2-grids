/**
 * Template render spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Grid } from '../../../src/grid/base/grid';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

describe('Template render module', () => {
    describe('column template render', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { field: 'EmployeeID' },
                        { template: '<div>${EmployeeID}</div><div>${index}</div>', headerText: 'Template column' },
                        { field: 'CustomerID', headerText: 'Customer ID' },

                    ],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('template render testing', () => {
            let trs = gridObj.getContent().querySelectorAll('tr');
            expect(trs[0].querySelector('.e-templatecell').innerHTML).toEqual('<div>5</div><div>0</div>');
            expect(trs[1].querySelector('.e-templatecell').innerHTML).toEqual('<div>6</div><div>1</div>');
            expect(gridObj.getHeaderTable().querySelectorAll('.e-headercelldiv')[1].innerHTML).toEqual('<span class="e-headertext">Template column</span>');
        });

        afterAll(() => {
            remove(elem);
        });

    });

    describe('column template element render', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            let template: Element = createElement('div', { id: 'template' });
            template.innerHTML = '<div>${EmployeeID}</div>';
            document.body.appendChild(template);
            gridObj = new Grid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { field: 'EmployeeID' },
                        { template: '#template', headerText: 'Template column' },
                        { field: 'CustomerID', headerText: 'Customer ID' },

                    ],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('cell value testing', () => {
            let trs = gridObj.getContent().querySelectorAll('tr');
            expect(trs[0].querySelector('.e-templatecell').innerHTML).toEqual('<div>5</div>');
        });

        afterAll(() => {
            remove(elem);
        });

    });


    describe('row template render', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, allowPaging: false,
                    rowTemplate: '<td>${OrderID}</td><td>${EmployeeID}</td>',
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'CustomerID', headerText: 'Customer ID' },

                    ],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('row render testing', () => {
            let trs = gridObj.getContent().querySelectorAll('tr');
            expect(trs[0].querySelectorAll('td')[0].innerHTML).toEqual('10248');
            expect(trs[0].querySelectorAll('td')[1].innerHTML).toEqual('5');
            expect(trs[1].querySelectorAll('td')[0].innerHTML).toEqual('10249');
            expect(trs[1].querySelectorAll('td')[1].innerHTML).toEqual('6');
        });

        afterAll(() => {
            remove(elem);
        });

    });

});