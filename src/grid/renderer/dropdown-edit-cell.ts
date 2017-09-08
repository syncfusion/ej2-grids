import { extend } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { IGrid, EJ2Intance, IEditCell } from '../base/interface';
import { Column } from '../models/column';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { isEditable } from '../base/util';

/**
 * `DropDownEditCell` is used to handle dropdown cell type editing.
 * @hidden
 */
export class DropDownEditCell implements IEditCell {


    private parent: IGrid;
    private obj: DropDownList;

    constructor(parent?: IGrid) {
        //constructor
        this.parent = parent;
    }

    public create(args: { column: Column, value: string }): Element {
        //create
        return createElement('input', {
            className: 'e-field', attrs: {
                id: this.parent.element.id + args.column.field, name: args.column.field, type: 'text', 'e-mappinguid': args.column.uid,
            }
        });
    }

    public read(element: Element): string {
        return (<EJ2Intance>element).ej2_instances[0].value;
    }

    public write(args: { rowData: Object, element: Element, column: Column, type: string }): void {
        let col: Column = args.column;
        let isInline: boolean = this.parent.editSettings.mode !== 'dialog';
        this.obj = new DropDownList(extend(
            {
                dataSource: this.parent.dataSource instanceof DataManager ?
                    this.parent.dataSource : new DataManager(this.parent.dataSource),
                query: new Query().select(args.column.field), enabled: isEditable(args.column, args.type, args.element),
                fields: { text: args.column.field }, text: args.rowData[args.column.field],
                enableRtl: this.parent.enableRtl, actionComplete: this.ddActionComplete,
                placeholder: isInline ? '' : args.column.headerText,
                floatLabelType: isInline ? 'Never' : 'Always',
            },
            args.column.edit.params));
        this.obj.appendTo(args.element as HTMLElement);
        args.element.setAttribute('name', args.column.field);
    }

    private ddActionComplete(e: { result: string[] }): void {
        e.result = e.result.filter((val: string, i: number, values: string[]) => values.indexOf(val) === i);
    }

    public destroy(): void {
        if (this.obj) {
            this.obj.destroy();
        }
    }

}