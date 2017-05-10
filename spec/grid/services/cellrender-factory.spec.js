var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, grid_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('CellRendererFactory module', function () {
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
            });
            it('Check fallback', function () {
                expect(function () { return gridObj.serviceLocator.getService('cellRendererFactory')
                    .getCellRenderer('hi'); }).toThrow('The cellRenderer hi is not found');
            });
            it('Check string register', function () {
                var CellMock = (function () {
                    function CellMock() {
                    }
                    CellMock.prototype.render = function (cell, data, attributes) {
                        return dom_1.createElement('td');
                    };
                    return CellMock;
                }());
                var DupCellMock = (function (_super) {
                    __extends(DupCellMock, _super);
                    function DupCellMock() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return DupCellMock;
                }(CellMock));
                var factory = gridObj.serviceLocator.getService('cellRendererFactory');
                factory.addCellRenderer('hi', new CellMock);
                factory.addCellRenderer('hi', new DupCellMock);
                expect('hi' in factory.cellRenderMap).toBeTruthy();
                expect(factory.getCellRenderer('hi') instanceof CellMock).toBeTruthy();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
