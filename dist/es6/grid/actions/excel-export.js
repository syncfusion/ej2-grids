import * as events from '../base/constant';
import { Workbook } from '@syncfusion/ej2-excel-export';
import { isNullOrUndefined, getEnumValue, compile, extend } from '@syncfusion/ej2-base';
import { Data } from '../actions/data';
import { ExportHelper, ExportValueFormatter } from './export-helper';
import { SummaryModelGenerator, GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { CellType } from '../base/enum';
import { Query, DataManager } from '@syncfusion/ej2-data';
/**
 * @hidden
 * `ExcelExport` module is used to handle the Excel export action.
 */
var ExcelExport = /** @class */ (function () {
    /**
     * Constructor for the Grid Excel Export module.
     * @hidden
     */
    function ExcelExport(parent) {
        /* tslint:disable-next-line:no-any */
        this.book = {};
        /* tslint:disable-next-line:no-any */
        this.workSheet = [];
        /* tslint:disable-next-line:no-any */
        this.rows = [];
        /* tslint:disable-next-line:no-any */
        this.columns = [];
        /* tslint:disable-next-line:no-any */
        this.styles = [];
        this.rowLength = 1;
        this.expType = 'appendtosheet';
        this.includeHiddenColumn = false;
        this.isCsvExport = false;
        this.isElementIdChanged = false;
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     */
    ExcelExport.prototype.getModuleName = function () {
        return 'ExcelExport';
    };
    ExcelExport.prototype.init = function (gObj) {
        if (gObj.element !== null && gObj.element.id === '') {
            gObj.element.id = new Date().toISOString();
            this.isElementIdChanged = true;
        }
        this.parent = gObj;
        if (this.parent.isDestroyed) {
            return;
        }
        this.isExporting = undefined;
        this.book = {};
        /* tslint:disable-next-line:no-any */
        this.workSheet = [];
        /* tslint:disable-next-line:no-any */
        this.rows = [];
        /* tslint:disable-next-line:no-any */
        this.columns = [];
        /* tslint:disable-next-line:no-any */
        this.styles = [];
        this.rowLength = 1;
        /* tslint:disable-next-line:no-any */
        this.footer = undefined;
        this.expType = 'appendtosheet';
        this.includeHiddenColumn = false;
        this.exportValueFormatter = new ExportValueFormatter();
        this.helper = new ExportHelper(gObj);
        //this.theme = 'material';
    };
    /**
     * Export Grid to Excel file.
     * @param  {exportProperties} exportProperties - Defines the export properties of the Grid.
     * @param  {isMultipleExport} isMultipleExport - Defines is multiple Grid's are exported.
     * @param  {workbook} workbook - Defined the Workbook if multiple Grid is exported.
     * @param  {isCsv} isCsv - true if export to CSV.
     * @return {Promise<any>}
     */
    /* tslint:disable-next-line:max-line-length */
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.Map = function (grid, exportProperties, isMultipleExport, workbook, isCsv) {
        var gObj = grid;
        gObj.trigger(events.beforeExcelExport);
        this.data = new Data(gObj);
        this.isExporting = true;
        if (isCsv) {
            this.isCsvExport = isCsv;
        }
        else {
            this.isCsvExport = false;
        }
        return this.processRecords(gObj, exportProperties, isMultipleExport, workbook);
    };
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.processRecords = function (gObj, exportProperties, isMultipleExport, workbook) {
        var _this = this;
        if (exportProperties !== undefined && exportProperties.dataSource !== undefined &&
            exportProperties.dataSource instanceof DataManager) {
            /* tslint:disable-next-line:no-any */
            var promise = void 0;
            return promise = new Promise(function (resolve, reject) {
                /* tslint:disable-next-line:max-line-length */
                /* tslint:disable-next-line:no-any */
                var dataManager = new DataManager({ url: exportProperties.dataSource.dataSource.url, adaptor: exportProperties.dataSource.adaptor }).executeQuery(new Query());
                dataManager.then(function (r) {
                    _this.init(gObj);
                    _this.processInnerRecords(gObj, exportProperties, isMultipleExport, workbook, r);
                    resolve(_this.book);
                });
            });
        }
        else {
            /* tslint:disable-next-line:no-any */
            var promise = void 0;
            return promise = new Promise(function (resolve, reject) {
                var dataManager = _this.data.getData({}, ExportHelper.getQuery(gObj, _this.data));
                dataManager.then(function (r) {
                    _this.init(gObj);
                    _this.processInnerRecords(gObj, exportProperties, isMultipleExport, workbook, r);
                    resolve(_this.book);
                });
            });
        }
    };
    /* tslint:disable-next-line:max-line-length */
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.processInnerRecords = function (gObj, exportProperties, isMultipleExport, workbook, r) {
        var blankRows = 5;
        if (exportProperties !== undefined && exportProperties.multipleExport !== undefined) {
            /* tslint:disable-next-line:max-line-length */
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
        /* tslint:disable-next-line:max-line-length */
        /* tslint:disable-next-line:no-any */
        var headerRow = this.helper.getHeaders(gObj.columns, this.includeHiddenColumn);
        var groupIndent = 0;
        /* tslint:disable:no-any */
        if ((r.result).level !== undefined) {
            groupIndent += (r.result).level;
            groupIndent += (r.result).childLevels;
        }
        /* tslint:enable:no-any */
        this.processHeaderContent(gObj, headerRow, exportProperties, groupIndent);
        /* tslint:disable-next-line:max-line-length */
        if (exportProperties !== undefined && exportProperties.dataSource !== undefined && !(exportProperties.dataSource instanceof DataManager)) {
            this.processRecordContent(gObj, r, headerRow, isMultipleExport, exportProperties.dataSource);
        }
        else if (exportProperties !== undefined && exportProperties.exportType === 'currentpage') {
            this.processRecordContent(gObj, r, headerRow, isMultipleExport, gObj.getCurrentViewRecords());
        }
        else {
            this.processRecordContent(gObj, r, headerRow, isMultipleExport);
        }
        this.isExporting = false;
        gObj.trigger(events.excelExportComplete);
    };
    /* tslint:disable-next-line:max-line-length */
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.processRecordContent = function (gObj, returnType, headerRow, isMultipleExport, currentViewRecords) {
        /* tslint:disable-next-line:no-any */
        var column = gObj.columns;
        /* tslint:disable-next-line:no-any */
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
        //footer template add
        if (this.footer !== undefined) {
            if ((this.expType === 'appendtosheet' && !isMultipleExport) || (this.expType === 'newsheet')) {
                this.processExcelFooter(this.footer);
            }
        }
        /* tslint:disable-next-line:no-any */
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
            if (this.isElementIdChanged) {
                gObj.element.id = '';
            }
        }
    };
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.processGroupedRows = function (gObj, dataSource, headerRow, level) {
        for (var _i = 0, dataSource_1 = dataSource; _i < dataSource_1.length; _i++) {
            var item = dataSource_1[_i];
            /* tslint:disable-next-line:no-any */
            var cells = [];
            var index = 1;
            /* tslint:disable-next-line:no-any */
            var cell = {};
            cell.index = index + level;
            /* tslint:disable-next-line:no-any */
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
                    /* tslint:disable-next-line:no-any */
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
                //Calculation for column span when group caption dont have aggregates
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
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.processRecordRows = function (gObj, record, headerRow, level) {
        var rLen = Object.keys(record).length;
        var index = 1;
        /* tslint:disable-next-line:no-any */
        var cells = [];
        for (var r = 0; r < rLen; r++) {
            cells = [];
            index = 1;
            for (var c = 0, len = headerRow.columns.length; c < len; c++) {
                /* tslint:disable-next-line:no-any */
                var value = record[r][headerRow.columns[c].field];
                if (!isNullOrUndefined(value)) {
                    /* tslint:disable-next-line:no-any */
                    var excelCellArgs = { data: record[r], column: headerRow.columns[c] };
                    gObj.trigger(events.excelQueryCellInfo, extend(excelCellArgs, {
                        column: headerRow.columns[c], data: record[r],
                        value: value, style: undefined, colSpan: 1
                    }));
                    /* tslint:disable-next-line:no-any */
                    var cell = {};
                    cell.index = index + level;
                    cell.value = excelCellArgs.value;
                    if (excelCellArgs.colSpan > 1) {
                        cell.colSpan = excelCellArgs.colSpan;
                    }
                    if (excelCellArgs.style !== undefined) {
                        var styleIndex = this.getColumnStyle(gObj, index + level);
                        cell.style = this.mergeOptions(this.styles[styleIndex], excelCellArgs.style);
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
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.processAggregates = function (gObj, rec, currentViewRecords, indent) {
        var summaryModel = new SummaryModelGenerator(gObj);
        /* tslint:disable-next-line:no-any */
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
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.fillAggregates = function (gObj, cells, indent, customIndex) {
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var row = cells_1[_i];
            /* tslint:disable-next-line:no-any */
            var cells_2 = [];
            var index = 0;
            for (var _a = 0, _b = row.cells; _a < _b.length; _a++) {
                var cell = _b[_a];
                /* tslint:disable-next-line:no-any */
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
                        eCell.style = this.getCaptionThemeStyle(this.theme); //{ name: gObj.element.id + 'column' + index };
                        cells_2.push(eCell);
                    }
                    else {
                        if (customIndex === undefined) {
                            eCell.index = index + indent;
                            eCell.style = this.getCaptionThemeStyle(this.theme); //{ name: gObj.element.id + 'column' + index };
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
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.mergeOptions = function (JSON1, JSON2) {
        /* tslint:disable-next-line:no-any */
        var result = {};
        /* tslint:disable-next-line:no-any */
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
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.processHeaderContent = function (gObj, headerRow, exportProperties, indent) {
        /* tslint:disable-next-line:no-any */
        var column = gObj.columns;
        var rowIndex = 1;
        /* tslint:disable-next-line:no-any */
        var returnValue = headerRow;
        /* tslint:enable:no-any */
        var gridRows = returnValue.rows;
        // Column collection with respect to the records in the grid
        var gridColumns = returnValue.columns;
        /* tslint:disable-next-line:no-any */
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
            /* tslint:disable-next-line:no-any */
            var cells = [];
            for (var column_1 = 0; column_1 < gridRows[row].cells.length; column_1++) {
                /* tslint:disable-next-line:no-any */
                var style = {};
                /* tslint:disable-next-line:no-any */
                var cell = {};
                /* tslint:disable-next-line:no-any */
                var gridCell = gridRows[row].cells[column_1];
                /* tslint:disable-next-line:no-any */
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
                        /* tslint:disable-next-line:no-any */
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
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.getHeaderThemeStyle = function (theme) {
        /* tslint:disable-next-line:no-any */
        var style = {};
        style.fontSize = 12;
        style.borders = { color: '#E0E0E0' };
        if (theme !== undefined && theme.header !== undefined) {
            style = this.updateThemeStyle(theme.header, style);
        }
        return style;
    };
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.updateThemeStyle = function (themestyle, style) {
        if (themestyle.fontColor !== undefined) {
            style.fontColor = themestyle.fontColor;
        }
        if (themestyle.fontName !== undefined) {
            style.fontName = themestyle.fontName;
        }
        if (themestyle.fontSize !== undefined) {
            style.fontSize = themestyle.fontSize;
        }
        if (themestyle.borders !== undefined) {
            if (themestyle.borders.color !== undefined) {
                style.borders.color = themestyle.borders.color;
            }
            if (themestyle.borders.lineStyle !== undefined) {
                style.borders.lineStyle = themestyle.borders.lineStyle;
            }
        }
        if (themestyle.bold !== false) {
            style.bold = themestyle.bold;
        }
        return style;
    };
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.getCaptionThemeStyle = function (theme) {
        /* tslint:disable-next-line:no-any */
        var style = {};
        style.fontSize = 13;
        style.backColor = '#F6F6F6';
        if (theme !== undefined && theme.caption !== undefined) {
            style = this.updateThemeStyle(theme.caption, style);
        }
        return style;
    };
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.getRecordThemeStyle = function (theme) {
        /* tslint:disable-next-line:no-any */
        var style = {};
        style.fontSize = 13;
        style.borders = { color: '#E0E0E0' };
        if (theme !== undefined && theme.record !== undefined) {
            style = this.updateThemeStyle(theme.record, style);
        }
        return style;
    };
    /* tslint:disable-next-line:no-any */
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
                /* tslint:disable-next-line:no-any */
                var json = header.rows[row];
                //Row index
                if (!(json.index !== null && json.index !== undefined)) {
                    json.index = (row + 1);
                }
                this.updatedCellIndex(json);
            }
        }
    };
    /* tslint:disable-next-line:no-any */
    ExcelExport.prototype.updatedCellIndex = function (json) {
        var cellsLength = json.cells.length;
        for (var cellId = 0; cellId < cellsLength; cellId++) {
            /* tslint:disable-next-line:no-any */
            var jsonCell = json.cells[cellId];
            //cell index
            if (!(jsonCell.index !== null && jsonCell.index !== undefined)) {
                jsonCell.index = (cellId + 1);
            }
        }
        this.rows.push(json);
    };
    /* tslint:disable-next-line:no-any */
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
                /* tslint:disable-next-line:no-any */
                var json = footer.rows[row];
                //Row index
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
    /* tslint:disable-next-line:no-any */
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
    /* tslint:disable-next-line:no-any */
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
            /* tslint:disable-next-line:max-line-length */
            this.columns.push({ index: index, width: typeof col.width === 'number' ? col.width : this.helper.getConvertedWidth(col.width) });
        }
    };
    /**
     * To destroy the excel export
     * @return {void}
     * @hidden
     */
    ExcelExport.prototype.destroy = function () {
        //destroy for exporting
    };
    return ExcelExport;
}());
export { ExcelExport };
