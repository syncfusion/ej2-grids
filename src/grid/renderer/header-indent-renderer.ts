import { createElement } from '@syncfusion/ej2-base';
import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { Column } from '../models/column';

/**
 * HeaderIndentCellRenderer class which responsible for building header indent cell. 
 * @hidden
 */
export class HeaderIndentCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = createElement('TH', { className: 'e-grouptopleftcell' });

    /**
     * Function to render the indent cell
     * @param  {Cell} cell
     * @param  {Object} data        
     */
    public render(cell: Cell<Column>, data: Object): Element {
        let node: Element = this.element.cloneNode() as Element;
        node.appendChild(createElement('div', { className: 'e-headercelldiv e-emptycell', innerHTML: '&nbsp;' }));
        return node;
    }

}