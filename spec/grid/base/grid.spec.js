define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/actions/page", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, ej2_base_1, util_1, dom_1, grid_1, page_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(page_1.Page);
    describe('Grid base module', function () {
        describe('Grid properties', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionComplete;
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
                    enableHover: false,
                    dataBound: dataBound,
                    actionComplete: actionComplete,
                });
                gridObj.appendTo('#Grid');
            });
            it('enable RTL testing', function () {
                gridObj.enableRtl = true;
                gridObj.dataBind();
                expect(gridObj.element.classList.contains('e-rtl')).toEqual(true);
            });
            it('disable RTL testing', function () {
                gridObj.enableRtl = false;
                gridObj.dataBind();
                expect(gridObj.element.classList.contains('e-rtl')).toEqual(false);
            });
            it('enable row hover testing', function () {
                gridObj.enableHover = true;
                gridObj.dataBind();
                expect(gridObj.element.classList.contains('e-gridhover')).toEqual(true);
            });
            it('disable row hover testing', function () {
                gridObj.enableHover = false;
                gridObj.dataBind();
                expect(gridObj.element.classList.contains('e-gridhover')).toEqual(false);
            });
            it('Row count testing', function () {
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(datasource_spec_1.data.length);
            });
            it('Column count testing', function () {
                expect(gridObj.element.querySelectorAll('.e-headercell').length).toEqual(gridObj.getColumns().length);
            });
            it('Content cell count testing', function () {
                expect(gridObj.element.querySelectorAll('.e-row')[0].childNodes.length).toEqual(gridObj.getColumns().length);
            });
            it('Disable altrow', function (done) {
                var dataBound = function (args) {
                    expect(gridObj.getContent().querySelectorAll('.e-altrow').length).toEqual(0);
                    done();
                };
                gridObj.dataBound = dataBound;
                gridObj.enableAltRow = false;
                gridObj.dataBind();
            });
            it('enable altrow', function (done) {
                var dataBound = function (args) {
                    expect(gridObj.getContent().querySelectorAll('.e-altrow').length).toEqual(Math.floor(gridObj.currentViewData.length / 2));
                    done();
                };
                gridObj.dataBound = dataBound;
                gridObj.enableAltRow = true;
                gridObj.dataBind();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Method testing', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var actionComplete;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, actionComplete: actionComplete, allowPaging: false,
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
            it('getRowByIndex testing', function () {
                expect(util_1.isNullOrUndefined(gridObj.getRowByIndex(1))).toEqual(false);
            });
            it('getHeaderContent testing', function () {
                expect(util_1.isNullOrUndefined(gridObj.getHeaderContent())).toEqual(false);
            });
            it('getContentTable testing', function () {
                expect(util_1.isNullOrUndefined(gridObj.getContentTable())).toEqual(false);
            });
            it('getContent testing', function () {
                expect(util_1.isNullOrUndefined(gridObj.getContent())).toEqual(false);
            });
            it('getHeaderTable testing', function () {
                expect(util_1.isNullOrUndefined(gridObj.getHeaderTable())).toEqual(false);
            });
            it('setGridHeaderContent testing', function () {
                var element = gridObj.getHeaderContent();
                gridObj.setGridHeaderContent(element);
                expect(gridObj.getHeaderContent().isEqualNode(element)).toEqual(true);
            });
            it('setGridContentTable testing', function () {
                var element = gridObj.getContentTable();
                gridObj.setGridContentTable(element);
                expect(gridObj.getContentTable().isEqualNode(element)).toEqual(true);
            });
            it('setGridContent testing', function () {
                var element = gridObj.getContent();
                gridObj.setGridContent(element);
                expect(gridObj.getContent().isEqualNode(element)).toEqual(true);
            });
            it('setGridHeaderTable testing', function () {
                var element = gridObj.getHeaderTable();
                gridObj.setGridHeaderTable(element);
                expect(gridObj.getHeaderTable().isEqualNode(element)).toEqual(true);
            });
            it('getColumnByField testing', function () {
                var col = gridObj.getColumnByField('OrderID');
                expect(col.field).toEqual('OrderID');
            });
            it('getColumnIndexByField testing', function () {
                var col = gridObj.getColumnIndexByField('OrderID');
                expect(col).toEqual(0);
                var col1 = gridObj.getColumnIndexByField('OrderID1');
                expect(col1).toEqual(-1);
            });
            it('getColumnIndexByUid testing', function () {
                var col = gridObj.getColumnIndexByUid(gridObj.getColumnByField('OrderID').uid);
                expect(col).toEqual(0);
                col = gridObj.getColumnIndexByUid(gridObj.getColumnByField('OrderID').uid + 'test');
                expect(col).toEqual(-1);
            });
            it('getUidByColumnField testing', function () {
                expect(gridObj.getUidByColumnField('OrderID')).toEqual(gridObj.getColumnByField('OrderID').uid);
            });
            it('getColumnHeaderByIndex testing', function () {
                expect(gridObj.getColumnHeaderByIndex(1).querySelector('.e-headercelldiv').textContent).toEqual('CustomerID');
            });
            it('renderEmptyRow testing', function () {
                gridObj.renderModule.renderEmptyRow();
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(0);
                expect(gridObj.element.querySelectorAll('.e-emptyrow').length).toEqual(1);
            });
            afterAll(function () {
                gridObj.getPersistData();
                dom_1.remove(elem);
            });
        });
        describe('Grid lines testing', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var header;
            var content;
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
                    gridLines: 'both',
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Grid line both testing', function () {
                expect(gridObj.element.classList.contains('e-horizontallines')).toEqual(false);
                expect(gridObj.element.classList.contains('e-verticallines')).toEqual(false);
                expect(gridObj.element.classList.contains('e-hidelines')).toEqual(false);
            });
            it('Grid line horizontal testing', function () {
                gridObj.gridLines = 'horizontal';
                gridObj.dataBind();
                expect(gridObj.element.classList.contains('e-horizontallines')).toEqual(true);
                expect(gridObj.element.classList.contains('e-verticallines')).toEqual(false);
                expect(gridObj.element.classList.contains('e-hidelines')).toEqual(false);
            });
            it('Grid line vertical testing', function () {
                gridObj.gridLines = 'vertical';
                gridObj.dataBind();
                expect(gridObj.element.classList.contains('e-horizontallines')).toEqual(false);
                expect(gridObj.element.classList.contains('e-verticallines')).toEqual(true);
                expect(gridObj.element.classList.contains('e-hidelines')).toEqual(false);
            });
            it('Grid line hide both testing', function () {
                gridObj.gridLines = 'none';
                gridObj.dataBind();
                expect(gridObj.element.classList.contains('e-horizontallines')).toEqual(false);
                expect(gridObj.element.classList.contains('e-verticallines')).toEqual(false);
                expect(gridObj.element.classList.contains('e-hidelines')).toEqual(true);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Grid lines testing', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var colHeader;
            var content;
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
                    allowTextWrap: true,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Text wrap testing', function () {
                expect(gridObj.element.classList.contains('e-wrap')).toEqual(true);
            });
            it('Text wrap false testing', function () {
                gridObj.allowTextWrap = false;
                gridObj.dataBind();
                expect(gridObj.element.classList.contains('e-wrap')).toEqual(false);
            });
            it('Text wrap false testing', function () {
                gridObj.allowTextWrap = true;
                gridObj.dataBind();
                expect(gridObj.element.classList.contains('e-wrap')).toEqual(true);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('Localization testing', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                ej2_base_1.L10n.load({
                    'de-DE': {
                        'grid': {
                            EmptyRecord: 'Geen records om te laten zien'
                        }
                    }
                });
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, locale: 'de-DE', allowPaging: false,
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
            it('renderEmptyRow testing', function () {
                gridObj.renderModule.renderEmptyRow();
                expect(gridObj.element.querySelectorAll('.e-row').length).toEqual(0);
                expect(gridObj.element.querySelectorAll('.e-emptyrow').length).toEqual(1);
            });
            it('renderEmptyRow content testing', function () {
                expect(gridObj.element.querySelector('.e-emptyrow').textContent).toEqual('Geen records om te laten zien');
            });
            it('get constant method testing', function () {
                expect(gridObj.localeObj.getConstant('True')).toEqual('true');
            });
            it('get constant method testing', function () {
                expect(gridObj.localeObj.getConstant('EmptyRecord')).toEqual('Geen records om te laten zien');
                gridObj.refreshHeader();
                gridObj.refresh();
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
