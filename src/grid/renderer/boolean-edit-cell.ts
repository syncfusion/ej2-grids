import { createElement } from '@syncfusion/ej2-base';
import { IEditCell, IGrid } from '../base/interface';
import { Column } from '../models/column';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { extend } from '@syncfusion/ej2-base';
import { isEditable } from '../base/util';

/**
 * `BooleanEditCell` is used to handle boolean cell type editing.
 * @hidden
 */
export class BooleanEditCell implements IEditCell {
    private parent: IGrid;
    private obj: CheckBox;

    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public create(args: { column: Column, value: string, type: string }): Element {
        let col: Column = args.column;
        return createElement('input', {
            className: 'e-field e-boolcell', attrs: {
                type: 'checkbox', value: args.value, 'e-mappinguid': col.uid,
                id: this.parent.element.id + col.field, name: col.field
            }
        });
    }

    public read(element: Element): boolean {
        return (<HTMLInputElement>element).checked;
    }

    public write(args: { rowData: Object, element: Element, column: Column, type: string }): void {
        this.obj = new CheckBox(
            extend(
                {
                    label: this.parent.editSettings.mode !== 'dialog' ? '' : args.column.headerText,
                    checked: args.rowData[args.column.field] &&
                    JSON.parse(args.rowData[args.column.field].toString().toLowerCase()),
                    disabled: !isEditable(args.column, args.type, args.element), enableRtl: this.parent.enableRtl
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
