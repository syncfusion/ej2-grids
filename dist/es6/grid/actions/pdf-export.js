import * as events from '../base/constant';
import { PdfDocument, PdfGrid, PdfBorders, PdfPen } from '@syncfusion/ej2-pdf-export';
import { PdfStandardFont, PdfFontFamily, PdfFontStyle, PdfBitmap } from '@syncfusion/ej2-pdf-export';
import { PdfStringFormat, PdfTextAlignment, PdfColor, PdfSolidBrush } from '@syncfusion/ej2-pdf-export';
import { PdfVerticalAlignment, RectangleF, PdfPageTemplateElement } from '@syncfusion/ej2-pdf-export';
import { PointF, PdfPageNumberField, PdfCompositeField } from '@syncfusion/ej2-pdf-export';
import { PdfPageCountField, SizeF, PdfPageSettings, PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import { ExportHelper, ExportValueFormatter } from './export-helper';
import { Data } from '../actions/data';
import { SummaryModelGenerator, GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { compile, getEnumValue } from '@syncfusion/ej2-base';
import { CellType } from '../base/enum';
import { DataManager, Query } from '@syncfusion/ej2-data';
var PdfExport = (function () {
    function PdfExport(parent) {
        this.hideColumnInclude = false;
        this.currentViewData = false;
        this.customDataSource = false;
        this.gridTheme = 'material';
        this.isGrouping = false;
        this.parent = parent;
        this.data = new Data(parent);
        if (this.parent.isDestroyed) {
            return;
        }
    }
    PdfExport.prototype.getModuleName = function () {
        return 'PdfExport';
    };
    PdfExport.prototype.init = function (parent) {
        this.exportValueFormatter = new ExportValueFormatter();
        this.pdfDocument = undefined;
        this.hideColumnInclude = false;
        this.currentViewData = false;
        this.parent = parent;
        var gObj = parent;
        this.gridTheme = 'material';
        this.isGrouping = false;
        this.isExporting = true;
        gObj.trigger(events.beforePdfExport);
    };
    PdfExport.prototype.Map = function (parent, pdfExportProperties, isMultipleExport, pdfDoc) {
        var _this = this;
        this.data = new Data(this.parent);
        if (pdfExportProperties !== undefined && pdfExportProperties.dataSource !== undefined && pdfExportProperties.dataSource instanceof DataManager) {
            var promise = void 0;
            return promise = new Promise(function (resolve, reject) {
                new DataManager({ url: pdfExportProperties.dataSource.dataSource.url, adaptor: pdfExportProperties.dataSource.adaptor }).executeQuery(new Query()).then(function (returnType) {
                    _this.init(parent);
                    if (pdfDoc !== undefined) {
                        _this.pdfDocument = pdfDoc;
                    }
                    else {
                        _this.pdfDocument = new PdfDocument();
                    }
                    _this.processExport(parent, returnType, pdfExportProperties, isMultipleExport);
                    _this.isExporting = false;
                    parent.trigger(events.pdfExportComplete);
                    resolve(_this.pdfDocument);
                });
            });
        }
        else {
            var promise = void 0;
            return promise = new Promise(function (resolve, reject) {
                var dataManager = _this.data.getData({}, _this.data.generateQuery(true).requiresCount());
                dataManager.then(function (returnType) {
                    _this.init(parent);
                    if (pdfDoc !== undefined) {
                        _this.pdfDocument = pdfDoc;
                    }
                    else {
                        _this.pdfDocument = new PdfDocument();
                    }
                    _this.processExport(parent, returnType, pdfExportProperties, isMultipleExport);
                    _this.isExporting = false;
                    parent.trigger(events.pdfExportComplete);
                    resolve(_this.pdfDocument);
                });
            });
        }
    };
    PdfExport.prototype.processExport = function (gObj, returnType, pdfExportProperties, isMultipleExport) {
        var columns = gObj.columns;
        var dataSource = returnType.result;
        var section = this.pdfDocument.sections.add();
        var result = this.processExportProperties(pdfExportProperties, dataSource, section);
        dataSource = result.dataSource;
        if (dataSource.GroupGuid !== undefined) {
            this.isGrouping = true;
        }
        section = result.section;
        var pdfPage = section.pages.add();
        var pdfGrid = new PdfGrid();
        var headerThemeStyle = this.getHeaderThemeStyle();
        var border = headerThemeStyle.border;
        var headerFont = headerThemeStyle.font;
        var headerBrush = headerThemeStyle.brush;
        var returnValue = (new ExportHelper(this.parent)).getHeaders(columns, this.hideColumnInclude);
        var rows = returnValue.rows;
        var gridColumns = returnValue.columns;
        pdfGrid = this.processGridHeaders(dataSource.childLevels, pdfGrid, rows, gridColumns, border, headerFont, headerBrush);
        this.setColumnProperties(gridColumns, pdfGrid);
        var captionThemeStyle = this.getSummaryCaptionThemeStyle();
        if (dataSource !== undefined && dataSource !== null && dataSource.length > 0) {
            if (this.isGrouping) {
                this.processGroupedRecords(pdfGrid, dataSource, gridColumns, gObj, border, 0, captionThemeStyle.font, captionThemeStyle.brush, captionThemeStyle.backgroundBrush, returnType);
            }
            else {
                this.processRecord(border, gridColumns, gObj, dataSource, pdfGrid);
            }
            if (returnType.aggregates !== undefined) {
                var summaryModel = new SummaryModelGenerator(gObj);
                var sRows = void 0;
                if (this.customDataSource) {
                    sRows = summaryModel.generateRows(dataSource, returnType.aggregates);
                }
                else if (this.currentViewData) {
                    sRows = summaryModel.generateRows(this.parent.getCurrentViewRecords(), returnType.aggregates);
                }
                else if (this.isGrouping) {
                    sRows = summaryModel.generateRows(dataSource.records, returnType.aggregates);
                }
                else {
                    sRows = summaryModel.generateRows(returnType.result, returnType.aggregates);
                }
                this.processAggregates(sRows, pdfGrid, border, captionThemeStyle.font, captionThemeStyle.brush, captionThemeStyle.backgroundBrush, false);
            }
        }
        else {
            var row = pdfGrid.rows.addRow();
            row.style.setBorder(border);
        }
        pdfGrid.draw(pdfPage, 20, 20);
        if (!isMultipleExport) {
            this.pdfDocument.save('Export.pdf');
        }
    };
    PdfExport.prototype.getSummaryCaptionThemeStyle = function () {
        switch (this.gridTheme) {
            case 'bootstrap':
                return { font: new PdfStandardFont(PdfFontFamily.Helvetica, 10.5), brush: new PdfSolidBrush(new PdfColor(51, 51, 51)), backgroundBrush: new PdfSolidBrush(new PdfColor(255, 255, 255)) };
            case 'fabric':
                return { font: new PdfStandardFont(PdfFontFamily.Helvetica, 10.5), brush: new PdfSolidBrush(new PdfColor(51, 51, 51)), backgroundBrush: new PdfSolidBrush(new PdfColor(246, 246, 246)) };
            default:
                return { font: new PdfStandardFont(PdfFontFamily.Helvetica, 9.75), brush: new PdfSolidBrush(new PdfColor(0, 0, 0)), backgroundBrush: new PdfSolidBrush(new PdfColor(246, 246, 246)) };
        }
    };
    PdfExport.prototype.getHeaderThemeStyle = function () {
        var border = new PdfBorders();
        switch (this.gridTheme) {
            case 'bootstrap':
                border.all = new PdfPen(new PdfColor(221, 221, 221));
                return { border: border, font: new PdfStandardFont(PdfFontFamily.Helvetica, 10.5), brush: new PdfSolidBrush(new PdfColor(51, 51, 51)) };
            case 'fabric':
                border.all = new PdfPen(new PdfColor(224, 224, 224));
                return { border: border, font: new PdfStandardFont(PdfFontFamily.Helvetica, 9), brush: new PdfSolidBrush(new PdfColor(0, 0, 0.54)) };
            default:
                border.all = new PdfPen(new PdfColor(234, 234, 234));
                return { border: border, font: new PdfStandardFont(PdfFontFamily.Helvetica, 10.5), brush: new PdfSolidBrush(new PdfColor(102, 102, 102)) };
        }
    };
    PdfExport.prototype.processGroupedRecords = function (pdfGrid, dataSource, gridColumns, gObj, border, level, font, brush, backgroundBrush, returnType) {
        var groupIndex = level;
        for (var _i = 0, dataSource_1 = dataSource; _i < dataSource_1.length; _i++) {
            var dataSourceItems = dataSource_1[_i];
            var row = pdfGrid.rows.addRow();
            var args = {
                value: dataSourceItems.key,
                column: gObj.getColumnByField(dataSourceItems.field),
                style: undefined
            };
            var value = dataSourceItems.field + ': ' + this.exportValueFormatter.formatCellValue(args) + ' - ' + dataSourceItems.count + (dataSource.count > 1 ? ' items' : ' item');
            row.cells.getCell(groupIndex).value = value;
            row.style.setBorder(border);
            row.style.setFont(font);
            row.style.setTextBrush(brush);
            row.style.setBackgroundBrush(backgroundBrush);
            var sRows = void 0;
            var captionSummaryModel = new CaptionSummaryModelGenerator(gObj);
            if (dataSourceItems.items.records !== undefined) {
                sRows = captionSummaryModel.generateRows(dataSourceItems.items.records, returnType.aggregates);
            }
            else {
                sRows = captionSummaryModel.generateRows(dataSourceItems.items, returnType.aggregates);
            }
            if (sRows !== undefined && sRows.length === 0) {
                row.cells.getCell(groupIndex + 1).columnSpan = pdfGrid.columns.count - (groupIndex + 1);
            }
            if (dataSource.childLevels !== undefined && dataSource.childLevels > 0) {
                this.processAggregates(sRows, pdfGrid, border, font, brush, backgroundBrush, true, row, groupIndex);
                this.processGroupedRecords(pdfGrid, dataSourceItems.items, gridColumns, gObj, border, (groupIndex + 1), font, brush, backgroundBrush, returnType);
                var groupSummaryModel = new GroupSummaryModelGenerator(gObj);
                sRows = groupSummaryModel.generateRows(dataSourceItems.items.records, returnType.aggregates);
                this.processAggregates(sRows, pdfGrid, border, font, brush, backgroundBrush, false);
            }
            else {
                this.processAggregates(sRows, pdfGrid, border, font, brush, backgroundBrush, true, row, groupIndex);
                this.processRecord(border, gridColumns, gObj, dataSourceItems.items, pdfGrid, (groupIndex + 1));
                var groupSummaryModel = new GroupSummaryModelGenerator(gObj);
                sRows = groupSummaryModel.generateRows(dataSourceItems.items, returnType.aggregates);
                this.processAggregates(sRows, pdfGrid, border, font, brush, backgroundBrush, false);
            }
        }
    };
    PdfExport.prototype.processGridHeaders = function (childLevels, pdfGrid, rows, gridColumns, border, headerFont, headerBrush) {
        var columnCount = gridColumns.length;
        if (this.isGrouping) {
            columnCount += (childLevels + 1);
        }
        pdfGrid.columns.add(columnCount);
        if (this.isGrouping) {
            for (var i = 0; i < (childLevels + 1); i++) {
                pdfGrid.columns.getColumn(i).width = 20;
            }
        }
        pdfGrid.headers.add(rows.length);
        for (var i = 0; i < rows.length; i++) {
            var gridHeader = pdfGrid.headers.getHeader(i);
            gridHeader.style.setBorder(border);
            gridHeader.style.setFont(headerFont);
            gridHeader.style.setTextBrush(headerBrush);
            var cellIndex = this.isGrouping ? (childLevels + 1) : 0;
            if (rows[i].cells.length === 0) {
                for (var j = 0; j < gridHeader.cells.count; j++) {
                    var cell = gridHeader.cells.getCell(j);
                    cell.value = '';
                }
            }
            else {
                for (var j = 0; j < cellIndex; j++) {
                    var cell = gridHeader.cells.getCell(j);
                    cell.value = '';
                }
                for (var j = 0; j < rows[i].cells.length; j++) {
                    var cell = gridHeader.cells.getCell(cellIndex);
                    if (cell.value !== null) {
                        cell.value = rows[i].cells[j].column.headerText;
                        if (rows[i].cells[j].column.headerTextAlign !== undefined) {
                            cell.style.stringFormat = this.getHorizontalAlignment(rows[i].cells[j].column.headerTextAlign);
                        }
                        if (rows[i].cells[j].rowSpan !== undefined) {
                            cell.rowSpan = rows[i].cells[j].rowSpan;
                            cell.style.stringFormat = this.getVerticalAlignment('bottom', cell.style.stringFormat, rows[i].cells[j].column.textAlign);
                            for (var k = 1; k < rows[i].cells[j].rowSpan; k++) {
                                pdfGrid.headers.getHeader(i + k).cells.getCell(cellIndex).value = null;
                            }
                        }
                        if (rows[i].cells[j].colSpan !== undefined) {
                            cell.columnSpan = rows[i].cells[j].colSpan;
                        }
                        cellIndex += cell.columnSpan;
                    }
                    else {
                        cell.value = '';
                        cellIndex += cell.columnSpan;
                        j = j - 1;
                    }
                }
            }
        }
        if (pdfGrid.columns.count >= 6) {
            pdfGrid.style.allowHorizontalOverflow = true;
        }
        return pdfGrid;
    };
    PdfExport.prototype.processExportProperties = function (pdfExportProperties, dataSource, section) {
        if (pdfExportProperties !== undefined) {
            if (pdfExportProperties.theme !== undefined) {
                this.gridTheme = pdfExportProperties.theme;
            }
            if (pdfExportProperties.pageOrientation !== undefined || pdfExportProperties.pageSize !== undefined) {
                var pdfPageSettings = new PdfPageSettings();
                pdfPageSettings.orientation = (pdfExportProperties.pageOrientation === 'Landscape') ? PdfPageOrientation.Landscape : PdfPageOrientation.Portrait;
                pdfPageSettings.size = this.getPageSize(pdfExportProperties.pageSize);
                section.setPageSettings(pdfPageSettings);
            }
            var clientSize = this.pdfDocument.pageSettings.size;
            if (pdfExportProperties.header !== undefined) {
                var header = pdfExportProperties.header;
                var position = new PointF(0, header.fromTop);
                var size = new SizeF((clientSize.width - 80), (header.height * 0.75));
                var bounds = new RectangleF(position, size);
                this.pdfDocument.template.top = this.drawPageTemplate(new PdfPageTemplateElement(bounds), header);
            }
            if (pdfExportProperties.footer !== undefined) {
                var footer = pdfExportProperties.footer;
                var position = new PointF(0, ((clientSize.width - 80) - (footer.fromBottom * 0.75)));
                var size = new SizeF((clientSize.width - 80), (footer.height * 0.75));
                var bounds = new RectangleF(position, size);
                this.pdfDocument.template.bottom = this.drawPageTemplate(new PdfPageTemplateElement(bounds), footer);
            }
            if (pdfExportProperties.includeHiddenColumn !== undefined && !this.isGrouping) {
                this.hideColumnInclude = pdfExportProperties.includeHiddenColumn;
            }
            if (pdfExportProperties.dataSource !== undefined) {
                if (!(pdfExportProperties.dataSource instanceof DataManager)) {
                    dataSource = pdfExportProperties.dataSource;
                }
                this.customDataSource = true;
                this.currentViewData = false;
            }
            else if (pdfExportProperties.exportType !== undefined) {
                if (pdfExportProperties.exportType === 'currentview') {
                    dataSource = this.parent.getCurrentViewRecords();
                    this.currentViewData = true;
                    this.customDataSource = false;
                }
                else {
                    this.currentViewData = false;
                    this.customDataSource = false;
                }
            }
            else {
                this.currentViewData = false;
                this.customDataSource = false;
            }
        }
        else {
            this.currentViewData = false;
            this.customDataSource = false;
        }
        return { dataSource: dataSource, section: section };
    };
    PdfExport.prototype.drawPageTemplate = function (template, element) {
        for (var _i = 0, _a = element.contents; _i < _a.length; _i++) {
            var content = _a[_i];
            this.processContentValidation(content);
            switch (content.type) {
                case 'text':
                    if (content.value === '' || content.value === undefined || content.value === null || typeof content.value !== 'string') {
                        throw new Error('please enter the valid input value in text content...');
                    }
                    this.drawText(template, content);
                    break;
                case 'pageNumber':
                    this.drawPageNumber(template, content);
                    break;
                case 'image':
                    if (content.src === undefined || content.src === null || content.src === '') {
                        throw new Error('please enter the valid base64 string in image content...');
                    }
                    this.drawImage(template, content);
                    break;
                case 'line':
                    this.drawLine(template, content);
                    break;
                default:
                    throw new Error('Please set valid content type...');
            }
        }
        return template;
    };
    PdfExport.prototype.processContentValidation = function (content) {
        if (content.type === '' || content.type === undefined || content.type === null) {
            throw new Error('please set valid content type...');
        }
        else {
            if (content.type === 'line') {
                if (content.points === '' || content.points === undefined || content.points === null) {
                    throw new Error('please enter valid points in ' + content.type + ' content...');
                }
                else {
                    if (content.points.x1 === undefined || content.points.x1 === null || typeof content.points.x1 !== 'number') {
                        throw new Error('please enter valid x1 co-ordinate in ' + content.type + ' points...');
                    }
                    if (content.points.y1 === undefined || content.points.y1 === null || typeof content.points.y1 !== 'number') {
                        throw new Error('please enter valid y1 co-ordinate in ' + content.type + ' points...');
                    }
                    if (content.points.x2 === undefined || content.points.x2 === null || typeof content.points.x2 !== 'number') {
                        throw new Error('please enter valid x2 co-ordinate in ' + content.type + ' points...');
                    }
                    if (content.points.y2 === undefined || content.points.y2 === null || typeof content.points.y2 !== 'number') {
                        throw new Error('please enter valid y2 co-ordinate in ' + content.type + ' points...');
                    }
                }
            }
            else {
                if (content.position === '' || content.position === undefined || content.position === null) {
                    throw new Error('please enter valid position in ' + content.type + ' content...');
                }
                else {
                    if (content.position.x === undefined || content.position.x === null || typeof content.position.x !== 'number') {
                        throw new Error('please enter valid x co-ordinate in ' + content.type + ' position...');
                    }
                    if (content.position.y === undefined || content.position.y === null || typeof content.position.y !== 'number') {
                        throw new Error('please enter valid y co-ordinate in ' + content.type + ' position...');
                    }
                }
            }
        }
    };
    PdfExport.prototype.drawText = function (pageTemplate, content) {
        var font = this.getFont(content);
        var brush = this.getBrushFromContent(content);
        var pen = null;
        if (content.style.textPenColor !== undefined) {
            var penColor = this.hexToRgb(content.style.textPenColor);
            pen = new PdfPen(new PdfColor(penColor.r, penColor.g, penColor.b));
        }
        if (brush == null && pen == null) {
            brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        }
        var value = content.value.toString();
        var x = content.position.x * 0.75;
        var y = content.position.y * 0.75;
        var format;
        var result = this.setContentFormat(content, format);
        if (result !== null && result.format !== undefined && result.size !== undefined) {
            pageTemplate.graphics.drawString(value, font, pen, brush, x, y, result.size.width, result.size.height, result.format);
        }
        else {
            pageTemplate.graphics.drawString(value, font, pen, brush, x, y, format);
        }
    };
    PdfExport.prototype.drawPageNumber = function (documentHeader, content) {
        var font = this.getFont(content);
        var brush = null;
        if (content.style.textBrushColor !== undefined) {
            var brushColor = this.hexToRgb(content.style.textBrushColor);
            brush = new PdfSolidBrush(new PdfColor(brushColor.r, brushColor.g, brushColor.b));
        }
        else {
            brush = new PdfSolidBrush(new PdfColor(0, 0, 0));
        }
        var pageNumber = new PdfPageNumberField(font, brush);
        pageNumber.numberStyle = this.getPageNumberStyle(content.pageNumberType);
        var compositeField;
        var format;
        if (content.format !== undefined) {
            if (content.format.indexOf('$total') !== -1 && content.format.indexOf('$current') !== -1) {
                var pageCount = new PdfPageCountField(font);
                if (content.format.indexOf('$total') > content.format.indexOf('$current')) {
                    format = content.format.replace('$current', '0');
                    format = format.replace('$total', '1');
                }
                else {
                    format = content.format.replace('$current', '1');
                    format = format.replace('$total', '0');
                }
                compositeField = new PdfCompositeField(font, brush, format, pageNumber, pageCount);
            }
            else if (content.format.indexOf('$current') !== -1 && content.format.indexOf('$total') === -1) {
                format = content.format.replace('$current', '0');
                compositeField = new PdfCompositeField(font, brush, format, pageNumber);
            }
            else {
                var pageCount = new PdfPageCountField(font);
                format = content.format.replace('$total', '0');
                compositeField = new PdfCompositeField(font, brush, format, pageCount);
            }
        }
        else {
            format = '{0}';
            compositeField = new PdfCompositeField(font, brush, format, pageNumber);
        }
        var x = content.position.x * 0.75;
        var y = content.position.y * 0.75;
        var result = this.setContentFormat(content, compositeField.stringFormat);
        if (result !== null && result.format !== undefined && result.size !== undefined) {
            compositeField.stringFormat = result.format;
            compositeField.bounds = new RectangleF(x, y, result.size.width, result.size.height);
        }
        compositeField.draw(documentHeader.graphics, x, y);
    };
    PdfExport.prototype.drawImage = function (documentHeader, content) {
        var x = content.position.x * 0.75;
        var y = content.position.y * 0.75;
        var width = (content.size !== undefined) ? (content.size.width * 0.75) : undefined;
        var height = (content.size !== undefined) ? (content.size.height * 0.75) : undefined;
        var image = new PdfBitmap(content.src);
        if (width !== undefined) {
            documentHeader.graphics.drawImage(image, x, y, width, height);
        }
        else {
            documentHeader.graphics.drawImage(image, x, y);
        }
    };
    PdfExport.prototype.drawLine = function (documentHeader, content) {
        var x1 = content.points.x1 * 0.75;
        var y1 = content.points.y1 * 0.75;
        var x2 = content.points.x2 * 0.75;
        var y2 = content.points.y2 * 0.75;
        var pen = this.getPenFromContent(content);
        if (content.style !== undefined && content.style !== null) {
            if (content.style.penSize !== undefined && content.style.penSize !== null && typeof content.style.penSize === 'number') {
                pen.width = content.style.penSize * 0.75;
            }
            pen.dashStyle = this.getDashStyle(content.style.dashStyle);
        }
        documentHeader.graphics.drawLine(pen, x1, y1, x2, y2);
    };
    PdfExport.prototype.processAggregates = function (sRows, pdfGrid, border, font, brush, backgroundBrush, isCaption, captionRow, groupIndex) {
        for (var _i = 0, sRows_1 = sRows; _i < sRows_1.length; _i++) {
            var row = sRows_1[_i];
            var startIndex = 0;
            var leastCaptionSummaryIndex = -1;
            var index = 0;
            var isEmpty = true;
            var value = [];
            for (var i = 0; i < pdfGrid.columns.count; i++) {
                var cell = row.cells[index];
                if (!this.hideColumnInclude) {
                    while (cell.visible === undefined) {
                        if (captionRow !== undefined) {
                            if (captionRow.cells.getCell(i).value !== undefined) {
                                value.push('');
                                value.push(captionRow.cells.getCell(i).value);
                                isEmpty = false;
                                i += 1;
                            }
                            else {
                                value.push('');
                            }
                        }
                        else {
                            value.push('');
                        }
                        i += 1;
                        index = index + 1;
                        cell = row.cells[index];
                    }
                    while (cell.visible !== undefined && !cell.visible) {
                        index = index + 1;
                        cell = row.cells[index];
                    }
                }
                if (cell.isDataCell) {
                    var templateFn = {};
                    if (cell.column.footerTemplate !== undefined || cell.column.groupCaptionTemplate !== undefined || cell.column.groupFooterTemplate !== undefined) {
                        var result = this.getTemplateFunction(templateFn, i, leastCaptionSummaryIndex, cell.column);
                        templateFn = result.templateFunction;
                        leastCaptionSummaryIndex = result.leastCaptionSummaryIndex;
                        var txt = (templateFn[getEnumValue(CellType, cell.cellType)](row.data[cell.column.field]));
                        value.push(txt[0].wholeText);
                        isEmpty = false;
                    }
                    else {
                        var result = this.getSummaryWithoutTemplate(row.data[cell.column.field]);
                        if (result !== undefined) {
                            value.push(result);
                        }
                    }
                }
                else {
                    value.push('');
                }
                if (isEmpty && value[i] !== '' && value[i] !== undefined && value[i] !== null) {
                    isEmpty = false;
                }
                index += 1;
            }
            if (!isEmpty) {
                if (!isCaption) {
                    var gridRow = pdfGrid.rows.addRow();
                    gridRow.style.setBorder(border);
                    gridRow.style.setFont(font);
                    gridRow.style.setTextBrush(brush);
                    gridRow.style.setBackgroundBrush(backgroundBrush);
                    for (var i = 0; i < pdfGrid.columns.count; i++) {
                        gridRow.cells.getCell(i).value = value[i].toString();
                    }
                }
                else {
                    for (var i = 0; i < pdfGrid.columns.count; i++) {
                        captionRow.cells.getCell(i).value = value[i].toString();
                        if (i === (groupIndex + 1) && leastCaptionSummaryIndex !== -1) {
                            captionRow.cells.getCell(i).columnSpan = leastCaptionSummaryIndex - (groupIndex + 1);
                        }
                        else if (i === (groupIndex + 1) && leastCaptionSummaryIndex === -1) {
                            captionRow.cells.getCell(i).columnSpan = pdfGrid.columns.count - (groupIndex + 1);
                        }
                    }
                }
            }
        }
    };
    PdfExport.prototype.getTemplateFunction = function (templateFn, index, leastCaptionSummaryIndex, column) {
        if (column.footerTemplate !== undefined) {
            templateFn[getEnumValue(CellType, CellType.Summary)] = compile(column.footerTemplate);
        }
        else if (column.groupCaptionTemplate !== undefined) {
            if (leastCaptionSummaryIndex === -1) {
                leastCaptionSummaryIndex = index;
            }
            templateFn[getEnumValue(CellType, CellType.CaptionSummary)] = compile(column.groupCaptionTemplate);
        }
        else {
            templateFn[getEnumValue(CellType, CellType.GroupSummary)] = compile(column.groupFooterTemplate);
        }
        return { templateFunction: templateFn, leastCaptionSummaryIndex: leastCaptionSummaryIndex };
    };
    PdfExport.prototype.getSummaryWithoutTemplate = function (data) {
        if (data.sum !== undefined) {
            return data.sum;
        }
        else if (data.average !== undefined) {
            return data.average;
        }
        else if (data.max !== undefined) {
            return data.max;
        }
        else if (data.min !== undefined) {
            return data.min;
        }
        else if (data.count !== undefined) {
            return data.count;
        }
        else if (data.truecount !== undefined) {
            return data.truecount;
        }
        else if (data.falsecount !== undefined) {
            return data.falsecount;
        }
        else if (data.custom !== undefined) {
            return data.custom;
        }
    };
    PdfExport.prototype.setColumnProperties = function (gridColumns, pdfGrid) {
        var startIndex = this.isGrouping ? (pdfGrid.columns.count - gridColumns.length) : 0;
        for (var i = 0; i < gridColumns.length; i++) {
            if (gridColumns[i].textAlign !== undefined) {
                pdfGrid.columns.getColumn(i + startIndex).format = this.getHorizontalAlignment(gridColumns[i].textAlign);
            }
            if (pdfGrid.style.allowHorizontalOverflow && gridColumns[i].width !== undefined) {
                pdfGrid.columns.getColumn(i + startIndex).width = (gridColumns[i].width * 0.75);
            }
        }
    };
    PdfExport.prototype.setRecordThemeStyle = function (row, border) {
        switch (this.gridTheme) {
            case 'bootstrap':
                row.style.setTextBrush(new PdfSolidBrush(new PdfColor(51, 51, 51)));
                break;
            case 'fabric':
                row.style.setTextBrush(new PdfSolidBrush(new PdfColor(51, 51, 51)));
                break;
            default:
                row.style.setTextBrush(new PdfSolidBrush(new PdfColor(0, 0, 0)));
        }
        row.style.setBorder(border);
        return row;
    };
    PdfExport.prototype.processRecord = function (border, columns, gObj, dataSource, pdfGrid, groupIndex) {
        var startIndex = this.isGrouping ? groupIndex : 0;
        for (var _i = 0, _a = dataSource; _i < _a.length; _i++) {
            var items = _a[_i];
            var gridRow = this.setRecordThemeStyle(pdfGrid.rows.addRow(), border);
            for (var j = 0; j < columns.length; j++) {
                var value = items[columns[j].field];
                var args = {
                    value: value,
                    column: columns[j],
                    style: undefined
                };
                gObj.trigger(events.pdfQueryCellInfo, args);
                var cell = gridRow.cells.getCell(j + startIndex);
                cell.value = this.exportValueFormatter.formatCellValue(args);
                if (args.style !== undefined) {
                    this.processCellStyle(cell, args);
                }
            }
        }
    };
    PdfExport.prototype.processCellStyle = function (cell, args) {
        if (args.style.backgroundColor !== undefined) {
            var backColor = this.hexToRgb(args.style.backgroundColor);
            cell.style.backgroundBrush = new PdfSolidBrush(new PdfColor(backColor.r, backColor.g, backColor.b));
        }
        if (args.style.textAlignment !== undefined) {
            cell.style.stringFormat = this.getHorizontalAlignment(args.style.textAlignment);
        }
        if (args.style.verticalAlignment !== undefined) {
            cell.style.stringFormat = this.getVerticalAlignment(args.style.verticalAlignment, cell.style.stringFormat);
        }
        if (args.style.textBrushColor !== undefined) {
            var textBrushColor = this.hexToRgb(args.style.textBrushColor);
            cell.style.textBrush = new PdfSolidBrush(new PdfColor(textBrushColor.r, textBrushColor.g, textBrushColor.b));
        }
        if (args.style.textPenColor !== undefined) {
            cell.style.textPen = new PdfPen(new PdfColor(args.style.textPenColor.r, args.style.textPenColor.g, args.style.textPenColor.b));
        }
        if (args.style.fontFamily !== undefined || args.style.fontSize !== undefined || args.style.bold !== undefined || args.style.italic !== undefined || args.style.underline !== undefined || args.style.strikeout !== undefined) {
            cell.style.font = this.getFont(args);
        }
        if (args.style.border !== undefined) {
            var border = new PdfBorders();
            var borderWidth = args.style.border.width;
            var width = (borderWidth !== undefined && typeof borderWidth === 'number') ? (borderWidth * 0.75) : (undefined);
            var color = new PdfColor(196, 196, 196);
            if (args.style.border.color !== undefined) {
                var borderColor = this.hexToRgb(args.style.border.color);
                color = new PdfColor(borderColor.r, borderColor.g, borderColor.b);
            }
            var pen = new PdfPen(color, width);
            if (args.style.border.dashStyle !== undefined) {
                pen.dashStyle = this.getDashStyle(args.style.border.dashStyle);
            }
            border.all = pen;
            cell.style.borders = border;
        }
    };
    PdfExport.prototype.getHorizontalAlignment = function (textAlign, format) {
        if (format === undefined) {
            format = new PdfStringFormat();
        }
        switch (textAlign) {
            case 'right':
                format.alignment = PdfTextAlignment.Right;
                break;
            case 'center':
                format.alignment = PdfTextAlignment.Center;
                break;
            case 'justify':
                format.alignment = PdfTextAlignment.Justify;
                break;
            case 'left':
                format.alignment = PdfTextAlignment.Left;
                break;
        }
        return format;
    };
    PdfExport.prototype.getVerticalAlignment = function (verticalAlign, format, textAlign) {
        if (format === undefined) {
            format = new PdfStringFormat();
            format = this.getHorizontalAlignment(textAlign, format);
        }
        switch (verticalAlign) {
            case 'bottom':
                format.lineAlignment = PdfVerticalAlignment.Bottom;
                break;
            case 'middle':
                format.lineAlignment = PdfVerticalAlignment.Middle;
                break;
            case 'top':
                format.lineAlignment = PdfVerticalAlignment.Top;
                break;
        }
        return format;
    };
    PdfExport.prototype.getFontFamily = function (fontFamily) {
        switch (fontFamily) {
            case 'TimesRoman':
                return 2;
            case 'Courier':
                return 1;
            case 'Symbol':
                return 3;
            case 'ZapfDingbats':
                return 4;
            default:
                return 0;
        }
    };
    PdfExport.prototype.getFont = function (content) {
        var fontSize = (content.style.fontSize !== undefined) ? (content.style.fontSize * 0.75) : 9.75;
        var fontFamily = (content.style.fontFamily !== undefined) ? (this.getFontFamily(content.style.fontFamily)) : PdfFontFamily.Helvetica;
        var fontStyle = PdfFontStyle.Regular;
        if (content.style.bold !== undefined && content.style.bold) {
            fontStyle |= PdfFontStyle.Bold;
        }
        if (content.style.italic !== undefined && content.style.italic) {
            fontStyle |= PdfFontStyle.Italic;
        }
        if (content.style.underline !== undefined && content.style.underline) {
            fontStyle |= PdfFontStyle.Underline;
        }
        if (content.style.strikeout !== undefined && content.style.strikeout) {
            fontStyle |= PdfFontStyle.Strikeout;
        }
        return new PdfStandardFont(fontFamily, fontSize, fontStyle);
    };
    PdfExport.prototype.getPageNumberStyle = function (pageNumberType) {
        switch (pageNumberType) {
            case 'LowerLatin':
                return 2;
            case 'LowerRoman':
                return 3;
            case 'UpperLatin':
                return 4;
            case 'UpperRoman':
                return 5;
            default:
                return 1;
        }
    };
    PdfExport.prototype.setContentFormat = function (content, format) {
        if (content.size !== undefined) {
            var width = content.size.width * 0.75;
            var height = content.size.height * 0.75;
            format = new PdfStringFormat(PdfTextAlignment.Left, PdfVerticalAlignment.Middle);
            if (content.style.hAlign !== undefined) {
                switch (content.style.hAlign) {
                    case 'right':
                        format.alignment = PdfTextAlignment.Right;
                        break;
                    case 'center':
                        format.alignment = PdfTextAlignment.Center;
                        break;
                    case 'justify':
                        format.alignment = PdfTextAlignment.Justify;
                        break;
                    default:
                        format.alignment = PdfTextAlignment.Left;
                }
            }
            if (content.style.vAlign !== undefined) {
                format = this.getVerticalAlignment(content.style.vAlign, format);
            }
            return { format: format, size: new SizeF(width, height) };
        }
        return null;
    };
    PdfExport.prototype.getPageSize = function (pageSize) {
        switch (pageSize) {
            case 'Letter':
                return new SizeF(612, 792);
            case 'Note':
                return new SizeF(540, 720);
            case 'Legal':
                return new SizeF(612, 1008);
            case 'A0':
                return new SizeF(2380, 3368);
            case 'A1':
                return new SizeF(1684, 2380);
            case 'A2':
                return new SizeF(1190, 1684);
            case 'A3':
                return new SizeF(842, 1190);
            case 'A5':
                return new SizeF(421, 595);
            case 'A6':
                return new SizeF(297, 421);
            case 'A7':
                return new SizeF(210, 297);
            case 'A8':
                return new SizeF(148, 210);
            case 'A9':
                return new SizeF(105, 148);
            case 'B0':
                return new SizeF(2836, 4008);
            case 'B1':
                return new SizeF(2004, 2836);
            case 'B2':
                return new SizeF(1418, 2004);
            case 'B3':
                return new SizeF(1002, 1418);
            case 'B4':
                return new SizeF(709, 1002);
            case 'B5':
                return new SizeF(501, 709);
            case 'ArchA':
                return new SizeF(648, 864);
            case 'ArchB':
                return new SizeF(864, 1296);
            case 'ArchC':
                return new SizeF(1296, 1728);
            case 'ArchD':
                return new SizeF(1728, 2592);
            case 'ArchE':
                return new SizeF(2592, 3456);
            case 'Flsa':
                return new SizeF(612, 936);
            case 'HalfLetter':
                return new SizeF(396, 612);
            case 'Letter11x17':
                return new SizeF(792, 1224);
            case 'Ledger':
                return new SizeF(1224, 792);
            default:
                return new SizeF(595, 842);
        }
    };
    PdfExport.prototype.getDashStyle = function (dashStyle) {
        switch (dashStyle) {
            case 'Dash':
                return 1;
            case 'Dot':
                return 2;
            case 'DashDot':
                return 3;
            case 'DashDotDot':
                return 4;
            default:
                return 0;
        }
    };
    PdfExport.prototype.getPenFromContent = function (content) {
        var pen = new PdfPen(new PdfColor(0, 0, 0));
        if (content.style !== undefined && content.style !== null && content.style.penColor !== undefined) {
            var penColor = this.hexToRgb(content.style.penColor);
            pen = new PdfPen(new PdfColor(penColor.r, penColor.g, penColor.b));
        }
        return pen;
    };
    PdfExport.prototype.getBrushFromContent = function (content) {
        var brush = null;
        if (content.style.textBrushColor !== undefined) {
            var brushColor = this.hexToRgb(content.style.textBrushColor);
            brush = new PdfSolidBrush(new PdfColor(brushColor.r, brushColor.g, brushColor.b));
        }
        return brush;
    };
    PdfExport.prototype.hexToRgb = function (hex) {
        if (hex === null || hex === '' || hex.length !== 7) {
            throw new Error('please set valid hex value for color...');
        }
        hex = hex.substring(1);
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;
        return { r: r, g: g, b: b };
    };
    PdfExport.prototype.destroy = function () {
    };
    return PdfExport;
}());
export { PdfExport };
