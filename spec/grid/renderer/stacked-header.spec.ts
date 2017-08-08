/**
 * Stacked header render spec
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { Grid } from '../../../src/grid/base/grid';
import { Reorder } from '../../../src/grid/actions/reorder';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Reorder);

describe('Stacked header render module', () => {
    describe('Stacked header render', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, allowPaging: false,
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
                                        { field: 'Verified', headerText: 'Verified' }]
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

        it('header colunt testing', () => {
            let trs = gridObj.getHeaderContent().querySelectorAll('tr');
            expect(trs[0].querySelectorAll('.e-headercell').length).toBe(4);
            expect(trs[0].querySelectorAll('.e-stackedheadercell').length).toBe(2);
            expect(trs[1].querySelectorAll('.e-headercell').length).toBe(6);
            expect(trs[1].querySelectorAll('.e-stackedheadercell').length).toBe(1);
            expect(trs[2].querySelectorAll('.e-headercell').length).toBe(3);
            expect(trs[2].querySelectorAll('.e-stackedheadercell').length).toBe(0);

            //for coverage
            gridObj.reorderColumns('ShipCountry', 'Ship Details');
            gridObj.reorderColumns('ShipCountry', 'ShipCity');
        });

        afterAll(() => {
            remove(elem);
        });

    });



});