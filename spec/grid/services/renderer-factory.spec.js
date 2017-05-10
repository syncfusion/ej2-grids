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
define(["require", "exports", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/base/enum", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, util_1, dom_1, grid_1, enum_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('RendererFactory module', function () {
        describe('Register and get service', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
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
                expect(function () { return gridObj.serviceLocator.getService('rendererFactory')
                    .getRenderer(enum_1.RenderType.Summary); }).toThrow('The renderer Summary is not found');
            });
            it('Check register', function () {
                var RenderMock = (function () {
                    function RenderMock() {
                    }
                    RenderMock.prototype.renderPanel = function () {
                        dom_1.createElement('div');
                    };
                    RenderMock.prototype.renderTable = function () {
                        dom_1.createElement('div');
                    };
                    RenderMock.prototype.setPanel = function (panel) {
                        dom_1.createElement('div');
                    };
                    RenderMock.prototype.setTable = function (table) {
                        dom_1.createElement('div');
                    };
                    RenderMock.prototype.getPanel = function () {
                        return dom_1.createElement('div');
                    };
                    ;
                    RenderMock.prototype.getTable = function () {
                        return dom_1.createElement('div');
                    };
                    ;
                    return RenderMock;
                }());
                var DupRenderMock = (function (_super) {
                    __extends(DupRenderMock, _super);
                    function DupRenderMock() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return DupRenderMock;
                }(RenderMock));
                var factory = gridObj.serviceLocator.getService('rendererFactory');
                factory.addRenderer(enum_1.RenderType.Summary, new RenderMock);
                factory.addRenderer(enum_1.RenderType.Summary, new DupRenderMock);
                expect(util_1.getEnumValue(enum_1.RenderType, enum_1.RenderType.Summary) in factory.rendererMap).toBeTruthy();
                expect(factory.getRenderer(enum_1.RenderType.Summary) instanceof RenderMock).toBeTruthy();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
