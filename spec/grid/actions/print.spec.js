define(["require", "exports", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/actions/sort", "../../../src/grid/actions/filter", "../../../src/grid/actions/page", "../../../src/grid/actions/print", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, grid_1, sort_1, filter_1, page_1, print_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(sort_1.Sort, page_1.Page, filter_1.Filter, print_1.Print);
    describe('Print module', function () {
        describe('Print without paging, filterbar testing', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var beforePrint;
            var actionComplete;
            window.open = function () {
                return {
                    document: { write: function () { }, close: function () { } },
                    close: function () { }, print: function () { }, focus: function () { }, moveTo: function () { }, resizeTo: function () { }
                };
            };
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                    allowSelection: false,
                    beforePrint: beforePrint,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Print all pages testing', function (done) {
                beforePrint = function (args) {
                    expect(args.element.querySelectorAll('.e-gridpager').length).toEqual(0);
                    expect(args.element.querySelectorAll('.e-filterbar').length).toEqual(0);
                    expect(args.element.querySelectorAll('.e-row').length).toEqual(15);
                    done();
                };
                window.print = function () { };
                Window.print = function () { };
                gridObj.beforePrint = beforePrint;
                gridObj.dataBind();
                gridObj.print();
            });
            afterAll(function () {
                elem.remove();
            });
        });
        describe('Print with paging, filterbar testing', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            var beforePrint;
            var actionComplete;
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                    allowFiltering: true,
                    allowPaging: true,
                    height: 600,
                    pageSettings: { pageSize: 5 },
                    allowGrouping: true,
                    groupSettings: { columns: ['OrderID'] },
                    beforePrint: beforePrint,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('Print all pages testing', function (done) {
                beforePrint = function (args) {
                    expect(args.element.querySelectorAll('.e-gridpager').length).toEqual(0);
                    expect(args.element.querySelector('.e-filterbar').style.display).toEqual('none');
                    done();
                };
                gridObj.beforePrint = beforePrint;
                gridObj.dataBind();
                gridObj.print();
            });
            it('Print current page testing', function (done) {
                beforePrint = function (args) {
                    expect(args.element.querySelector('.e-gridpager').style.display).toEqual('none');
                    done();
                };
                gridObj.printModule.destroy();
                gridObj.printMode = 'currentpage';
                gridObj.dataBind();
                gridObj.beforePrint = beforePrint;
                gridObj.dataBind();
                gridObj.print();
            });
            afterAll(function () {
                elem.remove();
            });
        });
    });
});
