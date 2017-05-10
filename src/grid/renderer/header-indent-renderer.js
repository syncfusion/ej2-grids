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
define(["require", "exports", "@syncfusion/ej2-base/dom", "./cell-renderer"], function (require, exports, dom_1, cell_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderIndentCellRenderer = (function (_super) {
        __extends(HeaderIndentCellRenderer, _super);
        function HeaderIndentCellRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.element = dom_1.createElement('TH', { className: 'e-grouptopleftcell' });
            return _this;
        }
        HeaderIndentCellRenderer.prototype.render = function (cell, data) {
            var node = this.element.cloneNode();
            node.appendChild(dom_1.createElement('div', { className: 'e-headercelldiv e-emptycell', innerHTML: '&nbsp;' }));
            return node;
        };
        return HeaderIndentCellRenderer;
    }(cell_renderer_1.CellRenderer));
    exports.HeaderIndentCellRenderer = HeaderIndentCellRenderer;
});
