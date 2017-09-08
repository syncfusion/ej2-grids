import { extend } from '@syncfusion/ej2-base';
import { remove, classList } from '@syncfusion/ej2-base';
import { FormValidator } from '@syncfusion/ej2-base';
import { IGrid, NotifyArgs, BeginEditArgs } from '../base/interface';
import { parentsUntil } from '../base/util';
import * as events from '../base/constant';
import { EditRender } from '../renderer/edit-renderer';
import { RowRenderer } from '../renderer/row-renderer';
import { Row } from '../models/row';
import { ServiceLocator } from '../services/service-locator';
import { Column } from '../models/column';
import { InlineEdit } from './inline-edit';
import { ReturnType } from '../base/type';


/**
 * `NormalEdit` module is used to handle normal('inline, dialog, external') editing actions.
 * @hidden
 */
export class NormalEdit {
    protected edit: InlineEdit;
    protected parent: IGrid;
    protected serviceLocator: ServiceLocator;
    protected renderer: EditRender;
    public formObj: FormValidator;
    protected previousData: Object;
    private lastSelIndex: number;
    private uid: string;
    private args: { data?: Object, requestType: string, previousData: Object, selectedRow: Number, type: string };

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, renderer?: EditRender) {
        this.parent = parent;
        this.renderer = renderer;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    protected clickHandler(e: MouseEvent): void {
        let gObj: IGrid = this.parent;
        if (parentsUntil(e.target as Element, 'e-gridcontent')) {
            if (this.parent.isEdit) {
                gObj.editModule.endEdit();
            }
        }
    }

    protected dblClickHandler(e: MouseEvent): void {
        let target: Element = e.target as Element;
        if (parentsUntil(target, 'e-grid').id !== this.parent.element.id || !this.parent.editSettings.allowEditOnDblClick) {
            return;
        }
        if (parentsUntil(target, 'e-rowcell')) {
            this.parent.editModule.startEdit(parentsUntil(target, 'e-row') as HTMLTableRowElement);
        }
    }

    /**
     * The function used to trigger editComplete
     * @return {void}
     * @hidden
     */
    public editComplete(e: NotifyArgs): void {
        this.parent.selectRow(e.requestType as string === 'delete' ? this.lastSelIndex : 0);
        if (e.requestType as string === 'delete') {
            this.parent.trigger(events.actionComplete, extend(e, {
                requestType: 'delete',
                type: events.actionComplete
            }));
        }
        this.parent.element.focus();
    }

    protected startEdit(tr: Element): void {
        let gObj: IGrid = this.parent;
        let primaryKeys: string[] = gObj.getPrimaryKeyFieldNames();
        let primaryKeyValues: string[] = [];
        let rowIndex: number = parseInt(tr.getAttribute('aria-rowindex'), 10);
        this.previousData = gObj.getCurrentViewRecords()[rowIndex];
        gObj.isEdit = true;
        for (let i: number = 0; i < primaryKeys.length; i++) {
            primaryKeyValues.push(this.previousData[primaryKeys[i]]);
        }
        let args: BeginEditArgs = {
            row: tr, primaryKey: primaryKeys, primaryKeyValue: primaryKeyValues,
            rowData: this.previousData, rowIndex: rowIndex, type: 'edit', cancel: false
        };
        gObj.trigger(events.beginEdit, args);
        if (args.cancel) {
            return;
        }
        this.renderer.update(args);
        this.uid = tr.getAttribute('data-uid');
        this.applyFormValidation();
    }

    protected endEdit(): void {
        let gObj: IGrid = this.parent;
        if (!this.parent.isEdit || !this.formObj.validate()) {
            return;
        }
        let formElement: Element = gObj.element.querySelector('.e-gridform');
        let editedData: Object = extend({}, this.previousData);
        editedData = gObj.editModule.getCurrentEditedData(formElement, editedData);
        gObj.editModule.destroyWidgets();
        if (gObj.element.querySelectorAll('.e-editedrow').length) {
            let args: { data?: Object, requestType: string, previousData: Object, selectedRow: Number, type: string } = {
                requestType: 'save', type: events.actionBegin, data: editedData,
                previousData: this.previousData, selectedRow: gObj.selectedRowIndex
            };
            gObj.trigger(events.actionBegin, args);
            gObj.notify(events.updateData, { requestType: 'save', data: editedData });
        } else {
            gObj.notify(events.modelChanged, {
                requestType: 'add', type: events.actionComplete, data: editedData,
                previousData: this.previousData, selectedRow: gObj.selectedRowIndex
            });
        }
        this.parent.notify(events.tooltipDestroy, {});
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
    }

    private editFailure(e: ReturnType): void {
        this.parent.trigger(events.actionFailure, e);
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
        if (this.parent.isEdit) {
            let gObj: IGrid = this.parent;
            this.parent.editModule.destroyWidgets();
            this.parent.notify(events.tooltipDestroy, {});
            this.stopEditStatus();
            let args: { data: Object, requestType: string, selectedRow: Number, type: string } = {
                requestType: 'cancel', type: events.actionBegin, data: this.previousData, selectedRow: gObj.selectedRowIndex
            };
            gObj.trigger(events.actionBegin, args);
            args.type = events.actionComplete;
            this.refreshRow(args.data);
            gObj.trigger(events.actionComplete, args);
            this.parent.notify(events.toolbarRefresh, {});
        }
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
        gObj.clearSelection();
        let addData: Object = {};
        for (let col of gObj.columns as Column[]) {
            addData[col.field] = data && data[col.field] ? data[col.field] : col.defaultValue;
        }
        let args: { cancel: boolean, requestType: string, rowData: Object, type: string } = {
            cancel: false,
            requestType: 'add', rowData: addData, type: events.actionComplete
        };
        gObj.trigger(events.actionBegin, args);
        if (args.cancel) {
            return;
        }
        this.renderer.addNew({ rowData: args.rowData, type: 'add' });
        this.applyFormValidation();
        gObj.isEdit = true;
    }

    protected deleteRecord(fieldname?: string, data?: Object): void {
        this.lastSelIndex = this.parent.selectedRowIndex;
        this.parent.notify(events.modelChanged, {
            requestType: 'delete', type: events.actionBegin, foreignKeyData: fieldname ?
                [fieldname] : this.parent.getPrimaryKeyFieldNames(),
            data: data ? [data] : this.parent.getSelectedRecords(), tr: this.parent.getSelectedRows[0]
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
        this.formObj.destroy();
    }

    private destroyForm(): void {
        if (this.formObj && !this.formObj.isDestroyed) {
            this.parent.notify(events.tooltipDestroy, {});
            this.formObj.destroy();
            this.parent.notify(events.tooltipDestroy, {});
        }
    }

    protected applyFormValidation(): void {
        let gObj: IGrid = this.parent;
        let form: HTMLFormElement = gObj.element.querySelector('.e-gridform') as HTMLFormElement;
        let rules: Object = {};
        for (let col of gObj.columns as Column[]) {
            if (col.validationRules && form.querySelectorAll('#' + gObj.element.id + col.field).length) {
                rules[col.field] = col.validationRules;
            }
        }
        this.formObj = new FormValidator(form, {
            rules: rules as { [name: string]: { [rule: string]: Object } },
            validationComplete: (args: { status: string, inputName: string, element: HTMLElement }) => {
                let edit: { validationComplete: Function } | Object = (this.parent.editModule as Object);
                (edit as { validationComplete: Function }).validationComplete(args);
            },
            customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                let edit: { valErrorPlacement: Function } | Object = (this.parent.editModule as Object);
                (edit as { valErrorPlacement: Function }).valErrorPlacement(inputElement, error);
            }
        });
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.dblclick, this.dblClickHandler, this);
        this.parent.on(events.deleteComplete, this.editComplete, this);
        this.parent.on(events.addComplete, this.editComplete, this);
        this.parent.on(events.actionComplete, this.editComplete, this);
        this.parent.on(events.crudAction, this.editHandler, this);
        this.parent.on(events.destroyForm, this.destroyForm, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.dblclick, this.dblClickHandler);
        this.parent.off(events.deleteComplete, this.editComplete);
        this.parent.off(events.addComplete, this.editComplete);
        this.parent.off(events.crudAction, this.editHandler);
        this.parent.off(events.destroyForm, this.destroyForm);
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