/**
 * Grid Excel Export spec document
 */
import { EmitType, EventHandler } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Group } from '../../../src/grid/actions/group';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { data } from '../base/datasource.spec';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { ExcelExport } from '../../../src/grid/actions/excel-export';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page, Group, Selection, Toolbar, ExcelExport, Aggregate);


function excelQueryCellInfo(args: any): void {
    if ((args.column.field === 'OrderID') && (args.value > 10250)) {
        args.style = { fontName: 'Tahoma', bold: true, italic: true, backColor: '#C67890', leftBorder: { color: '#C67878', lineStyle: 'thick' } };
    }
    if (args.column.field === 'ShipCountry' && args.value === 'Switzerland') {
        args.style = { textAlignment: 'right', backColor: '#C67890', verticalAlignment: 'bottom', fontStyle: 'Bold', fontSize: 15, fontFamily: 'TimesRoman' };
    }
    if (args.column.field === 'OrderDate') {
        args.style = { name: 'colm', textAlignment: 'right', backColor: '#C67890', verticalAlignment: 'bottom', fontStyle: 'Bold', fontSize: 15, fontFamily: 'TimesRoman' };
    }
}

let customDataProperties: any = {
    dataSource: data.slice(10, 15)
}
let customAggregateFn = (data: Object[]) => data.filter((item: any) => item.ShipCountry === 'France').length;

let excelExportProperties: any = {
    header: {
        headerRows: 3,
        rows: [
            { cells: [{ colSpan: 6, value: "Northwind Traders", style: { fontColor: '#C67878', fontSize: 20, hAlign: 'center', bold: true, } }] },
            { cells: [{ colSpan: 6, value: "2501 Aerial Center Parkway", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'center', bold: true, } }] },
            { cells: [{ colSpan: 6, value: "Suite 200 Morrisville, NC 27560 USA", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'center', bold: true, } }] },
            { cells: [{ colSpan: 6, value: "Tel +1 888.936.8638 Fax +1 919.573.0306", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'center', bold: true, } }] },
            { cells: [{ colSpan: 6, hyperlink: { target: 'https://www.northwind.com/', displayText: 'www.northwind.com' }, style: { hAlign: 'center' } }] },
            { cells: [{ colSpan: 6, hyperlink: { target: 'mailto:support@northwind.com' }, style: { hAlign: 'center' } }] },
        ]
    },
    footer: {
        footerRows: 4,
        rows: [
            { cells: [{ colSpan: 6, value: "Thank you for your business!", style: { hAlign: 'center', bold: true } }] },
            { cells: [{ colSpan: 6, value: "!Visit Again!", style: { hAlign: 'center', bold: true } }] }
        ]
    },
    exportType: 'currentpage'
};

