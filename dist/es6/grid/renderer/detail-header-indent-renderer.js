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
import { createElement } from '@syncfusion/ej2-base/dom';
import { CellRenderer } from './cell-renderer';
var DetailHeaderIndentCellRenderer = (function (_super) {
    __extends(DetailHeaderIndentCellRenderer, _super);
    function DetailHeaderIndentCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = createElement('TH', { className: 'e-detailheadercell' });
        return _this;
    }
    DetailHeaderIndentCellRenderer.prototype.render = function (cell, data) {
        var node = this.element.cloneNode();
        node.appendChild(createElement('div', { className: 'e-emptycell' }));
        return node;
    };
    return DetailHeaderIndentCellRenderer;
}(CellRenderer));
export { DetailHeaderIndentCellRenderer };
