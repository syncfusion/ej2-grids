define(["require", "exports", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, grid_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Template render module', function () {
        describe('column template render', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, allowPaging: false,
                    columns: [
                        { field: 'EmployeeID' },
                        { template: '<div>${EmployeeID}</div><div>${index}</div>', headerText: 'Template column' },
                        { field: 'CustomerID', headerText: 'Customer ID' },
                    ],
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('template render testing', function () {
                var trs = gridObj.getContent().querySelectorAll('tr');
                expect(trs[0].querySelector('.e-templatecell').innerHTML).toEqual('<div>5</div><div>0</div>');
                expect(trs[1].querySelector('.e-templatecell').innerHTML).toEqual('<div>6</div><div>1</div>');
                expect(gridObj.getHeaderTable().querySelectorAll('.e-headercelldiv')[1].innerHTML).toEqual('<span class="e-headertext">Template column</span>');
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('column template element render', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                var template = dom_1.createElement('div', { id: 'template' });
                template.innerHTML = '<div>${EmployeeID}</div>';
                document.body.appendChild(template);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, allowPaging: false,
                    columns: [
                        { field: 'EmployeeID' },
                        { template: '#template', headerText: 'Template column' },
                        { field: 'CustomerID', headerText: 'Customer ID' },
                    ],
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('cell value testing', function () {
                var trs = gridObj.getContent().querySelectorAll('tr');
                expect(trs[0].querySelector('.e-templatecell').innerHTML).toEqual('<div>5</div>');
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
        describe('row template render', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, allowPaging: false,
                    rowTemplate: '<td>${OrderID}</td><td>${EmployeeID}</td>',
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        { field: 'CustomerID', headerText: 'Customer ID' },
                    ],
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('row render testing', function () {
                var trs = gridObj.getContent().querySelectorAll('tr');
                expect(trs[0].querySelectorAll('td')[0].innerHTML).toEqual('10248');
                expect(trs[0].querySelectorAll('td')[1].innerHTML).toEqual('5');
                expect(trs[1].querySelectorAll('td')[0].innerHTML).toEqual('10249');
                expect(trs[1].querySelectorAll('td')[1].innerHTML).toEqual('6');
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
