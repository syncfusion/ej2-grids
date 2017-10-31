import { extend, KeyboardEventArgs, addClass, removeClass } from '@syncfusion/ej2-base';
import { remove, classList, createElement } from '@syncfusion/ej2-base';
import { FormValidator } from '@syncfusion/ej2-inputs';
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
        this.parent.removeEventListener(events.dataBound, this.dataBound.bind(this));
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
            if (parentsUntil(e.target as HTMLElement, 'e-rowcell') && !this.parent.isEdit) {
                this.setCellIdx(e.target as HTMLTableCellElement);
            }
        }
    }

    protected dblClickHandler(e: MouseEvent): void {
        let target: Element = e.target as Element;
        let tr: Element = parentsUntil(e.target as Element, 'e-row');
        if ((parentsUntil(target, 'e-rowcell')) && tr) {
            this.editCell(
                parseInt(tr.getAttribute('aria-rowindex'), 10),
                (this.parent.columns[parseInt(parentsUntil(target, 'e-rowcell').getAttribute('aria-colindex'), 10)] as Column).field);
        }
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        let isEdit: boolean = this.parent.isEdit;
        let actions: string[] = ['tab', 'shiftTab', 'enter', 'f2'];
        if (!document.querySelectorAll('.e-popup-open').length && actions.indexOf(e.action) > -1) {
            this.saveCell();
            isEdit = isEdit && !this.validateFormObj();
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
        this.reFocusOnError(e);
    }

    private reFocusOnError(e: KeyboardEventArgs): void {
        if (this.validateFormObj() && (e.action === 'tab' || e.action === 'shiftTab')) {
            (e.target as HTMLElement).focus();
            e.preventDefault();
        }
    }

    private isAddRow(index: number): boolean {
        return this.parent.getDataRows()[index].classList.contains('e-insertedrow');
    }

    private editNextCell(): void {
        let oldIdx: number = this.cellDetails.cellIndex;
        let oldRowIdx: number = this.cellDetails.rowIndex;
        let cellIdx: number = this.findNextEditableCell(this.cellDetails.cellIndex + 1, this.isAddRow(this.cellDetails.rowIndex));
        let tr: HTMLTableRowElement = this.parent.getDataRows()[this.cellDetails.rowIndex] as HTMLTableRowElement;
        let cellIndex: number = this.getColIndex([].slice.apply(tr.cells), cellIdx);
        if (cellIndex === -1 && cellIdx > -1) {
            this.cellDetails.cellIndex = cellIdx;
            this.editNextCell();
        } else if (cellIdx > -1 && cellIndex < tr.cells.length && cellIndex > -1) {
            this.cellDetails.cellIndex = cellIdx;
        } else if (this.cellDetails.rowIndex + 1 < this.parent.getDataRows().length) {
            this.cellDetails.rowIndex++;
            this.cellDetails.cellIndex = this.findNextEditableCell(0, this.isAddRow(this.cellDetails.rowIndex));
            let row: HTMLTableRowElement = this.parent.getDataRows()[this.cellDetails.rowIndex] as HTMLTableRowElement;
            if (this.getColIndex([].slice.apply(row.cells), this.cellDetails.cellIndex) === -1) {
                this.editNextCell();
            }
        }
        if (oldIdx !== this.cellDetails.cellIndex || oldRowIdx !== this.cellDetails.rowIndex) {
            this.editCellFromIndex(this.cellDetails.rowIndex, this.cellDetails.cellIndex);
        }
    }

    private editPrevCell(): void {
        let oldIdx: number = this.cellDetails.cellIndex;
        let oldRowIdx: number = this.cellDetails.rowIndex;
        let cellIdx: number = this.findPrevEditableCell(this.cellDetails.cellIndex - 1, this.isAddRow(this.cellDetails.rowIndex));
        let tr: HTMLTableRowElement = this.parent.getDataRows()[this.cellDetails.rowIndex] as HTMLTableRowElement;
        if (cellIdx > -1 && this.getColIndex([].slice.apply(tr.cells), cellIdx) === -1) {
            this.cellDetails.cellIndex = cellIdx;
            this.editPrevCell();
        } else if (cellIdx > -1) {
            this.cellDetails.cellIndex = cellIdx;
        } else if (this.cellDetails.rowIndex - 1 > -1) {
            this.cellDetails.rowIndex--;
            let tr: HTMLTableRowElement = this.parent.getDataRows()[this.cellDetails.rowIndex] as HTMLTableRowElement;
            this.cellDetails.cellIndex = this.findPrevEditableCell(
                this.parent.columns.length - 1, this.isAddRow(this.cellDetails.rowIndex));
            if (this.cellDetails.cellIndex >= tr.cells.length) {
                let index: number = parseInt(tr.cells[tr.cells.length - 1].getAttribute('aria-colindex'), 10);
                if (this.checkNPCell(this.parent.getColumns()[index])) {
                    this.cellDetails.cellIndex = index;
                } else {
                    this.cellDetails.cellIndex = this.findPrevEditableCell(index, this.isAddRow(this.cellDetails.rowIndex));
                }
            }
        }
        if (oldIdx !== this.cellDetails.cellIndex || oldRowIdx !== this.cellDetails.rowIndex) {
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
        let rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
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
        if (this.parent.isEdit && this.validateFormObj()) {
            return;
        }
        this.batchSave();
    }

    private validateFormObj(): boolean {
        return this.parent.editModule.formObj && !this.parent.editModule.formObj.validate();
    }

    public batchSave(): void {
        let gObj: IGrid = this.parent;
        this.saveCell();
        if (gObj.isEdit) {
            return;
        }
        let changes: Object = this.getBatchChanges();
        let args: BeforeBatchSaveArgs = { batchChanges: changes, cancel: false };
        gObj.trigger(events.beforeBatchSave, args);
        if (args.cancel) {
            return;
        }
        gObj.showSpinner();
        gObj.notify(events.bulkSave, { changes: changes });
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
        gObj.element.focus();
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
        let row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this.parent);
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
            } else if (isAdd && !cols[i].template && cols[i].visible && cols[i].allowEditing) {
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
            } else if (isAdd && !cols[i].template && cols[i].visible && cols[i].allowEditing) {
                return i;
            }
        }
        return -1;
    }

    private checkNPCell(col: Column): boolean {
        return !col.template && col.visible && !col.isPrimaryKey && !col.isIdentity && col.allowEditing;
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
            let cells: Element[] = [].slice.apply((row as HTMLTableRowElement).cells);
            let args: CellEditArgs = {
                cell: cells[this.getColIndex(cells, this.getCellIdx(col.uid))], row: row,
                columnName: col.field, columnObject: col, isForeignKey: !isNullOrUndefined(col.foreignKeyValue),
                primaryKey: keys, rowData: rowData,
                validationRules: extend({}, col.validationRules ? col.validationRules : {}),
                value: rowData[col.field], type: !isAdd ? 'edit' : 'add', cancel: false
            };
            if (!args.cell) { return; }
            gObj.trigger(events.cellEdit, args);
            if (args.cancel) {
                return;
            }
            this.cellDetails = {
                rowData: rowData, column: col, value: args.value, isForeignKey: args.isForeignKey, rowIndex: index,
                cellIndex: parseInt((args.cell as HTMLTableCellElement).getAttribute('aria-colindex'), 10)
            };
            if (args.cell.classList.contains('e-updatedtd')) {
                this.isColored = true;
                args.cell.classList.remove('e-updatedtd');
            }
            gObj.clearSelection();
            gObj.selectRow(this.cellDetails.rowIndex);
            gObj.isEdit = true;
            this.renderer.update(args);
            this.form = gObj.element.querySelector('#' + gObj.element.id + 'EditForm');
            gObj.editModule.applyFormValidation([col]);
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
        let cell: CellRenderer = new CellRenderer(this.parent, this.serviceLocator);
        this.setChanges(rowObj, column.field, value);
        cell.refreshTD(td, rowObj.cells[this.getCellIdx(column.uid)] as Cell<Column>, rowObj.changes);
        td.classList.add('e-updatedtd');
        this.parent.notify(events.toolbarRefresh, {});
    }

    private getColIndex(cells: Element[], index: number): number {
        for (let m: number = 0; m < cells.length; m++) {
            let colIndex: number = parseInt(cells[m].getAttribute('aria-colindex'), 10);
            if (colIndex === index) {
                return m;
            }
        }
        return -1;
    }

    public saveCell(isForceSave?: boolean): void {
        let gObj: IGrid = this.parent;
        if (!isForceSave && (!gObj.isEdit || this.validateFormObj())) {
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
        gObj.editModule.destroyForm();
        gObj.editModule.destroyWidgets([column]);
        this.parent.notify(events.tooltipDestroy, {});
        this.refreshTD(args.cell, column, gObj.getRowObjectFromUID(tr.getAttribute('data-uid')), args.value);
        removeClass([tr], ['e-editedrow', 'e-batchrow']);
        removeClass([args.cell], ['e-editedbatchcell', 'e-boolcell']);
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
}

/**
 * @hidden
 */
interface IGridEx extends IGrid {
    contentModule: { getRows: Function };
}