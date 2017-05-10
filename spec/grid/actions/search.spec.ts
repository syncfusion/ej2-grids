/**
 * Grid search spec document
 */
import { Browser, EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { SortDirection } from '../../../src/grid/base/enum';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { Search } from '../../../src/grid/actions/search';
import { Page } from '../../../src/grid/actions/page';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Search, Page);

describe('Search module', () => {
    describe('Search methods testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let beforePrint: Function;
        let actionComplete: (args?: Object) => void;

        beforeAll((done: Function) => {
            let dataBoundSearch: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    allowPaging: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    actionComplete: actionComplete,
                    dataBound: dataBoundSearch
                });
            gridObj.appendTo('#Grid');
        });

        it('Search method testing', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.searchModule.search('10249');
        });

        it('Search method same key testing', () => {
            gridObj.searchModule.search('10249');
            expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
        });

        it('Search method empty string testing', (done: Function) => {
            actionComplete = (): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(12);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.search('');
        });

        it('Search method ignorecase testing', (done: Function) => {
            actionComplete = (): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.searchModule.search('ViNet');
        });

        it('Search clear testing', (done: Function) => {
            actionComplete = (): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(12);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.search('');
        });

        it('goToPage testing for search', (done: Function) => {
            actionComplete = (): void => {
                expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toEqual('2');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 2;
            gridObj.dataBind();
        });

        it('Search method from last page testing testing', (done: Function) => {
            actionComplete = (): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.searchModule.search('TOMSP');
            (<any>gridObj.searchModule).onPropertyChanged({ module: 'search', properties: {} });
        });

        afterAll(() => {
            remove(elem);
        });
    });

    //scenario - goto last page and search a value, check grid render with first page
    //then check clear searching case.

    describe('Search methods testing with paging', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: () => void;

        beforeAll((done: Function) => {
            let dataBoundSearch: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    allowPaging: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    actionComplete: actionComplete,
                    dataBound: dataBoundSearch,
                    pageSettings: { pageSize: 6, pageCount: 3 }
                });
            gridObj.appendTo('#Grid');
        });
        it('go to last page', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].innerHTML).toEqual('3');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.currentPage = 3;
            gridObj.dataBind();
        });
        it('search a value', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].innerHTML).toEqual('1');
                expect(gridObj.pageSettings.totalRecordsCount).toEqual(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.search('VINET');
            gridObj.dataBind();
        });
        it('clear search value', (done: Function) => {
            actionComplete = (args?: Object) => {
                expect(gridObj.getPager().querySelectorAll('.e-active')[0].innerHTML).toEqual('1')
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.search('');
            gridObj.dataBind();
        });
        afterAll(() => {
            remove(elem);
        });
    });

});
