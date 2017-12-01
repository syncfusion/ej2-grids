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
import { CellRenderer } from './cell-renderer';
/**
 * HeaderIndentCellRenderer class which responsible for building header indent cell.
 * @hidden
 */
var HeaderIndentCellRenderer = /** @class */ (function (_super) {
    __extends(HeaderIndentCellRenderer, _super);
    function HeaderIndentCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = createElement('TH', { className: 'e-grouptopleftcell' });
        return _this;
    }
    /**
     * Function to render the indent cell
     * @param  {Cell} cell
     * @param  {Object} data
     */
    HeaderIndentCellRenderer.prototype.render = function (cell, data) {
        var node = this.element.cloneNode();
        node.appendChild(createElement('div', { className: 'e-headercelldiv e-emptycell', innerHTML: '&nbsp;' }));
        return node;
    };
    return HeaderIndentCellRenderer;
}(CellRenderer));
export { HeaderIndentCellRenderer };
