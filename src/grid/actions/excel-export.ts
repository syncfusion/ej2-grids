import {
    IGrid, ExcelExportProperties, ExcelHeader, ExcelFooter, ExcelRow,
    ExcelCell, Theme, ThemeStyle, ExcelQueryCellInfoEventArgs
} from '../base/interface';
import * as events from '../base/constant';
import { Workbook } from '@syncfusion/ej2-excel-export';
import { isNullOrUndefined, getEnumValue, compile, extend } from '@syncfusion/ej2-base';
import { Data } from '../actions/data';
import { ReturnType } from '../base/type';
import { ExportHelper, ExportValueFormatter } from './export-helper';
import { Row } from '../models/row';
import { Column } from '../models/column';
import { SummaryModelGenerator, GroupSummaryModelGenerator, CaptionSummaryModelGenerator } from '../services/summary-model-generator';
import { AggregateColumnModel } from '../models/aggregate-model';
import { CellType, MultipleExportType } from '../base/enum';
import { Query, DataManager } from '@syncfusion/ej2-data';
/**
 * @hidden
 * `ExcelExport` module is used to handle the Excel export action.
 */
export class ExcelExport {
    private parent: IGrid;
    private isExporting: boolean;
    private theme: Theme;
    /* tslint:disable-next-line:no-any */
    private book: any = {};
    /* tslint:disable-next-line:no-any */
    private workSheet: any = [];
    /* tslint:disable-next-line:no-any */
    private rows: any = [];
    /* tslint:disable-next-line:no-any */
    private columns: any = [];
    /* tslint:disable-next-line:no-any */
    private styles: any = [];
    private data: Data;
    private rowLength: number = 1;
    /* tslint:disable-next-line:no-any */
    private footer: any;
    private expType: MultipleExportType = 'appendtosheet';
    private includeHiddenColumn: boolean = false;
    private isCsvExport: boolean = false;
    private exportValueFormatter: ExportValueFormatter;
    private isElementIdChanged: boolean = false;
    private helper: ExportHelper;
    /**
     * Constructor for the Grid Excel Export module.
     * @hidden
     */
    constructor(parent?: IGrid) {
        this.parent = parent;
    }
    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'ExcelExport';
    }
    private init(gObj: IGrid): void {
        if (gObj.element !== null && gObj.element.id === '') {
            gObj.element.id = new Date().toISOString();
            this.isElementIdChanged = true;
        }
        this.parent = gObj;
        if (this.parent.isDestroyed) { return; }
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
    }
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
    public Map(grid: IGrid, exportProperties: any, isMultipleExport: boolean, workbook: any, isCsv: boolean): Promise<any> {
        let gObj: IGrid = grid;
        gObj.trigger(events.beforeExcelExport);
        this.data = new Data(gObj);
        this.isExporting = true;
        if (isCsv) {
            this.isCsvExport = isCsv;
        } else {
            this.isCsvExport = false;
        }

        return this.processRecords(gObj, exportProperties, isMultipleExport, workbook);
    }
    /* tslint:disable-next-line:no-any */
    private processRecords(gObj: IGrid, exportProperties: ExcelExportProperties, isMultipleExport: boolean, workbook: any): Promise<any> {
        if (exportProperties !== undefined && exportProperties.dataSource !== undefined &&
            exportProperties.dataSource instanceof DataManager) {
            /* tslint:disable-next-line:no-any */
            let promise: Promise<any>;
            return promise = new Promise((resolve: Function, reject: Function) => {
                /* tslint:disable-next-line:max-line-length */
                /* tslint:disable-next-line:no-any */
                let dataManager: any = new DataManager({ url: (exportProperties.dataSource as DataManager).dataSource.url, adaptor: (exportProperties.dataSource as DataManager).adaptor }).executeQuery(new Query());
                dataManager.then((r: ReturnType) => {
                    this.init(gObj);
                    this.processInnerRecords(gObj, exportProperties, isMultipleExport, workbook, r);
                    resolve(this.book);
                });
            });

        } else {
            /* tslint:disable-next-line:no-any */
            let promise: Promise<any>;
            return promise = new Promise((resolve: Function, reject: Function) => {
                let dataManager: Promise<Object> = this.data.getData({}, ExportHelper.getQuery(gObj, this.data));
                dataManager.then((r: ReturnType) => {
                    this.init(gObj);
                    this.processInnerRecords(gObj, exportProperties, isMultipleExport, workbook, r);
                    resolve(this.book);
                });
            });
        }
    }

    /* tslint:disable-next-line:max-line-length */
    /* tslint:disable-next-line:no-any */
    private processInnerRecords(gObj: IGrid, exportProperties: ExcelExportProperties, isMultipleExport: boolean, workbook: any, r: ReturnType): any {
        let blankRows: number = 5;
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
        } else if (this.expType === 'newsheet') {
            this.workSheet = workbook.worksheets;
            this.rows = [];
            this.columns = [];
            this.styles = workbook.styles;
        } else {
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
                    } else {
                        this.footer = JSON.parse(JSON.stringify(exportProperties.footer));
                    }
                }
            } else {
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
        let headerRow: { rows: any[], columns: Column[] } = this.helper.getHeaders(gObj.columns, this.includeHiddenColumn);
        let groupIndent: number = 0;
        /* tslint:disable:no-any */
        if (((r.result) as any).level !== undefined) {
            groupIndent += ((r.result) as any).level;
            groupIndent += ((r.result) as any).childLevels;
        }
        /* tslint:enable:no-any */
        this.processHeaderContent(gObj, headerRow, exportProperties, groupIndent);
        /* tslint:disable-next-line:max-line-length */
        if (exportProperties !== undefined && exportProperties.dataSource !== undefined && !(exportProperties.dataSource instanceof DataManager)) {
            this.processRecordContent(gObj, r, headerRow, isMultipleExport, exportProperties.dataSource as Object[]);
        } else if (exportProperties !== undefined && exportProperties.exportType === 'currentpage') {
            this.processRecordContent(gObj, r, headerRow, isMultipleExport, gObj.getCurrentViewRecords());
        } else {
            this.processRecordContent(gObj, r, headerRow, isMultipleExport);
        }
        this.isExporting = false;
        gObj.trigger(events.excelExportComplete);

    }
    /* tslint:disable-next-line:max-line-length */
    /* tslint:disable-next-line:no-any */
    private processRecordContent(gObj: IGrid, returnType: ReturnType, headerRow: any, isMultipleExport: boolean, currentViewRecords?: Object[]): void {
        /* tslint:disable-next-line:no-any */
        let column: any[] = gObj.columns;

        /* tslint:disable-next-line:no-any */
        let record: any = undefined;
        if (currentViewRecords !== undefined) {
            record = currentViewRecords;
        } else {
            record = returnType.result;
        }

        if (record.level !== undefined) {
            this.processGroupedRows(gObj, record, headerRow, record.level);
        } else {
            this.processRecordRows(gObj, record, headerRow, 0);
            if (returnType.aggregates !== undefined) {
                if (currentViewRecords !== undefined) {
                    this.processAggregates(gObj, returnType.result, currentViewRecords);
                } else {
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
        let sheet: any = {};
        if (this.columns.length > 0) {
            sheet.columns = this.columns;
        }
        sheet.rows = this.rows;
        this.workSheet.push(sheet);

        this.book.worksheets = this.workSheet;
        this.book.styles = this.styles;

        if (!isMultipleExport) {
            if (this.isCsvExport) {
                let book: Workbook = new Workbook(this.book, 'csv');
                book.save('Export.csv');
            } else {
                let book: Workbook = new Workbook(this.book, 'xlsx');
                book.save('Export.xlsx');
            }
            if (this.isElementIdChanged) {
                gObj.element.id = '';
            }
        }
    }
    /* tslint:disable-next-line:no-any */
    private processGroupedRows(gObj: IGrid, dataSource: any, headerRow: any, level: number): void {
        for (let item of dataSource) {
            /* tslint:disable-next-line:no-any */
            let cells: any = [];
            let index: number = 1;
            /* tslint:disable-next-line:no-any */
            let cell: any = {};
            cell.index = index + level;

            /* tslint:disable-next-line:no-any */
            let args: any = {
                value: item.key,
                column: gObj.getColumnByField(item.field),
                style: undefined
            };

            cell.value = item.field + ': ' + this.exportValueFormatter.formatCellValue(args) + ' - ';
            if (item.count > 1) {
                cell.value += item.count + ' items';
            } else {
                cell.value += item.count + ' item';
            }
            cell.style = this.getCaptionThemeStyle(this.theme);
            let captionModelGen: CaptionSummaryModelGenerator = new CaptionSummaryModelGenerator(gObj);
            let groupCaptionSummaryRows: Row<AggregateColumnModel>[] = captionModelGen.generateRows(item);

            this.fillAggregates(gObj, groupCaptionSummaryRows, dataSource.level + dataSource.childLevels, this.rowLength);
            cells.push(cell);
            if (this.rows[this.rowLength - 1].cells.length > 0) {
                let lIndex: number = dataSource.level + dataSource.childLevels + groupCaptionSummaryRows[0].cells.length;
                let hIndex: number = 0;
                for (let tCell of this.rows[this.rowLength - 1].cells) {
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
                    let sCell: any = {};
                    if (dataSource.childLevels === 0) {
                        sCell.index = (hIndex);
                    } else {
                        sCell.index = (hIndex + 1);
                    }
                    sCell.style = this.getCaptionThemeStyle(this.theme);
                    cells.push(sCell);
                    hIndex++;
                }
            } else {
                let span: number = 0;
                //Calculation for column span when group caption dont have aggregates
                for (let col of headerRow.columns) {
                    if ((col as Column).visible) {
                        span++;
                    }
                }
                cell.colSpan = (dataSource.childLevels + span);
            }
            this.rows[this.rowLength - 1].cells = cells;
            this.rowLength++;



            if (dataSource.childLevels !== undefined && dataSource.childLevels > 0) {
                this.processGroupedRows(gObj, item.items, headerRow, item.items.level);
            } else {
                this.processRecordRows(gObj, item.items, headerRow, (level));
                this.processAggregates(gObj, item, undefined, (level));
            }
        }
    }
    /* tslint:disable-next-line:no-any */
    private processRecordRows(gObj: IGrid, record: any, headerRow: any, level: number): void {
        let rLen: number = Object.keys(record).length;
        let index: number = 1;
        /* tslint:disable-next-line:no-any */
        let cells: any = [];
        for (let r: number = 0; r < rLen; r++) {
            cells = [];
            index = 1;
            for (let c: number = 0, len: number = headerRow.columns.length; c < len; c++) {
                /* tslint:disable-next-line:no-any */
                let value: any = record[r][headerRow.columns[c].field];
                if (!isNullOrUndefined(value)) {
                    /* tslint:disable-next-line:no-any */
                    let excelCellArgs: any = { data: record[r], column: headerRow.columns[c] };
                    gObj.trigger(events.excelQueryCellInfo, extend(
                        excelCellArgs,
                        <ExcelQueryCellInfoEventArgs>{
                            column: headerRow.columns[c], data: record[r],
                            value: value, style: undefined, colSpan: 1
                        }));
                    /* tslint:disable-next-line:no-any */
                    let cell: any = {};
                    cell.index = index + level;
                    cell.value = excelCellArgs.value;
                    if (excelCellArgs.colSpan > 1) {
                        cell.colSpan = excelCellArgs.colSpan;
                    }
                    if (excelCellArgs.style !== undefined) {
                        let styleIndex: number = this.getColumnStyle(gObj, index + level);
                        cell.style = this.mergeOptions(this.styles[styleIndex], excelCellArgs.style);
                    } else {
                        cell.style = { name: gObj.element.id + 'column' + (index + level) };
                    }
                    cells.push(cell);
                }
                index++;

            }
            this.rows.push({ index: this.rowLength++, cells: cells });
        }
    }
    /* tslint:disable-next-line:no-any */
    private processAggregates(gObj: IGrid, rec: any, currentViewRecords?: Object[], indent?: number): void {
        let summaryModel: SummaryModelGenerator = new SummaryModelGenerator(gObj);

        /* tslint:disable-next-line:no-any */
        let data: any = undefined;
        if (currentViewRecords !== undefined) {
            data = currentViewRecords;
        } else {
            data = rec;
        }
        if (indent === undefined) {
            indent = 0;
        }
        if (gObj.groupSettings.columns.length > 0) {
            let groupSummaryModel: GroupSummaryModelGenerator = new GroupSummaryModelGenerator(gObj);
            let groupSummaryRows: Row<AggregateColumnModel>[] = groupSummaryModel.generateRows(<Object>data, { level: data.level });
            if (groupSummaryRows.length > 0) {
                this.fillAggregates(gObj, groupSummaryRows, indent);
            }
        }
        let sRows: Row<AggregateColumnModel>[] = summaryModel.generateRows(data, <SummaryData>rec.aggregates);
        if (sRows.length > 0) {
            this.fillAggregates(gObj, sRows, indent);
        }
    }
    /* tslint:disable-next-line:no-any */
    private fillAggregates(gObj: IGrid, cells: any, indent: number, customIndex?: number): void {
        for (let row of cells) {
            /* tslint:disable-next-line:no-any */
            let cells: any = [];
            let index: number = 0;
            for (let cell of row.cells) {
                /* tslint:disable-next-line:no-any */
                let eCell: any = {};
                if ((cell.visible || this.includeHiddenColumn)) {
                    index++;
                    if (cell.isDataCell) {
                        eCell.index = index + indent;
                        if (cell.column.footerTemplate !== undefined) {
                            eCell.value = this.getAggreateValue(CellType.Summary, cell.column.footerTemplate, cell, row);
                        } else if (cell.column.groupFooterTemplate !== undefined) {
                            eCell.value = this.getAggreateValue(CellType.GroupSummary, cell.column.groupFooterTemplate, cell, row);
                        } else if (cell.column.groupCaptionTemplate !== undefined) {
                            eCell.value = this.getAggreateValue(CellType.CaptionSummary, cell.column.groupCaptionTemplate, cell, row);
                        } else {
                            for (let key of Object.keys(row.data[cell.column.field])) {
                                if (key === cell.column.type) {
                                    if (row.data[cell.column.field].sum !== undefined) {
                                        eCell.value = row.data[cell.column.field].sum;
                                    } else if (row.data[cell.column.field].average !== undefined) {
                                        eCell.value = row.data[cell.column.field].average;
                                    } else if (row.data[cell.column.field].max !== undefined) {
                                        eCell.value = row.data[cell.column.field].max;
                                    } else if (row.data[cell.column.field].min !== undefined) {
                                        eCell.value = row.data[cell.column.field].min;
                                    } else if (row.data[cell.column.field].count !== undefined) {
                                        eCell.value = row.data[cell.column.field].count;
                                    } else if (row.data[cell.column.field].truecount !== undefined) {
                                        eCell.value = row.data[cell.column.field].truecount;
                                    } else if (row.data[cell.column.field].falsecount !== undefined) {
                                        eCell.value = row.data[cell.column.field].falsecount;
                                    } else if (row.data[cell.column.field].custom !== undefined) {
                                        eCell.value = row.data[cell.column.field].custom;
                                    }
                                }
                            }
                        }
                        eCell.style = this.getCaptionThemeStyle(this.theme); //{ name: gObj.element.id + 'column' + index };
                        cells.push(eCell);
                    } else {
                        if (customIndex === undefined) {
                            eCell.index = index + indent;
                            eCell.style = this.getCaptionThemeStyle(this.theme); //{ name: gObj.element.id + 'column' + index };
                            cells.push(eCell);
                        }
                    }
                }
            }
            if (customIndex !== undefined) {
                this.rows.push({ index: customIndex, cells: cells });
            } else {
                this.rows.push({ index: this.rowLength++, cells: cells });
            }
        }
    }
    /* tslint:disable-next-line:no-any */
    private getAggreateValue(cellType: CellType, template: any, cell: any, row: any): string {
        let templateFn: { [x: string]: Function } = {};
        templateFn[getEnumValue(CellType, cell.cellType)] = compile(template);
        /* tslint:disable-next-line:max-line-length */
        let txt: NodeList = (templateFn[getEnumValue(CellType, cell.cellType)](row.data[cell.column.field ? cell.column.field : cell.column.columnName]));
        return (<Text>txt[0]).wholeText;
    }
    /* tslint:disable-next-line:no-any */
    private mergeOptions(JSON1: any, JSON2: any): any {
        /* tslint:disable-next-line:no-any */
        let result: any = {};
        /* tslint:disable-next-line:no-any */
        let attrname: any = Object.keys(JSON1);
        for (let index: number = 0; index < attrname.length; index++) {
            if (attrname[index] !== 'name') {
                result[attrname[index]] = JSON1[attrname[index]];
            }
        }
        attrname = Object.keys(JSON2);
        for (let index: number = 0; index < attrname.length; index++) {
            if (attrname[index] !== 'name') {
                result[attrname[index]] = JSON2[attrname[index]];
            }
        }
        return result;
    }

    private getColumnStyle(gObj: IGrid, columnIndex: number): number {
        let index: number = 0;
        for (let style of this.styles) {
            if (style.name === gObj.element.id + 'column' + columnIndex) {
                return index;
            }
            index++;
        }
        return undefined;
    }
    /* tslint:disable-next-line:no-any */
    private processHeaderContent(gObj: IGrid, headerRow: any, exportProperties: ExcelExportProperties, indent: number): void {
        /* tslint:disable-next-line:no-any */
        let column: any[] = gObj.columns;
        let rowIndex: number = 1;
        /* tslint:disable-next-line:no-any */
        let returnValue: { rows: any[], columns: Column[] } = headerRow;
        /* tslint:enable:no-any */
        let gridRows: Row<Column>[] = returnValue.rows;
        // Column collection with respect to the records in the grid
        let gridColumns: Column[] = returnValue.columns;
        /* tslint:disable-next-line:no-any */
        let spannedCells: any[] = [];
        if (indent > 0) {
            let index: number = 0;
            while (index !== indent) {
                this.columns.push({ index: index + 1, width: 30 });
                index++;
            }
        }
        for (let row: number = 0; row < gridRows.length; row++) {
            let currentCellIndex: number = 1 + indent;
            /* tslint:disable-next-line:no-any */
            let cells: any[] = [];

            for (let column: number = 0; column < gridRows[row].cells.length; column++) {
                /* tslint:disable-next-line:no-any */
                let style: any = {};
                /* tslint:disable-next-line:no-any */
                let cell: any = {};
                /* tslint:disable-next-line:no-any */
                let gridCell: any = gridRows[row].cells[column];
                /* tslint:disable-next-line:no-any */
                let result: any = { contains: true, index: 1 };
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
                    for (let i: number = rowIndex; i < gridCell.rowSpan + rowIndex; i++) {
                        /* tslint:disable-next-line:no-any */
                        let spannedCell: any = { rowIndex: 0, columnIndex: 0 };
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

        for (let col: number = 0; col < gridColumns.length; col++) {
            this.parseStyles(gObj, gridColumns[col], this.getRecordThemeStyle(this.theme), indent + col + 1);
        }
    }

    /* tslint:disable-next-line:no-any */
    private getHeaderThemeStyle(theme: Theme): any {
        /* tslint:disable-next-line:no-any */
        let style: any = {};
        style.fontSize = 12;
        style.borders = { color: '#E0E0E0' };
        if (theme !== undefined && theme.header !== undefined) {
            style = this.updateThemeStyle(theme.header, style);
        }
        return style;
    }
    /* tslint:disable-next-line:no-any */
    private updateThemeStyle(themestyle: ThemeStyle, style: any): any {
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
    }
    /* tslint:disable-next-line:no-any */
    private getCaptionThemeStyle(theme: Theme): any {
        /* tslint:disable-next-line:no-any */
        let style: any = {};
        style.fontSize = 13;
        style.backColor = '#F6F6F6';
        if (theme !== undefined && theme.caption !== undefined) {
            style = this.updateThemeStyle(theme.caption, style);
        }
        return style;
    }
    /* tslint:disable-next-line:no-any */
    private getRecordThemeStyle(theme: Theme): any {
        /* tslint:disable-next-line:no-any */
        let style: any = {};
        style.fontSize = 13;
        style.borders = { color: '#E0E0E0' };
        if (theme !== undefined && theme.record !== undefined) {
            style = this.updateThemeStyle(theme.record, style);
        }
        return style;
    }
    /* tslint:disable-next-line:no-any */
    private processExcelHeader(header: ExcelHeader): void {
        if (header.rows !== undefined && (this.expType === 'newsheet' || this.rowLength === 1)) {
            let noRows: number;
            if (header.headerRows === undefined) {
                this.rowLength = header.rows.length;
            } else {
                this.rowLength = header.headerRows;
            }
            if (this.rowLength < header.rows.length) {
                noRows = this.rowLength;
            } else {
                noRows = header.rows.length;
            }
            this.rowLength++;
            for (let row: number = 0; row < noRows; row++) {
                /* tslint:disable-next-line:no-any */
                let json: any = header.rows[row];

                //Row index
                if (!(json.index !== null && json.index !== undefined)) {
                    json.index = (row + 1);
                }
                this.updatedCellIndex(json);
            }
        }
    }
    /* tslint:disable-next-line:no-any */
    private updatedCellIndex(json: ExcelRow): void {
        let cellsLength: number = json.cells.length;
        for (let cellId: number = 0; cellId < cellsLength; cellId++) {
            /* tslint:disable-next-line:no-any */
            let jsonCell: ExcelCell = json.cells[cellId];
            //cell index
            if (!(jsonCell.index !== null && jsonCell.index !== undefined)) {
                jsonCell.index = (cellId + 1);
            }
        }
        this.rows.push(json);
    }
    /* tslint:disable-next-line:no-any */
    private processExcelFooter(footer: ExcelFooter): void {
        if (footer.rows !== undefined) {
            let noRows: number;
            if (footer.footerRows === undefined) {
                this.rowLength += footer.rows.length;
            } else {
                if (footer.footerRows > footer.rows.length) {
                    this.rowLength += (footer.footerRows - footer.rows.length);
                    noRows = footer.rows.length;
                } else {
                    noRows = footer.footerRows;
                }
            }

            for (let row: number = 0; row < noRows; row++) {
                /* tslint:disable-next-line:no-any */
                let json: any = footer.rows[row];

                //Row index
                if (json.index === null || json.index === undefined) {
                    json.index = this.rowLength++;
                } else {
                    json.index += this.rowLength;
                }
                this.updatedCellIndex(json);
            }
        }
    }

    /* tslint:disable-next-line:no-any */
    private getIndex(spannedCells: any, rowIndex: number, columnIndex: number): { contains: boolean, index: number } {
        for (let spannedCell of spannedCells) {
            if ((spannedCell.rowIndex === rowIndex) && (spannedCell.columnIndex === columnIndex)) {
                columnIndex = columnIndex + 1;
                return { contains: true, index: columnIndex };
            }
        }
        return { contains: false, index: columnIndex };
    }
    /* tslint:disable-next-line:no-any */
    private parseStyles(gObj: IGrid, col: any, style: any, index: number): void {
        if (col.format !== undefined) {
            if (col.format.skeleton !== undefined) {
                style.numberFormat = col.format.skeleton;
                if (col.format.type !== undefined) {
                    style.type = col.format.type;
                }
            } else {
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
    }
    /**
     * To destroy the excel export
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        //destroy for exporting
    }
}
interface SummaryData {
    aggregates?: Object;
    level?: number;
}