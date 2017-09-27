
import { createElement } from '@syncfusion/ej2-base';
import { IEditCell, IGrid } from '../base/interface';
import { Column } from '../models/column';
import { isEditable } from '../base/util';

/**
 * `BooleanEditCell` is used to handle boolean cell type editing.
 * @hidden
 */
export class BooleanEditCell implements IEditCell {

    private parent: IGrid;

    constructor(parent?: IGrid) {
        this.parent = parent;
    }

    public create(args: { column: Column, value: string, requestType: string, element: Element }): Element {
        let col: Column = args.column;
        let input: Element = createElement('input', {
            className: 'e-field e-boolcell', attrs: {
                type: 'checkbox', value: args.value, 'e-mappinguid': col.uid,
                id: this.parent.element.id + col.field, name: col.field
            }
        });
        if (!isEditable(args.column, args.requestType, args.element)) {
            input.setAttribute('disabled', 'true');
        }
        if (args.value) {
            (input as HTMLInputElement).checked = true;
        }
        return input;
    }

    public read(element: Element): boolean {
        return (<HTMLInputElement>element).checked;
    }

    public write(args: { rowData: Object, element: Element, column: Column, requestType: string }): void {
        (args.element as HTMLElement).style.width = 'auto';
    }

    public destroy(): void {
        //To destroy component
    }

}