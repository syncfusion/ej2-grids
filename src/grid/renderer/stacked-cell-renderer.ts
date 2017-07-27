import { createElement } from '@syncfusion/ej2-base/dom';
import { isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';

/**
 * StackedHeaderCellRenderer class which responsible for building stacked header cell content.
 * @hidden 
 */
export class StackedHeaderCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = createElement('TH', {
        className: 'e-headercell e-stackedheadercell', attrs: {
            role: 'columnheader',
            tabindex: '-1'
        }
    });

    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data     
     * @param  {Element}
     */
    public render(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }): Element {

        let node: Element = this.element.cloneNode() as Element;
        node.innerHTML = cell.column.headerText;

        if (cell.column.toolTip) {
            node.setAttribute('title', cell.column.toolTip);
        }

        if (isNullOrUndefined(cell.column.textAlign)) {
            (node as HTMLElement).style.textAlign = cell.column.textAlign;
        }

        node.setAttribute('colspan', cell.colSpan.toString());
        node.setAttribute('aria-colspan', cell.colSpan.toString());
        node.setAttribute('aria-rowspan', '1');

        return node;
    }

}