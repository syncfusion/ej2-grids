define(["require", "exports", "@syncfusion/ej2-base/util", "../models/row", "../base/enum", "../models/cell", "../base/util"], function (require, exports, util_1, row_1, enum_1, cell_1, util_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RowModelGenerator = (function () {
        function RowModelGenerator(parent) {
            this.parent = parent;
        }
        RowModelGenerator.prototype.generateRows = function (data) {
            var rows = [];
            for (var i = 0, len = Object.keys(data).length; i < len; i++) {
                rows[i] = this.generateRow(data[i], i);
            }
            return rows;
        };
        RowModelGenerator.prototype.ensureColumns = function () {
            return this.parent.getColumns();
        };
        RowModelGenerator.prototype.generateRow = function (data, index) {
            var options = {};
            var tmp = [];
            options.uid = util_2.getUid('grid-row');
            options.data = data;
            options.index = index;
            options.isDataRow = true;
            options.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;
            var dummies = this.ensureColumns();
            for (var _i = 0, dummies_1 = dummies; _i < dummies_1.length; _i++) {
                var dummy = dummies_1[_i];
                tmp.push(this.generateCell(dummy, options.uid));
            }
            var row = new row_1.Row(options);
            row.cells = tmp;
            return row;
        };
        RowModelGenerator.prototype.generateCell = function (column, rowId, cellType, colSpan) {
            var opt = {
                'visible': column.visible,
                'isDataCell': !util_1.isNullOrUndefined(column.field || column.template),
                'isTemplate': !util_1.isNullOrUndefined(column.template),
                'rowID': rowId,
                'column': column,
                'cellType': !util_1.isNullOrUndefined(cellType) ? cellType : enum_1.CellType.Data,
                'colSpan': colSpan
            };
            if (opt.isDataCell) {
                opt.index = this.parent.getColumnIndexByField(column.field);
            }
            return new cell_1.Cell(opt);
        };
        return RowModelGenerator;
    }());
    exports.RowModelGenerator = RowModelGenerator;
});
