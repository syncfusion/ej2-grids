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
import { createElement } from '@syncfusion/ej2-base';
import { IndentCellRenderer } from './indent-cell-renderer';
/**
 * ExpandCellRenderer class which responsible for building group expand cell.
 * @hidden
 */
var ExpandCellRenderer = /** @class */ (function (_super) {
    __extends(ExpandCellRenderer, _super);
    function ExpandCellRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Function to render the expand cell
     * @param  {Cell} cell
     * @param  {Object} data
     */
    ExpandCellRenderer.prototype.render = function (cell, data) {
        var node = this.element.cloneNode();
        node.className = 'e-recordplusexpand';
        node.setAttribute('ej-mappingname', data.field);
        node.setAttribute('ej-mappingvalue', data.key);
        node.setAttribute('aria-expanded', 'true');
        node.setAttribute('tabindex', '-1');
        node.appendChild(createElement('div', { className: 'e-icons e-gdiagonaldown e-icon-gdownarrow' }));
        return node;
    };
    return ExpandCellRenderer;
}(IndentCellRenderer));
export { ExpandCellRenderer };
