import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IGrid, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { Input } from '@syncfusion/ej2-inputs';
import { isEditable } from '../base/util';

/**
 * `DefaultEditCell` is used to handle default cell type editing.
 * @hidden
 */
export class DefaultEditCell implements IEditCell {

    private parent: IGrid;

    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public create(args: { column: Column, value: string, requestType: string }): Element {
        let col: Column = args.column;
        let input: Element = createElement('input', {
            className: 'e-field e-input e-defaultcell', attrs: {
                type: 'text', value: !isNullOrUndefined(args.value) ? args.value : '', 'e-mappinguid': col.uid,
                id: this.parent.element.id + col.field, name: col.field, style: 'text-align:' + col.textAlign,
            }
        });
        return input;
    }

    public read(element: Element): string {
        return (<HTMLInputElement>element).value;
    }

    public write(args: { rowData: Object, element: Element, column: Column, requestType: string }): void {
        let col: Column = args.column;
        let isInline: boolean = this.parent.editSettings.mode !== 'dialog';
        Input.createInput({
            element: args.element as HTMLInputElement, floatLabelType: this.parent.editSettings.mode !== 'dialog' ? 'Never' : 'Always',
            properties: {
                enableRtl: this.parent.enableRtl, enabled: isEditable(args.column, args.requestType, args.element),
                placeholder: isInline ? '' : args.column.headerText
            }
        });
    }
}