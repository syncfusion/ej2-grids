define(["require", "exports", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/actions/page", "../../../src/grid/actions/sort", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, grid_1, page_1, sort_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(page_1.Page, sort_1.Sort);
    describe('Paging module', function () {
        describe('Paging functionalities', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var preventDefault = new Function();
            beforeAll(function (done) {
                var dataBound = function () {
                    setTimeout(function () { done(); }, 100);
                };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
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
            it('page size testing', function () {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(2);
            });
            it('current page testing', function () {
                expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toEqual('2');
            });
            it('page count testing', function () {
                expect(gridObj.getPager().getElementsByClassName('e-numericcontainer')[0].childNodes.length).toEqual(4);
            });
            it('totalRecordsCount testing', function () {
                expect(gridObj.pageSettings.totalRecordsCount).toEqual(15);
            });
            it('querystring testing', function () {
                gridObj.goToPage(3);
                expect(window.location.href.indexOf('?page=3')).toBeGreaterThan(-1);
            });
            it('class testing', function () {
                expect(gridObj.element.querySelectorAll('.e-pager').length).toEqual(1);
            });
            it('navigate page', function (done) {
                var row = JSON.stringify(gridObj.currentViewData[0]);
                actionComplete = function (args) {
                    expect(row !== JSON.stringify(gridObj.currentViewData[0])).toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.getPager().getElementsByClassName('e-numericcontainer')[0].childNodes[0].click();
            });
            it('pageDown shortcut testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toEqual('2');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.element.focus();
                var args = { action: 'pageDown', preventDefault: preventDefault };
                gridObj.keyBoardModule.keyAction(args);
            });
            it('pageUp shortcut testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toEqual('1');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                var args = { action: 'pageUp', preventDefault: preventDefault };
                gridObj.keyBoardModule.keyAction(args);
            });
            it('ctrlAltPageDown shortcut testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toEqual('8');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                var args = { action: 'ctrlAltPageDown', preventDefault: preventDefault };
                gridObj.keyBoardModule.keyAction(args);
            });
            it('ctrlAltPageUp shortcut testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toEqual('1');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                var args = { action: 'ctrlAltPageUp', preventDefault: preventDefault };
                gridObj.keyBoardModule.keyAction(args);
            });
            it('altPageDown shortcut testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toEqual('5');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                var args = { action: 'altPageDown', preventDefault: preventDefault };
                gridObj.keyBoardModule.keyAction(args);
            });
            it('altPageUp shortcut testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getPager().querySelectorAll('.e-active')[0].textContent).toEqual('1');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                var args = { action: 'altPageUp', preventDefault: preventDefault };
                gridObj.keyBoardModule.keyAction(args);
            });
            it('updateExternalmessage method false testing', function () {
                gridObj.updateExternalMessage('extmsg');
                expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].textContent).toEqual('extmsg');
            });
            it('updateExternalmessage method true testing', function () {
                gridObj.updateExternalMessage('extmsg1');
                expect(gridObj.getPager().querySelectorAll('.e-pagerexternalmsg')[0].textContent).toEqual('extmsg1');
            });
            it('current page onproperty changed testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getPager().getElementsByClassName('e-active')[0].getAttribute('index')).toEqual('4');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.pageSettings.currentPage = 4;
                gridObj.dataBind();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Disabled paging', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                document.body.appendChild(elem);
                var dataBound = function () { done(); };
                gridObj = new grid_1.Grid({
                    allowPaging: false,
                    dataSource: datasource_spec_1.data, dataBound: dataBound,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                    pageSettings: {
                        pageSize: 2, currentPage: 2, pageCount: 4,
                        totalRecordsCount: 10, enableQueryString: true
                    },
                });
                gridObj.appendTo('#Grid');
            });
            it('class testing', function () {
                expect(gridObj.element.querySelectorAll('.e-pager').length).toEqual(0);
            });
            it('allowpaging true setmodel testing', function () {
                gridObj.allowPaging = true;
                gridObj.dataBind();
                expect(gridObj.element.querySelectorAll('.e-pager').length).toEqual(1);
            });
            it('allowpaging false setmodel testing', function () {
                gridObj.allowPaging = false;
                gridObj.dataBind();
                expect(gridObj.element.querySelectorAll('.e-pager').length).toEqual(0);
            });
            it('allowpaging true setmodel testing', function (done) {
                var dataBound = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-pager').length).toEqual(1);
                    done();
                };
                gridObj.dataBound = dataBound;
                gridObj.allowPaging = true;
                gridObj.dataBind();
            });
            it('change pageCount', function () {
                gridObj.pageSettings.pageCount = 3;
                gridObj.dataBind();
                expect(gridObj.element.querySelectorAll('.e-link.e-numericitem.e-spacing.e-pager-default').length).toEqual(3);
            });
            it('Check enableQueryString', function (done) {
                var actionComplete = function (args) {
                    expect(document.location.href).toMatch('page=1');
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.pageSettings.currentPage = 1;
                gridObj.dataBind();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('paging without pageSettings', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    allowPaging: true,
                    dataSource: datasource_spec_1.data, dataBound: dataBound,
                    allowSorting: true,
                    height: 300,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                });
                gridObj.appendTo('#Grid');
            });
            it('class testing', function () {
                expect(gridObj.element.querySelectorAll('.e-pager').length).toEqual(1);
                gridObj.pageSettings = { currentPage: 3 };
                gridObj.dataBind();
                gridObj.pagerModule.refresh();
                gridObj.getContent().firstElementChild.scrollTop = 10;
                var args = { action: 'pageDown', preventDefault: function () { } };
                gridObj.keyBoardModule.keyAction(args);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Paging & Scrolling - PageDown case', function () {
            var grid;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var preventDefault = new Function();
            var which = 'which';
            var content;
            var raiseEvt = function (code) {
                var p = { '34': 'pageDown', '33': 'pageUp' };
                grid.keyBoardModule.keyAction({ action: p[code + ''], preventDefault: function () { return 0; } });
            };
            describe('pageDown case', function () {
                beforeAll(function (done) {
                    var dataBound = function () {
                        done();
                    };
                    document.body.appendChild(elem);
                    grid = new grid_1.Grid({
                        dataSource: datasource_spec_1.data,
                        columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                            { field: 'ShipCity' }],
                        allowPaging: true,
                        pageSettings: {
                            pageSize: 12
                        },
                        height: 300,
                        dataBound: function () { setTimeout(function () { return done(); }, 100); }
                    });
                    grid.appendTo('#Grid');
                    content = grid.getContent().firstChild;
                });
                it('pageDown check - no page trigger', function () {
                    content.focus();
                    raiseEvt(34, grid);
                    expect(grid.pageSettings.currentPage).toEqual(1);
                });
                it('pageDown check - page trigger', function () {
                    content.scrollTop = (content.scrollHeight - content.clientHeight) + 1;
                    raiseEvt(34);
                    expect(grid.pageSettings.currentPage).toEqual(2);
                });
                afterAll(function () {
                    dom_1.remove(elem);
                });
            });
            describe('pageUp case', function () {
                beforeAll(function (done) {
                    elem = dom_1.createElement('div', { id: 'Grid' });
                    document.body.appendChild(elem);
                    grid = new grid_1.Grid({
                        dataSource: datasource_spec_1.data,
                        columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                            { field: 'ShipCity' }],
                        allowPaging: true,
                        pageSettings: {
                            pageSize: 12
                        },
                        height: 300,
                        dataBound: function () { setTimeout(function () { return done(); }, 100); }
                    });
                    grid.appendTo(elem);
                    content = grid.getContent().firstChild;
                });
                it('pageUp check - no page trigger', function () {
                    content.focus();
                    grid.goToPage(2);
                    content.scrollTop = 10;
                    raiseEvt(33, grid);
                    expect(grid.pageSettings.currentPage).toEqual(2);
                });
                it('pageUp check - page trigger', function () {
                    content.scrollTop = 0;
                    raiseEvt(33, grid);
                    expect(grid.pageSettings.currentPage).toEqual(1);
                });
                afterAll(function () {
                    dom_1.remove(elem);
                });
            });
        });
    });
});
