define(["require", "exports", "@syncfusion/ej2-base/dom", "@syncfusion/ej2-data", "../../../src/grid/base/grid", "../../../src/grid/base/util", "../../../src/grid/actions/page", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, ej2_data_1, grid_1, util_1, page_1, datasource_spec_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(page_1.Page);
    describe('Data module', function () {
        describe('Locale data testing', function () {
            var mockAjax = function (d, query, response) {
                jasmine.Ajax.install();
                var dataManager = d.dm || new ej2_data_1.DataManager({
                    url: '/api/Employees',
                });
                var prom = dataManager.executeQuery(query);
                var request;
                var defaults = {
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify(d.data)
                };
                var responses = {};
                request = jasmine.Ajax.requests.mostRecent();
                util_1.extend(responses, defaults, response);
                request.respondWith(responses);
                return {
                    promise: prom,
                    request: request
                };
            };
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    query: new ej2_data_1.Query().take(5), allowPaging: false, dataBound: dataBound,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                });
                gridObj.appendTo('#Grid');
            });
            it('TR generated testing', function () {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(5);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Remote data without columns testing', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var resquest;
            var dataManager;
            var query = new ej2_data_1.Query().take(5);
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                jasmine.Ajax.install();
                dataManager = new ej2_data_1.DataManager({
                    url: 'service/Orders/'
                });
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: dataManager, dataBound: dataBound,
                    query: query, allowPaging: true,
                });
                gridObj.appendTo('#Grid');
                _this.request = jasmine.Ajax.requests.mostRecent();
                _this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: datasource_spec_1.data, __count: 15 })
                });
            });
            it('TR generated testing', function () {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(15);
            });
            it('Column count testing', function () {
                expect(gridObj.element.querySelectorAll('.e-headercell').length).toEqual(12);
            });
            afterAll(function () {
                gridObj.destroy();
                dom_1.remove(gridObj.element);
                jasmine.Ajax.uninstall();
            });
        });
        describe('actionFailure after control destroyed', function () {
            var actionFailedFunction = jasmine.createSpy('actionFailure');
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var gridObj;
            beforeAll(function () {
                jasmine.Ajax.install();
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: new ej2_data_1.DataManager({
                        url: '/test/db',
                        adaptor: new ej2_data_1.ODataV4Adaptor
                    }),
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    actionFailure: actionFailedFunction
                });
                gridObj.appendTo('#Grid');
            });
            beforeEach(function (done) {
                var request = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 404,
                    'contentType': 'application/json',
                    'responseText': 'Page not found'
                });
                setTimeout(function () { done(); }, 100);
            });
            it('actionFailure testing', function () {
                expect(actionFailedFunction).toHaveBeenCalled();
            });
            afterAll(function () {
                dom_1.remove(elem);
                jasmine.Ajax.uninstall();
            });
        });
        describe('Grid with empty datasource', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: null, allowPaging: false,
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
            it('Row count testing', function () {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(0);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
