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
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { appendChildren } from '../base/util';
import { CellRenderer } from './cell-renderer';
var SummaryCellRenderer = (function (_super) {
    __extends(SummaryCellRenderer, _super);
    function SummaryCellRenderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = createElement('TD', { className: 'e-summarycell', attrs: { role: 'gridcell', tabindex: '-1' } });
        return _this;
    }
    SummaryCellRenderer.prototype.getValue = function (field, data, column) {
        var key;
        key = !isNullOrUndefined(column.type) ? column.field + ' - ' + (column.type) : column.columnName;
        return data[column.columnName] ? data[column.columnName][key] : '';
    };
    SummaryCellRenderer.prototype.evaluate = function (node, cell, data, attributes) {
        var column = cell.column;
        if (!(column.footerTemplate || column.groupFooterTemplate || column.groupCaptionTemplate)) {
            return true;
        }
        var fn = column.getTemplate(cell.cellType);
        appendChildren(node, fn(data[column.columnName]));
        return false;
    };
    return SummaryCellRenderer;
}(CellRenderer));
export { SummaryCellRenderer };
