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
define(["require", "exports", "@syncfusion/ej2-base/dom", "./indent-cell-renderer"], function (require, exports, dom_1, indent_cell_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExpandCellRenderer = (function (_super) {
        __extends(ExpandCellRenderer, _super);
        function ExpandCellRenderer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ExpandCellRenderer.prototype.render = function (cell, data) {
            var node = this.element.cloneNode();
            node.className = 'e-recordplusexpand';
            node.setAttribute('ej-mappingname', data.field);
            node.setAttribute('ej-mappingvalue', data.key);
            node.setAttribute('aria-expanded', 'true');
            node.appendChild(dom_1.createElement('div', { className: 'e-icons e-gdiagonaldown e-icon-gdownarrow' }));
            return node;
        };
        return ExpandCellRenderer;
    }(indent_cell_renderer_1.IndentCellRenderer));
    exports.ExpandCellRenderer = ExpandCellRenderer;
});
