import { IGrid } from '../base/interface';
import { getValue } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { InlineEditRender } from './inline-edit-renderer';
import { BatchEditRender } from './batch-edit-renderer';
import { DialogEditRender } from './dialog-edit-renderer';
import { createElement, attributes, classList } from '@syncfusion/ej2-base';
import { ServiceLocator } from '../services/service-locator';

/**
 * Edit render module is used to render grid edit row.
 * @hidden
 */
export class EditRender {
    //Internal variables               
    private editType: Object = {
        'inline': InlineEditRender,
        'normal': InlineEditRender, 'batch': BatchEditRender, 'dialog': DialogEditRender
    };
    //Module declarations
    protected parent: IGrid;
    private renderer: InlineEditRender;
    protected serviceLocator: ServiceLocator;

    /**
     * Constructor for render module
     */
    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.renderer = new this.editType[this.parent.editSettings.mode](parent, serviceLocator);
    }

    public addNew(args: {
        rowData?: Object, columnName?: string, columnObject?: Column,
        requestType?: string, cell?: Element, row?: Element, primaryKeyValue?: string[]
    }): void {
        this.renderer.addNew(this.getEditElements(args), args);
        this.convertWidget(args);
    }

    public update(args: {
        rowData?: Object, columnName?: string, columnObject?: Column,
        requestType?: string, cell?: Element, row?: Element, primaryKeyValue?: string[]
    }): void {
        this.renderer.update(this.getEditElements(args), args);
        this.convertWidget(args);
    }

    private convertWidget(args: { rowData?: Object, columnName?: string, requestType?: string }): void {
        let gObj: IGrid = this.parent;
        let isFocused: boolean;
        let cell: HTMLElement;
        let value: string;
        let form: Element = gObj.element.querySelector('.e-gridform');
        let cols: Column[] = gObj.editSettings.mode !== 'batch' ? gObj.columns as Column[] : [gObj.getColumnByField(args.columnName)];
        for (let col of cols) {
            if (!col.visible) {
                continue;
            }
            value = col.valueAccessor(col.field, args.rowData, col) as string;
            cell = form.querySelector('[e-mappinguid=' + col.uid + ']') as HTMLElement;
            let temp: Function = col.edit.write as Function;
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
            }
            (col.edit.write as Function)({ rowData: args.rowData, element: cell, column: col, requestType: args.requestType });
            if (!isFocused && !cell.getAttribute('disabled')) {
                this.focusElement(cell as HTMLInputElement);
                isFocused = true;
            }
        }
    }

    private focusElement(elem: HTMLInputElement): void {
        elem.focus();
        if (elem.classList.contains('e-defaultcell')) {
            elem.setSelectionRange(elem.value.length, elem.value.length);
        }
    }

    private getEditElements(args: { rowData?: Object, columnName?: string, requestType?: string, row?: Element }): Object {
        let gObj: IGrid = this.parent;
        let elements: Object = {};
        let cols: Column[] = gObj.editSettings.mode !== 'batch' ? gObj.columns as Column[] : [gObj.getColumnByField(args.columnName)];
        for (let col of cols) {
            if (!col.visible) {
                continue;
            }
            let value: string = col.valueAccessor(col.field, args.rowData, col) as string;
            let tArgs: Object = { column: col, value: value, type: args.requestType };
            let temp: Function = col.edit.create as Function;
            let input: Element;
            input = (col.edit.create as Function)(tArgs);
            if (typeof input === 'string') {
                let div: Element = createElement('div');
                div.innerHTML = input;
                input = div.firstChild as Element;
            }
            let isInput: number = input.tagName !== 'input' && input.querySelectorAll('input').length;
            attributes(isInput ? input.querySelector('input') : input, {
                name: col.field, 'e-mappinguid': col.uid,
                id: gObj.element.id + col.field,
            });
            classList(input, ['e-input', 'e-field'], []);
            if (col.textAlign === 'right') {
                input.classList.add('e-ralign');
            }
            if ((col.isPrimaryKey || col.isIdentity) && args.requestType === 'beginEdit') { // already disabled in cell plugins
                input.setAttribute('disabled', 'true');
            }
            elements[col.uid] = input;
        }
        return elements;
    }
}

