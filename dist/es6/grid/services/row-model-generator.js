import { isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { Row } from '../models/row';
import { CellType } from '../base/enum';
import { Cell } from '../models/cell';
import { getUid } from '../base/util';
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
        var cols = [];
        if (this.parent.detailsTemplate || this.parent.childGrid) {
            cols.push(this.generateCell({}, null, CellType.DetailExpand));
        }
        return cols;
    };
    RowModelGenerator.prototype.generateRow = function (data, index, cssClass) {
        var options = {};
        var tmp = [];
        options.uid = getUid('grid-row');
        options.data = data;
        options.index = index;
        options.isDataRow = true;
        options.cssClass = cssClass;
        options.isAltRow = this.parent.enableAltRow ? index % 2 !== 0 : false;
        var cells = this.ensureColumns();
        var dummies = this.parent.getColumns();
        for (var _i = 0, dummies_1 = dummies; _i < dummies_1.length; _i++) {
            var dummy = dummies_1[_i];
            tmp.push(this.generateCell(dummy, options.uid));
        }
        var row = new Row(options);
        row.cells = cells.concat(tmp);
        return row;
    };
    RowModelGenerator.prototype.generateCell = function (column, rowId, cellType, colSpan) {
        var opt = {
            'visible': column.visible,
            'isDataCell': !isNullOrUndefined(column.field || column.template),
            'isTemplate': !isNullOrUndefined(column.template),
            'rowID': rowId,
            'column': column,
            'cellType': !isNullOrUndefined(cellType) ? cellType : CellType.Data,
            'colSpan': colSpan
        };
        if (opt.isDataCell) {
            opt.index = this.parent.getColumnIndexByField(column.field);
        }
        return new Cell(opt);
    };
    return RowModelGenerator;
}());
export { RowModelGenerator };
