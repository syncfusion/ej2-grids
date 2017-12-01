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
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { CellRenderer } from './cell-renderer';
/**
 * StackedHeaderCellRenderer class which responsible for building stacked header cell content.
 * @hidden
 */
var StackedHeaderCellRenderer = /** @class */ (function (_super) {
    __extends(StackedHeaderCellRenderer, _super);
    function StackedHeaderCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = createElement('TH', {
            className: 'e-headercell e-stackedheadercell', attrs: {
                role: 'columnheader',
                tabindex: '-1'
            }
        });
        return _this;
    }
    /**
     * Function to render the cell content based on Column object.
     * @param  {Column} column
     * @param  {Object} data
     * @param  {Element}
     */
    StackedHeaderCellRenderer.prototype.render = function (cell, data, attributes) {
        var node = this.element.cloneNode();
        var div = createElement('div', { className: 'e-stackedheadercelldiv' });
        node.appendChild(div);
        div.innerHTML = cell.column.headerText;
        if (cell.column.toolTip) {
            node.setAttribute('title', cell.column.toolTip);
        }
        if (isNullOrUndefined(cell.column.textAlign)) {
            div.style.textAlign = cell.column.textAlign;
        }
        node.setAttribute('colspan', cell.colSpan.toString());
        node.setAttribute('aria-colspan', cell.colSpan.toString());
        node.setAttribute('aria-rowspan', '1');
        return node;
    };
    return StackedHeaderCellRenderer;
}(CellRenderer));
export { StackedHeaderCellRenderer };