describe('excel export', () => {

    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;


    afterAll(() => {
        remove(elem);
    });
    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data,
                allowExcelExport: true,
                allowPdfExport: true,
                allowPaging: true,
                allowGrouping: true,
                groupSettings: { columns: ['Verified', 'ShipRegion', 'ShipCountry'] },
                toolbar: ['excelexport'],
                pageSettings: { pageCount: 5 },
                excelQueryCellInfo: excelQueryCellInfo,
                columns: [
                    {
                        field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: '120px'
                        , columns: [
                            { field: 'OrderID1', headerText: 'Shipped Date', textAlign: 'right', width: 145, format: 'yMd' },
                            { field: 'OrderID2', headerText: 'Ship Country', width: 140 },
                        ]
                    },
                    { field: 'OrderDate', headerText: 'Order Date', headerTextAlign: 'right', textAlign: 'right', width: '15%', format: 'yMd' },
                    { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    { field: 'ShipRegion', width: 140 },
                    { field: 'Verified', width: 140 },
                    { field: 'ProductName', headerText: 'Product Name', textAlign: 'right' },
                    { field: 'OrderDate', headerText: 'short-skeleton-date', format: { skeleton: 'short' } },
                    { field: 'OrderDate', headerText: 'short-format-date', format: 'short', type: 'date' },
                    { field: 'OrderDate', headerText: 'medium-format-date', format: 'medium', type: 'date' },
                    { field: 'OrderDate', headerText: 'long-format-date', format: 'long', type: 'date' },
                    { field: 'OrderDate', headerText: 'full-format-date', format: 'full', type: 'date' },

                    { field: 'OrderDate', headerText: 'short-format-time', format: 'short', type: 'time' },
                    { field: 'OrderDate', headerText: 'medium-format-time', format: 'medium', type: 'time' },
                    { field: 'OrderDate', headerText: 'long-format-time', format: 'long', type: 'time' },
                    { field: 'OrderDate', headerText: 'full-format-time', format: 'full', type: 'time' },

                    { field: 'OrderDate', headerText: 'short-format-datetime', format: 'short', type: 'datetime' },
                    { field: 'OrderDate', headerText: 'medium-format-datetime', format: 'medium', type: 'datetime' },
                    { field: 'OrderDate', headerText: 'long-format-datetime', format: 'long', type: 'datetime' },
                    { field: 'OrderDate', headerText: 'full-format-datetime', format: 'full', type: 'datetime' },
                    { field: 'OrderDate', headerText: 'short-skeleton-date', format: { skeleton: 'short', type: 'date' } },
                    { field: 'OrderDate', headerText: 'medium-skeleton-date', format: { skeleton: 'medium', type: 'date' } },
                    { field: 'OrderDate', headerText: 'long-skeleton-date', format: { skeleton: 'long', type: 'date' } },
                    { field: 'OrderDate', headerText: 'full-skeleton-date', format: { skeleton: 'full', type: 'date' } },

                    { field: 'OrderDate', headerText: 'short-skeleton-time', format: { skeleton: 'short', type: 'time' } },
                    { field: 'OrderDate', headerText: 'medium-skeleton-time', format: { skeleton: 'medium', type: 'time' } },
                    { field: 'OrderDate', headerText: 'long-skeleton-time', format: { skeleton: 'long', type: 'time' } },
                    { field: 'OrderDate', headerText: 'full-skeleton-time', format: { skeleton: 'full', type: 'time' } },
                ],
                aggregates: [{
                    columns: [
                        {
                            type: 'min',
                            field: 'Freight',
                            format: 'C2',
                            groupFooterTemplate: 'Min: ${min}'
                        },
                        {
                            type: 'max',
                            field: 'OrderDate',
                            format: { type: 'date', skeleton: 'medium' },
                            groupFooterTemplate: 'Max: ${max}'
                        }, {
                            type: 'max',
                            field: 'Freight',
                            format: 'C2',
                            groupCaptionTemplate: 'Max: ${max}'
                        }, {
                            type: 'max',
                            field: 'OrderDate',
                            format: { type: 'date', skeleton: 'medium' },
                            groupCaptionTemplate: 'Max: ${max}'
                        }, {
                            type: 'custom',
                            customAggregate: customAggregateFn,
                            field: 'ShipCountry',
                        }
                    ]
                }, {
                    columns: [{
                        type: 'custom',
                        customAggregate: customAggregateFn,
                        columnName: 'ShipCountry',
                    }]
                }]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });

    it('material', (done) => {
        gridObj.excelExport();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('bootstrap', (done) => {
        gridObj.excelExport({
            theme:
                {
                    header: { fontName: 'Segoe UI', fontColor: '#666666' },
                    record: { fontName: 'Segoe UI', fontColor: '#666666' },
                    caption: { fontName: 'Segoe UI', fontColor: '#666666' }
                }
        });
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('header and footer', (done) => {
        gridObj.excelExport(excelExportProperties);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('custom data source', (done) => {
        gridObj.excelExport(customDataProperties);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('remote data', (done) => {
        gridObj.excelExport(new DataManager(data.slice(10, 15) as JSON[]));
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });

    it('material-csv', (done) => {
        gridObj.csvExport();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('bootstrap - csv', (done) => {
        gridObj.csvExport({
            theme:
                {
                    header: { fontName: 'Segoe UI', fontColor: '#666666' },
                    record: { fontName: 'Segoe UI', fontColor: '#666666' },
                    caption: { fontName: 'Segoe UI', fontColor: '#666666' }
                }
        });
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('header and footer - csv', (done) => {
        gridObj.csvExport(excelExportProperties);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('custom data source - csv', (done) => {
        gridObj.csvExport(customDataProperties);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('remote data - csv', (done) => {
        gridObj.csvExport(new DataManager(data.slice(10, 15) as JSON[]));
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
});

describe('multiple-grid-exporting', () => {
    let gridObj1: Grid;
    let elem1: HTMLElement = createElement('div', { id: 'Grid1' });
    let gridObj2: Grid;
    let elem2: HTMLElement = createElement('div', { id: 'Grid2' });
    let gridObj3: Grid;
    let elem3: HTMLElement = createElement('div', { id: 'Grid3' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;
    let excelExportPropertiesHeader: any = {
        multipleExport: {},
        includeHiddenColumn: true,
        header: {
            headerRows: 7,
            rows: [
                { cells: [{ colSpan: 6, value: "Northwind Traders", style: { fontColor: '#C67878', fontSize: 20, hAlign: 'center', bold: true, } }] },
                { cells: [{ colSpan: 6, value: "2501 Aerial Center Parkway", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'center', bold: true, } }] },
                { cells: [{ colSpan: 6, value: "Suite 200 Morrisville, NC 27560 USA", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'center', bold: true, } }] },
                { cells: [{ colSpan: 6, value: "Tel +1 888.936.8638 Fax +1 919.573.0306", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'center', bold: true, } }] },
                { cells: [{ colSpan: 6, hyperlink: { target: 'https://www.northwind.com/', displayText: 'www.northwind.com' }, style: { hAlign: 'center' } }] },
                { cells: [{ colSpan: 6, hyperlink: { target: 'mailto:support@northwind.com' }, style: { hAlign: 'center' } }] },
            ]
        }
    };
    let appendExcelExportProperties: any = {
        multipleExport: { blankRows: 3 },
        includeHiddenColumn: true,
        header: {
            headerRows: 7,
            rows: [
                { cells: [{ colSpan: 6, value: "Northwind Traders", style: { fontColor: '#C67878', fontSize: 20, hAlign: 'center', bold: true, } }] },
                { cells: [{ colSpan: 6, value: "2501 Aerial Center Parkway", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'center', bold: true, } }] },
                { cells: [{ colSpan: 6, value: "Suite 200 Morrisville, NC 27560 USA", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'center', bold: true, } }] },
                { cells: [{ colSpan: 6, value: "Tel +1 888.936.8638 Fax +1 919.573.0306", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'center', bold: true, } }] },
                { cells: [{ colSpan: 6, hyperlink: { target: 'https://www.northwind.com/', displayText: 'www.northwind.com' }, style: { hAlign: 'center' } }] },
                { cells: [{ colSpan: 6, hyperlink: { target: 'mailto:support@northwind.com' }, style: { hAlign: 'center' } }] },
            ]
        },
        footer: {
            footerRows: 4,
            rows: [
                { cells: [{ colSpan: 6, value: "Thank you for your business!", style: { hAlign: 'center', bold: true } }] },
                { cells: [{ colSpan: 6, value: "!Visit Again!", style: { hAlign: 'center', bold: true } }] }
            ]
        },
    };

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    beforeAll(() => {
        document.body.appendChild(elem1);
        document.body.appendChild(elem3);
        gridObj1 = new Grid(
            {
                dataSource: data.slice(0, 2),
                allowExcelExport: true,
                toolbar: ['excelexport'],
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120 },
                    { field: 'OrderDate', format: { skeleton: 'full', type: 'date' }, visible: false },
                ],
            });

        gridObj3 = new Grid(
            {
                dataSource: data.slice(0, 2),
                allowExcelExport: true,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120 },
                    { field: 'OrderDate', format: { skeleton: 'full', type: 'time' } },
                ],
            });

        gridObj1.appendTo('#Grid1');
        gridObj3.appendTo('#Grid3');
    });
    afterAll(() => {
        remove(elem1);
        remove(elem2);
        remove(elem3);
    });
    let gBook: any;
    it('multiexport without saving the book', (done) => {
        let excelExp: Promise<any> = gridObj1.excelExport(excelExportPropertiesHeader, true);
        excelExp.then((data: any) => {
            gBook = data;
            done();
        });
    });
    it('multiexport with saving the book', (done) => {
        let excelExp: Promise<any> = gridObj3.excelExport(appendExcelExportProperties, false, gBook);
        excelExp.then((data: any) => {
            done();
        });
    });
    it('multiexport without saving the book-csv', (done) => {
        let excelExp: Promise<any> = gridObj1.csvExport(excelExportPropertiesHeader, true);
        excelExp.then((data: any) => {
            gBook = data;
            done();
        });
    });

    it('multiexport with saving the book-csv', (done) => {
        let excelExp: Promise<any> = gridObj3.csvExport(appendExcelExportProperties, false, gBook);
        excelExp.then((data: any) => {
            done();
        });
    });
});




