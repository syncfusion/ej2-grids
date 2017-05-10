define(["require", "exports", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, grid_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Render module', function () {
        describe('Grid render', function () {
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
                        { headerText: 'OrderDate', field: 'OrderDate', format: 'long', type: 'datetime' },
                    ],
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Row count testing', function () {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.data.length);
                gridObj.getColumns()[0].type = undefined;
                gridObj.getColumns()[1].type = undefined;
                gridObj.getColumns()[2].type = undefined;
                gridObj.getColumns()[3].type = undefined;
                gridObj.getColumns()[4].type = undefined;
                gridObj.renderModule.updateColumnType({
                    OrderID: new Date(2017, 2, 13, 0, 0, 0, 10),
                    EmployeeID: new Date(2017, 2, 13, 0, 0, 10, 0), CustomerID: new Date(2017, 2, 13, 0, 10, 0, 0),
                    ShipCity: new Date(2017, 2, 13, 10, 0, 0, 0), ShipCountry: new Date(2017, 2, 13, 0, 0, 0, 0), OrderDate: new Date(2017, 2, 13, 0, 10, 0, 10)
                });
                gridObj.renderModule.data.removeRows({ indexes: [4, 5] });
                gridObj.ariaService.setOptions(null, { role: 'grid' });
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Grid render without columns testing', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, allowPaging: false, dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Column count testing', function () {
                expect(gridObj.element.querySelectorAll('.e-headercell').length).toEqual(gridObj.getColumns().length);
            });
            it('Content cell count testing', function () {
                var cols = gridObj.getColumns();
                expect(gridObj.element.querySelectorAll('.e-row')[0].childNodes.length).toEqual(cols.length);
                cols = [];
                gridObj.renderModule.dataManagerSuccess({ result: {}, count: 0 });
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Column type testing with empty data source', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: [], allowPaging: false, dataBound: dataBound,
                    columns: [
                        { field: 'Column1', type: 'string' },
                        { field: 'Column2' }
                    ]
                });
                gridObj.appendTo('#Grid');
            });
            it('Column type testing', function () {
                expect(gridObj.columns[0].type).toEqual('string');
                expect(gridObj.columns[1].type).toBeNull();
            });
        });
    });
});
