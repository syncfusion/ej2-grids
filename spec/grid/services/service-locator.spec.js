define(["require", "exports", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, grid_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('ServiceLocator module', function () {
        var servFunc = function () {
            return 'hi';
        };
        describe('Register and get service', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, allowPaging: false,
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
                gridObj.serviceLocator.register('servFunc', servFunc);
            });
            it('Register and getService testing', function () {
                var fn = gridObj.serviceLocator.getService('servFunc');
                expect(fn()).toBe('hi');
            });
            it('Register and getService testing', function () {
                gridObj.serviceLocator.register('servFunc', servFunc);
                var fn = gridObj.serviceLocator.getService('servFunc');
                expect(fn()).toBe('hi');
            });
            it('Check fallback', function () {
                expect(function () { return gridObj.serviceLocator.getService('mock'); }).toThrow('The service mock is not registered');
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
