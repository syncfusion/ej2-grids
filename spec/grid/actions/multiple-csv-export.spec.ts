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
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { data } from '../base/datasource.spec';
import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { ExcelExport } from '../../../src/grid/actions/excel-export';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Page, Toolbar, ExcelExport);

function excelQueryCellInfo(args: any): void {
    if ((args.column.field === 'OrderID') && (args.value > 11000)) {
        args.style = { fontName: 'Tahoma', bold: true, italic: true, backColor: '#C67890', leftBorder: { color: '#C67878', lineStyle: 'thick' } };
    }
    if (args.column.field === 'ShipCountry' && args.value === 'Switzerland') {
        args.style = { textAlignment: 'right', backColor: '#C67890', verticalAlignment: 'bottom', fontStyle: 'Bold', fontSize: 15, fontFamily: 'TimesRoman' };
    }
    if (args.column.field === 'OrderDate') {
        args.style = { name: 'colm', textAlignment: 'right', backColor: '#C67890', verticalAlignment: 'bottom', fontStyle: 'Bold', fontSize: 15, fontFamily: 'TimesRoman' };
    }
}


describe('multiple-grid-csv-exporting', () => {
    let gridObj1: Grid;
    let elem1: HTMLElement = createElement('div', { id: 'Grid1' });
    let gridObj2: Grid;
    let elem2: HTMLElement = createElement('div', { id: 'Grid2' });
    let gridObj3: Grid;
    let elem3: HTMLElement = createElement('div', { id: 'Grid3' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;
    let appendExcelExportProperties: any = {
        theme: 'fabric',
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
        let excelExp: Promise<any> = gridObj1.csvExport(appendExcelExportProperties, true);
        excelExp.then((data: any) => {
            gBook = data;
            done();
        });
    });
    it('multiexport with saving the book', (done) => {
        let excelExp: Promise<any> = gridObj3.csvExport(appendExcelExportProperties, false, gBook);
        excelExp.then((data: any) => {
            done();
        });
    });
});
describe('multiple grid csv exporting with header and footer', () => {
    let gridObj1: Grid;
    let elem1: HTMLElement = createElement('div', { id: 'Grid1' });
    let gridObj2: Grid;
    let elem2: HTMLElement = createElement('div', { id: 'Grid2' });
    let gridObj3: Grid;
    let elem3: HTMLElement = createElement('div', { id: 'Grid3' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;
    let newExcelExportProperties: any = {
        theme: 'fabric',
        includeHiddenColumn: false,
        multipleExport: { type: 'newsheet', blankRows: 3 },
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
                ],
            });

        gridObj3 = new Grid(
            {
                dataSource: data.slice(0, 2),
                allowExcelExport: true,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', width: 120 },
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
        let excelExp: Promise<any> = gridObj1.csvExport(newExcelExportProperties, true);
        excelExp.then((data: any) => {
            gBook = data;
            done();
        });
    });
    it('multiexport with saving the book', (done) => {
        let excelExp: Promise<any> = gridObj3.csvExport(newExcelExportProperties, false, gBook);
        excelExp.then((data: any) => {
            done();
        });
    });
});
describe('multiple grid csv exporting with header', () => {
    let gridObj1: Grid;
    let elem1: HTMLElement = createElement('div', { id: 'Grid1' });
    let gridObj2: Grid;
    let elem2: HTMLElement = createElement('div', { id: 'Grid2' });
    let gridObj3: Grid;
    let elem3: HTMLElement = createElement('div', { id: 'Grid3' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;
    let appendExcelExportProperties: any = {
        theme: 'fabric',
        multipleExport: { },
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
    
    afterAll((done) => {
        remove(elem1);
        remove(elem2);
        remove(elem3);
        setTimeout(function () {
            done();
        }, 1000);

    });
    let gBook: any;
    it('multiexport without saving the book', (done) => {
        let excelExp: Promise<any> = gridObj1.csvExport(appendExcelExportProperties, true);
        excelExp.then((data: any) => {
            gBook = data;
            done();
        });
    });
    it('multiexport with saving the book', (done) => {
        let excelExp: Promise<any> = gridObj3.csvExport(appendExcelExportProperties, false, gBook);
        excelExp.then((data: any) => {
            done();
        });
    });
});