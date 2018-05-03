
import { extend } from '@syncfusion/ej2-base';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, EJ2Intance, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { isEditable } from '../base/util';

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
        let isComplexField: boolean = !isNullOrUndefined(args.column.field) && args.column.field.split('.').length > 1;
        let splits: string[] = !isNullOrUndefined(args.column.field) && args.column.field.split('.');
        return createElement('input', {
            className: 'e-field', attrs: {
                /* tslint:disable-next-line:no-any */
                id: isComplexField ? this.parent.element.id + splits[0] + splits[1] : this.parent.element.id + args.column.field,
                name: isComplexField ? splits[0] + splits[1] : args.column.field, 'e-mappinguid': args.column.uid
            }
        });
    }

    public read(element: Element): number {
        (element as HTMLElement).blur();
        return (<EJ2Intance>element).ej2_instances[0].value;
    }

    public write(args: { rowData: Object, element: Element, column: Column, requestType: string }): void {
        let col: Column = args.column;
        let isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        let isComplexField: boolean = !isNullOrUndefined(args.column.field) && args.column.field.split('.').length > 1;
        let splits: string[] = !isNullOrUndefined(args.column.field) && args.column.field.split('.');
        this.obj = new NumericTextBox(extend(
            {
                value: isComplexField ? parseFloat(args.rowData[splits[0]][splits[1]]) : parseFloat(args.rowData[col.field]),
                enableRtl: this.parent.enableRtl,
                placeholder: isInline ? '' : args.column.headerText,
                enabled: isEditable(args.column, args.requestType, args.element),
                floatLabelType: this.parent.editSettings.mode !== 'Dialog' ? 'Never' : 'Always',
            },
            col.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
        args.element.setAttribute('name', isComplexField ? splits[0] + splits[1] : args.column.field);
    }

    public destroy(): void {
        if (this.obj && !this.obj.isDestroyed) {
            this.obj.destroy();
        }
    }
}