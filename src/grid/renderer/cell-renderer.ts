import { L10n } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base/util';
import { createElement } from '@syncfusion/ej2-base/dom';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer, IValueFormatter, ICellFormatter, ICell } from '../base/interface';
import { doesImplementInterface, setStyleAndAttributes, appendChildren } from '../base/util';
import { ServiceLocator } from '../services/service-locator';

/**
 * CellRenderer class which responsible for building cell content. 
 * @hidden
 */
export class CellRenderer implements ICellRenderer {

    public element: HTMLElement = createElement('TD', { className: 'e-rowcell', attrs: { role: 'gridcell' } });

    private localizer: L10n;
    private formatter: IValueFormatter;

    constructor(locator?: ServiceLocator) {
        this.localizer = locator.getService<L10n>('localization');
        this.formatter = locator.getService<IValueFormatter>('valueFormatter');
    }
    /**
     * Function to return the wrapper for the TD content
     * @returns string
     */
    public getGui(): string | Element {
        return '';
    }

    /**
     * Function to format the cell value.
     * @param  {Column} column
     * @param  {Object} value
     * @param  {Object} data
     */
    public format(column: Column, value: Object, data?: Object): string {
        if (!isNullOrUndefined(column.format)) {
            value = this.formatter.toView(value as number | Date, column.getFormatter());
        }

        return isNullOrUndefined(value) ? '' : value.toString();
    }

    /**
     * Function to invoke the custom formatter available in the column object.
     * @param  {Column} column
     * @param  {Object} value
     * @param  {Object} data
     */
    public invokeFormatter(column: Column, value: Object, data: Object): Object {
        if (!isNullOrUndefined(column.formatter)) {
            if (doesImplementInterface(column.formatter, 'getValue')) {
                let formatter: { new (): ICellFormatter } = <{ new (): ICellFormatter }>column.formatter;
                value = new formatter().getValue(column, data);

            } else if (typeof column.formatter === 'function') {
                value = (column.formatter as Function)(column, data);
            } else {
                value = (column.formatter as ICellFormatter).getValue(column, data);
            }
        }
        return value;
    }

    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {{[x:string]:Object}} attributes?
     * @param  {Element}
     */
    public render(cell: Cell, data: Object, attributes?: { [x: string]: Object }): Element {
        let node: Element = this.element.cloneNode() as Element;
        let column: Column = cell.column;
        let literals: string[] = ['index'];

        //Prepare innerHtml
        let innerHtml: string = <string>this.getGui();

        let value: Object = column.valueAccessor(column.field, data, column);

        value = this.format(column, value, data);

        innerHtml = value.toString();

        if (column.type === 'boolean') {
            let isNull: boolean = (value !== 'true' && value !== 'false');
            if (column.displayAsCheckBox) {
                node.classList.add('e-checkbox');
                innerHtml = isNull ? null : '<input type="checkbox" disabled ' + (value === 'true' ? 'checked' : '') + '/>';
            } else {
                let localeStr: string = isNull ? null : value === 'true' ? 'True' : 'False';
                innerHtml = localeStr ? this.localizer.getConstant(localeStr) : innerHtml;
            }
        }

        let fromFormatter: Object = this.invokeFormatter(column, value, data);

        if (!column.template) {
            innerHtml = !isNullOrUndefined(column.formatter) ? isNullOrUndefined(fromFormatter) ? '' : fromFormatter.toString() : innerHtml;
            this.appendHtml(node, innerHtml, column.getDomSetter());
        } else {
            appendChildren(node, column.getColumnTemplate()(extend({ 'index': attributes[literals[0]] }, data)));
        }

        this.buildAttributeFromCell(<HTMLElement>node, cell);

        setStyleAndAttributes(node as HTMLElement, attributes);

        if (column.customAttributes) {
            setStyleAndAttributes(node as HTMLElement, column.customAttributes);
        }

        if (!isNullOrUndefined(column.textAlign)) {
            (node as HTMLElement).style.textAlign = column.textAlign;
        }

        return node;
    }

    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHtml
     * @returns Element
     */
    public appendHtml(node: Element, innerHtml: string | Element, property: string = 'innerHTML'): Element {
        node[property] = innerHtml as string;
        return node;
    }

    public buildAttributeFromCell(node: HTMLElement, cell: Cell): void {
        let attr: ICell & { 'class'?: string[] } = {};
        let prop: { 'colindex'?: string } = { 'colindex': 'aria-colindex' };
        let classes: string[] = [];

        if (cell.colSpan) {
            attr.colSpan = cell.colSpan;
        }

        if (cell.rowSpan) {
            attr.rowSpan = cell.rowSpan;
        }

        if (cell.isTemplate) {
            classes.push('e-templatecell');
        }

        if (!isNullOrUndefined(cell.index)) {
            attr[prop.colindex] = cell.index;
        }

        if (!cell.visible) {
            classes.push('e-hide');
        }

        attr.class = classes;

        setStyleAndAttributes(node, attr);
    }
}