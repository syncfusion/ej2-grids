/**
 * Grid Filtering spec document
 */
import { EventHandler, ChildProperty, EmitType } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { CellType } from '../../../src/grid/base/enum';
import { ValueFormatter } from '../../../src/grid/services/value-formatter';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { NumericEditCell } from '../../../src/grid/renderer/numeric-edit-cell';
import { filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Filter, Page, Selection, Group, Edit, Toolbar);

describe('Editing module', () => {

    describe('Dialog editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'dialog', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        {
                            field: 'ShipName', isIdentity: true, edit: {
                                create: () => { return '<input>' },
                                read: () => { }, write: () => { }, destroy: () => { }
                            }
                        },
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

        it('dialog actions', () => {
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
            gridObj.selectRow(0);
            gridObj.startEdit();
            // actionComplete = (args?: Object): void => {                
            //     done();
            // };
            gridObj.endEdit();
        });

        afterAll(() => {
            remove(elem);
        });
    });

    describe('Dialog editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'dialog', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        {
                            field: 'ShipName', isIdentity: true, edit: {
                                create: () => { return '<input>' },
                                read: () => { }, write: () => { }, destroy: () => { }
                            }
                        },
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

        it('dialog actions', () => {
            gridObj.selectRow(0);
            gridObj.addRecord();
            gridObj.endEdit();
        });


        afterAll(() => {
            remove(elem);
        });
    });

    describe('Dialog editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'dialog', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        {
                            field: 'ShipName', isIdentity: true, edit: {
                                create: () => { return '<input>' },
                                read: () => { }, write: () => { }, destroy: () => { }
                            }
                        },
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

        it('dialog actions', () => {
            gridObj.selectRow(0);
            gridObj.deleteRecord();
            gridObj.addRecord();
            gridObj.closeEdit();
        });


        afterAll(() => {
            remove(elem);
        });
    });

    describe('Dialog editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'dialog', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        {
                            field: 'ShipName', isIdentity: true, edit: {
                                create: () => { return '<input>' },
                                read: () => { }, write: () => { }, destroy: () => { }
                            }
                        },
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

        it('dialog actions', () => {
            gridObj.selectRow(0);
            gridObj.addRecord();
            let lbl: Element = createElement('lbl');
            lbl.innerHTML = 'cancel';
            (gridObj.editModule as any).editModule.renderer.renderer.btnClick({ target: lbl });
        });


        afterAll(() => {
            remove(elem);
        });
    });


    describe('Dialog editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'dialog', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        {
                            field: 'ShipName', isIdentity: true, edit: {
                                create: () => { return '<input>' },
                                read: () => { }, write: () => { }, destroy: () => { }
                            }
                        },
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

        it('dialog actions', () => {
            gridObj.selectRow(0);
            gridObj.startEdit();
            let lbl: Element = createElement('lbl');
            lbl.innerHTML = '';
            (gridObj.editModule as any).editModule.renderer.renderer.btnClick({ target: lbl });
        });


        afterAll(() => {
            remove(elem);
        });
    });

    describe('Dialog editing functionalities', () => {
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
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'dialog', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' }, { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        {
                            field: 'ShipName', isIdentity: true, edit: {
                                create: () => { return '<input>' },
                                read: () => { }, write: () => { }, destroy: () => { }
                            }
                        },
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

        it('dialog actions', () => {
            (gridObj.editModule as any).getBatchChanges();
            (gridObj.editModule as any).editModule.renderer.renderer.destroy();
        });


        afterAll(() => {
            remove(elem);
        });
    });

});