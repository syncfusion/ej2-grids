import { extend } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { IEditCell, IGrid, EJ2Intance } from '../base/interface';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { isEditable } from '../base/util';

/**
 * `DatePickerEditCell` is used to handle datepicker cell type editing.
 * @hidden
 */
export class DatePickerEditCell implements IEditCell {
    private parent: IGrid;
    private obj: DatePicker;
    constructor(parent?: IGrid) {
        this.parent = parent;
    }
    public create(args: { column: Column, value: string, type: string }): Element {
        return createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + args.column.field, name: args.column.field, type: 'text', 'e-mappinguid': args.column.uid
            }
        });
    }
    public read(element: Element): string | Date {
        return (<EJ2Intance>element).ej2_instances[0].value;
    }
    public write(args: { rowData: Object, element: Element, column: Column, type: string }): void {
        let isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        this.obj = new DatePicker(
            extend(
                {
                    floatLabelType: isInline ? 'Never' : 'Always',
                    value: new Date(args.rowData[args.column.field]), placeholder: isInline ?
                        '' : args.column.headerText, enableRtl: this.parent.enableRtl,
                    enabled: isEditable(args.column, args.type, args.element),
                },
                args.column.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
    }

    public destroy(): void {
        if (this.obj) {
            this.obj.destroy();
        }
    }
}