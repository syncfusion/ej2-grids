define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/base/constant", "../../../src/grid/actions/scroll", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, ej2_base_1, util_1, dom_1, grid_1, constant_1, scroll_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(scroll_1.Scroll);
    var ieUa = 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; .NET4.0E; .NET4.0C; ' +
        'Tablet PC 2.0; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; InfoPath.3; rv:11.0) like Gecko';
    var mozUa = 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0';
    describe('Scrolling module', function () {
        ej2_base_1.Browser.userAgent = ieUa;
        var createGrid = function (options, done) {
            var grid;
            var dataBound = function () { done(); };
            grid = new grid_1.Grid(util_1.extend({}, {
                dataSource: datasource_spec_1.data,
                dataBound: dataBound,
            }, options));
            var div = dom_1.createElement('div', { id: 'Grid' });
            document.body.appendChild(div);
            grid.appendTo(div);
            return grid;
        };
        var destroy = function (grid) {
            if (grid) {
                grid.destroy();
                dom_1.remove(grid.element);
            }
        };
        var raise = function (grid) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('scroll', true, true);
            grid.getContent().firstChild.dispatchEvent(evt);
        };
        describe('Enable scrolling', function () {
            var grid;
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
            it('check content class', function () {
                expect(grid.getContent().firstChild.classList.contains('e-content')).toBeTruthy();
            });
            it('check header class', function () {
                expect(grid.getHeaderContent().firstChild.classList.contains('e-headercontent')).toBeTruthy();
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('Scrolling with settings', function () {
            var grid;
            beforeAll(function (done) {
                grid = createGrid({
                    width: 300, height: '50%',
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
            it('check element width', function () {
                expect(grid.element.style.width).toBe('300px');
            });
            it('check element height', function () {
                expect(grid.getContent().firstChild.style.height).toBe('50%');
            });
            it('check padding and border', function () {
                var header = grid.getHeaderContent();
                expect(header.firstChild.style.borderRightWidth).toBe('1px');
                expect(header.style.paddingRight).toBe(ej2_base_1.Browser.info.name === 'mozilla' ? '16.5px' : (scroll_1.Scroll.getScrollBarWidth() - 1) + 'px');
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('Scrolling with settings - RTL', function () {
            var grid;
            beforeAll(function (done) {
                grid = createGrid({
                    width: 300, height: '50%',
                    enableRtl: true,
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
            it('check element width', function () {
                expect(grid.element.style.width).toBe('300px');
            });
            it('check element height', function () {
                expect(grid.getContent().firstChild.style.height).toBe('50%');
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('Scrolling setModel', function () {
            var grid;
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
                    grid.width = '100px';
                    grid.height = '100%';
                    grid.dataBind();
                    done();
                });
            });
            it('check element width', function () {
                expect(grid.element.style.width).toBe('100px');
            });
            it('check element height', function () {
                expect(grid.getContent().firstChild.style.height).toBe('100%');
            });
            it('check padding and border', function () {
                var header = grid.getHeaderContent();
                expect(header.firstChild.style.borderRightWidth).toBe('1px');
                expect(header.style.paddingRight).toBe(ej2_base_1.Browser.info.name === 'mozilla' ? '16.5px' : (scroll_1.Scroll.getScrollBarWidth() - 1) + 'px');
            });
            it('internal module call - module - different', function () {
                grid.notify(constant_1.uiUpdate, { module: 'filter' });
                expect(grid.element.style.width).toBe('100px');
            });
            it('internal module call - Enable - false', function () {
                grid.notify(constant_1.uiUpdate, { enable: false, module: 'scroll' });
                expect(grid.element.style.width).toBe('100px');
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('Scrolling setModel - back to default', function () {
            var grid;
            beforeAll(function (done) {
                grid = createGrid({
                    height: 300,
                    width: 300,
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
                    grid.width = 'auto';
                    grid.height = 'auto';
                    grid.dataBind();
                    done();
                });
            });
            it('check element width', function () {
                expect(grid.element.style.width).toBe('auto');
            });
            it('check element height', function () {
                expect(grid.getContent().firstChild.style.height).toBe('auto');
            });
            it('check padding and border', function () {
                var header = grid.getHeaderContent();
                expect(header.firstChild.style.borderRightWidth).toBe('');
                expect(header.style.paddingRight).toBe('');
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('Scrolling scroll event', function () {
            var grid;
            beforeAll(function (done) {
                grid = createGrid({
                    width: 300, height: 400,
                    allowPaging: true,
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', width: 200
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean', width: 200 },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', width: 200 },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right', width: 200 }
                    ]
                }, done);
            });
            it('check scroll left header/content sync', function () {
                grid.getContent().firstChild.scrollLeft = 100;
                raise(grid);
                expect(grid.getHeaderContent().firstChild.scrollLeft)
                    .toBe(100);
                grid.getContent().firstChild.scrollTop = 10;
                raise(grid);
            });
            afterAll(function () {
                destroy(grid);
            });
        });
        describe('Scrolling - emulate mobile scroller', function () {
            var grid;
            var old;
            beforeAll(function (done) {
                ej2_base_1.Browser.userAgent = mozUa;
                old = scroll_1.Scroll.getScrollBarWidth;
                scroll_1.Scroll.getScrollBarWidth = function () { return 0; };
                grid = createGrid({
                    width: 300, height: 300,
                    allowPaging: true,
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'right',
                            textAlign: 'right', width: 200
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean', width: 200 },
                        { field: 'Freight', format: 'C1', width: 200 },
                        { field: 'OrderDate', format: 'yMd', width: 200 },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right', width: 200 }
                    ]
                }, done);
            });
            it('check padding and border', function () {
                var header = grid.getHeaderContent();
                expect(header.firstChild.style.borderRightWidth).toBe('0px');
                expect(header.style.paddingRight).toBe('0px');
            });
            afterAll(function () {
                scroll_1.Scroll.getScrollBarWidth = old;
                destroy(grid);
            });
        });
    });
});
