import { extend } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { IEditCell, IGrid, EJ2Intance } from '../base/interface';
import { DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';
import { isEditable, isComplexField, getComplexFieldID, getObject } from '../base/util';

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
        /* tslint:disable-next-line:no-any */
        let complexFieldName: string = getComplexFieldID(args.column.field);
        return this.parent.createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + complexFieldName,
                name: complexFieldName, type: 'text', 'e-mappinguid': args.column.uid
            }
        });
    }
    public read(element: Element): string | Date {
        return (<EJ2Intance>element).ej2_instances[0].value;
    }
    public write(args: { rowData: Object, element: Element, column: Column, type: string, row: HTMLElement, requestType: string }): void {
        let isInline: boolean = this.parent.editSettings.mode !== 'Dialog';
        /* tslint:disable-next-line:no-any */
        let isComplex: boolean = isComplexField(args.column.field);
        let isAddRow: boolean = args.requestType === 'add' || args.row.classList.contains('e-addedrow');
        let value: Date = getObject(args.column.field, args.rowData);
        value = value ? new Date(value) : null;
        if (args.column.editType === 'datepickeredit') {
            this.obj = new DatePicker(
                extend(
                    {
                        floatLabelType: isInline ? 'Never' : 'Always',
                        value: value,
                        placeholder: isInline ?
                            '' : args.column.headerText, enableRtl: this.parent.enableRtl,
                        enabled: isEditable(args.column, args.type, args.element),
                    },
                    args.column.edit.params));

        } else if (args.column.editType === 'datetimepickeredit') {
            this.obj = new DateTimePicker(
                extend(
                    {
                        floatLabelType: isInline ? 'Never' : 'Always',
                        value: value,
                        placeholder: isInline ?
                            '' : args.column.headerText, enableRtl: this.parent.enableRtl,
                        enabled: isEditable(args.column, args.type, args.element),
                    },
                    args.column.edit.params));
        }
        this.obj.appendTo(args.element as HTMLElement);
    }

    public destroy(): void {
        if (this.obj) {
            this.obj.destroy();
        }
    }
}