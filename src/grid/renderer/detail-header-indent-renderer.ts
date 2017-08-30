import { createElement } from '@syncfusion/ej2-base';
import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { Column } from '../models/column';

/**
 * DetailHeaderIndentCellRenderer class which responsible for building detail header indent cell. 
 * @hidden
 */
export class DetailHeaderIndentCellRenderer extends CellRenderer implements ICellRenderer<Column> {

    public element: HTMLElement = createElement('TH', { className: 'e-detailheadercell' });

    /**
     * Function to render the detail indent cell
     * @param  {Cell} cell
     * @param  {Object} data        
     */
    public render(cell: Cell<Column>, data: Object): Element {
        let node: Element = this.element.cloneNode() as Element;
        node.appendChild(createElement('div', { className: 'e-emptycell' }));
        return node;
    }

}