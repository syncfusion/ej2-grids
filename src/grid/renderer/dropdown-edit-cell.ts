import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { IGrid, EJ2Intance, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Query, DataManager, DataUtil } from '@syncfusion/ej2-data';
import { isEditable } from '../base/util';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { parentsUntil } from '../base/util';

/**
 * `DropDownEditCell` is used to handle dropdown cell type editing.
 * @hidden
 */
export class DropDownEditCell implements IEditCell {

    private parent: IGrid;
    private obj: DropDownList;
    private column: Column;
    constructor(parent?: IGrid) {
        //constructor
        this.parent = parent;
    }

    public create(args: { column: Column, value: string }): Element {
        /* tslint:disable-next-line:no-any */
        let splits: string[] = !isNullOrUndefined(args.column.field) && args.column.field.split('.');
        /* tslint:disable-next-line:no-any */
        let isComplexField: boolean = !isNullOrUndefined(args.column.field) && args.column.field.split('.').length > 1;
        return createElement('input', {
            className: 'e-field', attrs: {
                /* tslint:disable-next-line:no-any */
                id: isComplexField ? this.parent.element.id + splits[0] + splits[1] : this.parent.element.id + args.column.field,
                /* tslint:disable-next-line:no-any */
                name: isComplexField ? splits[0] + splits[1] : args.column.field, type: 'text', 'e-mappinguid': args.column.uid,

            }
        });
    }

    public write(args: { rowData: Object, element: Element, column: Column, requestType: string }): void {
        this.column = args.column;
        let isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        /* tslint:disable-next-line:no-any */
        let isComplexField: boolean = !isNullOrUndefined(args.column.field) && args.column.field.split('.').length > 1;
        let splits: string[] = !isNullOrUndefined(args.column.field) && args.column.field.split('.');
        this.obj = new DropDownList(extend(
            {
                dataSource: this.parent.dataSource instanceof DataManager ?
                    this.parent.dataSource : new DataManager(this.parent.dataSource),
                query: new Query().select(args.column.field), enabled: isEditable(args.column, args.requestType, args.element),
                fields: { value: args.column.field },
                value: isComplexField ? args.rowData[splits[0]][splits[1]] : args.rowData[args.column.field],
                enableRtl: this.parent.enableRtl, actionComplete: this.ddActionComplete.bind(this),
                placeholder: isInline ? '' : args.column.headerText, popupHeight: '200px',
                floatLabelType: isInline ? 'Never' : 'Always', open: this.dropDownOpen.bind(this),
                sortOrder: 'Ascending'
            },
            args.column.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
        /* tslint:disable-next-line:no-any */
        args.element.setAttribute('name', isComplexField ? splits[0] + splits[1] : args.column.field);
    }

    public read(element: Element): string {
        return (<EJ2Intance>element).ej2_instances[0].value;
    }

    private ddActionComplete(e: { result: Object[] }): void {
        e.result = DataUtil.distinct(e.result, this.column.isForeignColumn() ? this.column.foreignKeyField : this.column.field, true);
        if ((<DataManager>this.column.dataSource)) {
            (<DataManager>this.column.dataSource).dataSource.json = e.result;
        }
    }

    private dropDownOpen(args: { popup: Popup }): void {
        let dlgElement: Element = parentsUntil(this.obj.element, 'e-dialog');
        if (!isNullOrUndefined(dlgElement)) {
            let dlgObj: Dialog = (<EJ2Intance>this.parent.element.querySelector('#' + dlgElement.id)).ej2_instances[0];
            args.popup.element.style.zIndex = (dlgObj.zIndex + 1).toString();
        }
    }

    public destroy(): void {
        if (this.obj) {
            this.obj.destroy();
        }
    }

}