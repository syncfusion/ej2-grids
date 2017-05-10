import { createElement } from '@syncfusion/ej2-base/dom';
import { Cell } from '../models/cell';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';

/**
 * IndentCellRenderer class which responsible for building group indent cell. 
 * @hidden
 */
export class IndentCellRenderer extends CellRenderer implements ICellRenderer {

    public element: HTMLElement = createElement('TD', { className: 'e-indentcell' });

    /**
     * Function to render the indent cell
     * @param  {Cell} cell
     * @param  {Object} data        
     */
    public render(cell: Cell, data: Object): Element {
        return this.element.cloneNode() as Element;
    }

}