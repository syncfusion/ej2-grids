import { createElement } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';

/**
 * GroupCaptionCellRenderer class which responsible for building group caption cell. 
 * @hidden
 */
export class GroupCaptionCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = createElement('TD', { className: 'e-groupcaption', attrs: { role: 'gridcell', tabindex: '-1' } });

    /**
     * Function to render the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Object} data         
     */
    public render(cell: Cell<Column>, data: { field: string, key: string, count: number }): Element {
        let node: Element = this.element.cloneNode() as Element;
        let value: string = this.format(cell.column, cell.column.valueAccessor('key', data, cell.column));

        node.innerHTML = cell.column.headerText + ': ' + value + ' - ' + data.count + ' ' +
            (data.count < 2 ? this.localizer.getConstant('Item') : this.localizer.getConstant('Items'));
        node.setAttribute('colspan', cell.colSpan.toString());
        node.setAttribute('aria-label', node.innerHTML + ' is groupcaption cell');
        return node;
    }
}

/**
 * GroupCaptionEmptyCellRenderer class which responsible for building group caption empty cell. 
 * @hidden
 */
export class GroupCaptionEmptyCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = createElement('TD', { className: 'e-groupcaption' });

    /**
     * Function to render the cell content based on Column object.
     * @param  {Cell} cell
     * @param  {Object} data         
     */
    public render(cell: Cell<Column>, data: { field: string, key: string, count: number }): Element {
        let node: Element = this.element.cloneNode() as Element;
        node.innerHTML = '&nbsp;';
        node.setAttribute('colspan', cell.colSpan.toString());
        return node;
    }
}

