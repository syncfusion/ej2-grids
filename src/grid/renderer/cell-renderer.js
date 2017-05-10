define(["require", "exports", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../base/util"], function (require, exports, util_1, dom_1, util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellRenderer = (function () {
        function CellRenderer(locator) {
            this.element = dom_1.createElement('TD', { className: 'e-rowcell', attrs: { role: 'gridcell' } });
            this.localizer = locator.getService('localization');
            this.formatter = locator.getService('valueFormatter');
        }
        CellRenderer.prototype.getGui = function () {
            return '';
        };
        CellRenderer.prototype.format = function (column, value, data) {
            if (!util_1.isNullOrUndefined(column.format)) {
                value = this.formatter.toView(value, column.getFormatter());
            }
            return util_1.isNullOrUndefined(value) ? '' : value.toString();
        };
        CellRenderer.prototype.invokeFormatter = function (column, value, data) {
            if (!util_1.isNullOrUndefined(column.formatter)) {
                if (util_2.doesImplementInterface(column.formatter, 'getValue')) {
                    var formatter = column.formatter;
                    value = new formatter().getValue(column, data);
                }
                else if (typeof column.formatter === 'function') {
                    value = column.formatter(column, data);
                }
                else {
                    value = column.formatter.getValue(column, data);
                }
            }
            return value;
        };
        CellRenderer.prototype.render = function (cell, data, attributes) {
            var node = this.element.cloneNode();
            var column = cell.column;
            var literals = ['index'];
            var innerHtml = this.getGui();
            var value = column.valueAccessor(column.field, data, column);
            value = this.format(column, value, data);
            innerHtml = value.toString();
            if (column.type === 'boolean') {
                var isNull = (value !== 'true' && value !== 'false');
                if (column.displayAsCheckBox) {
                    node.classList.add('e-checkbox');
                    innerHtml = isNull ? null : '<input type="checkbox" disabled ' + (value === 'true' ? 'checked' : '') + '/>';
                }
                else {
                    var localeStr = isNull ? null : value === 'true' ? 'True' : 'False';
                    innerHtml = localeStr ? this.localizer.getConstant(localeStr) : innerHtml;
                }
            }
            var fromFormatter = this.invokeFormatter(column, value, data);
            if (!column.template) {
                innerHtml = !util_1.isNullOrUndefined(column.formatter) ? util_1.isNullOrUndefined(fromFormatter) ? '' : fromFormatter.toString() : innerHtml;
                this.appendHtml(node, innerHtml, column.getDomSetter());
            }
            else {
                this.appendHtml(node, column.getColumnTemplate()(util_1.extend({ 'index': attributes[literals[0]] }, data)));
            }
            this.buildAttributeFromCell(node, cell);
            util_2.setStyleAndAttributes(node, attributes);
            if (column.customAttributes) {
                util_2.setStyleAndAttributes(node, column.customAttributes);
            }
            if (!util_1.isNullOrUndefined(column.textAlign)) {
                node.style.textAlign = column.textAlign;
            }
            return node;
        };
        CellRenderer.prototype.appendHtml = function (node, innerHtml, property) {
            if (property === void 0) { property = 'innerHTML'; }
            node[property] = innerHtml;
            return node;
        };
        CellRenderer.prototype.buildAttributeFromCell = function (node, cell) {
            var attr = {};
            var prop = { 'colindex': 'aria-colindex' };
            var classes = [];
            if (cell.colSpan) {
                attr.colSpan = cell.colSpan;
            }
            if (cell.rowSpan) {
                attr.rowSpan = cell.rowSpan;
            }
            if (cell.isTemplate) {
                classes.push('e-templatecell');
            }
            if (!util_1.isNullOrUndefined(cell.index)) {
                attr[prop.colindex] = cell.index;
            }
            if (!cell.visible) {
                classes.push('e-hide');
            }
            attr.class = classes;
            util_2.setStyleAndAttributes(node, attr);
        };
        return CellRenderer;
    }());
    exports.CellRenderer = CellRenderer;
});
