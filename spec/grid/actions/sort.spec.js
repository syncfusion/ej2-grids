define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/actions/sort", "../../../src/grid/actions/filter", "../../../src/grid/actions/page", "../../../src/grid/actions/group", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, ej2_base_1, util_1, dom_1, grid_1, sort_1, filter_1, page_1, group_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(sort_1.Sort, page_1.Page, filter_1.Filter, group_1.Group);
    describe('Sorting module', function () {
        var getActualProperties = function (obj) {
            if (obj instanceof ej2_base_1.ChildProperty) {
                return util_1.getValue('properties', obj);
            }
            else {
                return obj;
            }
        };
        var getString = function (obj) {
            return JSON.stringify(obj, function (key, value) {
                return getActualProperties(value);
            });
        };
        describe('Sorting functionalities', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionBegin;
            var actionComplete;
            var colHeader;
            var col1;
            var col2;
            var evt = document.createEvent('MouseEvent');
            evt.initMouseEvent('click', true, true, window, null, 0, 0, 0, 0, true, false, false, false, 0, null);
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    allowSorting: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Single sort orderID asc testing', function (done) {
                actionComplete = function (args) {
                    expect(col1.querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(getString(gridObj.sortSettings.columns) === '[{"field":"OrderID","direction":"ascending"}]').toEqual(true);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                col1 = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[0];
                col2 = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[1];
                col1.click();
            });
            it('Single sort orderID des testing', function (done) {
                actionComplete = function (args) {
                    expect(col1.querySelectorAll('.e-descending').length).toEqual(1);
                    expect(getString(gridObj.sortSettings.columns) === '[{"field":"OrderID","direction":"descending"}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                col1.click();
            });
            it('Single sort CustomerID asc testing', function (done) {
                actionComplete = function (args) {
                    expect(col2.querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(getString(gridObj.sortSettings.columns) === '[{"field":"CustomerID","direction":"ascending"}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                col2.click();
            });
            it('Single sort CustomerID des testing', function (done) {
                actionComplete = function (args) {
                    expect(col2.querySelectorAll('.e-descending').length).toEqual(1);
                    expect(getString(gridObj.sortSettings.columns) === '[{"field":"CustomerID","direction":"descending"}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                col2.click();
            });
            it('clear sorting', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toEqual(0);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-ascending').length).toEqual(0);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-descending').length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                gridObj.clearSorting();
            });
            it('actionBegin event call', function () {
                var spyFn = jasmine.createSpy('begin');
                gridObj.actionBegin = spyFn;
                gridObj.dataBind();
                colHeader = col2;
                colHeader.click();
                expect(spyFn).toHaveBeenCalled();
            });
            it('Disabled sort asc testing', function () {
                gridObj.allowSorting = false;
                gridObj.dataBind();
                colHeader = col1;
                colHeader.click();
                expect(colHeader.querySelectorAll('.e-ascending').length).toEqual(0);
                expect(gridObj.sortSettings.columns.length).toEqual(0);
            });
            it('Disabled sort des testing', function () {
                colHeader = col1;
                colHeader.click();
                expect(colHeader.querySelectorAll('.e-descending').length).toEqual(0);
                expect(gridObj.sortSettings.columns.length).toEqual(0);
            });
            it('Multisort OrderID asc testing', function (done) {
                gridObj.allowSorting = true;
                gridObj.dataBind();
                actionComplete = function (args) {
                    expect(col1.querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(getString(gridObj.sortSettings.columns) === '[{"field":"OrderID","direction":"ascending"}]').toEqual(true);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                col1.click();
            });
            it('Multisort OrderID and CustomerID testing', function (done) {
                actionComplete = function (args) {
                    expect(col1.querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(col2.querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(getString(gridObj.sortSettings.columns) ===
                        '[{"field":"OrderID","direction":"ascending"},{"field":"CustomerID","direction":"ascending"}]').toEqual(true);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toEqual(2);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                col2.dispatchEvent(evt);
            });
            it('Multisort OrderID and CustomerID des testing', function (done) {
                actionComplete = function (args) {
                    expect(col1.querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(col2.querySelectorAll('.e-descending').length).toEqual(1);
                    expect(getString(gridObj.sortSettings.columns) ===
                        '[{"field":"OrderID","direction":"ascending"},{"field":"CustomerID","direction":"descending"}]').toEqual(true);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toEqual(2);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                col2.dispatchEvent(evt);
            });
            it('Multisort OrderID, CustomerID des, EmployeeID testing', function (done) {
                actionComplete = function (args) {
                    expect(col1.querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(col2.querySelectorAll('.e-descending').length).toEqual(1);
                    expect(colHeader.querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(getString(gridObj.sortSettings.columns) ===
                        '[{"field":"OrderID","direction":"ascending"},{"field":"CustomerID","direction":"descending"},' +
                            '{"field":"EmployeeID","direction":"ascending"}]').toEqual(true);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toEqual(3);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                colHeader = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[2];
                colHeader.dispatchEvent(evt);
            });
            it('Clear sorting', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-sortnumber').length).toEqual(0);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-ascending').length).toEqual(0);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-columnheader')[0].querySelectorAll('.e-descending').length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                gridObj.clearSorting();
            });
            it('Single sort column method testing', function (done) {
                actionComplete = function (args) {
                    expect(col1.querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(getString(gridObj.sortSettings.columns) === '[{"field":"OrderID","direction":"ascending"}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                gridObj.sortColumn('OrderID', 'ascending', false);
            });
            it('Multisort column method testing', function (done) {
                actionComplete = function (args) {
                    expect(col1.querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(col2.querySelectorAll('.e-descending').length).toEqual(1);
                    expect(getString(gridObj.sortSettings.columns) ===
                        '[{"field":"OrderID","direction":"ascending"},{"field":"CustomerID","direction":"descending"}]').toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                gridObj.sortColumn('CustomerID', 'descending', true);
            });
            it('Remove sorted column by field method testing', function (done) {
                actionComplete = function (args) {
                    expect(col2.querySelectorAll('.e-descending').length).toEqual(1);
                    expect(getString(gridObj.sortSettings.columns) === '[{"field":"CustomerID","direction":"descending"}]').toEqual(true);
                    gridObj.actionComplete = function (e) { return undefined; };
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                gridObj.removeSortColumn('OrderID');
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('sort inital settings', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    allowSorting: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                    sortSettings: { columns: [{ field: 'OrderID', direction: 'ascending' }, { field: 'CustomerID', direction: 'ascending' }] },
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Initial sort settings testing', function () {
                var col1 = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[0];
                var col2 = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[1];
                expect(col1.querySelectorAll('.e-ascending').length).toEqual(1);
                expect(col2.querySelectorAll('.e-ascending').length).toEqual(1);
                expect(getString(gridObj.sortSettings.columns) ===
                    '[{"field":"OrderID","direction":"ascending"},{"field":"CustomerID","direction":"ascending"}]').toEqual(true);
                expect(col1.querySelectorAll('.e-sortnumber').length).toEqual(1);
                expect(col2.querySelectorAll('.e-sortnumber').length).toEqual(1);
                gridObj.sortModule.removeSortColumn('Freight');
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Sort with Grouping', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionComplete;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    allowSorting: true,
                    allowGrouping: true,
                    groupSettings: { showGroupedColumn: true },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Sort a Column', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(getString(gridObj.sortSettings.columns) === '[{"field":"Freight","direction":"ascending"}]').toEqual(true);
                    expect(gridObj.currentViewData[0].Freight === 3.05).toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                gridObj.sortColumn('Freight', 'ascending', false);
            });
            it('Disable Allow Sorting', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending.e-icon-ascending').length).toEqual(0);
                    expect(getString(gridObj.sortSettings.columns) === '[]').toEqual(true);
                    expect(gridObj.currentViewData[0].OrderID === 10248).toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.allowSorting = false;
                gridObj.dataBind();
            });
            it('Enable Allow Sorting', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.allowSorting).toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.allowSorting = true;
                gridObj.dataBind();
            });
            it('Sort Column', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(gridObj.currentViewData[0].Freight === 3.05).toEqual(true);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                gridObj.sortColumn('Freight', 'ascending', false);
            });
            it('Sort and Group testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending.e-icon-ascending').length).toEqual(2);
                    expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toEqual(1);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-sortnumber').length).toEqual(2);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.groupColumn('EmployeeID');
                gridObj.dataBind();
            });
            it('Group with sort testing', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending.e-icon-ascending').length).toEqual(1);
                    expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toEqual(1);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-sortnumber').length).toEqual(2);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.sortColumn('Freight', 'descending');
                gridObj.dataBind();
            });
            it('Clear sorting', function (done) {
                actionComplete = function (args) {
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-descending').length).toEqual(0);
                    expect(gridObj.getHeaderContent().querySelectorAll('.e-sortnumber').length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.clearSorting();
                gridObj.dataBind();
            });
            it('remove Grouping', function (done) {
                var actionComplete = function (args) {
                    expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toEqual(0);
                    expect(gridObj.getHeaderTable().querySelectorAll('.e-descending.e-icon-descending').length).toEqual(0);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.groupModule.ungroupColumn('EmployeeID');
                gridObj.dataBound();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Grid popup testing', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var gridPopUp;
            var spanElement;
            var col1;
            var actionComplete;
            var col2;
            var androidPhoneUa = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                ej2_base_1.Browser.userAgent = androidPhoneUa;
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    allowSorting: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity', allowSorting: false }],
                    dataBound: dataBound, actionComplete: actionComplete
                });
                gridObj.appendTo('#Grid');
            });
            it('gridPopUp display testing', function () {
                gridPopUp = gridObj.element.querySelector('.e-gridpopup');
                spanElement = gridPopUp.querySelector('span');
                col1 = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[0];
                col2 = gridObj.getHeaderContent().querySelectorAll('.e-headercell')[1];
                expect(gridPopUp.style.display).toEqual('none');
            });
            it('single sort testing', function (done) {
                actionComplete = function (args) {
                    expect(gridPopUp.style.display).toEqual('');
                    expect(spanElement.classList.contains('e-sortdirect')).toEqual(true);
                    expect(col1.querySelectorAll('.e-ascending').length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                gridObj.dataBind();
                col1.click();
            });
            it('multi sort testing', function (done) {
                actionComplete = function (args) {
                    expect(gridPopUp.style.display).toEqual('');
                    expect(spanElement.classList.contains('e-sortdirect')).toEqual(true);
                    expect(col1.querySelectorAll('.e-ascending').length).toEqual(1);
                    expect(col2.querySelectorAll('.e-ascending').length).toEqual(1);
                    done();
                };
                gridObj.actionComplete = actionComplete;
                spanElement.click();
                expect(spanElement.classList.contains('e-spanclicked')).toEqual(true);
                col2.click();
            });
            it('gridpopup hide testing', function () {
                spanElement.click();
                expect(gridPopUp.style.display).toEqual('none');
                gridObj.sortModule.showPopUp({ target: gridObj.element });
                gridObj.sortModule.popUpClickHandler({ target: gridObj.element });
                gridObj.sortModule.getSortedColsIndexByField('OrderID', [{ field: 'OrderID' }]);
                gridObj.sortModule.sortColumn('ShipCity', 'ascending', false);
                gridObj.isDestroyed = true;
                gridObj.sortModule.addEventListener();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
