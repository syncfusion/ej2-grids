import * as events from '../base/constant';
import { Workbook } from '@syncfusion/ej2-excel-export';
import { isNullOrUndefined, getEnumValue, compile } from '@syncfusion/ej2-base';
import { Data } from '../actions/data';
import { ExportHelper, ExportValueFormatter } from './export-helper';
import { SummaryModelGenerator, GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { CellType } from '../base/enum';
import { Query, DataManager } from '@syncfusion/ej2-data';
var ExcelExport = (function () {
    function ExcelExport(parent) {
        this.book = {};
        this.workSheet = [];
        this.rows = [];
        this.columns = [];
        this.styles = [];
        this.rowLength = 1;
        this.expType = 'appendtosheet';
        this.includeHiddenColumn = false;
        this.isCsvExport = false;
        this.parent = parent;
    }
    ExcelExport.prototype.getModuleName = function () {
        return 'ExcelExport';
    };
    ExcelExport.prototype.init = function (gObj) {
        if (gObj.element !== null && gObj.element.id === '') {
            gObj.element.id = new Date().toISOString();
        }
        this.parent = gObj;
        if (this.parent.isDestroyed) {
            return;
        }
        this.isExporting = undefined;
        this.book = {};
        this.workSheet = [];
        this.rows = [];
        this.columns = [];
        this.styles = [];
        this.rowLength = 1;
        this.footer = undefined;
        this.expType = 'appendtosheet';
        this.includeHiddenColumn = false;
        this.exportValueFormatter = new ExportValueFormatter();
        this.theme = 'material';
    };
    ExcelExport.prototype.Map = function (grid, exportProperties, isMultipleExport, workbook, isCsv) {
        var gObj = grid;
        this.data = new Data(gObj);
        this.isExporting = true;
        if (isCsv) {
            this.isCsvExport = isCsv;
        }
        else {
            this.isCsvExport = false;
        }
        gObj.trigger(events.beforeExcelExport);
        return this.processRecords(grid, exportProperties, isMultipleExport, workbook);
    };
    ExcelExport.prototype.processRecords = function (gObj, exportProperties, isMultipleExport, workbook) {
        var _this = this;
        if (exportProperties !== undefined && exportProperties.dataSource !== undefined &&
            exportProperties.dataSource instanceof DataManager) {
            var promise = void 0;
            return promise = new Promise(function (resolve, reject) {
                var dataManager = new DataManager({ url: exportProperties.dataSource.dataSource.url, adaptor: exportProperties.dataSource.adaptor }).executeQuery(new Query());
                dataManager.then(function (r) {
                    _this.init(gObj);
                    _this.processInnerRecords(gObj, exportProperties, isMultipleExport, workbook, r);
                    resolve(_this.book);
                });
            });
        }
        else {
            var promise = void 0;
            return promise = new Promise(function (resolve, reject) {
                var dataManager = _this.data.getData({}, _this.data.generateQuery(true).requiresCount());
                dataManager.then(function (r) {
                    _this.init(gObj);
                    _this.processInnerRecords(gObj, exportProperties, isMultipleExport, workbook, r);
                    resolve(_this.book);
                });
            });
        }
    };
    ExcelExport.prototype.processInnerRecords = function (gObj, exportProperties, isMultipleExport, workbook, r) {
        var blankRows = 5;
        if (exportProperties !== undefined && exportProperties.multipleExport !== undefined) {
            this.expType = (exportProperties.multipleExport.type !== undefined ? exportProperties.multipleExport.type : 'appendtosheet');
            if (exportProperties.multipleExport.blankRows !== undefined) {
                blankRows = exportProperties.multipleExport.blankRows;
            }
        }
        if (workbook === undefined) {
            this.workSheet = [];
            this.rows = [];
            this.columns = [];
            this.styles = [];
        }
        else if (this.expType === 'newsheet') {
            this.workSheet = workbook.worksheets;
            this.rows = [];
            this.columns = [];
            this.styles = workbook.styles;
        }
        else {
            this.workSheet = [];
            this.rows = workbook.worksheets[0].rows;
            this.columns = workbook.worksheets[0].columns;
            this.styles = workbook.styles;
            this.rowLength = (this.rows[this.rows.length - 1].index + blankRows);
            this.rowLength++;
        }
        if (exportProperties !== undefined) {
            if (isMultipleExport !== undefined) {
                if (exportProperties.header !== undefined && (isMultipleExport || this.expType === 'newsheet')) {
                    this.processExcelHeader(JSON.parse(JSON.stringify(exportProperties.header)));
                }
                if (exportProperties.footer !== undefined) {
                    if (this.expType === 'appendtosheet') {
                        if (!isMultipleExport) {
                            this.footer = JSON.parse(JSON.stringify(exportProperties.footer));
                        }
                    }
                    else {
                        this.footer = JSON.parse(JSON.stringify(exportProperties.footer));
                    }
                }
            }
            else {
                if (exportProperties.header !== undefined) {
                    this.processExcelHeader(JSON.parse(JSON.stringify(exportProperties.header)));
                }
                if (exportProperties.footer !== undefined) {
                    this.footer = JSON.parse(JSON.stringify(exportProperties.footer));
                }
            }
        }
        this.includeHiddenColumn = (exportProperties !== undefined ? exportProperties.includeHiddenColumn : false);
        var headerRow = new ExportHelper(gObj).getHeaders(gObj.columns, this.includeHiddenColumn);
        var groupIndent = 0;
        if ((r.result).level !== undefined) {
            groupIndent += (r.result).level;
            groupIndent += (r.result).childLevels;
        }
        this.processHeaderContent(gObj, headerRow, exportProperties, groupIndent);
        if (exportProperties !== undefined && exportProperties.dataSource !== undefined && !(exportProperties.dataSource instanceof DataManager)) {
            this.processRecordContent(gObj, r, headerRow, isMultipleExport, exportProperties.dataSource);
        }
        else if (exportProperties !== undefined && exportProperties.exportType === 'currentview') {
            this.processRecordContent(gObj, r, headerRow, isMultipleExport, gObj.getCurrentViewRecords());
        }
        else {
            this.processRecordContent(gObj, r, headerRow, isMultipleExport);
        }
        this.isExporting = false;
        gObj.trigger(events.excelExportComplete);
    };
    ExcelExport.prototype.processRecordContent = function (gObj, returnType, headerRow, isMultipleExport, currentViewRecords) {
        var column = gObj.columns;
        var record = undefined;
        if (currentViewRecords !== undefined) {
            record = currentViewRecords;
        }
        else {
            record = returnType.result;
        }
        if (record.level !== undefined) {
            this.processGroupedRows(gObj, record, headerRow, record.level);
        }
        else {
            this.processRecordRows(gObj, record, headerRow, 0);
            if (returnType.aggregates !== undefined) {
                if (currentViewRecords !== undefined) {
                    this.processAggregates(gObj, returnType.result, currentViewRecords);
                }
                else {
                    this.processAggregates(gObj, returnType.result);
                }
            }
        }
        if (this.footer !== undefined) {
            if ((this.expType === 'appendtosheet' && !isMultipleExport) || (this.expType === 'newsheet')) {
                this.processExcelFooter(this.footer);
            }
        }
        var sheet = {};
        if (this.columns.length > 0) {
            sheet.columns = this.columns;
        }
        sheet.rows = this.rows;
        this.workSheet.push(sheet);
        this.book.worksheets = this.workSheet;
        this.book.styles = this.styles;
        if (!isMultipleExport) {
            if (this.isCsvExport) {
                var book = new Workbook(this.book, 'csv');
                book.save('Export.csv');
            }
            else {
                var book = new Workbook(this.book, 'xlsx');
                book.save('Export.xlsx');
            }
        }
    };
    ExcelExport.prototype.processGroupedRows = function (gObj, dataSource, headerRow, level) {
        for (var _i = 0, dataSource_1 = dataSource; _i < dataSource_1.length; _i++) {
            var item = dataSource_1[_i];
            var cells = [];
            var index = 1;
            var cell = {};
            cell.index = index + level;
            var args = {
                value: item.key,
                column: gObj.getColumnByField(item.field),
                style: undefined
            };
            cell.value = item.field + ': ' + this.exportValueFormatter.formatCellValue(args) + ' - ';
            if (item.count > 1) {
                cell.value += item.count + ' items';
            }
            else {
                cell.value += item.count + ' item';
            }
            cell.style = this.getCaptionThemeStyle(this.theme);
            var captionModelGen = new CaptionSummaryModelGenerator(gObj);
            var groupCaptionSummaryRows = captionModelGen.generateRows(item);
            this.fillAggregates(gObj, groupCaptionSummaryRows, dataSource.level + dataSource.childLevels, this.rowLength);
            cells.push(cell);
            if (this.rows[this.rowLength - 1].cells.length > 0) {
                var lIndex = dataSource.level + dataSource.childLevels + groupCaptionSummaryRows[0].cells.length;
                var hIndex = 0;
                for (var _a = 0, _b = this.rows[this.rowLength - 1].cells; _a < _b.length; _a++) {
                    var tCell = _b[_a];
                    if (tCell.index < lIndex) {
                        lIndex = tCell.index;
                    }
                    if (tCell.index > hIndex) {
                        hIndex = tCell.index;
                    }
                    tCell.style = this.getCaptionThemeStyle(this.theme);
                    cells.push(tCell);
                }
                if ((lIndex - cell.index) > 1) {
                    cell.colSpan = lIndex - cell.index;
                }
                while (hIndex < (headerRow.columns.length + index + level)) {
                    var sCell = {};
                    if (dataSource.childLevels === 0) {
                        sCell.index = (hIndex);
                    }
                    else {
                        sCell.index = (hIndex + 1);
                    }
                    sCell.style = this.getCaptionThemeStyle(this.theme);
                    cells.push(sCell);
                    hIndex++;
                }
            }
            else {
                var span = 0;
                for (var _c = 0, _d = headerRow.columns; _c < _d.length; _c++) {
                    var col = _d[_c];
                    if (col.visible) {
                        span++;
                    }
                }
                cell.colSpan = (dataSource.childLevels + span);
            }
            this.rows[this.rowLength - 1].cells = cells;
            this.rowLength++;
            if (dataSource.childLevels !== undefined && dataSource.childLevels > 0) {
                this.processGroupedRows(gObj, item.items, headerRow, item.items.level);
            }
            else {
                this.processRecordRows(gObj, item.items, headerRow, (level));
                this.processAggregates(gObj, item, undefined, (level));
            }
        }
    };
    ExcelExport.prototype.processRecordRows = function (gObj, record, headerRow, level) {
        var rLen = Object.keys(record).length;
        var index = 1;
        var cells = [];
        for (var r = 0; r < rLen; r++) {
            cells = [];
            index = 1;
            for (var c = 0, len = headerRow.columns.length; c < len; c++) {
                var value = record[r][headerRow.columns[c].field];
                if (!isNullOrUndefined(value)) {
                    var args = {
                        column: headerRow.columns[c], value: value, style: undefined
                    };
                    gObj.trigger(events.excelQueryCellInfo, args);
                    var cell = {};
                    cell.index = index + level;
                    cell.value = args.value;
                    if (args.style !== undefined) {
                        var styleIndex = this.getColumnStyle(gObj, index + level);
                        cell.style = this.mergeOptions(this.styles[styleIndex], args.style);
                    }
                    else {
                        cell.style = { name: gObj.element.id + 'column' + (index + level) };
                    }
                    cells.push(cell);
                }
                index++;
            }
            this.rows.push({ index: this.rowLength++, cells: cells });
        }
    };
    ExcelExport.prototype.processAggregates = function (gObj, rec, currentViewRecords, indent) {
        var summaryModel = new SummaryModelGenerator(gObj);
        var data = undefined;
        if (currentViewRecords !== undefined) {
            data = currentViewRecords;
        }
        else {
            data = rec;
        }
        if (indent === undefined) {
            indent = 0;
        }
        if (gObj.groupSettings.columns.length > 0) {
            var groupSummaryModel = new GroupSummaryModelGenerator(gObj);
            var groupSummaryRows = groupSummaryModel.generateRows(data, { level: data.level });
            if (groupSummaryRows.length > 0) {
                this.fillAggregates(gObj, groupSummaryRows, indent);
            }
        }
        var sRows = summaryModel.generateRows(data, rec.aggregates);
        if (sRows.length > 0) {
            this.fillAggregates(gObj, sRows, indent);
        }
    };
    ExcelExport.prototype.fillAggregates = function (gObj, cells, indent, customIndex) {
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var row = cells_1[_i];
            var cells_2 = [];
            var index = 0;
            for (var _a = 0, _b = row.cells; _a < _b.length; _a++) {
                var cell = _b[_a];
                var eCell = {};
                if ((cell.visible || this.includeHiddenColumn)) {
                    index++;
                    if (cell.isDataCell) {
                        eCell.index = index + indent;
                        var templateFn = {};
                        if (cell.column.footerTemplate !== undefined) {
                            templateFn[getEnumValue(CellType, CellType.Summary)] = compile(cell.column.footerTemplate);
                            var txt = (templateFn[getEnumValue(CellType, cell.cellType)](row.data[cell.column.field]));
                            eCell.value = txt[0].wholeText;
                        }
                        else if (cell.column.groupFooterTemplate !== undefined) {
                            templateFn[getEnumValue(CellType, CellType.GroupSummary)] = compile(cell.column.groupFooterTemplate);
                            var txt = (templateFn[getEnumValue(CellType, cell.cellType)](row.data[cell.column.field]));
                            eCell.value = txt[0].wholeText;
                        }
                        else if (cell.column.groupCaptionTemplate !== undefined) {
                            templateFn[getEnumValue(CellType, CellType.CaptionSummary)] = compile(cell.column.groupCaptionTemplate);
                            var txt = (templateFn[getEnumValue(CellType, cell.cellType)](row.data[cell.column.field]));
                            eCell.value = txt[0].wholeText;
                        }
                        else {
                            for (var _c = 0, _d = Object.keys(row.data[cell.column.field]); _c < _d.length; _c++) {
                                var key = _d[_c];
                                if (key === cell.column.type) {
                                    if (row.data[cell.column.field].sum !== undefined) {
                                        eCell.value = row.data[cell.column.field].sum;
                                    }
                                    else if (row.data[cell.column.field].average !== undefined) {
                                        eCell.value = row.data[cell.column.field].average;
                                    }
                                    else if (row.data[cell.column.field].max !== undefined) {
                                        eCell.value = row.data[cell.column.field].max;
                                    }
                                    else if (row.data[cell.column.field].min !== undefined) {
                                        eCell.value = row.data[cell.column.field].min;
                                    }
                                    else if (row.data[cell.column.field].count !== undefined) {
                                        eCell.value = row.data[cell.column.field].count;
                                    }
                                    else if (row.data[cell.column.field].truecount !== undefined) {
                                        eCell.value = row.data[cell.column.field].truecount;
                                    }
                                    else if (row.data[cell.column.field].falsecount !== undefined) {
                                        eCell.value = row.data[cell.column.field].falsecount;
                                    }
                                    else if (row.data[cell.column.field].custom !== undefined) {
                                        eCell.value = row.data[cell.column.field].custom;
                                    }
                                }
                            }
                        }
                        eCell.style = this.getCaptionThemeStyle(this.theme);
                        cells_2.push(eCell);
                    }
                    else {
                        if (customIndex === undefined) {
                            eCell.index = index + indent;
                            eCell.style = this.getCaptionThemeStyle(this.theme);
                            cells_2.push(eCell);
                        }
                    }
                }
            }
            if (customIndex !== undefined) {
                this.rows.push({ index: customIndex, cells: cells_2 });
            }
            else {
                this.rows.push({ index: this.rowLength++, cells: cells_2 });
            }
        }
    };
    ExcelExport.prototype.mergeOptions = function (JSON1, JSON2) {
        var result = {};
        var attrname = Object.keys(JSON1);
        for (var index = 0; index < attrname.length; index++) {
            if (attrname[index] !== 'name') {
                result[attrname[index]] = JSON1[attrname[index]];
            }
        }
        attrname = Object.keys(JSON2);
        for (var index = 0; index < attrname.length; index++) {
            if (attrname[index] !== 'name') {
                result[attrname[index]] = JSON2[attrname[index]];
            }
        }
        return result;
    };
    ExcelExport.prototype.getColumnStyle = function (gObj, columnIndex) {
        var index = 0;
        for (var _i = 0, _a = this.styles; _i < _a.length; _i++) {
            var style = _a[_i];
            if (style.name === gObj.element.id + 'column' + columnIndex) {
                return index;
            }
            index++;
        }
        return undefined;
    };
    ExcelExport.prototype.processHeaderContent = function (gObj, headerRow, exportProperties, indent) {
        var column = gObj.columns;
        var rowIndex = 1;
        var returnValue = headerRow;
        var gridRows = returnValue.rows;
        var gridColumns = returnValue.columns;
        var spannedCells = [];
        if (indent > 0) {
            var index = 0;
            while (index !== indent) {
                this.columns.push({ index: index + 1, width: 30 });
                index++;
            }
        }
        for (var row = 0; row < gridRows.length; row++) {
            var currentCellIndex = 1 + indent;
            var cells = [];
            for (var column_1 = 0; column_1 < gridRows[row].cells.length; column_1++) {
                var style = {};
                var cell = {};
                var gridCell = gridRows[row].cells[column_1];
                var result = { contains: true, index: 1 };
                while (result.contains) {
                    result = this.getIndex(spannedCells, rowIndex, currentCellIndex);
                    currentCellIndex = result.index;
                    if (!result.contains) {
                        cell.index = result.index;
                        break;
                    }
                }
                if (gridCell.rowSpan !== undefined && gridCell.rowSpan !== 1) {
                    cell.rowSpan = gridCell.rowSpan;
                    for (var i = rowIndex; i < gridCell.rowSpan + rowIndex; i++) {
                        var spannedCell = { rowIndex: 0, columnIndex: 0 };
                        spannedCell.rowIndex = i;
                        spannedCell.columnIndex = currentCellIndex;
                        spannedCells.push(spannedCell);
                    }
                }
                if (gridCell.colSpan !== undefined && gridCell.colSpan !== 1) {
                    cell.colSpan = gridCell.colSpan;
                    currentCellIndex = currentCellIndex + cell.colSpan - 1;
                }
                cell.value = gridCell.column.headerText;
                if (exportProperties !== undefined && exportProperties.theme !== undefined) {
                    this.theme = exportProperties.theme;
                }
                cell.style = this.getHeaderThemeStyle(this.theme);
                if (gridCell.column.textAlign !== undefined) {
                    style.hAlign = gridCell.column.textAlign;
                }
                if (gridCell.column.headerTextAlign !== undefined) {
                    style.hAlign = gridCell.column.headerTextAlign;
                }
                cell.style = style;
                cells.push(cell);
                currentCellIndex++;
            }
            this.rows.push({ index: this.rowLength++, cells: cells });
        }
        for (var col = 0; col < gridColumns.length; col++) {
            this.parseStyles(gObj, gridColumns[col], this.getRecordThemeStyle(this.theme), indent + col + 1);
        }
    };
    ExcelExport.prototype.getHeaderThemeStyle = function (theme) {
        var style = {};
        switch (theme) {
            case 'fabric':
                style.fontColor = '#666666';
                style.fontName = 'Segoe UI';
                style.fontSize = 14;
                style.borders = { color: '#EAEAEA' };
                break;
            case 'bootstrap':
                style.fontColor = '#33330F';
                style.fontSize = 14;
                style.bold = true;
                style.borders = { color: '#33330F' };
                break;
            default:
                style.fontSize = 12;
                style.borders = { color: '#E0E0E0' };
                break;
        }
        return style;
    };
    ExcelExport.prototype.getCaptionThemeStyle = function (theme) {
        var style = {};
        switch (theme) {
            case 'fabric':
                style.fontColor = '#33330F';
                style.fontName = 'Segoe UI';
                style.fontSize = 14;
                style.backColor = '#F6F6F6';
                style.borders = { color: '#EAEAEA' };
                break;
            case 'bootstrap':
                style.fontColor = '#33330F';
                style.fontSize = 14;
                style.bold = true;
                style.borders = { color: '#EAEAEA' };
                break;
            default:
                style.fontSize = 13;
                style.backColor = '#F6F6F6';
                break;
        }
        return style;
    };
    ExcelExport.prototype.getRecordThemeStyle = function (theme) {
        var style = {};
        switch (theme) {
            case 'fabric':
                style.fontColor = '#333333';
                style.fontName = 'Segoe UI';
                style.fontSize = 13;
                style.borders = { color: '#EAEAEA' };
                break;
            case 'bootstrap':
                style.fontColor = '#33330F';
                style.fontSize = 14;
                style.borders = { color: '#DDDDDD' };
                break;
            default:
                style.fontSize = 13;
                style.borders = { color: '#E0E0E0' };
                break;
        }
        return style;
    };
    ExcelExport.prototype.processExcelHeader = function (header) {
        if (header.rows !== undefined && (this.expType === 'newsheet' || this.rowLength === 1)) {
            var noRows = void 0;
            if (header.headerRows === undefined) {
                this.rowLength = header.rows.length;
            }
            else {
                this.rowLength = header.headerRows;
            }
            if (this.rowLength < header.rows.length) {
                noRows = this.rowLength;
            }
            else {
                noRows = header.rows.length;
            }
            this.rowLength++;
            for (var row = 0; row < noRows; row++) {
                var json = header.rows[row];
                if (!(json.index !== null && json.index !== undefined)) {
                    json.index = (row + 1);
                }
                this.updatedCellIndex(json);
            }
        }
    };
    ExcelExport.prototype.updatedCellIndex = function (json) {
        var cellsLength = json.cells.length;
        for (var cellId = 0; cellId < cellsLength; cellId++) {
            var jsonCell = json.cells[cellId];
            if (!(jsonCell.index !== null && jsonCell.index !== undefined)) {
                jsonCell.index = (cellId + 1);
            }
        }
        this.rows.push(json);
    };
    ExcelExport.prototype.processExcelFooter = function (footer) {
        if (footer.rows !== undefined) {
            var noRows = void 0;
            if (footer.footerRows === undefined) {
                this.rowLength += footer.rows.length;
            }
            else {
                if (footer.footerRows > footer.rows.length) {
                    this.rowLength += (footer.footerRows - footer.rows.length);
                    noRows = footer.rows.length;
                }
                else {
                    noRows = footer.footerRows;
                }
            }
            for (var row = 0; row < noRows; row++) {
                var json = footer.rows[row];
                if (json.index === null || json.index === undefined) {
                    json.index = this.rowLength++;
                }
                else {
                    json.index += this.rowLength;
                }
                this.updatedCellIndex(json);
            }
        }
    };
    ExcelExport.prototype.getIndex = function (spannedCells, rowIndex, columnIndex) {
        for (var _i = 0, spannedCells_1 = spannedCells; _i < spannedCells_1.length; _i++) {
            var spannedCell = spannedCells_1[_i];
            if ((spannedCell.rowIndex === rowIndex) && (spannedCell.columnIndex === columnIndex)) {
                columnIndex = columnIndex + 1;
                return { contains: true, index: columnIndex };
            }
        }
        return { contains: false, index: columnIndex };
    };
    ExcelExport.prototype.parseStyles = function (gObj, col, style, index) {
        if (col.format !== undefined) {
            if (col.format.skeleton !== undefined) {
                style.numberFormat = col.format.skeleton;
                if (col.format.type !== undefined) {
                    style.type = col.format.type;
                }
            }
            else {
                style.numberFormat = col.format;
                style.type = col.type;
            }
        }
        if (col.textAlign !== undefined) {
            style.hAlign = col.textAlign;
        }
        if (Object.keys(style).length > 0) {
            style.name = gObj.element.id + 'column' + index;
            this.styles.push(style);
        }
        if (col.width !== undefined) {
            this.columns.push({ index: index, width: col.width });
        }
    };
    ExcelExport.prototype.destroy = function () {
    };
    return ExcelExport;
}());
export { ExcelExport };
