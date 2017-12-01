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
/**
 * `PDF Export` module is used to handle the exportToPDF action.
 * @hidden
 */
var PdfExport = /** @class */ (function () {
    /**
     * Constructor for the Grid PDF Export module
     * @hidden
     */
    function PdfExport(parent) {
        this.hideColumnInclude = false;
        this.currentViewData = false;
        this.customDataSource = false;
        this.isGrouping = false;
        this.parent = parent;
        if (this.parent.isDestroyed) {
            return;
        }
    }
    /**
     * For internal use only - Get the module name.
     */
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
        this.helper = new ExportHelper(gObj);
        this.isGrouping = false;
        this.isExporting = true;
        gObj.trigger(events.beforePdfExport);
    };
    /**
     * Used to map the input data
     * @return {void}
     */
    /* tslint:disable-next-line:no-any */
    PdfExport.prototype.Map = function (parent, pdfExportProperties, isMultipleExport, pdfDoc) {
        var _this = this;
        this.data = new Data(this.parent);
        /* tslint:disable-next-line:max-line-length */
        if (pdfExportProperties !== undefined && pdfExportProperties.dataSource !== undefined && pdfExportProperties.dataSource instanceof DataManager) {
            var promise = void 0;
            return promise = new Promise(function (resolve, reject) {
                /* tslint:disable-next-line:no-any */ /* tslint:disable-next-line:max-line-length */
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
                var dataManager = _this.data.getData({}, ExportHelper.getQuery(parent, _this.data));
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
    /* tslint:disable:no-any */
    PdfExport.prototype.processExport = function (gObj, returnType, pdfExportProperties, isMultipleExport) {
        if (pdfExportProperties !== undefined) {
            this.gridTheme = pdfExportProperties.theme;
        }
        var columns = gObj.columns;
        var dataSource = returnType.result;
        /* tslint:enable:no-any */
        var section = this.pdfDocument.sections.add();
        /* tslint:disable-next-line:no-any */
        var result = this.processExportProperties(pdfExportProperties, dataSource, section);
        dataSource = result.dataSource;
        /* tslint:disable-next-line:no-any */
        if (dataSource.GroupGuid !== undefined) {
            this.isGrouping = true;
        }
        section = result.section;
        var pdfPage = section.pages.add();
        // create a grid
        var pdfGrid = new PdfGrid();
        // get header theme style
        /* tslint:disable-next-line:no-any */
        var headerThemeStyle = this.getHeaderThemeStyle();
        var border = headerThemeStyle.border;
        var headerFont = headerThemeStyle.font;
        var headerBrush = headerThemeStyle.brush;
        /* tslint:disable-next-line:no-any */
        var returnValue = this.helper.getHeaders(columns, this.hideColumnInclude);
        var rows = returnValue.rows;
        // Column collection with respect to the records in the grid
        var gridColumns = returnValue.columns;
        // process grid header content
        pdfGrid = this.processGridHeaders(dataSource.childLevels, pdfGrid, rows, gridColumns, border, headerFont, headerBrush);
        // set alignment, width and type of the values of the column
        this.setColumnProperties(gridColumns, pdfGrid);
        /* tslint:disable-next-line:no-any */
        var captionThemeStyle = this.getSummaryCaptionThemeStyle();
        if (dataSource !== undefined && dataSource !== null && dataSource.length > 0) {
            if (this.isGrouping) {
                /* tslint:disable-next-line:max-line-length */
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
                /* tslint:disable-next-line:max-line-length */
                this.processAggregates(sRows, pdfGrid, border, captionThemeStyle.font, captionThemeStyle.brush, captionThemeStyle.backgroundBrush, false);
            }
        }
        else {
            var row = pdfGrid.rows.addRow();
            row.style.setBorder(border);
        }
        // draw the grid
        pdfGrid.draw(pdfPage, 20, 20);
        if (!isMultipleExport) {
            // save the PDF
            this.pdfDocument.save('Export.pdf');
        }
    };
    /* tslint:disable-next-line:no-any */
    PdfExport.prototype.getSummaryCaptionThemeStyle = function () {
        if (this.gridTheme !== undefined && this.gridTheme.caption !== undefined && this.gridTheme.caption !== null) {
            var fontSize = this.gridTheme.caption.fontSize !== undefined ? this.gridTheme.caption.fontSize : 9.75;
            var pdfColor = new PdfColor();
            if (this.gridTheme.caption.fontColor !== undefined) {
                var penBrushColor = this.hexToRgb(this.gridTheme.caption.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }
            /* tslint:disable-next-line:max-line-length */
            return { font: new PdfStandardFont(PdfFontFamily.Helvetica, 10.5), brush: new PdfSolidBrush(new PdfColor(pdfColor)), backgroundBrush: new PdfSolidBrush(new PdfColor(246, 246, 246)) };
        }
        else {
            //Material theme
            /* tslint:disable-next-line:max-line-length */
            return { font: new PdfStandardFont(PdfFontFamily.Helvetica, 9.75), brush: new PdfSolidBrush(new PdfColor(0, 0, 0)), backgroundBrush: new PdfSolidBrush(new PdfColor(246, 246, 246)) };
        }
    };
    /* tslint:disable-next-line:no-any */
    PdfExport.prototype.getHeaderThemeStyle = function () {
        var border = new PdfBorders();
        if (this.gridTheme !== undefined && this.gridTheme.header !== undefined && this.gridTheme.header !== null) {
            if (this.gridTheme.header.borders !== undefined && this.gridTheme.header.borders.color !== undefined) {
                var borderColor = this.hexToRgb(this.gridTheme.header.borders.color);
                border.all = new PdfPen(new PdfColor(borderColor.r, borderColor.g, borderColor.b));
            }
            var fontSize = this.gridTheme.header.fontSize !== undefined ? this.gridTheme.header.fontSize : 10.5;
            var pdfColor = new PdfColor();
            if (this.gridTheme.header.fontColor !== undefined) {
                var penBrushColor = this.hexToRgb(this.gridTheme.header.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }
            /* tslint:disable-next-line:max-line-length */
            return { border: border, font: new PdfStandardFont(PdfFontFamily.Helvetica, fontSize), brush: new PdfSolidBrush(pdfColor) };
        }
        else {
            //Material theme
            border.all = new PdfPen(new PdfColor(234, 234, 234));
            /* tslint:disable-next-line:max-line-length */
            return { border: border, font: new PdfStandardFont(PdfFontFamily.Helvetica, 10.5), brush: new PdfSolidBrush(new PdfColor(102, 102, 102)) };
        }
    };
    /* tslint:disable-next-line:max-line-length */ /* tslint:disable-next-line:no-any */
    PdfExport.prototype.processGroupedRecords = function (pdfGrid, dataSource, gridColumns, gObj, border, level, font, brush, backgroundBrush, returnType) {
        var groupIndex = level;
        for (var _i = 0, dataSource_1 = dataSource; _i < dataSource_1.length; _i++) {
            var dataSourceItems = dataSource_1[_i];
            var row = pdfGrid.rows.addRow();
            /* tslint:disable-next-line:no-any */
            var args = {
                value: dataSourceItems.key,
                column: gObj.getColumnByField(dataSourceItems.field),
                style: undefined
            };
            /* tslint:disable-next-line:max-line-length */
            var value = dataSourceItems.field + ': ' + this.exportValueFormatter.formatCellValue(args) + ' - ' + dataSourceItems.count + (dataSource.count > 1 ? ' items' : ' item');
            row.cells.getCell(groupIndex).value = value;
            row.cells.getCell(groupIndex + 1).style.stringFormat = new PdfStringFormat(PdfTextAlignment.Left);
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
                /* tslint:disable-next-line:max-line-length */
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
    /* tslint:disable-next-line:max-line-length */
    PdfExport.prototype.processGridHeaders = function (childLevels, pdfGrid, rows, gridColumns, border, headerFont, headerBrush) {
        var columnCount = gridColumns.length;
        if (this.isGrouping) {
            columnCount += (childLevels + 1);
        }
        // add columns
        pdfGrid.columns.add(columnCount);
        if (this.isGrouping) {
            for (var i = 0; i < (childLevels + 1); i++) {
                pdfGrid.columns.getColumn(i).width = 20;
            }
        }
        // add header
        pdfGrid.headers.add(rows.length);
        // set cell values of each rows in the header
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
                            /* tslint:disable-next-line:max-line-length */
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
    /* tslint:disable-next-line:no-any */ /* tslint:disable-next-line:max-line-length */
    PdfExport.prototype.processExportProperties = function (pdfExportProperties, dataSource, section) {
        if (pdfExportProperties !== undefined) {
            if (pdfExportProperties.theme !== undefined) {
                this.gridTheme = pdfExportProperties.theme;
            }
            if (pdfExportProperties.pageOrientation !== undefined || pdfExportProperties.pageSize !== undefined) {
                var pdfPageSettings = new PdfPageSettings();
                /* tslint:disable-next-line:max-line-length */
                pdfPageSettings.orientation = (pdfExportProperties.pageOrientation === 'landscape') ? PdfPageOrientation.Landscape : PdfPageOrientation.Portrait;
                pdfPageSettings.size = this.getPageSize(pdfExportProperties.pageSize);
                section.setPageSettings(pdfPageSettings);
            }
            var clientSize = this.pdfDocument.pageSettings.size;
            if (pdfExportProperties.header !== undefined) {
                /* tslint:disable-next-line:no-any */
                var header = pdfExportProperties.header;
                var position = new PointF(0, header.fromTop);
                var size = new SizeF((clientSize.width - 80), (header.height * 0.75));
                var bounds = new RectangleF(position, size);
                this.pdfDocument.template.top = this.drawPageTemplate(new PdfPageTemplateElement(bounds), header);
            }
            if (pdfExportProperties.footer !== undefined) {
                /* tslint:disable-next-line:no-any */
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
                if (pdfExportProperties.exportType === 'currentpage') {
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
    /* tslint:disable-next-line:no-any */
    PdfExport.prototype.drawPageTemplate = function (template, element) {
        for (var _i = 0, _a = element.contents; _i < _a.length; _i++) {
            var content = _a[_i];
            this.processContentValidation(content);
            switch (content.type) {
                case 'text':
                    /* tslint:disable-next-line:max-line-length */
                    if (content.value === '' || content.value === undefined || content.value === null || typeof content.value !== 'string') {
                        throw new Error('please enter the valid input value in text content...');
                    }
                    this.drawText(template, content);
                    break;
                case 'pagenumber':
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
    /* tslint:disable-next-line:no-any */
    PdfExport.prototype.processContentValidation = function (content) {
        if (content.type === undefined || content.type === null) {
            throw new Error('please set valid content type...');
        }
        else {
            if (content.type === 'line') {
                if (content.points === undefined || content.points === null) {
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
                if (content.position === undefined || content.position === null) {
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
    /* tslint:disable-next-line:no-any */
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
    /* tslint:disable-next-line:no-any */
    PdfExport.prototype.drawPageNumber = function (documentHeader, content) {
        var font = this.getFont(content);
        var brush = null;
        if (content.style.textBrushColor !== undefined) {
            /* tslint:disable-next-line:max-line-length */
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
    /* tslint:disable-next-line:no-any */
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
    /* tslint:disable-next-line:no-any */
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
    /* tslint:disable-next-line:no-any */ /* tslint:disable-next-line:max-line-length */
    PdfExport.prototype.processAggregates = function (sRows, pdfGrid, border, font, brush, backgroundBrush, isCaption, captionRow, groupIndex) {
        for (var _i = 0, sRows_1 = sRows; _i < sRows_1.length; _i++) {
            var row = sRows_1[_i];
            var startIndex = 0;
            var leastCaptionSummaryIndex = -1;
            var index = 0;
            var isEmpty = true;
            /* tslint:disable-next-line:no-any */
            var value = [];
            for (var i = 0; i < pdfGrid.columns.count; i++) {
                /* tslint:disable-next-line:no-any */
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
                    /* tslint:disable-next-line:max-line-length */
                    if (cell.column.footerTemplate !== undefined || cell.column.groupCaptionTemplate !== undefined || cell.column.groupFooterTemplate !== undefined) {
                        /* tslint:disable-next-line:no-any */
                        var result = this.getTemplateFunction(templateFn, i, leastCaptionSummaryIndex, cell.column);
                        templateFn = result.templateFunction;
                        leastCaptionSummaryIndex = result.leastCaptionSummaryIndex;
                        var txt = (templateFn[getEnumValue(CellType, cell.cellType)](row.data[cell.column.field]));
                        value.push(txt[0].wholeText);
                        isEmpty = false;
                    }
                    else {
                        /* tslint:disable-next-line:no-any */
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
    /* tslint:disable-next-line:no-any */
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
    /* tslint:disable-next-line:no-any */
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
    // Set alignment, width and type of the values of the column
    /* tslint:disable:no-any */
    /* tslint:disable-next-line:max-line-length */
    PdfExport.prototype.setColumnProperties = function (gridColumns, pdfGrid) {
        var startIndex = this.isGrouping ? (pdfGrid.columns.count - gridColumns.length) : 0;
        for (var i = 0; i < gridColumns.length; i++) {
            if (gridColumns[i].textAlign !== undefined) {
                pdfGrid.columns.getColumn(i + startIndex).format = this.getHorizontalAlignment(gridColumns[i].textAlign);
            }
            // Need to add width consideration with % value
            if (pdfGrid.style.allowHorizontalOverflow && gridColumns[i].width !== undefined) {
                /* tslint:disable-next-line:max-line-length */
                pdfGrid.columns.getColumn(i + startIndex).width = typeof gridColumns[i].width === 'number' ? gridColumns[i].width * 0.75 : this.helper.getConvertedWidth(gridColumns[i].width) * 0.75;
            }
        }
    };
    /**
     * set default style properties of each rows in exporting grid
     * @private
     */
    PdfExport.prototype.setRecordThemeStyle = function (row, border) {
        if (this.gridTheme !== undefined && this.gridTheme.record !== undefined && this.gridTheme.record !== null) {
            var pdfColor = new PdfColor();
            if (this.gridTheme.record.fontColor !== undefined) {
                var penBrushColor = this.hexToRgb(this.gridTheme.record.fontColor);
                pdfColor = new PdfColor(penBrushColor.r, penBrushColor.g, penBrushColor.b);
            }
            row.style.setTextBrush(new PdfSolidBrush(pdfColor));
        }
        else {
            row.style.setTextBrush(new PdfSolidBrush(new PdfColor(0, 0, 0)));
        }
        row.style.setBorder(border);
        return row;
    };
    /**
     * generate the formatted cell values
     * @private
     */
    /* tslint:disable-next-line:max-line-length */ /* tslint:disable-next-line:no-any */
    PdfExport.prototype.processRecord = function (border, columns, gObj, dataSource, pdfGrid, groupIndex) {
        var startIndex = this.isGrouping ? groupIndex : 0;
        for (var _i = 0, _a = dataSource; _i < _a.length; _i++) {
            var items = _a[_i];
            // create a new row and set default style properties
            var gridRow = this.setRecordThemeStyle(pdfGrid.rows.addRow(), border);
            for (var j = 0; j < columns.length; j++) {
                /* tslint:disable:no-any */
                var value = items[columns[j].field];
                var data = items;
                var args = {
                    data: data,
                    value: value,
                    column: columns[j],
                    style: undefined,
                    colSpan: 1
                };
                /* tslint:enable:no-any */
                gObj.trigger(events.pdfQueryCellInfo, args);
                var cell = gridRow.cells.getCell(j + startIndex);
                cell.value = this.exportValueFormatter.formatCellValue(args);
                if (args.style !== undefined) {
                    this.processCellStyle(cell, args);
                }
                if (args.colSpan > 1) {
                    if ((j + startIndex + 1 + args.colSpan) > gridRow.cells.count) {
                        args.colSpan = gridRow.cells.count - (j + startIndex + 1);
                    }
                    cell.columnSpan = args.colSpan;
                    for (var i = 1; i < cell.columnSpan; i++) {
                        var spanCell = gridRow.cells.getCell(j + startIndex + i);
                        spanCell.value = '';
                    }
                    j += (args.colSpan - 1);
                }
            }
        }
    };
    /* tslint:disable-next-line:no-any */
    PdfExport.prototype.processCellStyle = function (cell, args) {
        if (args.style.backgroundColor !== undefined) {
            /* tslint:disable-next-line:max-line-length */
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
            var textPenColor = this.hexToRgb(args.style.textPenColor);
            cell.style.textPen = new PdfPen(new PdfColor(textPenColor.r, textPenColor.g, textPenColor.b));
        }
        /* tslint:disable-next-line:max-line-length */
        if (args.style.fontFamily !== undefined || args.style.fontSize !== undefined || args.style.bold !== undefined || args.style.italic !== undefined || args.style.underline !== undefined || args.style.strikeout !== undefined) {
            cell.style.font = this.getFont(args);
        }
        if (args.style.border !== undefined) {
            var border = new PdfBorders();
            var borderWidth = args.style.border.width;
            // set border width
            var width = (borderWidth !== undefined && typeof borderWidth === 'number') ? (borderWidth * 0.75) : (undefined);
            // set border color
            var color = new PdfColor(196, 196, 196);
            if (args.style.border.color !== undefined) {
                var borderColor = this.hexToRgb(args.style.border.color);
                color = new PdfColor(borderColor.r, borderColor.g, borderColor.b);
            }
            var pen = new PdfPen(color, width);
            // set border dashStyle 'Solid <default>, Dash, Dot, DashDot, DashDotDot'
            if (args.style.border.dashStyle !== undefined) {
                pen.dashStyle = this.getDashStyle(args.style.border.dashStyle);
            }
            border.all = pen;
            cell.style.borders = border;
        }
    };
    /**
     * set text alignment of each columns in exporting grid
     * @private
     */
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
    /**
     * set vertical alignment of each columns in exporting grid
     * @private
     */
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
    /* tslint:disable-next-line:no-any */
    PdfExport.prototype.getFont = function (content) {
        var fontSize = (content.style.fontSize !== undefined) ? (content.style.fontSize * 0.75) : 9.75;
        /* tslint:disable-next-line:max-line-length */
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
            case 'lowerlatin':
                return 2;
            case 'lowerroman':
                return 3;
            case 'upperlatin':
                return 4;
            case 'upperroman':
                return 5;
            default:
                return 1;
        }
    };
    /* tslint:disable-next-line:max-line-length */ /* tslint:disable-next-line:no-any */
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
            case 'letter':
                return new SizeF(612, 792);
            case 'note':
                return new SizeF(540, 720);
            case 'legal':
                return new SizeF(612, 1008);
            case 'a0':
                return new SizeF(2380, 3368);
            case 'a1':
                return new SizeF(1684, 2380);
            case 'a2':
                return new SizeF(1190, 1684);
            case 'a3':
                return new SizeF(842, 1190);
            case 'a5':
                return new SizeF(421, 595);
            case 'a6':
                return new SizeF(297, 421);
            case 'a7':
                return new SizeF(210, 297);
            case 'a8':
                return new SizeF(148, 210);
            case 'a9':
                return new SizeF(105, 148);
            // case 'A10':
            //     return new SizeF(74, 105);
            case 'b0':
                return new SizeF(2836, 4008);
            case 'b1':
                return new SizeF(2004, 2836);
            case 'b2':
                return new SizeF(1418, 2004);
            case 'b3':
                return new SizeF(1002, 1418);
            case 'b4':
                return new SizeF(709, 1002);
            case 'b5':
                return new SizeF(501, 709);
            case 'archa':
                return new SizeF(648, 864);
            case 'archb':
                return new SizeF(864, 1296);
            case 'archc':
                return new SizeF(1296, 1728);
            case 'archd':
                return new SizeF(1728, 2592);
            case 'arche':
                return new SizeF(2592, 3456);
            case 'flsa':
                return new SizeF(612, 936);
            case 'halfletter':
                return new SizeF(396, 612);
            case 'letter11x17':
                return new SizeF(792, 1224);
            case 'ledger':
                return new SizeF(1224, 792);
            default:
                return new SizeF(595, 842);
        }
    };
    PdfExport.prototype.getDashStyle = function (dashStyle) {
        switch (dashStyle) {
            case 'dash':
                return 1;
            case 'dot':
                return 2;
            case 'dashdot':
                return 3;
            case 'dashdotdot':
                return 4;
            default:
                return 0;
        }
    };
    /* tslint:disable-next-line:no-any */
    PdfExport.prototype.getPenFromContent = function (content) {
        var pen = new PdfPen(new PdfColor(0, 0, 0));
        if (content.style !== undefined && content.style !== null && content.style.penColor !== undefined) {
            var penColor = this.hexToRgb(content.style.penColor);
            pen = new PdfPen(new PdfColor(penColor.r, penColor.g, penColor.b));
        }
        return pen;
    };
    /* tslint:disable-next-line:no-any */
    PdfExport.prototype.getBrushFromContent = function (content) {
        var brush = null;
        if (content.style.textBrushColor !== undefined) {
            /* tslint:disable-next-line:max-line-length */
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
    /**
     * To destroy the pdf export
     * @return {void}
     * @hidden
     */
    PdfExport.prototype.destroy = function () {
        //destroy for exporting
    };
    return PdfExport;
}());
export { PdfExport };
