/**
 * Grid Filtering spec document
 */
import { EventHandler, ChildProperty, EmitType } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { CellType } from '../../../src/grid/base/enum';
import { ValueFormatter } from '../../../src/grid/services/value-formatter';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { NumericEditCell } from '../../../src/grid/renderer/numeric-edit-cell';
import { DropDownEditCell } from '../../../src/grid/renderer/dropdown-edit-cell';
import { filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, Toolbar);

describe('Editing module', () => {

    describe('Inline editing functionalities1', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        // it('skip input filter string value testing', (done: Function) => {

        //     setTimeout(() => {
        //         expect(gridObj.element.querySelectorAll('.e-row').length).toBe(71);
        //         done();
        //     }, 500);
        // });

        it('inline actions1', () => {
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'Grid_edit' } });
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'Grid_update' } });
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'Grid_edit' } });
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'Grid_cancel' } });
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'Grid_delete' } });
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'Grid_add' } });
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'Grid_cancel' } });
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'Grid_add' } });
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'Grid_update' } });
            gridObj.selectRow(0, true);
            (<any>gridObj.editModule).keyPressHandler({ action: 'f2' });
            (<any>gridObj.editModule).editModule.clickHandler({ target: gridObj.getCellFromIndex(0, 0) });
            gridObj.selectRow(0, true);
            (<any>gridObj.editModule).editModule.clickHandler({ target: gridObj.getCellFromIndex(0, 0) });
            gridObj.isEdit = false;
            (<any>gridObj.editModule).editModule.clickHandler({ target: gridObj.getCellFromIndex(0, 0) });
            gridObj.isEdit = true;
            gridObj.selectRow(0, true);
            (<any>gridObj.editModule).editModule.dblClickHandler({ target: gridObj.getCellFromIndex(0, 0) });
            gridObj.selectRow(0, true);
            (<any>gridObj.editModule).editModule.dblClickHandler({ target: gridObj.element });
            (<any>gridObj.editModule).editModule.dblClickHandler({ target: createElement('div', { id: '3', className: 'e-grid' }) });
            (<any>gridObj.editModule).editModule.clickHandler({ target: gridObj.element });
            gridObj.selectRow(0, true);
            (<any>gridObj.editModule).editModule.editComplete({ requestType: 'delete' });
            gridObj.selectRow(0, true);
            (<any>gridObj.editModule).editModule.editComplete({ requestType: 'add' });
            (<any>gridObj.editModule).editModule.addRecord(gridObj.currentViewData[0]);
            gridObj.isEdit = true;
            (<any>gridObj.editModule).editModule.addRecord(gridObj.currentViewData[0]);

            let ne: NumericEditCell = new NumericEditCell(gridObj);
            ne.destroy();
            let dd: DropDownEditCell = new DropDownEditCell(gridObj);
            dd.destroy();
            expect(1).toBe(1);
        });


        it('inline key actions2', () => {
            gridObj.selectRow(0, true);
            (<any>gridObj.editModule).keyPressHandler({ action: 'insert' });
            (<any>gridObj.editModule).keyPressHandler({ action: 'cancel' });
            gridObj.selectRow(0, true);
            (<any>gridObj.editModule).keyPressHandler({ action: 'f2' });
            (<any>gridObj.editModule).keyPressHandler({ action: 'cancel' });
            gridObj.selectRow(0, true);
            (<any>gridObj.editModule).keyPressHandler({ action: 'f2' });
            (<any>gridObj.editModule).keyPressHandler({ action: 'enter' });
            gridObj.selectRow(0, true);
            (<any>gridObj.editModule).keyPressHandler({ action: 'f2' });
            (<any>gridObj.editModule).keyPressHandler({ action: 'escape' });
            gridObj.selectRow(0, true);
            (<any>gridObj.editModule).keyPressHandler({ action: 'delete' });
            expect(1).toBe(1);
        });

        it('inlline On property change3', () => {
            gridObj.editSettings.allowEditOnDblClick = false;
            gridObj.dataBind();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'Grid_edit' } });
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: 'Grid_cancel' } });
            gridObj.editSettings.allowEditOnDblClick = true;
            gridObj.dataBind();
            gridObj.editSettings.allowAdding = false;
            gridObj.dataBind();
            gridObj.editSettings.allowAdding = true;
            gridObj.dataBind();
            gridObj.editSettings.allowDeleting = false;
            gridObj.dataBind();
            gridObj.editSettings.allowDeleting = true;
            gridObj.dataBind();
            gridObj.editSettings.allowEditing = false;
            gridObj.dataBind();
            gridObj.editSettings.allowEditing = true;
            gridObj.dataBind();
            gridObj.editSettings.showConfirmDialog = true;
            gridObj.dataBind();
            gridObj.editSettings.showConfirmDialog = false;
            gridObj.dataBind();
            gridObj.editSettings.showDeleteConfirmDialog = true;
            gridObj.dataBind();
            gridObj.editSettings.showDeleteConfirmDialog = false;
            gridObj.dataBind();
            gridObj.editSettings.mode = 'batch';
            gridObj.dataBind();
            gridObj.editSettings.mode = 'dialog';
            gridObj.dataBind();
        });

        it('On property change4', () => {
            gridObj.isDestroyed = true;
            (gridObj.editModule as any).editModule.addEventListener();
            (gridObj.editModule as any).editModule.removeEventListener();
            gridObj.isDestroyed = false;
            (gridObj.editModule as any).editModule.uid = '';
            (gridObj.editModule as any).editModule.refreshRow();
            (gridObj.editModule as any).renderer.focusElement(gridObj.element);

        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            //document.body.innerHTML='';
            remove(elem);
        });
    });


    describe('Inline editing functionalities1', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit', allowEditing: false },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        // it('skip input filter string value testing', (done: Function) => {

        //     setTimeout(() => {
        //         expect(gridObj.element.querySelectorAll('.e-row').length).toBe(71);
        //         done();
        //     }, 500);
        // });    

        it('Single column group testing1', (done: Function) => {
            actionComplete = (args?: Object): void => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('OrderID');
        });

        it('inline grouping actions2', () => {
            gridObj.selectRow(0, true);
            gridObj.startEdit();
            gridObj.endEdit();
            gridObj.allowGrouping = false;
            gridObj.dataBind();
            gridObj.selectRow(0, true);
            gridObj.startEdit();
            gridObj.endEdit();
            gridObj.childGrid = {};
            gridObj.dataBind();
            gridObj.selectRow(0, true);
            gridObj.startEdit();
            gridObj.endEdit();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });


    describe('Inline editing functionalities3', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('inline grouping actions1', () => {
            gridObj.clearSelection();
            gridObj.editModule.startEdit();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });

    describe('Inline editing functionalities4', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('inline grouping actions', () => {
            gridObj.selectRow(0);
            gridObj.editModule.startEdit(gridObj.getSelectedRows()[0] as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });

    describe('Inline editing functionalities5', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('inline grouping actions', () => {
            gridObj.selectRow(0);

            let row: any = gridObj.getSelectedRows()[0]
            row.style.display = 'none';
            gridObj.editModule.startEdit(row);
            gridObj.editSettings.allowAdding = false;
            gridObj.dataBind();
            gridObj.editSettings.allowDeleting = false;
            gridObj.dataBind();
            gridObj.editSettings.allowEditing = false;
            gridObj.dataBind();
            gridObj.editSettings.showConfirmDialog = false;
            gridObj.dataBind();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });

    describe('Inline editing functionalities6', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('inline grouping actions', () => {
            gridObj.clearSelection();
            gridObj.editModule.startEdit();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });

    describe('Inline editing functionalities7', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('inline grouping actions', () => {
            gridObj.clearSelection();
            gridObj.editModule.startEdit(gridObj.element.querySelector('.e-row') as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });

    describe('Inline editing functionalities8', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit1' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit1', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'booleanedit1', }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('inline grouping actions9', () => {
            gridObj.editModule.getValueFromType(gridObj.columns[5] as any, 'true');
            gridObj.editModule.getValueFromType(gridObj.columns[9] as any, 'true');
            (gridObj.editModule as any).alertDObj = { hide: () => { } };
            (gridObj.editModule as any).alertClick();
            gridObj.clearSelection();
            gridObj.selectedRowIndex = -1;
            (gridObj.editModule as any).showDialog = () => { };
            (gridObj.editModule as any).deleteRecord()
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });

    describe('Inline editing functionalities10', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit1' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit1', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'booleanedit1', }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('inline grouping actions', () => {
            gridObj.editSettings.showDeleteConfirmDialog = true;
            gridObj.dataBind();
            gridObj.selectRow(0);
            (gridObj.editModule as any).deleteRecord()
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });

    describe('Inline editing functionalities11', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let beginEdit: EmitType<Object> = (args: any) => { args.cancel = true; };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowGrouping: true,
                    beginEdit: beginEdit,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit1' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit1', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'booleanedit1', }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('inline grouping actions', () => {
            gridObj.selectRow(0);
            (gridObj.editModule as any).startEdit();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });

    describe('Inline editing functionalities12', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let actionBegin: EmitType<Object> = (args: any) => { args.cancel = true; };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit1' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit1', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'booleanedit1', }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('inline grouping actions', () => {
            gridObj.selectRow(0);
            (gridObj.editModule as any).addRecord()

            gridObj.editModule.deleteRow = () => { };
            gridObj.deleteRow(gridObj.element as any);
            (gridObj as any).dblClickHandler({ target: gridObj.element });
            (gridObj.pagerModule as any).isForceCancel = true;
            (gridObj.pagerModule as any).clickHandler({});
            gridObj.isDestroyed = true;
            (gridObj.pagerModule as any).addEventListener({});
            gridObj.isDestroyed = false;
            (gridObj.columns[5] as any).editType = 'datapicker1';
            (gridObj.columns[5] as any).type = 'date';
            gridObj.editModule.getValueFromType(gridObj.columns[5] as any, 1 as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });


    describe('Inline editing functionalities13', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let actionBegin: EmitType<Object> = (args: any) => { args.cancel = true; };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowReordering: true,
                    allowSorting: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit1' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit1', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'booleanedit1', }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('inline grouping actions', () => {
            gridObj.selectRow(0);
            (gridObj.sortModule as any).isActionPrevent = () => { return true; };
            (gridObj.editModule as any).dialogObj = '';
            (gridObj.editModule as any).showDialog = () => { };
            (gridObj.sortModule as any).sortColumn('OrderID', 'any', false);
            (gridObj.sortModule as any).clearSorting('OrderID', 'any', false);
            (gridObj.sortModule as any).removeSortColumn('OrderID');
            (gridObj.selectionModule as any).isEditing();
            (gridObj.reorderModule as any).isActionPrevent = () => { return true; };
            (gridObj.reorderModule as any).moveColumns('OrderID', 'CustomerID');
            (gridObj.renderModule as any).dataManagerSuccess = () => { };
            (gridObj.renderModule as any).dmSuccess();
            (gridObj.renderModule as any).dataManagerFailure = () => { };
            (gridObj.renderModule as any).dmFailure();
            (gridObj.renderModule as any).dataManagerFailure = () => { };
            (gridObj.renderModule as any).data.dataManager.dataSource.offline = false;
            let promise: any = {
                then: (args: any) => {
                    args.call(this);
                    return { catch: (args: any) => { args.call(this); } }
                }
            };
            (gridObj.renderModule as any).data.saveChanges = () => { return promise };
            (gridObj.renderModule as any).sendBulkRequest({ changes: {} });
            promise.then(() => { return false; });
            promise.then(() => { return false; }).catch(() => { return false; });
            (gridObj.editModule as any).editModule.editFailure();
            (gridObj.editModule as any).editModule.refreshRow = () => { };
            (gridObj.editModule as any).editModule.editSuccess({ result: [] }, { data: [], type: null });
            (gridObj.editModule as any).editModule.editSuccess = () => { };
            (gridObj.editModule as any).editModule.edSucc();
            (gridObj.editModule as any).editModule.editFailure = () => { };
            (gridObj.editModule as any).editModule.edFail();
            let promise1: any = {
                then: (args: any) => {
                    args.call(this);
                    return { catch: (args: any) => { args.call(this); } }
                }
            };
            let args: any = { promise: promise1 };
            (gridObj.editModule as any).editModule.editHandler(args);
            promise.then(() => { return false; });
            promise.then(() => { return false; }).catch(() => { return false; });
            (gridObj.editModule as any).editModule.refreshRow = () => { };
            (gridObj.editModule as any).editModule.editSuccess({ result: [] }, { data: {} });
            let dd: DropDownEditCell = new DropDownEditCell();
            (dd as any).ddActionComplete({ result: [1, 2, 3] });
            gridObj.isEdit = false;
            (gridObj.editModule as any).valErrorPlacement();
            (gridObj.editModule as any).getValueFromType({ type: 'number' }, undefined);
            (gridObj.editModule as any).getValueFromType({ type: 'boolean' }, undefined);
            (gridObj.editModule as any).getValueFromType({ type: 'date', editType: 'datepicker1' }, undefined);
            (gridObj.editModule as any).keyPressHandler({ action: 'enter', target: gridObj.element.querySelector('.e-rowcell'), preventDefault: () => { } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });



    describe('Inline editing functionalities13', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let actionBegin: EmitType<Object> = (args: any) => { args.cancel = true; };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowReordering: true,
                    allowSorting: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit1' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit1', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'booleanedit1', }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('inline grouping actions', () => {
            gridObj.selectRow(0);
            gridObj.editModule.addRecord();
            gridObj.editModule.endEdit();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });



    describe('Inline editing functionalities13', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let actionBegin: EmitType<Object> = (args: any) => { args.cancel = true; };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowReordering: true,
                    allowSorting: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'inline', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', textAlign: 'right', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit1' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', editType: 'booleanedit1', isIdentity: true },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'booleanedit1', }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('inline grouping actions', () => {

            gridObj.trigger = () => { };
            gridObj.notify = () => { };
            (gridObj.editModule as any).editModule.editComplete({ requestType: 'save' });
            let content = gridObj.element.querySelector('.e-gridcontent');
            let cell = createElement('td');
            content.appendChild(cell);
            (gridObj.editModule as any).editModule.clickHandler({ target: cell });
            (gridObj.editModule as any).editModule.addRecord({ target: cell });
            (gridObj.renderModule as any).data.dataManager.remove = () => { };
            (gridObj.renderModule as any).data.dataManager.insert = () => { };
            (gridObj.renderModule as any).data.dataManager.executeQuery = () => { };
            (gridObj.renderModule as any).data.getData({ foreignKeyData: { '1': 1 } });
            (gridObj.renderModule as any).data.getData({ requestType: 'delete', data: [{}] }, null);
            (gridObj.renderModule as any).data.getData({ requestType: 'save', data: [{}] }, null);
            (gridObj.editModule as any).editModule.deleteRecord('OrderID', {});
            gridObj.isEdit = true;
            gridObj.selectRow(0);
            (gridObj.editModule as any).getCurrentEditedData = () => { };
            (gridObj.editModule as any).editModule.stopEditStatus = () => { };
            (gridObj.editModule as any).formObj = {};
            (gridObj.editModule as any).formObj.validate = () => { return true };
            (gridObj.editModule as any).editModule.endEdit();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            remove(elem);
        });
    });

    describe('tooltip inline testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    width: 200,
                    height: 200,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'right', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit', validationRules: { required: true } },
                        { field: 'ShipCity', textAlign: 'center', validationRules: { required: true } },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' , validationRules: { required: true }},
                        { field: 'ShipName', isIdentity: true , validationRules: { required: true }},
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'left' , validationRules: { required: true }},
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit', validationRules: { required: true } }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('add row check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {                    
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;         
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('add - update check', (done: Function) => {              
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    done();
                }      
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            gridObj.getContent().firstElementChild.scrollTop = 400;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            gridObj.getContent().firstElementChild.scrollTop = 0;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            gridObj.getContent().firstElementChild.scrollLeft = 400;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            gridObj.getContent().firstElementChild.scrollLeft = 0;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
        });

        afterAll((done) => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
            setTimeout(function () {
                done();
            }, 1000);
    
        });
    });

    describe('tooltip dialog testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: new DataManager(filterData as any),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'dialog', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    width: 200,
                    height: 200,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'right', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit', validationRules: { required: true } },
                        { field: 'ShipCity', textAlign: 'center', validationRules: { required: true } },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' , validationRules: { required: true }},
                        { field: 'ShipName', isIdentity: true , validationRules: { required: true }},
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'left' , validationRules: { required: true }},
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit', validationRules: { required: true } }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('add row check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {                    
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;         
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('add - update check', (done: Function) => {              
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    done();
                }      
            };
            gridObj.actionComplete = actionComplete;
            gridObj.endEdit();            
            gridObj.element.querySelector('#' + gridObj.element.id + '_dialogEdit_wrapper').querySelector('.e-dlg-content').scrollTop = 400;
            gridObj.endEdit();
            gridObj.element.querySelector('#' + gridObj.element.id + '_dialogEdit_wrapper').querySelector('.e-dlg-content').scrollTop = 0;
            gridObj.endEdit();
            gridObj.closeEdit();
        });

        afterAll((done) => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
            setTimeout(function () {
                done();
            }, 1000);
    
        });
    });

});
