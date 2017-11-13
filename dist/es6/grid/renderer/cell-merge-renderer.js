import { isNullOrUndefined, attributes } from '@syncfusion/ej2-base';
import { iterateArrayOrObject } from '../base/util';
import { CellType } from '../base/enum';
var CellMergeRender = (function () {
    function CellMergeRender(serviceLocator, parent) {
        this.serviceLocator = serviceLocator;
        this.parent = parent;
    }
    CellMergeRender.prototype.render = function (cellArgs, row, i, td) {
        var cellRendererFact = this.serviceLocator.getService('cellRendererFactory');
        var cellRenderer = cellRendererFact.getCellRenderer(row.cells[i].cellType || CellType.Data);
        var span = row.cells[i].cellSpan ? row.cells[i].cellSpan :
            (cellArgs.colSpan + i) <= row.cells.length ? cellArgs.colSpan : row.cells.length - i;
        var visible = 0;
        for (var j = i + 1; j < i + span && j < row.cells.length; j++) {
            if (row.cells[j].visible === false) {
                visible++;
            }
            else {
                row.cells[j].isSpanned = true;
            }
        }
        if (visible > 0) {
            for (var j = i + span; j < i + span + visible && j < row.cells.length; j++) {
                row.cells[j].isSpanned = true;
            }
            if (i + span + visible >= row.cells.length) {
                span -= (i + span + visible) - row.cells.length;
            }
        }
        if (row.cells[i].cellSpan) {
            row.data[cellArgs.column.field] = row.cells[i].spanText;
            td = cellRenderer.render(row.cells[i], row.data, { 'index': !isNullOrUndefined(row.index) ? row.index.toString() : '' });
        }
        if (span > 1) {
            attributes(td, { 'colSpan': span.toString(), 'aria-colSpan': span.toString() });
        }
        if (this.parent.enableColumnVirtualization && !row.cells[i].cellSpan &&
            !this.containsKey(cellArgs.column.field, cellArgs.data[cellArgs.column.field])) {
            this.backupMergeCells(cellArgs.column.field, cellArgs.data[cellArgs.column.field], cellArgs.colSpan);
        }
        return td;
    };
    CellMergeRender.prototype.backupMergeCells = function (fName, data, span) {
        this.setMergeCells(this.generteKey(fName, data), span);
    };
    CellMergeRender.prototype.generteKey = function (fname, data) {
        return fname + '__' + data.toString();
    };
    CellMergeRender.prototype.splitKey = function (key) {
        return key.split('__');
    };
    CellMergeRender.prototype.containsKey = function (fname, data) {
        return this.getMergeCells().hasOwnProperty(this.generteKey(fname, data));
    };
    CellMergeRender.prototype.getMergeCells = function () {
        return this.parent.mergeCells;
    };
    CellMergeRender.prototype.setMergeCells = function (key, span) {
        this.parent.mergeCells[key] = span;
    };
    CellMergeRender.prototype.updateVirtualCells = function (rows) {
        var mCells = this.getMergeCells();
        for (var _i = 0, _a = Object.keys(mCells); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = mCells[key];
            var merge = this.splitKey(key);
            var columnIndex = this.getIndexFromAllColumns(merge[0]);
            var vColumnIndices = this.parent.getColumnIndexesInView();
            var span = value - (vColumnIndices[0] - columnIndex);
            if (columnIndex < vColumnIndices[0] && span > 1) {
                for (var _b = 0, rows_1 = rows; _b < rows_1.length; _b++) {
                    var row = rows_1[_b];
                    if (row.data[merge[0]].toString() === merge[1].toString()) {
                        row.cells[0].cellSpan = span;
                        row.cells[0].spanText = merge[1];
                        break;
                    }
                }
            }
        }
        return rows;
    };
    CellMergeRender.prototype.getIndexFromAllColumns = function (field) {
        var index = iterateArrayOrObject(this.parent.getVisibleColumns(), function (item, index) {
            if (item.field === field) {
                return index;
            }
            return undefined;
        })[0];
        return index;
    };
    return CellMergeRender;
}());
export { CellMergeRender };
