import { Row } from './../models/row';
import { CellType } from '../base/enum';
import { isNullOrUndefined, Internationalization } from '@syncfusion/ej2-base';
import { Cell } from '../models/cell';
import { ValueFormatter } from './../services/value-formatter';
var ExportHelper = (function () {
    function ExportHelper(parent) {
        this.hideColumnInclude = false;
        this.parent = parent;
    }
    ExportHelper.prototype.getHeaders = function (column, isHideColumnInclude) {
        if (isHideColumnInclude) {
            this.hideColumnInclude = true;
        }
        else {
            this.hideColumnInclude = false;
        }
        var cols = column;
        this.colDepth = this.measureColumnDepth(cols);
        var rows = [];
        var actualColumns = [];
        for (var i = 0; i < this.colDepth; i++) {
            rows[i] = new Row({});
            rows[i].cells = [];
        }
        rows = this.processColumns(rows);
        rows = this.processHeaderCells(rows);
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            for (var i = 0; i < row.cells.length; i++) {
                var cell = row.cells[i];
                if (cell.visible === undefined && cell.cellType !== 9) {
                    row.cells = this.removeCellFromRow(row.cells, i);
                    i = i - 1;
                }
                if ((!isHideColumnInclude) && cell.visible !== undefined && (!cell.visible)) {
                    row.cells = this.removeCellFromRow(row.cells, i);
                    i = i - 1;
                }
            }
        }
        for (var i = 0; i < cols.length; i++) {
            this.generateActualColumns(cols[i], actualColumns);
        }
        return { rows: rows, columns: actualColumns };
    };
    ExportHelper.prototype.generateActualColumns = function (column, actualColumns) {
        if (!column.columns) {
            if (column.visible || this.hideColumnInclude) {
                actualColumns.push(column);
            }
        }
        else {
            if (column.visible || this.hideColumnInclude) {
                var colSpan = this.getCellCount(column, 0);
                if (colSpan !== 0) {
                    for (var i = 0; i < column.columns.length; i++) {
                        this.generateActualColumns(column.columns[i], actualColumns);
                    }
                }
            }
        }
    };
    ExportHelper.prototype.removeCellFromRow = function (cells, cellIndex) {
        var resultCells = [];
        for (var i = 0; i < cellIndex; i++) {
            resultCells.push(cells[i]);
        }
        for (var i = (cellIndex + 1); i < cells.length; i++) {
            resultCells.push(cells[i]);
        }
        return resultCells;
    };
    ExportHelper.prototype.processHeaderCells = function (rows) {
        var columns = this.parent.enableColumnVirtualization ? this.parent.getColumns() : this.parent.columns;
        for (var i = 0; i < columns.length; i++) {
            rows = this.appendGridCells(columns[i], rows, 0, i === 0, false, i === (columns.length - 1));
        }
        return rows;
    };
    ExportHelper.prototype.appendGridCells = function (cols, gridRows, index, isFirstObj, isFirstColumn, isLastColumn) {
        var lastCol = isLastColumn ? 'e-lastcell' : '';
        if (!cols.columns) {
            gridRows[index].cells.push(this.generateCell(cols, CellType.Header, this.colDepth - index, (isFirstObj ? '' : (isFirstColumn ? 'e-firstcell' : '')) + lastCol, index, this.parent.getColumnIndexByUid(cols.uid)));
        }
        else {
            var colSpan = this.getCellCount(cols, 0);
            if (colSpan) {
                gridRows[index].cells.push(new Cell({
                    cellType: CellType.StackedHeader, column: cols, colSpan: colSpan
                }));
            }
            var isFirstCell = void 0;
            var isIgnoreFirstCell = void 0;
            for (var i = 0, len = cols.columns.length; i < len; i++) {
                isFirstCell = false;
                if (cols.columns[i].visible && !isIgnoreFirstCell) {
                    isFirstCell = true;
                    isIgnoreFirstCell = true;
                }
                gridRows = this.appendGridCells(cols.columns[i], gridRows, index + 1, isFirstObj, i === 0, i === (len - 1) && isLastColumn);
            }
        }
        return gridRows;
    };
    ExportHelper.prototype.generateCell = function (gridColumn, cellType, rowSpan, className, rowIndex, columnIndex) {
        var option = {
            'visible': gridColumn.visible,
            'isDataCell': false,
            'isTemplate': !isNullOrUndefined(gridColumn.headerTemplate),
            'rowID': '',
            'column': gridColumn,
            'cellType': cellType,
            'rowSpan': rowSpan,
            'className': className,
            'index': rowIndex,
            'colIndex': columnIndex
        };
        if (!option.rowSpan || option.rowSpan < 2) {
            delete option.rowSpan;
        }
        return new Cell(option);
    };
    ExportHelper.prototype.processColumns = function (rows) {
        var gridObj = this.parent;
        var columnIndexes = this.parent.getColumnIndexesInView();
        for (var i = 0, len = rows.length; i < len; i++) {
            if (gridObj.allowGrouping) {
                for (var j = 0, len_1 = gridObj.groupSettings.columns.length; j < len_1; j++) {
                    if (this.parent.enableColumnVirtualization && columnIndexes.indexOf(j) === -1) {
                        continue;
                    }
                    rows[i].cells.push(this.generateCell({}, CellType.HeaderIndent));
                }
            }
            if (gridObj.detailTemplate || gridObj.childGrid) {
                rows[i].cells.push(this.generateCell({}, CellType.DetailHeader));
            }
        }
        return rows;
    };
    ExportHelper.prototype.getCellCount = function (column, count) {
        if (column.columns) {
            for (var i = 0; i < column.columns.length; i++) {
                count = this.getCellCount(column.columns[i], count);
            }
        }
        else {
            if (column.visible || this.hideColumnInclude) {
                count++;
            }
        }
        return count;
    };
    ExportHelper.prototype.measureColumnDepth = function (column) {
        var max = 0;
        for (var i = 0; i < column.length; i++) {
            var depth = this.checkDepth(column[i], 0);
            if (max < depth) {
                max = depth;
            }
        }
        return max + 1;
    };
    ExportHelper.prototype.checkDepth = function (col, index) {
        if (col.columns) {
            index++;
            for (var i = 0; i < col.columns.length; i++) {
                index = this.checkDepth(col.columns[i], index);
            }
        }
        return index;
    };
    ;
    return ExportHelper;
}());
export { ExportHelper };
var ExportValueFormatter = (function () {
    function ExportValueFormatter() {
        this.valueFormatter = new ValueFormatter();
        this.internationalization = new Internationalization();
    }
    ExportValueFormatter.prototype.formatCellValue = function (args) {
        if (args.column.type === 'number' && args.column.format !== undefined && args.column.format !== '') {
            return this.internationalization.getNumberFormat({ format: args.column.format })(args.value);
        }
        else if (args.column.type === 'boolean') {
            return args.value ? 'true' : 'false';
        }
        else if ((args.column.type === 'date' || args.column.type === 'datetime' || args.column.type === 'time') && args.column.format !== undefined) {
            if (typeof args.column.format === 'string') {
                var format = void 0;
                if (args.column.type === 'date') {
                    format = { type: 'date', skeleton: args.column.format };
                }
                else if (args.column.type === 'time') {
                    format = { type: 'time', skeleton: args.column.format };
                }
                else {
                    format = { type: 'dateTime', skeleton: args.column.format };
                }
                return this.valueFormatter.getFormatFunction(format)(args.value);
            }
            else {
                if (args.column.format instanceof Object && args.column.format.type === undefined) {
                    return (args.value.toString());
                }
                else {
                    var customFormat = void 0;
                    if (args.column.type === 'date') {
                        customFormat = { type: args.column.format.type, format: args.column.format.format, skeleton: args.column.format.skeleton };
                    }
                    else if (args.column.type === 'time') {
                        customFormat = { type: 'time', format: args.column.format.format, skeleton: args.column.format.skeleton };
                    }
                    else {
                        customFormat = { type: 'dateTime', format: args.column.format.format, skeleton: args.column.format.skeleton };
                    }
                    return this.valueFormatter.getFormatFunction(customFormat)(args.value);
                }
            }
        }
        else {
            if (args.column.type === undefined || args.column.type === null) {
                return '';
            }
            else {
                return (args.value).toString();
            }
        }
    };
    return ExportValueFormatter;
}());
export { ExportValueFormatter };
