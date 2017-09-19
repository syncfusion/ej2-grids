/**
 * Grid Filtering spec document
 */
import {  EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { isActionPrevent } from '../../../src/grid/base/util';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Selection } from '../../../src/grid/actions/selection';
import { filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Filter, Page, Selection, Group, Edit,  Toolbar);

describe('Editing module', () => {

    describe('Batch editing functionalities', () => {
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
                   allowFiltering: false,
                   allowGrouping: true,
                   editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {
            gridObj.selectRow(0);
            gridObj.editModule.editCell(0, 'CustomerID');
            gridObj.editModule.saveCell();
            gridObj.editModule.editCell(0, 'CustomerID');
            gridObj.editModule.closeEdit();
            gridObj.editModule.closeEdit();
            gridObj.editModule.addRecord();
            gridObj.editModule.closeEdit();
            gridObj.editModule.editCell(0, 'Verified');
            gridObj.editModule.saveCell();
            gridObj.editModule.editCell(0, 'CustomerID');
            gridObj.editModule.saveCell();
            expect(1).toBe(1);
            gridObj.editModule.editCell(0, 'CustomerID');
            (gridObj.editModule as any).editModule.keyPressHandler({ action: 'tab', preventDefault: () => { } });
            if (document.body.querySelector('.e-popup-open'))
                remove(document.body.querySelector('.e-popup-open') as any);
            if (document.body.querySelector('.e-popup-open'))
                remove(document.body.querySelector('.e-popup-open') as any);
            if (document.body.querySelector('.e-popup-open'))
                remove(document.body.querySelector('.e-popup-open') as any);
            if (document.body.querySelector('.e-popup-open'))
                remove(document.body.querySelector('.e-popup-open') as any);
            (gridObj.editModule as any).editModule.keyPressHandler({ action: 'tab', preventDefault: () => { } });
            if (document.body.querySelector('.e-popup-open'))
                remove(document.body.querySelector('.e-popup-open') as any);
            (gridObj.editModule as any).editModule.keyPressHandler({ action: 'shiftTab', preventDefault: () => { } });
            if (document.body.querySelector('.e-popup-open'))
                remove(document.body.querySelector('.e-popup-open') as any);
            (gridObj.editModule as any).editModule.keyPressHandler({ action: 'enter', preventDefault: () => { } });
            if (document.body.querySelector('.e-popup-open'))
                remove(document.body.querySelector('.e-popup-open') as any);
            gridObj.editModule.saveCell();
            (gridObj.editModule as any).editModule.keyPressHandler({ action: 'f2', preventDefault: () => { } });

            (gridObj.editModule as any).editModule.editCellFromIndex(0, 0);
            gridObj.editModule.saveCell();


            (gridObj.editModule as any).editModule.endEdit();
            (gridObj.editModule as any).editModule.formObj = { validate: () => { return false; } };
            (gridObj.editModule as any).editModule.endEdit();
            gridObj.editSettings.allowAdding = false;
            gridObj.dataBind();
            (gridObj.editModule as any).editModule.bulkAddRow();
            gridObj.editSettings.allowAdding = true;
            gridObj.dataBind();
            gridObj.editModule.editCell(0, 'CustomerID');
            (gridObj.editModule as any).editModule.bulkAddRow();
            gridObj.editModule.editCell(0, 'CustomerID');
            (gridObj.editModule as any).editModule.cellDetails.cellIndex = 1;
            (gridObj.editModule as any).editModule.editNextCell();
            (gridObj.editModule as any).editModule.cellDetails.cellIndex = 15;
            (gridObj.editModule as any).editModule.editNextCell();
            (gridObj.editModule as any).editModule.cellDetails.cellIndex = 15;
            (gridObj.editModule as any).editModule.isAddRow = ()=>{return true;};
            (gridObj.editModule as any).editModule.cellDetails.rowIndex = 115;
            (gridObj.editModule as any).editModule.editNextCell();
            (gridObj.editModule as any).editModule.cellDetails.cellIndex = 1;
            (gridObj.editModule as any).editModule.editPrevCell();
            (gridObj.editModule as any).editModule.cellDetails.cellIndex = -1;
            (gridObj.editModule as any).editModule.editPrevCell();




            (gridObj.editModule as any).editModule.batchSave();

            gridObj.isDestroyed = true;
            (gridObj.editModule as any).editModule.addEventListener();
            (gridObj.editModule as any).editModule.removeEventListener();
            gridObj.isDestroyed = false;
        });


        afterAll(() => {
            remove(elem);
        });
    });


    describe('Batch editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {
            gridObj.selectRow(1);
            (gridObj.editModule as any).editModule.dblClickHandler({ target: gridObj.getCellFromIndex(1, 1) });
            (gridObj.editModule as any).editModule.clickHandler({ target: gridObj.getCellFromIndex(1, 2) });
            (gridObj.editModule as any).editModule.dblClickHandler({ target: createElement('div', { id: '3', className: 'e-grid' }) });
            (gridObj.editModule as any).editModule.clickHandler({ target: createElement('div', { id: 'Grid_add', className: 'e-grid' }) });
            (gridObj.editModule as any).editModule.clickHandler({ target: gridObj.element });
            (gridObj.editModule as any).editModule.clickHandler({ target: gridObj.getHeaderTable() });
            gridObj.editSettings.allowAdding = false;
            gridObj.dataBind();
            (gridObj.editModule as any).addRecord();

            gridObj.editSettings.showConfirmDialog = true;
            gridObj.dataBind();
            (gridObj.editModule as any).closeEdit();

            gridObj.selectRow(0);
            gridObj.editSettings.showDeleteConfirmDialog = true;
            (gridObj.editModule as any).dialogObj = { hide: () => { } };
            gridObj.dataBind();
            (gridObj.editModule as any).dlgCancel();

        });


        afterAll(() => {
          //  gridObj.editModule.destroy();
            remove(elem);
        });
    });


    describe('Batch editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {
            gridObj.selectRow(0);
            (gridObj.editModule as any).updateCell(0, 'CustomerID', 'any');
            (gridObj.editModule as any).updateRow(0, gridObj.currentViewData[0]);
            gridObj.editModule.editCell(0, 'CustomerID');
            (gridObj.editModule as any).batchCancel();
            gridObj.editModule.editCell(0, 'CustomerID');
            (gridObj.editModule as any).batchSave();
        });


        afterAll(() => {
            remove(elem);
        });
    });

    describe('Batch editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {
            gridObj.selectRow(0);
            (gridObj.editModule as any).editFormValidate();
            let fn: Function = () => {
                return true;
            };
            (gridObj.editModule as any).editModule.formObj = { validate: fn };
            (gridObj.editModule as any).editFormValidate();
            (gridObj.editModule as any).getBatchChanges();
        });


        afterAll(() => {
            remove(elem);
        });
    });

    describe('Batch editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {
            gridObj.selectRow(0);
            gridObj.editModule.editCell(0, 'CustomerID');
            (gridObj.editModule as any).getCurrentEditCellData();
            gridObj.editModule.closeEdit();
            (gridObj.editModule as any).getBatchChanges();
            (gridObj.editModule as any).preventBatch({ instance: gridObj.editModule, handler: gridObj.editModule.closeEdit });
            (gridObj.editModule as any).executeAction();
        });


        afterAll(() => {
            (gridObj.editModule as any).removeEventListener();
            (gridObj.editModule as any).addEventListener();
            gridObj.isDestroyed = true;
            (gridObj.editModule as any).addEventListener();
            (gridObj.editModule as any).removeEventListener();
            gridObj.isDestroyed = false;
            remove(elem);
        });
    });


    describe('Batch editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {
            (gridObj.editModule as any).editModule.deleteRecord('OrderID', gridObj.currentViewData[8]);
        });


        afterAll(() => {          
            remove(elem);
        });
    });

    describe('Batch editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {
            gridObj.editSettings.allowDeleting = false;
            gridObj.dataBind();
            (gridObj.editModule as any).deleteRecord();
        });


        afterAll(() => {        
            remove(elem);
        });
    });

    describe('Batch editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {
            gridObj.selectRow(0);
            (gridObj.editModule as any).deleteRecord('OrderID', {});
        });


        afterAll(() => {           
            remove(elem);
        });
    });

    describe('Batch editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {
            gridObj.selectRow(3);
            (gridObj.editModule as any).deleteRow(gridObj.getSelectedRows()[0]);
        });


        afterAll(() => {
           
            remove(elem);
        });
    });

    describe('Batch editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {
            let elem: any = createElement('div');
            let elem1 = createElement('div', { className: 'e-dlg-content' });
            let elem2 = createElement('label');
            elem2.innerText = (gridObj.editModule as any).l10n.getConstant('ConfirmDelete');

            elem1.appendChild(elem2);
            elem.appendChild(elem1);
            (gridObj.editModule as any).dialogObj = { element: elem, hide: () => { }, show: () => { } };
            gridObj.selectRow(0);
            (gridObj.editModule as any).dlgOk({});
        });

        it('batch actions', () => {
            let elem: any = createElement('div');
            let elem1 = createElement('div', { className: 'e-dlg-content' });
            let elem2 = createElement('label');
            elem2.innerText = (gridObj.editModule as any).l10n.getConstant('BatchSaveConfirm');

            elem1.appendChild(elem2);
            elem.appendChild(elem1);
            (gridObj.editModule as any).dialogObj = { element: elem, hide: () => { }, show: () => { } };
            gridObj.selectRow(0);
            (gridObj.editModule as any).dlgOk({});
        });


        it('batch actions', () => {
            let elem: any = createElement('div');
            let elem1 = createElement('div', { className: 'e-dlg-content' });
            let elem2 = createElement('label');
            elem2.innerText = (gridObj.editModule as any).l10n.getConstant('BatchSaveLostChanges');
            (gridObj.editModule as any).preventBatch({ instance: gridObj.editModule, handler: gridObj.editModule.closeEdit });
            elem1.appendChild(elem2);
            elem.appendChild(elem1);
            (gridObj.editModule as any).dialogObj = { element: elem, hide: () => { }, show: () => { } };
            gridObj.selectRow(0);
            (gridObj.editModule as any).dlgOk({});
        });


        it('batch actions', () => {
            let elem: any = createElement('div');
            let elem1 = createElement('div', { className: 'e-dlg-content' });
            let elem2 = createElement('label');
            elem2.innerText = (gridObj.editModule as any).l10n.getConstant('CancelEdit');
            (gridObj.editModule as any).preventBatch({ instance: gridObj.editModule, handler: gridObj.editModule.closeEdit });
            elem1.appendChild(elem2);
            elem.appendChild(elem1);
            (gridObj.editModule as any).dialogObj = { element: elem, hide: () => { }, show: () => { } };
            gridObj.selectRow(0);
            (gridObj.editModule as any).dlgOk({});
        });


        afterAll(() => {
            remove(elem);
        });
    });

    describe('Batch editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {

            (gridObj.editModule as any).showDialog = () => { };
            gridObj.selectRow(0);
            gridObj.editSettings.showConfirmDialog = true;
            gridObj.dataBind();
            (gridObj.editModule as any).endEdit({});
        });


        afterAll(() => {
            remove(elem);
        });
    });

    describe('Batch editing functionalities', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let bbs: EmitType<Object> = (args: any) => { args.cancel = true; };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowGrouping: true,
                    beforeBatchSave: bbs,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {
            (gridObj.editModule as any).editModule.saveCell = () => { };
            gridObj.isEdit = true;
            (gridObj.editModule as any).editModule.isAddRow = ()=>{return true;};
            (gridObj.editModule as any).editModule.keyPressHandler({ action: 'tab', preventDefault: () => { } });
            (gridObj.editModule as any).editModule.keyPressHandler({ action: 'shiftTab', preventDefault: () => { } });
            (gridObj.editModule as any).editModule.keyPressHandler({ action: 'enter', preventDefault: () => { } });
            gridObj.element.appendChild(createElement('div', { className: 'e-popup-open' }));
            if (document.body.querySelector('.e-popup-open'))
                remove(document.body.querySelector('.e-popup-open') as any);
            (gridObj.editModule as any).editModule.keyPressHandler({ action: 'enter', preventDefault: () => { } });
            gridObj.isEdit = true;
            let fn: Function = () => { return false; };
            (gridObj.editModule as any).editModule.formObj = { validate: fn };
            (gridObj.editModule as any).editModule.endEdit();
            (gridObj.editModule as any).editModule.saveCell = () => { };
            (gridObj.editModule as any).editModule.batchSave();
        });


        afterAll(() => {
            remove(elem);
        });
    });

    describe('Batch editing functionalities', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let cellSave: EmitType<Object> = (args: any) => { args.cancel = true; };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowGrouping: true,
                    cellSave: cellSave,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity', defaultValue: 'germany' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {
            gridObj.selectRow(0);
            (gridObj.editModule as any).editModule.editCell(0, 'CustomerID');
            (gridObj.editModule as any).editModule.saveCell();
            (gridObj.contentModule.getRows()[0] as any).edit = 'add';
            (gridObj.contentModule.getRows()[0] as any).isDirty = true;
            (gridObj.contentModule.getRows()[0] as any).changes = {};
            (gridObj.editModule as any).editModule.getBatchChanges();
            (gridObj.editModule as any).editModule.removeRowObjectFromUID('');
            (gridObj.editModule as any).validationComplete = () => { };
            (gridObj.editModule as any).valErrorPlacement = () => { };
            (gridObj.editModule as any).editModule.valComplete({});
            (gridObj.editModule as any).editModule.customPlacement(null, null);    
            (gridObj.editModule as any).editModule.getDefaultData();
            let inst : any = { element: createElement('div').appendChild(createElement('div',{className:'e-updatedtd'})),
              editSettings: {mode:'batch'}}
            isActionPrevent(inst);
        });


        afterAll(() => {
            remove(elem);
        });
    });

    describe('Batch editing functionalities', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let cellSave: EmitType<Object> = (args: any) => { args.cancel = true; };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowGrouping: true,
                    beforeBatchAdd: cellSave,
                    beforeBatchDelete: cellSave,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity', defaultValue: 'germany' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {           
            (gridObj.editModule as any).editModule.bulkAddRow({OrderID:1342});                      
            gridObj.selectRow(1);
            (gridObj.editModule as any).editModule.bulkDelete();                
        });


        afterAll(() => {
            remove(elem);
        });
    });

    describe('Batch editing functionalities', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let cellSave: EmitType<Object> = (args: any) => { args.cancel = true; };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowGrouping: true,                   
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity', defaultValue: 'germany' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {                       
            gridObj.selectRow(0);
            gridObj.element.querySelector('.e-row').classList.add('e-insertedrow');
            (gridObj.editModule as any).editModule.bulkDelete();                
            (gridObj.editModule as any).editModule.findPrevEditableCell(0, false);               
            (gridObj.editModule as any).editModule.findPrevEditableCell(0, true);       
        });


        afterAll(() => {
            remove(elem);
        });
    });

    describe('Batch editing functionalities', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            let cellSave: EmitType<Object> = (args: any) => { args.cancel = true; };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: filterData,
                    allowFiltering: true,
                    allowGrouping: true,                   
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'ShipCity', defaultValue: 'germany' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('batch actions', () => {                       
            gridObj.selectRow(0);
            (gridObj.editModule as any).tapEvent({target: gridObj.element.querySelector('.e-rowcell')});                
            (gridObj.editModule as any).tapEvent({target: gridObj.element.querySelector('.e-rowcell')});                
            (gridObj.editModule as any).timeoutHandler();    
            (gridObj.editModule as any).getUserAgent = ()=>{return true;};
            (gridObj.editModule as any).tapEvent({target: gridObj.element.querySelector('.e-rowcell')});                
            (gridObj.editModule as any).getUserAgent = ()=>{return false;};
            (gridObj.editModule as any).tapEvent({target: gridObj.element.querySelector('.e-rowcell')});                
            (gridObj.editModule as any).editModule.validateFormObj  = ()=>{return true;};
            (gridObj.editModule as any).editModule.reFocusIfError = ()=>{return true;};
            (gridObj.editModule as any).editModule.keyPressHandler({ action: 'tab', preventDefault: () => { } });
            (gridObj.editModule as any).editModule.keyPressHandler({ action: 'shiftTab', preventDefault: () => { } });      
        });


        afterAll(() => {
            remove(elem);
        });
    });

});