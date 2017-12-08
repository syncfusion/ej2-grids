import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';
import { createElement, attributes } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';

/**
 * FilterCellRenderer class which responsible for building filter cell.
 * @hidden 
 */
export class FilterCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = createElement('TH', { className: 'e-filterbarcell' });
    /**
     * Function to return the wrapper for the TH content.
     * @returns string 
     */
    public getGui(): string | Element {
        return createElement('div');
    }

    /**
     * Function to render the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Object} data         
     */
    public render(cell: Cell<Column>, data: Object): Element {
        let tr: Element = this.parent.element.querySelector('.e-filterbar');
        let node: Element = this.element.cloneNode() as Element;
        let innerDIV: HTMLDivElement = <HTMLDivElement>this.getGui();
        let input: Element;
        let column: Column = cell.column;

        if (column.type !== 'checkbox') {
            tr.appendChild(node);
            if ((isNullOrUndefined(column.allowFiltering) || column.allowFiltering) && !isNullOrUndefined(column.filterBarTemplate)) {
                node.classList.add('e-fltrtemp');
                attributes(innerDIV, {
                    'class': 'e-fltrtempdiv'
                });
                if (isNullOrUndefined(column.filterBarTemplate.create)) {
                    input = createElement('input', {
                        id: column.field + '_filterBarcell', className: 'e-filterUi_input e-filtertext e-fltrTemp',
                        attrs: { type: 'search', title: column.headerText }
                    });
                    innerDIV.appendChild(input);
                } else {
                    let args: Object = {column: column, node: Element};
                    let temp: Function = column.filterBarTemplate.create as Function;
                    if (typeof temp === 'string') {
                        temp = getValue(temp, window);
                    }
                    input = temp(args);
                    if (typeof input === 'string') {
                        let div: Element = createElement('div');
                        div.innerHTML = input;
                        input = div.firstChild as Element;
                    }
                    attributes(innerDIV, {
                        class: 'e-filterUi_input e-filtertext e-fltrTemp',
                        title: column.headerText,
                        id: column.field + '_filterBarcell',
                    });
                    innerDIV.appendChild(input);
                }
            } else {
                attributes(innerDIV, {
                    'class': 'e-filterdiv e-fltrinputdiv'
                });
                input = createElement('input', {
                    id: column.field + '_filterBarcell', className: 'e-filtertext',
                    attrs: {
                        type: 'search', title: column.headerText + (cell.attributes as { title: string }).title,
                        value: data[cell.column.field] ? data[cell.column.field] : '', role: 'search'
                    }
                });
                innerDIV.appendChild(input);
                innerDIV.appendChild(createElement('span', {
                    className: 'e-cancel e-hide e-icons e-icon-hide',
                    attrs: { 'aria-label': 'clear filter cell', tabindex: '-1' }
                }));
            }
            //TODO: apply intial filtering
            if (column.allowFiltering === false || column.field === '' || isNullOrUndefined(column.field)) {
                input.setAttribute('disabled', 'true');
                input.classList.add('e-disable');
            }
            if (!column.visible) {
                node.classList.add('e-hide');
            }

            if ((isNullOrUndefined(column.allowFiltering) || column.allowFiltering) && !isNullOrUndefined(column.filterBarTemplate)) {
                let templateWrite: Function = column.filterBarTemplate.write as Function;
                let args: { element: Element, column: Column } = { element: input, column: column };
                if (typeof templateWrite === 'string') {
                    templateWrite = getValue(templateWrite, window);
                }
                templateWrite.call(this, args);
            }

            this.appendHtml(node, innerDIV);
        }

        return node;
    }

    /**
     * Function to specifies how the result content to be placed in the cell.
     * @param  {Element} node
     * @param  {string|Element} innerHTML
     * @returns Element
     */
    public appendHtml(node: Element, innerHtml: string | Element): Element {
        node.appendChild(<Element>innerHtml);
        return node;
    }
}