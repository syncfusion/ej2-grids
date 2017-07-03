import { createElement } from '@syncfusion/ej2-base/dom';
import { ICellRenderer } from '../base/interface';
import { CellRenderer } from './cell-renderer';

/**
 * ExpandCellRenderer class which responsible for building group expand cell. 
 * @hidden
 */
export class DetailExpandCellRenderer extends CellRenderer implements ICellRenderer {

    public element: HTMLElement = createElement('TD', { className: 'e-detailrowcollapse', attrs: { 'aria-expanded': 'false' } });

    /**
     * Function to render the detail expand cell           
     */
    public render(): Element {
        let node: Element = this.element.cloneNode() as Element;
        node.appendChild(createElement('div', { className: 'e-icons e-dtdiagonalright e-icon-grightarrow' }));
        return node;
    }

}