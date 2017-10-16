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
var GroupCaptionCellRenderer = (function (_super) {
    __extends(GroupCaptionCellRenderer, _super);
    function GroupCaptionCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = createElement('TD', { className: 'e-groupcaption', attrs: { role: 'gridcell', tabindex: '-1' } });
        return _this;
    }
    GroupCaptionCellRenderer.prototype.render = function (cell, data) {
        var node = this.element.cloneNode();
        var value = this.format(cell.column, cell.column.valueAccessor('key', data, cell.column));
        node.innerHTML = cell.column.headerText + ': ' + value + ' - ' + data.count + ' ' +
            (data.count < 2 ? this.localizer.getConstant('Item') : this.localizer.getConstant('Items'));
        node.setAttribute('colspan', cell.colSpan.toString());
        node.setAttribute('aria-label', node.innerHTML + ' is groupcaption cell');
        return node;
    };
    return GroupCaptionCellRenderer;
}(CellRenderer));
export { GroupCaptionCellRenderer };
var GroupCaptionEmptyCellRenderer = (function (_super) {
    __extends(GroupCaptionEmptyCellRenderer, _super);
    function GroupCaptionEmptyCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = createElement('TD', { className: 'e-groupcaption' });
        return _this;
    }
    GroupCaptionEmptyCellRenderer.prototype.render = function (cell, data) {
        var node = this.element.cloneNode();
        node.innerHTML = '&nbsp;';
        node.setAttribute('colspan', cell.colSpan.toString());
        return node;
    };
    return GroupCaptionEmptyCellRenderer;
}(CellRenderer));
export { GroupCaptionEmptyCellRenderer };
