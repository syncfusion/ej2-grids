/**
 * Grid batch edit spec document
 */
import { EventHandler, ChildProperty, EmitType } from '@syncfusion/ej2-base';
import { extend, getValue } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { QueryCellInfoEventArgs } from '../../../src/grid/base/interface';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Reorder } from '../../../src/grid/actions/reorder';
import { BatchEdit } from '../../../src/grid/actions/batch-edit';
import { Page } from '../../../src/grid/actions/page';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { CellType } from '../../../src/grid/base/enum';
import { ValueFormatter } from '../../../src/grid/services/value-formatter';
import { Column } from '../../../src/grid/models/column';
import { Selection } from '../../../src/grid/actions/selection';
import { NumericEditCell } from '../../../src/grid/renderer/numeric-edit-cell';
import { DropDownEditCell } from '../../../src/grid/renderer/dropdown-edit-cell';
import { DatePickerEditCell } from '../../../src/grid/renderer/datepicker-edit-cell';
import { BooleanEditCell } from '../../../src/grid/renderer/boolean-edit-cell';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, Toolbar);

describe('Editing module', () => {

    let dataSource: Function = (): Object[] => {
        let datasrc: Object[] = [];
        for (let i = 0; i < 11; i++) {
            datasrc.push(extend({}, data[i]));
        }
        return datasrc;
    };


    describe('Batch editing render', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('cell edit start - args.cancel true', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                args.cancel = true;
                done();
            };
            gridObj.cellEdit = cellEdit;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(2);
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('cell edit start - args.cancel false', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('cell edit - args.cancel', (done: Function) => {
            let cellSave = (args?: any): void => {
                gridObj.cellSave = null;
                args.cancel = true;
                done();
            };
            gridObj.cellSave = cellSave;
            //expect(document.activeElement.id).toBe(gridObj.element.id + 'CustomerID');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            expect(gridObj.editModule.getCurrentEditCellData()).toBe('updated');
            gridObj.editModule.saveCell();
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(2);
        });

        it('cell edit complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(2);
            gridObj.editModule.saveCell();
        });

        it('last action check', () => {
            expect((gridObj as any).contentModule.getRows()[0].data.CustomerID).toBe('VINET');
            expect((gridObj as any).contentModule.getRows()[0].changes.CustomerID).toBe('updated');
            //row count check
            expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
            //record count check
            expect(gridObj.currentViewData.length).toBe(11);
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(0);
        });

        it('add start', (done: Function) => {
            let beforeBatchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchAdd = null;
            };
            let batchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(gridObj.getVisibleColumns().length - 1);
                //expect(document.activeElement.id).toBe(gridObj.element.id + 'OrderID');
                expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                gridObj.batchAdd = null;
                done();
            };
            gridObj.beforeBatchAdd = beforeBatchAdd;
            gridObj.batchAdd = batchAdd;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('add - cell edit complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            //update orderid
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10247;
            gridObj.editModule.saveCell();
        });

        it('last action check', () => {
            let rowObj: any = gridObj.getRowObjectFromUID(gridObj.getContent().querySelector('.e-row').getAttribute('data-uid'));
            expect(rowObj.data.OrderID).toBe(0);
            expect(rowObj.data.CustomerID).toBeNull();
            expect(rowObj.data.Verified).toBeFalsy();
            expect(rowObj.changes.OrderID).toBe(10247);
            expect(rowObj.changes.CustomerID).toBeNull();
            expect(rowObj.changes.Verified).toBeFalsy();
            //row count check
            expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
            //record count check
            expect(gridObj.currentViewData.length).toBe(11);
        });

        it('delete', (done: Function) => {
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                //row count check
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(11);
                //record count check
                expect(gridObj.currentViewData.length).toBe(11);
                gridObj.batchDelete = null;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.batchDelete = batchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            gridObj.deleteRow(gridObj.getContent().querySelectorAll('.e-row')[2] as any);
        });

        it('delete', (done: Function) => {
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                //row count check
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(10);
                //record count check
                expect(gridObj.currentViewData.length).toBe(11);
                gridObj.batchDelete = null;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.batchDelete = batchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('batch save - args.cancel', (done: Function) => {
            let beforeBatchSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                args.cancel = true;
                gridObj.beforeBatchSave = null;
                done();
            };
            gridObj.beforeBatchSave = beforeBatchSave;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('batch save', (done: Function) => {
            let beforeBatchSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchSave = null;
            };
            let dataBound = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                //row count check
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(10);
                //record count check
                expect(gridObj.currentViewData.length).toBe(10);
                expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                expect((gridObj.currentViewData[1] as any).OrderID).toBe(10251);
                expect((gridObj.currentViewData[9] as any).OrderID).toBe(10247);
                gridObj.dataBound = null;
                done();
            };
            gridObj.beforeBatchSave = beforeBatchSave;
            gridObj.dataBound = dataBound;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });

    describe('same actions above for cancel edit', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('cell edit start', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('cell edit complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.editModule.saveCell();
        });

        it('add start', (done: Function) => {
            let beforeBatchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchAdd = null;
            };
            let batchAdd = (args?: any): void => {
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                gridObj.batchAdd = null;
                done();
            };
            gridObj.beforeBatchAdd = beforeBatchAdd;
            gridObj.batchAdd = batchAdd;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('add - cell edit complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10247;
            gridObj.editModule.saveCell();
        });

        it('delete', (done: Function) => {
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.batchDelete = null;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.batchDelete = batchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            gridObj.deleteRow(gridObj.getContent().querySelectorAll('.e-row')[2] as any);
        });

        it('delete - args.cancel - true', (done: Function) => {
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
                args.cancel = true;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('delete - args.cancel false', (done: Function) => {
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.batchDelete = null;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.batchDelete = batchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('batch cancel', () => {
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
            //row count check
            expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(11);
            //record count check
            expect(gridObj.currentViewData.length).toBe(11);
            expect((gridObj.currentViewData[0] as any).OrderID).toBe(10248);
            expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updated');
            expect((gridObj.currentViewData[1] as any).OrderID).toBe(10249);
            expect((gridObj.currentViewData[9] as any).OrderID).not.toBe(10247);
        });

        it('dbl click cell edit start', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].childNodes[1] });
        });

        it('click cell edit - cell save trigger check', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            (gridObj.element.querySelectorAll('.e-row')[2] as any).cells[0].click();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });

    describe('keyboard shortcuts testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        let cell: HTMLElement;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: false,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        //firt cell with shift tab key        
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('shift tab key', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeFalsy();
        });

        //firt cell with shift tab key        
        it('edit cell', (done: Function) => {
            // last action check
            expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(0);
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(gridObj.currentViewData.length - 1, 'OrderDate');
        });

        it('tab key', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('f2 key', (done: Function) => {
            // last action check
            expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(1);
            cell = gridObj.getContent().querySelector('.e-row').childNodes[1] as any;
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            cell.click();
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
        });

        it('enter key', (done: Function) => {
            let cell = gridObj.getContent().querySelector('.e-row').childNodes[1] as any;
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: cell } as any);
        });

        it('cell save', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });


        it('add start - args.cancel true', (done: Function) => {
            let beforeBatchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchAdd = null;
                args.cancel = true;
                done();
            };
            gridObj.beforeBatchAdd = beforeBatchAdd;
            gridObj.keyboardModule.keyAction({ action: 'insert', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('add start - args.cancel false', (done: Function) => {
            let beforeBatchAdd = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchAdd = null;
            };
            let batchAdd = (args?: any): void => {
                expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                gridObj.batchAdd = null;
                done();
            };
            gridObj.beforeBatchAdd = beforeBatchAdd;
            gridObj.batchAdd = batchAdd;
            gridObj.keyboardModule.keyAction({ action: 'insert', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('add - cell edit complete', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10247;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });

        it('delete', (done: Function) => {
            let cell = gridObj.getContent().querySelectorAll('.e-row')[2].childNodes[1] as any;
            let beforeBatchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.beforeBatchDelete = null;
            };
            let batchDelete = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.batchDelete = null;
                done();
            };
            gridObj.beforeBatchDelete = beforeBatchDelete;
            gridObj.batchDelete = batchDelete;
            gridObj.clearSelection();
            gridObj.selectRow(2, true);
            gridObj.keyboardModule.keyAction({ action: 'delete', preventDefault: preventDefault, target: cell } as any);
        });
        // allowEditing false
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('tab key', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('shift tab key', () => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'CustomerID');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'CustomerID');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });


        //isIdentity true
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'Verified');
        });

        it('tab key', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('shift tab key', () => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'ShipName');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'Verified');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });


        //visible false
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'ShipCountry');
        });

        it('tab key', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('shift tab key', () => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'OrderDate');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'ShipCountry');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });

        //next row and previous row
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'OrderDate');
        });

        it('tab key', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('shift tab key', () => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'OrderDate');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'ShipCountry');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });

        //next row and previous row
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'OrderDate');
        });

        it('tab key', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('shift tab key', () => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'OrderDate');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeTruthy();
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'ShipCountry');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });

        //prev row and next row
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'CustomerID');
        });

        it('tab key', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.isEdit).toBeFalsy();
        });

        it('shift tab key', () => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell')).toBeNull();
            gridObj.editModule.editCell(2, 'CustomerID');
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
        });

        it('cell save', (done: Function) => {
            //last action check
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'CustomerID');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            //for endedit and batch save while editing
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '';
            (gridObj.editModule as any).editModule.endEdit();
            (gridObj.editModule as any).editModule.batchSave();
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            //for coverage
            (gridObj.editModule as any).editModule.removeRowObjectFromUID('adsdf');
            expect(gridObj.isEdit).toBeTruthy();

            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
        });

        //shortcuts with validation error
        it('edit cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(1, 'CustomerID');
        });

        it('tab key', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '';
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.editModule.editFormValidate();
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '';
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: cell } as any);
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.editModule.editFormValidate();
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = '';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: cell } as any);
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelector('.e-field').id).toBe(gridObj.element.id + 'CustomerID');
        });

        it('tab key', () => {
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            (gridObj.getContent().querySelectorAll('.e-row')[2].firstElementChild as any).click();
            expect(gridObj.isEdit).toBeFalsy();
            gridObj.isEdit = true;
            (gridObj.editModule as any).editModule.validateFormObj = () => true;
            (gridObj.editModule as any).editModule.onBeforeCellFocused({ byClick: true, clickArgs: { preventDefault: () => {} } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });

    describe('update cell and row method testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('update cell', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBe(1);
            expect((gridObj as any).contentModule.getRows()[0].changes.CustomerID).toBe('updated');
        });

        it('update row', () => {
            gridObj.editModule.updateRow(1, { CustomerID: 'updated' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBe(2);
            expect((gridObj as any).contentModule.getRows()[1].changes.CustomerID).toBe('updated');
        });

        it('add record by method', () => {
            gridObj.editModule.addRecord({ OrderID: 10247, CustomerID: 'updated' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(2);
            expect((gridObj as any).contentModule.getRows()[0].changes.OrderID).toBe(10247);
        });

        it('delete record by method', () => {
            gridObj.editModule.deleteRecord('OrderID', gridObj.currentViewData[2]);
            expect(gridObj.getContent().querySelectorAll('.e-row')[3].classList.contains('e-hiddenrow')).toBeTruthy();
        });

        it('getBatch changes method test', () => {
            let batch: any = gridObj.editModule.getBatchChanges();
            expect(batch.changedRecords[0].CustomerID).toBe('updated');
            expect(batch.changedRecords[1].CustomerID).toBe('updated');
            expect(batch.addedRecords[0].OrderID).toBe(10247);
            expect(batch.deletedRecords[0].OrderID).toBe(10250);
        });

        it('batch save method testing', (done: Function) => {
            let dataBound = (args?: any): void => {
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(11);
                //record count check
                expect(gridObj.currentViewData.length).toBe(11);
                expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                expect((gridObj.currentViewData[2] as any).OrderID).toBe(10251);
                expect((gridObj.currentViewData[10] as any).OrderID).toBe(10247);
                gridObj.dataBound = null;
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.editModule.batchSave();
        });

        it('add record by method', () => {
            gridObj.editModule.addRecord({ OrderID: 10246, CustomerID: 'updated' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(0);
            expect((gridObj as any).contentModule.getRows()[0].changes.OrderID).toBe(10246);
        });

        it('delete record by method', () => {
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.editModule.deleteRecord();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });

        it('delete record by method', () => {
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.editModule.deleteRecord();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeTruthy();
        });

        it('batch cancel method testing', () => {
            gridObj.editModule.batchCancel();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });

    describe('update cell and row method testing', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('update cell', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBe(1);
            expect((gridObj as any).contentModule.getRows()[0].changes.CustomerID).toBe('updated');
        });

        it('update row', () => {
            gridObj.editModule.updateRow(1, { CustomerID: 'updated' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBe(2);
            expect((gridObj as any).contentModule.getRows()[1].changes.CustomerID).toBe('updated');
        });

        it('add record by method', () => {
            gridObj.editModule.addRecord({ OrderID: 10247, CustomerID: 'updated' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(2);
            expect((gridObj as any).contentModule.getRows()[0].changes.OrderID).toBe(10247);
        });

        it('delete record by method', () => {
            gridObj.editModule.deleteRecord('OrderID', gridObj.currentViewData[2]);
            expect(gridObj.getContent().querySelectorAll('.e-row')[3].classList.contains('e-hiddenrow')).toBeTruthy();
        });

        it('getBatch changes method test', () => {
            let batch: any = gridObj.editModule.getBatchChanges();
            expect(batch.changedRecords[0].CustomerID).toBe('updated');
            expect(batch.changedRecords[1].CustomerID).toBe('updated');
            expect(batch.addedRecords[0].OrderID).toBe(10247);
            expect(batch.deletedRecords[0].OrderID).toBe(10250);
        });

        it('batch save method testing', (done: Function) => {
            let dataBound = (args?: any): void => {
                expect(gridObj.getContent().querySelectorAll('.e-row:not(.e-hiddenrow)').length).toBe(11);
                //record count check
                expect(gridObj.currentViewData.length).toBe(11);
                expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                expect((gridObj.currentViewData[2] as any).OrderID).toBe(10251);
                expect((gridObj.currentViewData[10] as any).OrderID).toBe(10247);
                gridObj.dataBound = null;
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.editModule.batchSave();
        });

        it('add record by method', () => {
            gridObj.editModule.addRecord({ OrderID: 10246, CustomerID: 'updated' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(0);
            expect((gridObj as any).contentModule.getRows()[0].changes.OrderID).toBe(10246);
        });

        it('delete record by method', () => {
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.editModule.deleteRecord();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });

        it('delete record by method', () => {
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.editModule.deleteRecord();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeTruthy();
        });

        it('batch cancel method testing', () => {
            gridObj.editModule.batchCancel();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });

        it('batch edit invalie input', () => {
            (gridObj.editModule as any).editModule.dblClickHandler({ target: gridObj.element });
            expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(0);
            (gridObj.editModule as any).editModule.clickHandler({ target: gridObj.element.querySelector('#' + gridObj.element.id + '_add') });
        });

        it('For coverage', () => {
            let promise = {
                then: (args: any) => {
                    args.call(this, { result: [{}, {}] });
                    return {
                        catch: (args: any) => {
                            args.call(this, { result: [{}, {}] });
                        }
                    }
                }
            };
            (gridObj.renderModule as any).dataManagerSuccess = () => { };
            (gridObj.renderModule as any).dataManagerFailure = () => { };
            (gridObj.renderModule as any).data.dataManager.dataSource.offline = false;
            (gridObj.renderModule as any).data.saveChanges = () => { return promise };
            (gridObj.renderModule as any).sendBulkRequest({ changes: {} });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            gridObj.isDestroyed = true;
            let bEdit: BatchEdit = new BatchEdit(gridObj, gridObj.serviceLocator, {} as any);
            bEdit.addEventListener();
            bEdit.removeEventListener();
            gridObj.isDestroyed = false;
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });

    describe('batch editing lose with other actions', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    allowReordering: true,
                    allowSorting: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: true,
                    pageSettings:{pageSize: 8},
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('Search method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.searchModule.search('10249');
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('Search method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.searchModule.search('10249');
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('clear search', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).not.toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.searchModule.search('');
        });

        it('sort method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.sortColumn('OrderID', 'ascending', false);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('sort method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('OrderID', 'ascending', false);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('clear sorting method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.clearSorting();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('clear sorting method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-ascending').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSorting();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('group column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.groupModule.groupColumn('CustomerID');
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('group column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('CustomerID');
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('ungroup column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.groupModule.ungroupColumn('CustomerID');
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('ungroup column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('CustomerID');
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('filter column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('filter column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('clearfiltering method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.clearFiltering();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('clearfiltering method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).not.toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearFiltering();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('filter column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('filter column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.filterByColumn('OrderID', 'equal', 10248, 'and', true);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('removeFilteredColsByField method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.removeFilteredColsByField('OrderID')
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('removeFilteredColsByField method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-row').length).not.toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.removeFilteredColsByField('OrderID')
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('reorder column method - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            (gridObj.reorderModule as any).moveColumns(2, gridObj.columns[0]);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('reorder column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect((gridObj.columns[0] as Column).field).not.toBe('OrderID');
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.reorderModule as any).moveColumns(2, gridObj.columns[0]);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
        });

        it('goto page - cancel', () => {
            gridObj.editModule.updateCell(0, 'CustomerID', 'updated');
            gridObj.goToPage(2);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeFalsy();
            expect(gridObj.pageSettings.currentPage).not.toBe(2);
        });

        it('goto page - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.pageSettings.currentPage).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.goToPage(2);
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeFalsy();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });

    describe('cell edit types', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('input cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('save', (done: Function) => {
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelectorAll('.e-defaultcell').length).toBe(1);
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            gridObj.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'updated';
            gridObj.editModule.saveCell();
        });

        it('boolean cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'Verified');
        });

        it('save', (done: Function) => {
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelectorAll('.e-checkbox').length).toBe(1);
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = false;
            gridObj.editModule.saveCell();
        });

        it('numeric cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'Freight');
        });

        it('save', (done: Function) => {
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelectorAll('.e-numerictextbox').length).toBe(1);
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 10;
            gridObj.editModule.saveCell();
        });

        it('dropdown cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'ShipCountry');
        });

        it('save', (done: Function) => {
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelectorAll('.e-dropdownlist').length).toBe(1);
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'Germany';
            gridObj.editModule.saveCell();
        });

        it('datepicker cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'OrderDate');
        });

        it('save', (done: Function) => {
            expect(gridObj.element.querySelector('.e-editedbatchcell').querySelectorAll('.e-datepicker').length).toBe(1);
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 3;
            gridObj.editModule.saveCell();
        });

        it('for coverage', () => {
            let ne: NumericEditCell = new NumericEditCell(gridObj);
            ne.destroy();
            let dd: DropDownEditCell = new DropDownEditCell(gridObj);
            dd.destroy();
            let dp: DatePickerEditCell = new DatePickerEditCell(gridObj);
            dp.destroy();
            let boolean: BooleanEditCell = new BooleanEditCell(gridObj);
            boolean.destroy();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });

    describe('cell edit types', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        let datamManager = new DataManager(dataSource() as JSON[]);
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: datamManager,
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit', edit: { params: { dataSource: datamManager, value: 'Germany' } } },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('dropdown cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'ShipCountry');
        });

        it('save', (done: Function) => {
            expect((gridObj.element.querySelector('#' + gridObj.element.id + 'ShipCountry') as any).value).toBe('Germany');
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'Germany';
            gridObj.editModule.saveCell();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });

    describe('Validation check', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        let datamManager = new DataManager(dataSource() as JSON[]);
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: datamManager,
                    allowFiltering: true,
                    allowGrouping: false,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid');
        });

        it('editcell cell', (done: Function) => {
            let cellEdit = (args?: any): void => {
                expect(gridObj.isEdit).toBeFalsy();
                gridObj.cellEdit = null;
                done();
            };
            gridObj.cellEdit = cellEdit;
            gridObj.editModule.editCell(0, 'CustomerID');
        });

        it('validate', () => {
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = '';
            gridObj.editModule.saveCell();
            expect(document.querySelectorAll('.e-griderror').length).toBeGreaterThan(0);
        });

        it('save', (done: Function) => {
            let cellSave = (args?: any): void => {
                expect(gridObj.isEdit).toBeTruthy();
                gridObj.cellSave = null;
                expect(document.querySelectorAll('.e-griderror').length).toBe(0);
                done();
            };
            gridObj.cellSave = cellSave;
            (gridObj.element.querySelector('.e-editedbatchcell').querySelector('input') as any).value = 'updated';
            gridObj.editModule.saveCell();
        });

        it('allow adding false testing', () => {
            gridObj.editSettings.allowAdding = false;
            gridObj.dataBind();
            (gridObj.editModule as any).editModule.bulkAddRow();
            expect(gridObj.isEdit).toBeFalsy();
            //for coverage
            (gridObj.editModule as any).editModule.updateCell(0, 'undefined');
            (gridObj.editModule as any).editModule.checkNPCell ({ visible: true });
            (gridObj.editModule as any).editModule.isAddRow(0);
        });

        it('allow editing false testing', () => {
            gridObj.editSettings.allowEditing = false;
            gridObj.dataBind();
            (gridObj.editModule as any).editModule.editCell(0, 'CustomerID');
            expect(gridObj.element.querySelectorAll('.e-editedbatchcell').length).toBe(0);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid')) {
                document.getElementById('Grid').remove();
            }
        });
    });
    describe('keyboard shortcuts testing with cell spanning', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let actionBegin: () => void;
        let preventDefault: Function = new Function();
        let actionComplete: () => void;
        let cell: HTMLElement;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: false,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'batch', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['add', 'edit', 'delete', 'update', 'cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: true },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound,
                    queryCellInfo: function(args: QueryCellInfoEventArgs){
                        if (args.column['field'] === 'CustomerID' && args.data['CustomerID'] === 'VICTE' ) {
                            args.colSpan = 2;
                        }
                        else if (args.column['field'] === 'ShipCountry' && args.data['ShipCountry'] === 'Germany' ) {
                            args.colSpan = 2;
                        }
                        else if (args.column['field'] === 'OrderID' && args.data['OrderID'] === 10250 ) {
                            args.colSpan = 3;
                        }
                    }
                });
            gridObj.appendTo('#Grid');
        });

        //firt cell with shift tab key        
        it(' shift Tab from spanned cell', () => {
            gridObj.editModule.editCell(1, 'ShipCountry');
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: cell } as any);
            let td = gridObj.element.querySelector('.e-editedbatchcell') as HTMLTableCellElement;
            expect(td.getAttribute('aria-label').toString().indexOf('ShipName')).toBeGreaterThan(0);
            gridObj.editModule.editCell(3, 'CustomerID');
            gridObj.keyboardModule.keyAction({ action: 'shiftTab', preventDefault: preventDefault, target: cell } as any);
            td = gridObj.element.querySelector('.e-editedbatchcell') as HTMLTableCellElement;
            expect(td).toBeNull();
            expect(gridObj.getRows()[2].querySelectorAll('.e-editedbatchcell').length).toBe(0);
        });

        it('tab key', () => {
            gridObj.editModule.editCell(1, 'ShipCountry');
            gridObj.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            let td = gridObj.element.querySelector('.e-editedbatchcell') as HTMLTableCellElement;
            expect(td.getAttribute('aria-label').toString().indexOf('ShipCountry')).toBeGreaterThan(0);
            expect(gridObj.getRows()[1].querySelectorAll('.e-editedbatchcell').length).toBeGreaterThan(0);
            gridObj.editModule.editCell(3, 'CustomerID');
        });

        it('f2 key', () => {
            let tr = gridObj.getContent().querySelectorAll('tr')[1];
            cell = tr.cells[tr.cells.length -2 ];
            cell.click();
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: cell } as any);
            expect(cell.getAttribute('aria-label').toString().indexOf('ShipCountry')).toBeGreaterThan(0);
        });

        it('enter key', () => {
            let tr = gridObj.getContent().querySelectorAll('tr')[1];
            let cell = tr.cells[tr.cells.length -2 ];
            let ele = gridObj.element.querySelector('.e-editedbatchcell').querySelector('input');
            ele['ej2_instances'][0].value = 'France';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: cell } as any);
            expect(cell.classList.contains('e-updatedtd')).toBeGreaterThan(0);
        });

        afterAll((done) => {
            gridObj.notify('tooltip-destroy', {});
            (gridObj.editModule as any).editModule.destroy();
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
