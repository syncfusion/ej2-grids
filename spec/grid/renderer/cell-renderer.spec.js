define(["require", "exports", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, grid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Custom Atrributes and html encode module', function () {
        describe('Column attributes', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    columns: [
                        {
                            field: 'data.a', headerText: '<i>A</i>', headerTextAlign: 'center',
                            disableHtmlEncode: false, textAlign: 'right', customAttributes: {
                                class: 'hi',
                                style: { color: 'green', 'background-color': 'wheat' },
                                'data-id': 'grid-cell'
                            }
                        },
                        { headerText: 'B' },
                        { field: 'c', headerText: 'C', displayAsCheckBox: false, type: 'boolean', visible: false },
                        { field: 'c', headerText: 'Cc', displayAsCheckBox: true, type: 'boolean' },
                        {
                            headerText: 'D', valueAccessor: function (field, data, column) {
                                return '<span style="color:' + (data['c'] ? 'green' : 'red') + '"><i>GO</i><span>';
                            },
                        }
                    ],
                    dataSource: [{ data: { a: '<i>VINET</i>' }, b: '<i>TOMSP</i>', c: true, d: new Date() },
                        { data: { a: 2 }, b: 2, c: false, d: new Date() }],
                    allowPaging: false, dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('ClassName testing', function () {
                expect(gridObj.element.classList.contains('e-grid')).toEqual(true);
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        var ExtendedFormatter = (function () {
            function ExtendedFormatter() {
            }
            ExtendedFormatter.prototype.getValue = function (column, data) {
                return data[column.field].toFixed(2);
            };
            return ExtendedFormatter;
        }());
        describe('Custom Formatter - implements ICellFormatter', function () {
            var rows;
            var grid;
            var element = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                document.body.appendChild(element);
                grid = new grid_1.Grid({
                    columns: [
                        { field: 'data.a' },
                        { field: 'b', formatter: ExtendedFormatter }
                    ],
                    dataSource: [{ data: { a: 1 }, b: 5, c: true, d: new Date() },
                        { data: { a: 2 }, b: 6, c: false, d: new Date() }],
                    allowPaging: false, dataBound: done
                });
                grid.appendTo('#Grid');
            });
            it('Check custom Formatter return value', function () {
                rows = (grid.getContentTable().tBodies[0]).rows[0];
                expect(rows.cells[1].innerHTML).toBe('5.00');
            });
            afterAll(function () {
                dom_1.remove(element);
            });
        });
        describe('Custom Formatter -  as Object implements ICellFormatter', function () {
            var rows;
            var grid;
            var element = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                document.body.appendChild(element);
                grid = new grid_1.Grid({
                    columns: [
                        { field: 'data.a' },
                        { field: 'b', formatter: new ExtendedFormatter() }
                    ],
                    dataSource: [{ data: { a: 1 }, b: 5, c: true, d: new Date() },
                        { data: { a: 2 }, b: 6, c: false, d: new Date() }],
                    allowPaging: false, dataBound: done
                });
                grid.appendTo('#Grid');
            });
            it('Check custom Formatter return value', function () {
                rows = (grid.getContentTable().tBodies[0]).rows[0];
                expect(rows.cells[1].innerHTML).toBe('5.00');
            });
            afterAll(function () {
                dom_1.remove(element);
            });
        });
        describe('Custom Formatter as Function', function () {
            var customFn = {
                fn: function (column, data) {
                    return data[column.field].toFixed(2);
                }
            };
            var rows;
            var grid;
            var element = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                document.body.appendChild(element);
                grid = new grid_1.Grid({
                    columns: [
                        { field: 'data.a' },
                        { field: 'b', formatter: customFn.fn }
                    ],
                    dataSource: [{ data: { a: 1 }, b: 5, c: true, d: new Date() },
                        { data: { a: 2 }, b: 6, c: false, d: new Date() }],
                    allowPaging: false, dataBound: done
                });
                grid.appendTo('#Grid');
            });
            it('Check custom Formatter return value', function () {
                rows = (grid.getContentTable().tBodies[0]).rows[0];
                expect(rows.cells[1].innerHTML).toBe('5.00');
            });
            afterAll(function () {
                dom_1.remove(element);
            });
        });
    });
});
