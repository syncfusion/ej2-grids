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
define(["require", "exports", "@syncfusion/ej2-base/dom", "@syncfusion/ej2-base/util", "./cell-renderer"], function (require, exports, dom_1, util_1, cell_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StackedHeaderCellRenderer = (function (_super) {
        __extends(StackedHeaderCellRenderer, _super);
        function StackedHeaderCellRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.element = dom_1.createElement('TH', { className: 'e-headercell e-stackedheadercell', attrs: { role: 'columnheader' } });
            return _this;
        }
        StackedHeaderCellRenderer.prototype.render = function (cell, data, attributes) {
            var node = this.element.cloneNode();
            node.innerHTML = cell.column.headerText;
            if (cell.column.toolTip) {
                node.setAttribute('title', cell.column.toolTip);
            }
            if (util_1.isNullOrUndefined(cell.column.textAlign)) {
                node.style.textAlign = cell.column.textAlign;
            }
            node.setAttribute('colspan', cell.colSpan.toString());
            node.setAttribute('aria-colspan', cell.colSpan.toString());
            node.setAttribute('aria-rowspan', '1');
            return node;
        };
        return StackedHeaderCellRenderer;
    }(cell_renderer_1.CellRenderer));
    exports.StackedHeaderCellRenderer = StackedHeaderCellRenderer;
});
