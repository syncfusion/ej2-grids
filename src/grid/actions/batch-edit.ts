import { extend, KeyboardEventArgs, addClass } from '@syncfusion/ej2-base';
import { remove, classList, createElement } from '@syncfusion/ej2-base';
import { FormValidator } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, BeforeBatchAddArgs, BeforeBatchDeleteArgs, BeforeBatchSaveArgs } from '../base/interface';
import { BatchAddArgs, CellEditArgs, CellSaveArgs } from '../base/interface';
import { parentsUntil, inArray } from '../base/util';
import * as events from '../base/constant';
import { EditRender } from '../renderer/edit-renderer';
import { RowRenderer } from '../renderer/row-renderer';
import { CellRenderer } from '../renderer/cell-renderer';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import { ServiceLocator } from '../services/service-locator';
import { IModelGenerator } from '../base/interface';
import { RowModelGenerator } from '../services/row-model-generator';
import { Column } from '../models/column';

/**
 * `BatchEdit` module is used to handle batch editing actions.
 * @hidden
 */
export class BatchEdit {

    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private form: Element;
    public formObj: FormValidator;
    private renderer: EditRender;
    private cellDetails: {
        rowData?: Object, field?: string, value?: string,
        isForeignKey?: boolean, column?: Column, rowIndex?: number, cellIndex?: number
    } = {};
    private isColored: boolean;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, renderer?: EditRender) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.renderer = renderer;
        this.addEventListener();
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.dblclick, this.dblClickHandler, this);
        this.parent.on(events.keyPressed, this.keyPressHandler, this);
        this.parent.addEventListener(events.dataBound, this.dataBound.bind(this));
        this.parent.on(events.doubleTap, this.dblClickHandler, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.dblclick, this.dblClickHandler);
        this.parent.off(events.keyPressed, this.keyPressHandler);
        this.parent.removeEventListener(events.dataBound, this.dataBound);
        this.parent.off(events.doubleTap, this.dblClickHandler);
    }

    private dataBound(): void {
        this.parent.notify(events.toolbarRefresh, {});
    }

    /**
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }

    protected clickHandler(e: MouseEvent): void {
        if (!parentsUntil(e.target as Element, this.parent.element.id + '_add', true)) {
            this.saveCell();
            let rowCell: Element = parentsUntil(e.target as HTMLElement, 'e-rowcell');
            if (rowCell && !this.parent.isEdit) {
                this.setCellIdx(e.target as HTMLTableCellElement);
            }
        }
    }

    protected dblClickHandler(e: MouseEvent): void {
        let target: Element = e.target as Element;
        if (parentsUntil(target, 'e-grid').id !== this.parent.element.id) {
            return;
        }
        let tr: Element = parentsUntil(e.target as Element, 'e-row');
        if ((parentsUntil(target, 'e-rowcell')) && tr) {
            this.editCell(
                parseInt(tr.getAttribute('aria-rowindex'), 10),
                (this.parent.columns[parseInt(parentsUntil(target, 'e-rowcell').getAttribute('aria-colindex'), 10)] as Column).field);
        }
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        let isEdit: boolean = this.parent.isEdit;
        if (!document.querySelectorAll('.e-popup-open').length) {
            this.saveCell();
            switch (e.action) {
                case 'tab':
                    if (isEdit) {
                        this.editNextCell();
                    }
                    break;
                case 'shiftTab':
                    if (isEdit) {
                        this.editPrevCell();
                    }
                    break;
                case 'enter':
                    e.preventDefault();
                    if (isEdit && this.cellDetails.rowIndex + 1 < this.parent.getDataRows().length) {
                        this.editCell(this.cellDetails.rowIndex + 1, this.cellDetails.column.field);
                    }
                    break;
                case 'f2':
                    this.editCellFromIndex(this.cellDetails.rowIndex, this.cellDetails.cellIndex);
                    break;
            }
            if (this.parent.isEdit || !(this.cellDetails.cellIndex === 0 && this.cellDetails.rowIndex === 0) ||
                !(this.cellDetails.rowIndex === this.parent.getDataRows().length &&
                    this.cellDetails.cellIndex === this.parent.columns.length - 1)) {
                e.preventDefault();
            }
        }
    }

    private isAddRow(index: number): boolean {
        let tr: Element = this.parent.getDataRows()[index];
        return tr.classList.contains('e-insertedrow');
    }

    private editNextCell(): void {
        let oldIdx: number = this.cellDetails.cellIndex;
        let cellIdx: number = this.findNextEditableCell(this.cellDetails.cellIndex + 1, this.isAddRow(this.cellDetails.rowIndex));
        if (cellIdx > -1) {
            this.cellDetails.cellIndex = cellIdx;
        } else if (this.cellDetails.rowIndex + 1 < this.parent.getDataRows().length) {
            this.cellDetails.rowIndex++;
            this.cellDetails.cellIndex = this.findNextEditableCell(0, this.isAddRow(this.cellDetails.rowIndex));
        }
        if (oldIdx !== this.cellDetails.cellIndex) {
            this.editCellFromIndex(this.cellDetails.rowIndex, this.cellDetails.cellIndex);
        }
    }

    private editPrevCell(): void {
        let oldIdx: number = this.cellDetails.cellIndex;
        let cellIdx: number = this.findPrevEditableCell(this.cellDetails.cellIndex - 1, this.isAddRow(this.cellDetails.rowIndex));
        if (cellIdx > -1) {
            this.cellDetails.cellIndex = cellIdx;
        } else if (this.cellDetails.rowIndex - 1 > -1) {
            this.cellDetails.rowIndex--;
            this.cellDetails.cellIndex = this.findPrevEditableCell(
                this.parent.columns.length - 1, this.isAddRow(this.cellDetails.rowIndex));
        }
        if (oldIdx !== this.cellDetails.cellIndex) {
            this.editCellFromIndex(this.cellDetails.rowIndex, this.cellDetails.cellIndex);
        }
    }

    private editCellFromIndex(rowIdx: number, cellIdx: number): void {
        this.cellDetails.rowIndex = rowIdx;
        this.cellDetails.cellIndex = cellIdx;
        this.editCell(rowIdx, (this.parent.columns as Column[])[cellIdx].field);
    }

    public closeEdit(): void {
        let gObj: IGridEx = this.parent as IGridEx;
        let rows: Row<Column>[] = gObj.contentModule.getRows();
        let rowRenderer: RowRenderer<Column> = new RowRenderer(this.serviceLocator, null, this.parent);
        let tr: HTMLElement;
        if (gObj.isEdit) {
            this.saveCell(true);
        }
        gObj.clearSelection();
        for (let i: number = 0; i < rows.length; i++) {
            if (rows[i].isDirty) {
                tr = gObj.getContentTable().querySelector('[data-uid=' + rows[i].uid + ']') as HTMLElement;
                if (tr) {
                    if (tr.classList.contains('e-insertedrow')) {
                        remove(tr);
                        this.removeRowObjectFromUID(rows[i].uid);
                        i--;
                    } else {
                        delete rows[i].changes;
                        rows[i].isDirty = false;
                        classList(tr, [], ['e-hiddenrow', 'e-updatedtd']);
                        rowRenderer.refresh(rows[i], gObj.columns as Column[], false);
                    }
                }
            }
        }
        gObj.selectRow(this.cellDetails.rowIndex);
        this.refreshRowIdx();
        gObj.notify(events.toolbarRefresh, {});
        this.parent.notify(events.tooltipDestroy, {});
    }

    public deleteRecord(fieldname?: string, data?: Object): void {
        this.saveCell();
        this.bulkDelete(fieldname, data);
    }

    public addRecord(data?: Object): void {
        this.bulkAddRow(data);
    }

    public endEdit(data?: Object): void {
        if (this.parent.isEdit && this.formObj && !this.formObj.validate()) {
            return;
        }
        this.batchSave();
    }

    public batchSave(): void {
        let gObj: IGrid = this.parent;
        this.saveCell();
        let changes: Object = this.getBatchChanges();
        let args: BeforeBatchSaveArgs = { batchChanges: changes, cancel: false };
        gObj.trigger(events.beforeBatchSave, args);
        if (args.cancel) {
            return;
        }
        gObj.notify(events.bulkSave, { changes: changes });
        this.parent.notify(events.tooltipDestroy, {});
    }

    public getBatchChanges(): Object {
        let changes: { addedRecords: Object[], deletedRecords: Object[], changedRecords: Object[] } = {
            addedRecords: [],
            deletedRecords: [],
            changedRecords: []
        };
        let rows: Row<Column>[] = (this.parent as IGridEx).contentModule.getRows() as Row<Column>[];
        for (let row of rows) {
            if (row.isDirty) {
                switch (row.edit) {
                    case 'add':
                        changes.addedRecords.push(row.changes);
                        break;
                    case 'delete':
                        changes.deletedRecords.push(row.data);
                        break;
                    default:
                        changes.changedRecords.push(row.changes);
                }
            }
        }
        return changes;
    }


    /**
     * @hidden   
     */
    public removeRowObjectFromUID(uid: string): void {
        let rows: Row<Column>[] = (this.parent as IGridEx).contentModule.getRows() as Row<Column>[];
        let i: number = 0;
        for (let len: number = rows.length; i < len; i++) {
            if (rows[i].uid === uid) {
                break;
            }
        }
        rows.splice(i, 1);
    }

    /**
     * @hidden   
     */
    public addRowObject(row: Row<Column>): void {
        ((this.parent as IGridEx).contentModule.getRows() as Row<Column>[]).unshift(row);
    }


    private bulkDelete(fieldname?: string, data?: Object): void {
        let gObj: IGrid = this.parent;
        let index: number = data ? this.getIndexFromData(data) : gObj.selectedRowIndex;
        let args: BeforeBatchDeleteArgs = {
            primaryKey: this.parent.getPrimaryKeyFieldNames(),
            rowIndex: index,
            rowData: data ? data : gObj.getSelectedRecords()[0],
            row: data ? gObj.getRows()[index] : gObj.getSelectedRows()[0], cancel: false
        };
        if (!args.row) {
            return;
        }
        gObj.trigger(events.beforeBatchDelete, args);
        if (args.cancel) {
            return;
        }
        gObj.clearSelection();
        let uid: string = args.row.getAttribute('data-uid');
        if (args.row.classList.contains('e-insertedrow')) {
            this.removeRowObjectFromUID(uid);
            remove(args.row);
        } else {
            let rowObj: Row<Column> = gObj.getRowObjectFromUID(uid);
            rowObj.isDirty = true;
            rowObj.edit = 'delete';
            classList(args.row as HTMLTableRowElement, ['e-hiddenrow', 'e-updatedtd'], []);
        }
        this.refreshRowIdx();
        gObj.selectRow(index);
        delete args.row;
        gObj.trigger(events.batchDelete, args);
        gObj.notify(events.toolbarRefresh, {});
    }

    private refreshRowIdx(): void {
        let rows: HTMLElement[] = [].slice.call(this.parent.getContentTable().querySelector('tbody').children);
        let dataRows: Element[] = [];
        for (let i: number = 0, j: number = 0, len: number = rows.length; i < len; i++) {
            if (rows[i].classList.contains('e-row') && !rows[i].classList.contains('e-hiddenrow')) {
                rows[i].setAttribute('aria-rowindex', j.toString());
                j++;
            } else {
                rows[i].removeAttribute('aria-rowindex');
            }
        }
    }

    private getIndexFromData(data: Object): number {
        return inArray(data, this.parent.getCurrentViewRecords());
    }

    private bulkAddRow(data?: Object): void {
        let gObj: IGrid = this.parent;
        if (!gObj.editSettings.allowAdding) {
            return;
        }
        if (gObj.isEdit) {
            this.saveCell();
        }
        if (gObj.isEdit) {
            return;
        }
        let defaultData: Object = data ? data : this.getDefaultData();
        let args: BeforeBatchAddArgs = {
            defaultData: defaultData,
            primaryKey: gObj.getPrimaryKeyFieldNames(),
            cancel: false
        };
        gObj.trigger(events.beforeBatchAdd, args);
        if (args.cancel) {
            return;
        }
        gObj.clearSelection();
        let row: RowRenderer<Column> = new RowRenderer(this.serviceLocator, null, this.parent);
        let model: IModelGenerator<Column> = new RowModelGenerator(this.parent);
        let modelData: Row<Column>[] = model.generateRows([args.defaultData]);
        let tr: HTMLTableRowElement = row.render(modelData[0], gObj.getColumns()) as HTMLTableRowElement;
        let col: Column;
        let index: number;
        for (let i: number = 0; i < this.parent.groupSettings.columns.length; i++) {
            tr.insertBefore(createElement('td', { className: 'e-indentcell' }), tr.firstChild);
        }
        let tbody: Element = gObj.getContentTable().querySelector('tbody');
        tr.classList.add('e-insertedrow');
        tbody.insertBefore(tr, tbody.firstChild);
        addClass(tr.querySelectorAll('.e-rowcell'), ['e-updatedtd']);
        modelData[0].isDirty = true;
        modelData[0].changes = extend({}, modelData[0].data);
        modelData[0].edit = 'add';
        this.addRowObject(modelData[0]);
        this.refreshRowIdx();
        gObj.selectRow(0);
        if (!data) {
            index = this.findNextEditableCell(0, true);
            col = (gObj.columns[index] as Column);
            this.editCell(0, col.field, true);
        }
        let args1: BatchAddArgs = {
            defaultData: args.defaultData, row: tr,
            columnObject: col, columnIndex: index, primaryKey: args.primaryKey, cell: tr.cells[index]
        };
        gObj.trigger(events.batchAdd, args1);
    }

    private findNextEditableCell(columnIndex: number, isAdd: boolean): number {
        let cols: Column[] = this.parent.columns as Column[];
        let endIndex: number = cols.length;
        for (let i: number = columnIndex; i < endIndex; i++) {
            if (!isAdd && this.checkNPCell(cols[i])) {
                return i;
            } else if (isAdd && !cols[i].template && cols[i].visible) {
                return i;
            }
        }
        return -1;
    }

    private findPrevEditableCell(columnIndex: number, isAdd: boolean): number {
        let cols: Column[] = this.parent.columns as Column[];
        for (let i: number = columnIndex; i > -1; i--) {
            //prev
            if (!isAdd && this.checkNPCell(cols[i])) {
                return i;
            } else if (isAdd && !cols[i].template && cols[i].visible) {
                return i;
            }
        }
        return -1;
    }

    private checkNPCell(col: Column): boolean {
        return !col.template && col.visible && !col.isPrimaryKey && !col.isIdentity;
    }

    private getDefaultData(): Object {
        let gObj: IGrid = this.parent;
        let data: Object = {};
        let dValues: Object = { 'number': 0, 'string': null, 'boolean': false, 'date': null, 'datetime': null };
        for (let col of gObj.columns as Column[]) {
            data[col.field] = col.defaultValue ? col.defaultValue : dValues[col.type];
        }
        return data;
    }

    private setCellIdx(target: HTMLTableCellElement): void {
        let gLen: number = 0;
        if (this.parent.allowGrouping) {
            gLen = this.parent.groupSettings.columns.length;
        }
        this.cellDetails.cellIndex = target.cellIndex - gLen;
        this.cellDetails.rowIndex = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
    }

    public editCell(index: number, field: string, isAdd?: boolean): void {
        let gObj: IGrid = this.parent;
        let col: Column = gObj.getColumnByField(field);
        let keys: string[] = gObj.getPrimaryKeyFieldNames();
        if (gObj.editSettings.allowEditing && col.allowEditing) {
            if (gObj.isEdit && !(this.cellDetails.column.field === field && this.cellDetails.rowIndex === index)) {
                this.saveCell();
            }
            if (gObj.isEdit) {
                return;
            }
            let row: Element = gObj.getDataRows()[index];
            if ((keys[0] === col.field && !row.classList.contains('e-insertedrow')) || col.template || col.columns) {
                return;
            }
            let rowData: Object = extend({}, this.getDataByIndex(index));
            let args: CellEditArgs = {
                cell: (row as HTMLTableRowElement).cells[this.getCellIdx(col.uid)], row: row,
                columnName: col.field, columnObject: col, isForeignKey: !isNullOrUndefined(col.foreignKeyValue),
                primaryKey: keys, rowData: rowData,
                validationRules: extend({}, col.validationRules ? col.validationRules : {}),
                value: rowData[col.field], type: !isAdd ? 'edit' : 'add', cancel: false
            };
            gObj.trigger(events.cellEdit, args);
            if (args.cancel) {
                return;
            }
            this.cellDetails = {
                rowData: rowData, column: col, value: args.value, isForeignKey: args.isForeignKey,
            };
            this.setCellIdx(args.cell as HTMLTableCellElement);
            if (args.cell.classList.contains('e-updatedtd')) {
                this.isColored = true;
                args.cell.classList.remove('e-updatedtd');
            }
            gObj.clearSelection();
            gObj.selectRow(this.cellDetails.rowIndex);
            this.renderer.update(args);
            this.form = gObj.element.querySelector('#' + gObj.element.id + 'EditForm');
            this.applyFormValidation(col);
            gObj.isEdit = true;
            gObj.notify(events.toolbarRefresh, {});
            (this.parent.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'none';
        }
    }

    public updateCell(rowIndex: number, field: string, value: string | number | boolean | Date): void {
        let col: Column = this.parent.getColumnByField(field);
        if (col && !col.isPrimaryKey) {
            let td: Element = (this.parent.getDataRows()[rowIndex] as HTMLTableRowElement).cells[this.parent.getColumnIndexByField(field)];
            let rowObj: Row<Column> = this.parent.getRowObjectFromUID(td.parentElement.getAttribute('data-uid'));
            this.refreshTD(td, col, rowObj, value);
            this.parent.trigger(events.queryCellInfo, {
                cell: td, column: col, data: rowObj.changes
            });
        }
    }

    private setChanges(rowObj: Row<Column>, field: string, value: string | number | boolean | Date): void {
        if (!rowObj.changes) {
            rowObj.changes = extend({}, rowObj.data);
        }
        rowObj.changes[field] = value;
        rowObj.isDirty = true;
    }

    public updateRow(index: number, data: Object): void {
        let keys: string[] = Object.keys(data);
        for (let col of keys) {
            this.updateCell(index, col, data[col]);
        }
    }

    private getCellIdx(uid: string): number {
        let cIdx: number = this.parent.getColumnIndexByUid(uid) + this.parent.groupSettings.columns.length;
        if (!isNullOrUndefined(this.parent.detailTemplate) || !isNullOrUndefined(this.parent.childGrid)) {
            cIdx++;
        }
        return cIdx;
    }

    private refreshTD(td: Element, column: Column, rowObj: Row<Column>, value: string | number | boolean | Date): void {
        let cell: CellRenderer = new CellRenderer(this.serviceLocator);
        this.setChanges(rowObj, column.field, value);
        cell.refreshTD(td, rowObj.cells[this.getCellIdx(column.uid)] as Cell<Column>, rowObj.changes);
        td.classList.add('e-updatedtd');
        this.parent.notify(events.toolbarRefresh, {});
    }

    public saveCell(isForceSave?: boolean): void {
        let gObj: IGrid = this.parent;
        if (!isForceSave && (!gObj.isEdit || (this.formObj && !this.formObj.validate()))) {
            return;
        }
        let tr: Element = parentsUntil(this.form, 'e-row');
        let column: Column = this.cellDetails.column;
        let editedData: Object = gObj.editModule.getCurrentEditedData(this.form, {});
        editedData = extend(this.cellDetails.rowData, editedData);
        let args: CellSaveArgs = {
            columnName: column.field,
            value: editedData[column.field],
            rowData: this.cellDetails.rowData,
            previousValue: this.cellDetails.value,
            columnObject: column,
            cell: this.form.parentElement,
            isForeignKey: this.cellDetails.isForeignKey, cancel: false
        };
        if (!isForceSave) {
            gObj.trigger(events.cellSave, args);
        }
        if (args.cancel) {
            return;
        }
        gObj.editModule.destroyWidgets([column]);
        if (this.formObj) {
            this.formObj.destroy();
        }
        this.parent.notify(events.tooltipDestroy, {});
        this.refreshTD(args.cell, column, gObj.getRowObjectFromUID(tr.getAttribute('data-uid')), args.value);
        classList(tr, [], ['e-editedrow', 'e-batchrow']);
        args.cell.classList.remove('e-editedbatchcell');
        gObj.isEdit = false;
        if (!isNullOrUndefined(args.value) && args.value.toString() ===
            (!isNullOrUndefined(this.cellDetails.value) ? this.cellDetails.value : '').toString() && !this.isColored) {
            args.cell.classList.remove('e-updatedtd');
        }
        gObj.notify(events.toolbarRefresh, {});
        this.isColored = false;
    }

    protected getDataByIndex(index: number): Object {
        let row: Row<Column> = this.parent.getRowObjectFromUID(this.parent.getDataRows()[index].getAttribute('data-uid'));
        return row.changes ? row.changes : row.data;
    }

    private applyFormValidation(col: Column): void {
        let rules: Object = {};
        if (col.validationRules && this.form.querySelectorAll('#' + this.parent.element.id + col.field).length) {
            rules[col.field] = col.validationRules;
            this.formObj = new FormValidator(this.form as HTMLFormElement, {
                rules: rules as { [name: string]: { [rule: string]: Object } },
                validationComplete: this.valComplete.bind(this),
                customPlacement: this.customPlacement.bind(this)
            });
        }
    }

    private valComplete(args: { status: string, inputName: string, element: HTMLElement }): void {
        let edit: { validationComplete: Function } | Object = (this.parent.editModule as Object);
        (edit as { validationComplete: Function }).validationComplete(args);
    }


    private customPlacement(inputElement: HTMLElement, error: HTMLElement): void {
        let edit: { valErrorPlacement: Function } | Object = (this.parent.editModule as Object);
        (edit as { valErrorPlacement: Function }).valErrorPlacement(inputElement, error);
    }
}

/**
 * @hidden
 */
interface IGridEx extends IGrid {
    contentModule: { getRows: Function };
}