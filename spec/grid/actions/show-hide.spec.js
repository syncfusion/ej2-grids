define(["require", "exports", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/actions/filter", "../../../src/grid/base/constant", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, util_1, dom_1, grid_1, filter_1, constant_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(filter_1.Filter);
    describe('ShowHide module testing', function () {
        var createGrid = function (options, done) {
            var grid;
            var dataBound = function () { done(); };
            grid = new grid_1.Grid(util_1.extend({}, {
                dataSource: datasource_spec_1.data,
                dataBound: dataBound,
            }, options));
            grid.appendTo(dom_1.createElement('div', { id: 'Grid' }));
            return grid;
        };
        var destroy = function (grid) {
            if (grid) {
                grid.destroy();
                document.getElementById('Grid').remove();
            }
        };
        describe('Hide column at initial rendering', function () {
            var grid;
            var rows;
            beforeAll(function (done) {
                grid = createGrid({
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                }, done);
            });
            it('check TH/TD visiblity', function () {
                rows = grid.getHeaderTable().tHead.rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
                rows = grid.getContentTable().tBodies[0].rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            });
            it('check colgroup->col visiblity', function () {
                var col = grid.getHeaderTable().children[0].children[0];
                expect(col.style.display).toEqual('none');
                col = grid.getContentTable().children[0].children[0];
                expect(col.style.display).toEqual('none');
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('Show Column using headerText', function () {
            var grid;
            var rows;
            beforeAll(function (done) {
                grid = createGrid({
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                }, function () {
                    grid.on(constant_1.contentReady, done);
                    grid.showColumns('Order ID');
                });
            });
            it('check TH/TD visiblity', function () {
                rows = grid.getHeaderTable().tHead.rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
                rows = grid.getContentTable().tBodies[0].rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            });
            it('check colgroup->col visiblity', function () {
                var col = grid.getHeaderTable().children[0].children[0];
                expect(col.style.display).toEqual('');
                col = grid.getContentTable().children[0].children[0];
                expect(col.style.display).toEqual('');
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('Hide Column using headerText', function () {
            var grid;
            var rows;
            beforeAll(function (done) {
                grid = createGrid({
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                }, function () {
                    grid.on(constant_1.contentReady, done);
                    grid.hideColumns('Order ID');
                });
            });
            it('check TH/TD visiblity', function () {
                rows = grid.getHeaderTable().tHead.rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
                rows = grid.getContentTable().tBodies[0].rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            });
            it('check colgroup->col visiblity', function () {
                var col = grid.getHeaderTable().children[0].children[0];
                expect(col.style.display).toEqual('none');
                col = grid.getContentTable().children[0].children[0];
                expect(col.style.display).toEqual('none');
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('Show Column using field', function () {
            var grid;
            var rows;
            beforeAll(function (done) {
                grid = createGrid({
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                }, function () {
                    grid.on(constant_1.contentReady, done);
                    grid.showColumns(['OrderID'], 'field');
                });
            });
            it('check TH/TD visiblity', function () {
                rows = grid.getHeaderTable().tHead.rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
                rows = grid.getContentTable().tBodies[0].rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            });
            it('check colgroup->col visiblity', function () {
                var col = grid.getHeaderTable().children[0].children[0];
                expect(col.style.display).toEqual('');
                col = grid.getContentTable().children[0].children[0];
                expect(col.style.display).toEqual('');
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('Hide Column using field', function () {
            var grid;
            var rows;
            beforeAll(function (done) {
                grid = createGrid({
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                }, function () {
                    grid.on(constant_1.contentReady, done);
                    grid.hideColumns(['OrderID'], 'field');
                });
            });
            it('check TH/TD visiblity', function () {
                rows = grid.getHeaderTable().tHead.rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
                rows = grid.getContentTable().tBodies[0].rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            });
            it('check colgroup->col visiblity', function () {
                var col = grid.getHeaderTable().children[0].children[0];
                expect(col.style.display).toEqual('none');
                col = grid.getContentTable().children[0].children[0];
                expect(col.style.display).toEqual('none');
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('Show Column using UID', function () {
            var grid;
            var rows;
            beforeAll(function (done) {
                grid = createGrid({
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                }, function () {
                    grid.on(constant_1.contentReady, done);
                    grid.showColumns(grid.getColumns()[0].uid, 'uid');
                });
            });
            it('check TH/TD visiblity', function () {
                rows = grid.getHeaderTable().tHead.rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
                rows = grid.getContentTable().tBodies[0].rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            });
            it('check colgroup->col visiblity', function () {
                var col = grid.getHeaderTable().children[0].children[0];
                expect(col.style.display).toEqual('');
                col = grid.getContentTable().children[0].children[0];
                expect(col.style.display).toEqual('');
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('Hide Column using UID', function () {
            var grid;
            var rows;
            beforeAll(function (done) {
                grid = createGrid({
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                }, function () {
                    grid.on(constant_1.contentReady, done);
                    grid.hideColumns(grid.getColumns()[0].uid, 'uid');
                });
            });
            it('check TH/TD visiblity', function () {
                rows = grid.getHeaderTable().tHead.rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
                rows = grid.getContentTable().tBodies[0].rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            });
            it('check colgroup->col visiblity', function () {
                var col = grid.getHeaderTable().children[0].children[0];
                expect(col.style.display).toEqual('none');
                col = grid.getContentTable().children[0].children[0];
                expect(col.style.display).toEqual('none');
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('SetVisible function', function () {
            var grid;
            var rows;
            beforeAll(function (done) {
                grid = createGrid({
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ]
                }, function () {
                    grid.on(constant_1.contentReady, done);
                    var cols = (grid.getColumns());
                    cols[0].visible = true;
                    cols[1].visible = false;
                    grid.showHider.setVisible();
                });
            });
            it('check TH/TD visiblity', function () {
                rows = grid.getHeaderTable().tHead.rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
                rows = grid.getContentTable().tBodies[0].rows[0];
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
                rows = grid.getHeaderTable().tHead.rows[0];
                expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
                rows = grid.getContentTable().tBodies[0].rows[1];
                expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
            });
            it('check colgroup->col visiblity', function () {
                var col = grid.getHeaderTable().children[0].children[0];
                expect(col.style.display).toEqual('');
                col = grid.getContentTable().children[0].children[0];
                expect(col.style.display).toEqual('');
                col = grid.getHeaderTable().children[0].children[1];
                expect(col.style.display).toEqual('none');
                col = grid.getContentTable().children[0].children[1];
                expect(col.style.display).toEqual('none');
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('show/hide with filtering', function () {
            var grid;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                grid = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    allowFiltering: true,
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', visible: false
                        },
                        { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right' }
                    ],
                    dataBound: dataBound
                });
                grid.appendTo('#Grid');
            });
            it('render grid with filter enable', function () {
                expect(grid.getHeaderContent().querySelectorAll('.e-filterbarcell.e-hide').length).
                    toEqual(grid.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length);
            });
            it('hide a column with filter enabled', function (done) {
                grid.hideColumns('Verified', 'headerText');
                setTimeout(function () {
                    expect(grid.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toEqual(2);
                    expect(grid.getHeaderContent().querySelectorAll('.e-filterbarcell.e-hide').length).toEqual(2);
                    expect(grid.getContent().querySelectorAll('.e-rowcell.e-hide').length).toEqual(grid.currentViewData.length * 2);
                    done();
                }, 1000);
            });
            it('show hidden columns', function (done) {
                grid.showColumns(['Verified', 'Order ID'], 'headerText');
                setTimeout(function () {
                    expect(grid.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toEqual(0);
                    expect(grid.getContent().querySelectorAll('.e-rowcell.e-hide').length).toEqual(0);
                    done();
                }, 1000);
            });
            afterAll(function () {
                destroy(grid);
            });
        });
    });
});
