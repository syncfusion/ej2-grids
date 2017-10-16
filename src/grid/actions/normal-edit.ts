import { extend } from '@syncfusion/ej2-base';
import { remove, classList } from '@syncfusion/ej2-base';
import { IGrid, NotifyArgs, EditEventArgs, AddEventArgs, SaveEventArgs } from '../base/interface';
import { parentsUntil } from '../base/util';
import * as events from '../base/constant';
import { EditRender } from '../renderer/edit-renderer';
import { RowRenderer } from '../renderer/row-renderer';
import { Row } from '../models/row';
import { ServiceLocator } from '../services/service-locator';
import { Column } from '../models/column';
import { ReturnType } from '../base/type';
import { FormValidator } from '@syncfusion/ej2-inputs';

/**
 * `NormalEdit` module is used to handle normal('inline, dialog, external') editing actions.
 * @hidden
 */
export class NormalEdit {
    protected parent: IGrid;
    protected serviceLocator: ServiceLocator;
    protected renderer: EditRender;
    public formObj: FormValidator;
    protected previousData: Object;
    private editRowIndex: number;
    private rowIndex: number;
    private uid: string;
    private args: { data?: Object, requestType: string, previousData: Object, selectedRow: Number, type: string };

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, renderer?: EditRender) {
        this.parent = parent;
        this.renderer = renderer;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    protected clickHandler(e: MouseEvent): void {
        let target: Element = e.target as Element;
        let gObj: IGrid = this.parent;
        if (parentsUntil(target, 'e-gridcontent')) {
            this.rowIndex = parentsUntil(target, 'e-rowcell') ? parseInt(target.parentElement.getAttribute('aria-rowindex'), 10) : -1;
            if (gObj.isEdit) {
                gObj.editModule.endEdit();
            }
        }
    }

    protected dblClickHandler(e: MouseEvent): void {
        if (parentsUntil(e.target as Element, 'e-rowcell') && this.parent.editSettings.allowEditOnDblClick) {
            this.parent.editModule.startEdit(parentsUntil(e.target as Element, 'e-row') as HTMLTableRowElement);
        }
    }

    /**
     * The function used to trigger editComplete
     * @return {void}
     * @hidden
     */
    public editComplete(e: NotifyArgs): void {
        switch (e.requestType as string) {
            case 'save':
                this.parent.selectRow(0);
                this.parent.trigger(events.actionComplete, extend(e, {
                    requestType: 'save',
                    type: events.actionComplete
                }));
                break;
            case 'delete':
                this.parent.selectRow(this.editRowIndex);
                this.parent.trigger(events.actionComplete, extend(e, {
                    requestType: 'delete',
                    type: events.actionComplete
                }));
                break;
        }
        this.parent.element.focus();
    }

    protected startEdit(tr: Element): void {
        let gObj: IGrid = this.parent;
        let primaryKeys: string[] = gObj.getPrimaryKeyFieldNames();
        let primaryKeyValues: string[] = [];
        this.rowIndex = this.editRowIndex = parseInt(tr.getAttribute('aria-rowindex'), 10);
        this.previousData = gObj.getCurrentViewRecords()[this.rowIndex];
        for (let i: number = 0; i < primaryKeys.length; i++) {
            primaryKeyValues.push(this.previousData[primaryKeys[i]]);
        }
        let args: EditEventArgs = {
            row: tr, primaryKey: primaryKeys, primaryKeyValue: primaryKeyValues, requestType: 'beginEdit',
            rowData: this.previousData, rowIndex: this.rowIndex, type: 'edit', cancel: false
        };
        gObj.trigger(events.beginEdit, args);
        args.type = 'actionBegin';
        gObj.trigger(events.actionBegin, args);
        if (args.cancel) {
            return;
        }
        gObj.clearSelection();
        gObj.isEdit = true;
        this.renderer.update(args);
        this.uid = tr.getAttribute('data-uid');
        gObj.editModule.applyFormValidation();
        args.type = 'actionComplete';
        gObj.trigger(events.actionComplete, args);
    }

    protected endEdit(): void {
        let gObj: IGrid = this.parent;
        if (!this.parent.isEdit || !gObj.editModule.formObj.validate()) {
            return;
        }
        let editedData: Object = extend({}, this.previousData);
        let args: SaveEventArgs = {
            requestType: 'save', type: events.actionBegin, data: editedData, cancel: false,
            previousData: this.previousData, selectedRow: gObj.selectedRowIndex, foreignKeyData: {}
        };
        editedData = gObj.editModule.getCurrentEditedData(gObj.element.querySelector('.e-gridform'), editedData);
        if (gObj.element.querySelectorAll('.e-editedrow').length) {
            args.action = 'edit';
            gObj.trigger(events.actionBegin, args);
            if (args.cancel) {
                return;
            }
            gObj.notify(events.updateData, args);
        } else {
            args.action = 'add';
            args.selectedRow = 0;
            gObj.notify(events.modelChanged, args);
            if (args.cancel) {
                return;
            }
        }
        this.parent.notify(events.dialogDestroy, {});
        this.stopEditStatus();
    }

    private editHandler(args: EditArgs): void {
        if (args.promise) {
            args.promise.then((e: ReturnType) => this.edSucc(e, args)).catch((e: ReturnType) => this.edFail(e));
        } else {
            this.editSuccess({} as ReturnType, args);
        }
    }

    private edSucc(e: ReturnType, args: EditArgs): void {
        this.editSuccess(e, args);
    }

    private edFail(e: ReturnType): void {
        this.editFailure(e);
    }


    private editSuccess(e: ReturnType, args: EditArgs): void {
        if (e.result) {
            this.parent.trigger(events.beforeDataBound, e);
            args.data = e.result;
        } else {
            this.parent.trigger(events.beforeDataBound, args);
        }
        args.type = events.actionComplete;
        this.refreshRow(args.data);
        this.parent.trigger(events.actionComplete, args);
        this.parent.selectRow(this.rowIndex > -1 ? this.rowIndex : this.editRowIndex);
        this.parent.element.focus();
        this.parent.hideSpinner();
    }

    private editFailure(e: ReturnType): void {
        this.parent.trigger(events.actionFailure, e);
        this.parent.hideSpinner();
    }

    private refreshRow(data: Object): void {
        let row: RowRenderer<Column> = new RowRenderer(this.serviceLocator, null, this.parent);
        let rowObj: Row<Column> = this.parent.getRowObjectFromUID(this.uid);
        if (rowObj) {
            rowObj.changes = data;
            row.refresh(rowObj, this.parent.columns as Column[], true);
        }
    }

    protected closeEdit(): void {
        let gObj: IGrid = this.parent;
        let args: { data: Object, requestType: string, selectedRow: Number, type: string } = {
            requestType: 'cancel', type: events.actionBegin, data: this.previousData, selectedRow: gObj.selectedRowIndex
        };
        gObj.trigger(events.actionBegin, args);
        this.stopEditStatus();
        args.type = events.actionComplete;
        if (gObj.editSettings.mode !== 'dialog') {
            this.refreshRow(args.data);
        }
        gObj.selectRow(this.rowIndex);
        gObj.element.focus();
        gObj.trigger(events.actionComplete, args);
    }

    protected addRecord(data?: Object): void {
        let gObj: IGrid = this.parent;
        if (gObj.isEdit) {
            return;
        }
        if (data) {
            gObj.notify(events.modelChanged, {
                requestType: 'add', type: events.actionBegin, data: data
            });
            return;
        }
        this.previousData = {};
        this.uid = '';
        for (let col of gObj.columns as Column[]) {
            this.previousData[col.field] = data && data[col.field] ? data[col.field] : col.defaultValue;
        }
        let args: AddEventArgs = {
            cancel: false, foreignKeyData: {}, //foreign key support
            requestType: 'add', data: this.previousData, type: events.actionBegin
        };
        gObj.trigger(events.actionBegin, args);
        if (args.cancel) {
            return;
        }
        gObj.clearSelection();
        gObj.isEdit = true;
        this.renderer.addNew({ rowData: args.data, requestType: 'add' });
        gObj.editModule.applyFormValidation();
        args.type = events.actionComplete;
        args.row = gObj.element.querySelector('.e-addedrow');
        gObj.trigger(events.actionComplete, args);
    }

    protected deleteRecord(fieldname?: string, data?: Object): void {
        this.editRowIndex = this.parent.selectedRowIndex;
        this.parent.notify(events.modelChanged, {
            requestType: 'delete', type: events.actionBegin, foreignKeyData: {}, //foreign key support
            data: data ? [data] : this.parent.getSelectedRecords(), tr: this.parent.getSelectedRows(), cancel: false
        });
    }

    private stopEditStatus(): void {
        let gObj: IGrid = this.parent;
        gObj.isEdit = false;
        let elem: Element = gObj.element.querySelector('.e-addedrow');
        if (elem) {
            remove(elem);
        }
        elem = gObj.element.querySelector('.e-editedrow');
        if (elem) {
            elem.classList.remove('e-editedrow');
        }
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.crudAction, this.editHandler, this);
        this.parent.on(events.doubleTap, this.dblClickHandler, this);
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.dblclick, this.dblClickHandler, this);
        this.parent.on(events.deleteComplete, this.editComplete, this);
        this.parent.on(events.saveComplete, this.editComplete, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.crudAction, this.editHandler);
        this.parent.off(events.doubleTap, this.dblClickHandler);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.dblclick, this.dblClickHandler);
        this.parent.off(events.deleteComplete, this.editComplete);
        this.parent.off(events.saveComplete, this.editComplete);
    }

    /**
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
    }
}

interface EditArgs {
    data?: Object;
    requestType?: string;
    previousData?: Object;
    selectedRow?: Number;
    type?: string;
    promise?: Promise<Object>;
}