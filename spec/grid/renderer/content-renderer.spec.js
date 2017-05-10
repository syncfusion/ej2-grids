define(["require", "exports", "@syncfusion/ej2-base/dom", "@syncfusion/ej2-data", "../../../src/grid/base/grid", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, ej2_data_1, grid_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Content renderer module', function () {
        describe('grid content element testing', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    query: new ej2_data_1.Query().take(5), allowPaging: false, enableAltRow: false,
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
            it('Content div testing', function () {
                expect(gridObj.element.querySelectorAll('.e-gridcontent').length).toEqual(1);
            });
            it('Content table testing', function () {
                expect(gridObj.contentModule.getPanel().querySelectorAll('.e-table').length).toEqual(1);
            });
            it('Content cell count testing', function () {
                expect(gridObj.element.querySelectorAll('.e-row')[0].childNodes.length).toEqual(gridObj.getColumns().length);
            });
            it('getRows', function () {
                expect(gridObj.contentModule.getRows().length).toEqual(5);
                gridObj.contentModule.setColGroup(undefined);
                gridObj.contentModule.colGroupRefresh();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
