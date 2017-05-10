define(["require", "exports", "@syncfusion/ej2-base/util", "@syncfusion/ej2-base/dom", "../base/constant", "../base/util", "../base/enum"], function (require, exports, util_1, dom_1, constant_1, util_2, enum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RowRenderer = (function () {
        function RowRenderer(serviceLocator, cellType, parent) {
            this.element = dom_1.createElement('tr', { attrs: { role: 'row' } });
            this.cellType = cellType;
            this.serviceLocator = serviceLocator;
            this.parent = parent;
        }
        RowRenderer.prototype.render = function (row, columns, attributes, rowTemplate) {
            var tr = this.element.cloneNode();
            var rowArgs = { data: row.data };
            var cellArgs = { data: row.data };
            var attrCopy = util_1.extend({}, attributes, {});
            this.buildAttributeFromRow(tr, row);
            dom_1.attributes(tr, attrCopy);
            var cellRendererFact = this.serviceLocator.getService('cellRendererFactory');
            for (var i = 0, len = row.cells.length; i < len; i++) {
                var cell = row.cells[i];
                var cellRenderer = cellRendererFact.getCellRenderer(row.cells[i].cellType || enum_1.CellType.Data);
                var td = cellRenderer.render(row.cells[i], row.data, { 'index': !util_1.isNullOrUndefined(row.index) ? row.index.toString() : '' });
                tr.appendChild(td);
                if (row.cells[i].cellType === enum_1.CellType.Data) {
                    this.parent.trigger(constant_1.queryCellInfo, util_1.extend(cellArgs, { cell: td, column: cell.column }));
                }
            }
            if (row.isDataRow) {
                this.parent.trigger(constant_1.rowDataBound, util_1.extend(rowArgs, { row: tr }));
            }
            return tr;
        };
        RowRenderer.prototype.buildAttributeFromRow = function (tr, row) {
            var attr = {};
            var prop = { 'rowindex': 'aria-rowindex', 'dataUID': 'data-uid' };
            var classes = [];
            if (row.isDataRow) {
                classes.push('e-row');
            }
            if (row.isAltRow) {
                classes.push('e-altrow');
            }
            if (!util_1.isNullOrUndefined(row.index)) {
                attr[prop.rowindex] = row.index;
            }
            if (row.rowSpan) {
                attr.rowSpan = row.rowSpan;
            }
            if (row.uid) {
                attr[prop.dataUID] = row.uid;
            }
            attr.class = classes;
            util_2.setStyleAndAttributes(tr, attr);
        };
        return RowRenderer;
    }());
    exports.RowRenderer = RowRenderer;
});
