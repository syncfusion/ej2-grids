import { createElement, addClass, removeClass, attributes } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { Column } from '../models/column';
import { Cell } from '../models/cell';
import { ServiceLocator } from '../services/service-locator';
import { IGrid, ICellRenderer, CommandModel } from '../base/interface';
import { CellRenderer } from './cell-renderer';
import { appendChildren } from '../base/util';

/**
 * `CommandColumn` used to render command column in grid
 * @hidden
 */

export class CommandColumnRenderer extends CellRenderer implements ICellRenderer<Column> {
    private buttonElement: HTMLButtonElement = <HTMLButtonElement>createElement('button', {});
    private unbounDiv: HTMLElement = createElement('div', { className: 'e-unboundcelldiv', styles: 'display: inline-block' });

    public element: HTMLElement = createElement('TD', {
        className: 'e-rowcell e-unboundcell', attrs: {
            role: 'gridcell', tabindex: '-1'
        }
    });
    constructor(parent: IGrid, locator?: ServiceLocator) {
        super(parent, locator);
    }
    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {{[x:string]:Object}} attributes?
     * @param  {Element}
     */
    public render(cell: Cell<Column>, data: Object, attributes?: { [x: string]: Object }): Element {
        let node: Element = this.element.cloneNode() as Element;
        node.appendChild(this.unbounDiv.cloneNode());
        (<HTMLElement>node).setAttribute('aria-label', 'is Command column column header ' + cell.column.headerText);
        if (cell.column.commandsTemplate) {
            appendChildren(node.firstElementChild, cell.column.getColumnTemplate()(data));
        } else {
            for (let command of cell.commands) {
                node = this.renderButton(node, command, <number>attributes.index);
            }
        }
        this.setAttributes(<HTMLElement>node, cell, attributes);
        if (this.parent.isEdit) {
            addClass(node.querySelectorAll('.e-edit-delete'), 'e-hide');
            removeClass(node.querySelectorAll('.e-save-cancel'), 'e-hide');
        } else {
            addClass(node.querySelectorAll('.e-save-cancel'), 'e-hide');
            removeClass(node.querySelectorAll('.e-edit-delete'), 'e-hide');
        }
        return node;
    }

    private renderButton(node: Element, buttonOption: CommandModel, index: number): Element {
        let button: HTMLButtonElement = <HTMLButtonElement>this.buttonElement.cloneNode();
        attributes(button, { 'id': this.parent.element.id + (buttonOption.type || '') + '_' + index, 'type': 'button' });
        button.onclick = buttonOption.buttonOption.click;
        node.firstElementChild.appendChild(new Button(buttonOption.buttonOption, button).element);
        switch (buttonOption.type) {
            case 'edit':
            case 'delete':
                addClass([button], ['e-edit-delete', 'e-' + buttonOption.type + 'button']);
                break;
            case 'cancel':
            case 'save':
                addClass([button], ['e-save-cancel', 'e-' + buttonOption.type + 'button']);
                break;
        }
        return node;
    }
}
