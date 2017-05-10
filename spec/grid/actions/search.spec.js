define(["require", "exports", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/actions/search", "../../../src/grid/actions/page", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, grid_1, search_1, page_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(search_1.Search, page_1.Page);
    describe('Search module', function () {
        describe('Search methods testing', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var beforePrint;
            var actionComplete;
            beforeAll(function (done) {
                var dataBoundSearch = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    allowPaging: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                    actionComplete: actionComplete,
                    dataBound: dataBoundSearch
                });
                gridObj.appendTo('#Grid');
            });
            it('Search method testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                gridObj.searchModule.search('10249');
            });
            it('Search method same key testing', function () {
                gridObj.searchModule.search('10249');
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
            });
            it('Search method empty string testing', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(12);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.search('');
            });
            it('Search method ignorecase testing', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.searchModule.search('ViNet');
            });
            it('Search clear testing', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(12);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.search('');
            });
            it('goToPage testing for search', function (done) {
                actionComplete = function () {
                    expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toEqual('2');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.pageSettings.currentPage = 2;
                gridObj.dataBind();
            });
            it('Search method from last page testing testing', function (done) {
                actionComplete = function () {
                    expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.searchModule.search('TOMSP');
                gridObj.searchModule.onPropertyChanged({ module: 'search', properties: {} });
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Search methods testing with paging', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionComplete;
            beforeAll(function (done) {
                var dataBoundSearch = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    allowPaging: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                    actionComplete: actionComplete,
                    dataBound: dataBoundSearch,
                    pageSettings: { pageSize: 6, pageCount: 3 }
                });
                gridObj.appendTo('#Grid');
            });
            it('go to last page', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getPager().querySelectorAll('.e-active')[0].innerHTML).toEqual('3');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.pageSettings.currentPage = 3;
                gridObj.dataBind();
            });
            it('search a value', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getPager().querySelectorAll('.e-active')[0].innerHTML).toEqual('1');
                    expect(gridObj.pageSettings.totalRecordsCount).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.search('VINET');
                gridObj.dataBind();
            });
            it('clear search value', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getPager().querySelectorAll('.e-active')[0].innerHTML).toEqual('1');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.search('');
                gridObj.dataBind();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
