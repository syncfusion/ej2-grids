/**
 * Grid clipMode spec document
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { Resize } from '../../../src/grid/actions/resize';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Selection } from '../../../src/grid/actions/selection';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Resize, Reorder, Toolbar);

describe('ClipMode module', () => {

    describe('clipMode testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let row: any;
        let td: any;
        let all: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    allowPaging: false,
                    allowGrouping: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', clipMode: 'Clip' },
                        { headerText: 'CustomerID', field: 'CustomerID', clipMode: 'Ellipsis' },
                        { headerText: 'OrderDate', field: 'OrderDate' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipAddress', field: 'Shipping Address of the order', clipMode: 'EllipsisWithTooltip' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Class testing', () => {
            row = [gridObj.contentModule.getTable().children['1'].children];
            row.forEach((element: HTMLElement) => {
                td = element[0].children;
                for (let i: number = 0; i < td.length; i++) {
                    if (gridObj.getColumns()[i].clipMode === 'Clip') {
                        expect(td[i].classList.contains('e-gridclip')).toBeTruthy();
                        expect(td[i].classList.contains('e-ellipsistooltip')).toBeFalsy();
                    } else if (gridObj.getColumns()[i].clipMode === 'Ellipsis') {
                        expect(td[i].classList.contains('e-gridclip')).toBeFalsy();
                        expect(td[i].classList.contains('e-ellipsistooltip')).toBeFalsy();
                    } else if (gridObj.getColumns()[i].clipMode === 'EllipsisWithTooltip') {
                        expect(td[i].classList.contains('e-gridclip')).toBeFalsy();
                        expect(td[i].classList.contains('e-ellipsistooltip')).toBeTruthy();
                    }
                }
            });
        });

        afterAll(() => {
            remove(elem);
        });
    });

    describe('clipmode with Editing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    allowPaging: false,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number' },
                        { field: 'ShipAddress'},
                        { field: 'ShipCity' },
                        { field: 'ShipName',headerText:'Ship Name of the Order griven Ship Name of the Order griven', clipMode:'EllipsisWithTooltip' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Class testing for Editing', () => {
            expect(gridObj.element.querySelector('.e-ellipsistooltip').classList.contains('e-tooltip')).toBeTruthy();
            gridObj.selectRow(1);
            gridObj.startEdit();
            expect(gridObj.element.querySelector('.e-ellipsistooltip').classList.contains('e-tooltip')).toBeTruthy();
        });
        afterAll(() => {
            remove(elem);
        });
    });

    describe('clipmode with Resizing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let row: any;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', clipMode: 'Clip' },
                        { headerText: 'CustomerID', field: 'CustomerID', clipMode: 'Ellipsis' },
                        { headerText: 'OrderDate', field: 'OrderDate' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipAddress', field: 'Shipping Address of the order', clipMode: 'EllipsisWithTooltip' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Class testing', () => {
            gridObj.autoFitColumns([]);
            let td: NodeListOf<Element> = gridObj.element.querySelectorAll('e-rowcell');
            let td1: Element[] = [];
            for (let i: number = 0; i < td.length; i++) {
                td1[i] = td[i].cloneNode(true) as Element;
            }
            td1.forEach((ele: HTMLElement) => {
                expect(ele.classList.contains('e-tooltip')).toBeFalsy();
            });
        });
        afterAll(() => {
            remove(elem);
        });
    });
});