define(["require", "exports", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, grid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtHtmlEscapeService = (function () {
        function ExtHtmlEscapeService() {
            this.escapeRegex = /[&<>"']/g;
            this.entitySet = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&#34;',
                '\'': '&#39;'
            };
        }
        ExtHtmlEscapeService.prototype.getValue = function (column, data) {
            var _this = this;
            var value = column.valueAccessor(column.field, data, column);
            if (value === null || value === undefined) {
                return value;
            }
            return value.replace(this.escapeRegex, function (c) {
                return _this.entitySet[c];
            });
        };
        ExtHtmlEscapeService.extEscape = function (input, coluns) {
            return input;
        };
        return ExtHtmlEscapeService;
    }());
    describe('Html escaper module', function () {
        describe('Default and extended', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    columns: [
                        {
                            field: 'data.a', headerText: '<i>A</i>', headerTextAlign: 'center',
                            disableHtmlEncode: true, textAlign: 'right', customAttributes: {
                                class: 'hi',
                                style: { color: 'green', 'background-color': 'wheat' },
                                'data-id': 'grid-cell'
                            }
                        },
                        { field: 'c', headerText: 'C', displayAsCheckBox: true, type: 'boolean' },
                        { field: 'b', headerText: 'Cc', disableHtmlEncode: false, formatter: ExtHtmlEscapeService }
                    ],
                    dataSource: [{ data: { a: '<i>VINET</i>' }, b: '<i>TOMSP</i>', c: true, d: new Date() },
                        { data: { a: 2 }, b: null, c: false, d: new Date() }], allowPaging: false, dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('content testing', function () {
                expect(gridObj.getContent().querySelectorAll('.e-rowcell')[2].innerHTML).toEqual('&lt;i&gt;TOMSP&lt;/i&gt;');
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
