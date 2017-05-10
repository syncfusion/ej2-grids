define(["require", "exports", "@syncfusion/ej2-base/dom", "@syncfusion/ej2-data", "../../../src/grid/base/grid", "../../../src/grid/base/enum", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, ej2_data_1, grid_1, enum_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('header renderer module', function () {
        describe('grid header element testing', function () {
            var gridObj;
            var elem;
            if (document.body.querySelectorAll('#Grid').length) {
                elem = document.body.querySelectorAll('#Grid')[0];
                dom_1.remove(elem);
            }
            else {
                elem = dom_1.createElement('div', { id: 'Grid' });
            }
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    query: new ej2_data_1.Query().take(5), allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', headerTemplate: 'template' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Header div testing', function () {
                expect(gridObj.element.querySelectorAll('.e-gridheader').length).toEqual(1);
            });
            it('Header table testing', function () {
                expect(gridObj.headerModule.getPanel().querySelectorAll('.e-table').length).toEqual(1);
            });
            it('Column header testing', function () {
                expect(gridObj.headerModule.getPanel().querySelectorAll('.e-columnheader').length).toEqual(1);
            });
            it('Column count testing', function () {
                expect(gridObj.element.querySelectorAll('.e-headercell').length).toEqual(gridObj.getColumns().length);
                var hRender = gridObj.renderModule.locator.getService('cellRendererFactory').getCellRenderer(enum_1.CellType.Header);
                hRender.refresh({ column: gridObj.getColumns()[1] }, dom_1.createElement('div'));
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
