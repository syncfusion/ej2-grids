define(["require", "exports", "@syncfusion/ej2-base/dom", "../../../src/grid/base/grid", "../../../src/grid/actions/reorder", "../base/datasource.spec", "../../../node_modules/es6-promise/dist/es6-promise"], function (require, exports, dom_1, grid_1, reorder_1, datasource_spec_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    grid_1.Grid.Inject(reorder_1.Reorder);
    describe('Stacked header render module', function () {
        describe('Stacked header render', function () {
            var gridObj;
            var elem = dom_1.createElement('div', { id: 'Grid' });
            beforeAll(function (done) {
                var dataBound = function () { done(); };
                document.body.appendChild(elem);
                gridObj = new grid_1.Grid({
                    dataSource: datasource_spec_1.data, allowPaging: false,
                    columns: [
                        {
                            headerText: 'Order Details', toolTip: 'Order Details', textAlign: 'center',
                            columns: [{ field: 'OrderID', textAlign: 'right', headerText: 'Order ID' },
                                { field: 'OrderDate', textAlign: 'right', headerText: 'Order Date', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }]
                        },
                        { field: 'CustomerID', headerText: 'Customer ID' },
                        { field: 'EmployeeID', textAlign: 'right', headerText: 'Employee ID' },
                        {
                            headerText: 'Ship Details',
                            columns: [
                                { field: 'ShipCity', headerText: 'Ship City' },
                                { field: 'ShipCountry', headerText: 'Ship Country' },
                                {
                                    headerText: 'Ship Name Verified', columns: [
                                        { field: 'ShipName', headerText: 'Ship Name' },
                                        { field: 'ShipRegion', headerText: 'Ship Region', visible: false },
                                        { field: 'Verified', headerText: 'Verified' }
                                    ]
                                },
                            ],
                        },
                        {
                            headerText: 'Hidden', toolTip: 'Hidden', textAlign: 'center',
                            columns: [{ field: 'HiddenCol', textAlign: 'right', headerText: 'Hidden Column', visible: false }]
                        },
                    ],
                    allowReordering: true,
                    dataBound: dataBound
                });
                gridObj.appendTo('#Grid');
            });
            it('header colunt testing', function () {
                var trs = gridObj.getHeaderContent().querySelectorAll('tr');
                expect(trs[0].querySelectorAll('.e-headercell').length).toEqual(4);
                expect(trs[0].querySelectorAll('.e-stackedheadercell').length).toEqual(2);
                expect(trs[1].querySelectorAll('.e-headercell').length).toEqual(6);
                expect(trs[1].querySelectorAll('.e-stackedheadercell').length).toEqual(1);
                expect(trs[2].querySelectorAll('.e-headercell').length).toEqual(3);
                expect(trs[2].querySelectorAll('.e-stackedheadercell').length).toEqual(0);
                gridObj.reorderColumns('ShipCountry', 'Ship Details');
                gridObj.reorderColumns('ShipCountry', 'ShipCity');
            });
            afterAll(function () {
                dom_1.remove(elem);
            });
        });
    });
});
