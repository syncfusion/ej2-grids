
import { extend } from '@syncfusion/ej2-base';
import { IGrid, EJ2Intance, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { isEditable, isComplexField, getComplexFieldID, getComplexValue } from '../base/util';

/**
 * `NumericEditCell` is used to handle numeric cell type editing.
 * @hidden
 */
export class NumericEditCell implements IEditCell {

    private parent: IGrid;
    private obj: NumericTextBox;

    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public create(args: { column: Column, value: string }): Element {
        /* tslint:disable-next-line:no-any */
        let isComplex: boolean = isComplexField(args.column.field);
        let complexFieldName: string = getComplexFieldID(args.column.field);
        return this.parent.createElement('input', {
            className: 'e-field', attrs: {
                /* tslint:disable-next-line:no-any */
                id: isComplex ? this.parent.element.id + complexFieldName : this.parent.element.id + args.column.field,
                name: isComplex ? complexFieldName : args.column.field, 'e-mappinguid': args.column.uid
            }
        });
    }

    public read(element: Element): number {
        (element as HTMLElement).blur();
        return (<EJ2Intance>element).ej2_instances[0].value;
    }

    public write(args: { rowData: Object, element: Element, column: Column, row: HTMLElement, requestType: string }): void {
        let col: Column = args.column;
        let isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        let isComplex: boolean = isComplexField(args.column.field);
        let complexFieldName: string = getComplexFieldID(args.column.field);
        let isAddRow: boolean = args.requestType === 'add' || args.row.classList.contains('e-addedrow');
        this.obj = new NumericTextBox(extend(
            {
                value: isComplex && !isAddRow ?
                    parseFloat(getComplexValue(args.rowData, args.column.field)) : parseFloat(args.rowData[col.field]),
                enableRtl: this.parent.enableRtl,
                placeholder: isInline ? '' : args.column.headerText,
                enabled: isEditable(args.column, args.requestType, args.element),
                floatLabelType: this.parent.editSettings.mode !== 'Dialog' ? 'Never' : 'Always',
            },
            col.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
        args.element.setAttribute('name', isComplex ? complexFieldName : args.column.field);
    }

    public destroy(): void {
        if (this.obj && !this.obj.isDestroyed) {
            this.obj.destroy();
        }
    }
}