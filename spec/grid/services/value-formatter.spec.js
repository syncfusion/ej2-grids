define(["require", "exports", "../../../src/grid/base/grid", "@syncfusion/ej2-base", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, grid_1, ej2_base_1, util_1, dom_1, datasource_spec_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    ej2_base_1.L10n.load({
        'de-DE': {
            'grid': {
                EmptyRecord: 'Geen records om te laten zien',
                True: 'true'
            }
        },
        'gu-IN': {
            'grid': {
                EmptyRecord: 'Geen records om te laten zien',
                True: 'true'
            }
        }
    });
    describe('ValueFormatter Service', function () {
        var createGrid = function (options, done) {
            var grid;
            var dataBound = function () { done(); };
            datasource_spec_1.data.splice(datasource_spec_1.data.length, 1, { Verfied: null });
            grid = new grid_1.Grid(util_1.extend({}, {
                dataSource: datasource_spec_1.data,
                dataBound: dataBound
            }, options));
            grid.appendTo(dom_1.createElement('div', { id: 'Grid' }));
            return grid;
        };
        var destroy = function (grid) {
            if (grid) {
                grid.destroy();
                dom_1.remove(grid.element);
            }
        };
        describe('Format check - default locale', function () {
            var rows;
            var grid;
            beforeAll(function (done) {
                _this.grid = createGrid({
                    columns: [
                        {
                            field: 'OrderID', headerText: '<i>Order ID</i>', headerTextAlign: 'right',
                            disbleHtmlEncode: false, textAlign: 'right'
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ], allowPaging: false, allowSelection: false,
                }, done);
            });
            it('Number format check', function () {
                rows = (_this.grid.getContentTable().tBodies[0]).rows[0];
                expect(rows.cells[2].innerHTML).toBe('$32.4');
            });
            it('Date format check', function () {
                rows = (_this.grid.getContentTable().tBodies[0]).rows[0];
                var intl = new ej2_base_1.Internationalization();
                expect(rows.cells[3].innerHTML).toBe(intl.formatDate(new Date(8364186e5), { type: 'date', skeleton: 'yMd' }));
            });
            afterAll(function () {
                destroy(_this.grid);
            });
        });
        describe('fromView method check', function () {
            var rows;
            var grid;
            beforeAll(function (done) {
                grid = createGrid({
                    columns: [
                        {
                            field: 'OrderID', headerText: '<i>Order ID</i>', headerTextAlign: 'right',
                            disbleHtmlEncode: false, textAlign: 'right'
                        },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'Freight', format: { format: 'C1' } },
                    ], allowPaging: false, allowSelection: false,
                }, done);
            });
            it('check number format', function () {
                var fmtr = grid.serviceLocator.getService('valueFormatter');
                expect(fmtr.fromView('$32.0', grid.getColumns()[2].getParser(), 'number')).toBe(32);
            });
            it('check format with no target type', function () {
                var fmtr = grid.serviceLocator.getService('valueFormatter');
                expect(fmtr.fromView('$32.0', grid.getColumns()[1].getParser(), 'custom')).toBe('$32.0');
                fmtr.setCulture('en-US');
            });
            afterAll(function () {
                destroy(_this.grid);
            });
        });
    });
});
