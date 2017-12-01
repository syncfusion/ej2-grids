var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { createElement, addClass, removeClass, attributes } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { CellRenderer } from './cell-renderer';
import { appendChildren } from '../base/util';
/**
 * `CommandColumn` used to render command column in grid
 * @hidden
 */
var CommandColumnRenderer = /** @class */ (function (_super) {
    __extends(CommandColumnRenderer, _super);
    function CommandColumnRenderer(parent, locator) {
        var _this = _super.call(this, parent, locator) || this;
        _this.buttonElement = createElement('button', {});
        _this.unbounDiv = createElement('div', { className: 'e-unboundcelldiv', styles: 'display: inline-block' });
        _this.element = createElement('TD', {
            className: 'e-rowcell e-unboundcell', attrs: {
                role: 'gridcell', tabindex: '-1'
            }
        });
        return _this;
    }
    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {{[x:string]:Object}} attributes?
     * @param  {Element}
     */
    CommandColumnRenderer.prototype.render = function (cell, data, attributes) {
        var node = this.element.cloneNode();
        node.appendChild(this.unbounDiv.cloneNode());
        node.setAttribute('aria-label', 'is Command column column header ' + cell.column.headerText);
        if (cell.column.commandsTemplate) {
            appendChildren(node.firstElementChild, cell.column.getColumnTemplate()(data));
        }
        else {
            for (var _i = 0, _a = cell.commands; _i < _a.length; _i++) {
                var command = _a[_i];
                node = this.renderButton(node, command, attributes.index);
            }
        }
        this.setAttributes(node, cell, attributes);
        if (this.parent.isEdit) {
            addClass(node.querySelectorAll('.e-edit-delete'), 'e-hide');
            removeClass(node.querySelectorAll('.e-save-cancel'), 'e-hide');
        }
        else {
            addClass(node.querySelectorAll('.e-save-cancel'), 'e-hide');
            removeClass(node.querySelectorAll('.e-edit-delete'), 'e-hide');
        }
        return node;
    };
    CommandColumnRenderer.prototype.renderButton = function (node, buttonOption, index) {
        var button = this.buttonElement.cloneNode();
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
    };
    return CommandColumnRenderer;
}(CellRenderer));
export { CommandColumnRenderer };
