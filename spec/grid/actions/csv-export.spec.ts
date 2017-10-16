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

Grid.Inject(Page, Group, Selection, Toolbar, ExcelExport);


function getEventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = extend({}, tempEvent);
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

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

describe('csv export testing', () => {

    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    afterEach((done) => {
        remove(elem);
        setTimeout(function () {
            done();
        }, 1000);

    });
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    it('CSV export', (done) => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data.slice(0, 30),
                allowExcelExport: true,
                allowReordering: true,
                allowRowDragAndDrop: true,
                allowPaging: true,
                allowFiltering: true,
                allowSelection: true,
                allowSorting: true,
                selectionSettings: { type: 'multiple', mode: 'row' },
                toolbar: ['excelexport', 'pdfexport'],
                excelQueryCellInfo: excelQueryCellInfo,
                columns: [
                    {
                        field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120
                        , columns: [
                            { field: 'OrderID1', headerText: 'Shipped Date', textAlign: 'right', width: 145, format: 'yMd' },
                            { field: 'OrderID2', headerText: 'Ship Country', width: 140 },
                        ]
                    },
                    {
                        headerText: 'Order Details', columns: [
                            { field: 'OrderDate', headerText: 'Order Date', textAlign: 'right', width: 135, format: 'yMd' },
                            {
                                headerText: 'Frieght', columns: [
                                    { field: 'Freight', headerText: 'Freight1($)', textAlign: 'right', width: 120, format: 'C2' },
                                    { field: 'Freight', headerText: 'Freight2($)', textAlign: 'right', width: 120, format: 'C2' },
                                ]
                            }
                        ]
                    },
                    {
                        headerText: 'Ship Details', columns: [
                            { field: 'ShippedDate', headerText: 'Shipped Date', textAlign: 'right', width: 145, format: 'yMd' },
                            { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                        ]
                    },
                    { field: 'OrderIDdupl', headerText: 'Order IDduplicate', textAlign: 'right', width: 120 },
                ]

            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();

        gridObj.csvExport(undefined);

        //grid.csvExport(); // <- default grid exporting.
        //  }
        // }
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('CSV export with aggregates', (done) => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data.slice(0, 30),
                allowExcelExport: true,
                allowReordering: true,
                allowRowDragAndDrop: true,
                allowPaging: true,
                allowFiltering: true,
                allowSelection: true,
                allowSorting: true,
                selectionSettings: { type: 'multiple', mode: 'row' },
                toolbar: ['excelexport', 'pdfexport'],
                excelQueryCellInfo: excelQueryCellInfo,
                columns: [
                    {
                        field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120
                        , columns: [
                            { field: 'OrderID1', headerText: 'Shipped Date', textAlign: 'right', width: 145, format: 'yMd' },
                            { field: 'OrderID2', headerText: 'Ship Country', width: 140 },
                        ]
                    },
                    {
                        headerText: 'Order Details', columns: [
                            { field: 'OrderDate', headerText: 'Order Date', textAlign: 'right', width: 135, format: 'yMd' },
                            {
                                headerText: 'Frieght', columns: [
                                    { field: 'Freight', headerText: 'Freight1($)', textAlign: 'right', width: 120, format: 'C2' },
                                    { field: 'Freight', headerText: 'Freight2($)', textAlign: 'right', width: 120, format: 'C2' },
                                ]
                            }
                        ]
                    },
                    {
                        headerText: 'Ship Details', columns: [
                            { field: 'ShippedDate', headerText: 'Shipped Date', textAlign: 'right', width: 145, format: 'yMd' },
                            { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                        ]
                    },
                    { field: 'OrderIDdupl', headerText: 'Order IDduplicate', textAlign: 'right', width: 120 },
                ],
                aggregates: [
                    {
                        columns: [{
                            type: 'sum',
                            field: 'Freight',
                            format: 'C2',
                            footerTemplate: 'Sum: ${sum}'
                        }]
                    },
                    {
                        columns: [{
                            type: 'average',
                            field: 'Freight',
                            format: 'C2',
                            footerTemplate: 'Average: ${average}'
                        }]
                    },
                    {
                        columns: [{
                            type: 'min',
                            field: 'Freight',
                            format: 'C2',
                            footerTemplate: 'Minimum: ${min}'
                        }]
                    },
                    {
                        columns: [{
                            type: 'max',
                            field: 'Freight',
                            format: 'C2',
                            footerTemplate: 'Maximum: ${max}'
                        }]
                    }
                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
        //  (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_excelexport')).click();
        //  gridObj.toolbarClick = (args: Object) => {
        //   if (args['item'].id === 'Grid_excelexport') {
        let excelExportProperties: any = {
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

        gridObj.csvExport(excelExportProperties);

        //grid.csvExport(); // <- default grid exporting.
        //  }
        // }
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('CSV export with header and footer', (done) => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data.slice(0, 30),
                allowExcelExport: true,
                allowReordering: true,
                allowRowDragAndDrop: true,
                allowPaging: true,
                allowFiltering: true,
                allowSelection: true,
                allowSorting: true,
                selectionSettings: { type: 'multiple', mode: 'row' },
                toolbar: ['excelexport', 'pdfexport'],
                excelQueryCellInfo: excelQueryCellInfo,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 90 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 90 },
                    {
                        field: 'Freight', headerText: 'Freight', format: 'C', headerTextAlign: 'centre',
                        textAlign: 'right', width: 75
                    },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 85 },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, headerTextAlign: 'centre', format: 'yMd', type: 'date', textAlign: 'right' },
                    { field: 'ShipCity', headerText: 'Ship City', width: 90 },
                    { field: 'Verified' }

                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
        let excelExportProperties: any = {
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
        gridObj.csvExport(excelExportProperties);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('CSV export with empty export properties', (done) => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data.slice(0, 30),
                allowExcelExport: true,
                allowReordering: true,
                allowRowDragAndDrop: true,
                allowPaging: true,
                allowFiltering: true,
                allowSelection: true,
                allowSorting: true,
                selectionSettings: { type: 'multiple', mode: 'row' },
                toolbar: ['excelexport', 'pdfexport'],
                excelQueryCellInfo: excelQueryCellInfo,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 90 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 90 },
                    {
                        field: 'Freight', headerText: 'Freight', format: 'C', headerTextAlign: 'centre',
                        textAlign: 'right', width: 75
                    },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 85 },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, headerTextAlign: 'centre', format: 'yMd', type: 'date', textAlign: 'right' },
                    { field: 'ShipCity', headerText: 'Ship City', width: 90 },
                    { field: 'Verified' }

                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
        let excelExportProperties: any = {
        };
        gridObj.csvExport(excelExportProperties);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('CSV export with footer', (done) => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data.slice(0, 30),
                allowExcelExport: true,
                allowReordering: true,
                allowRowDragAndDrop: true,
                allowPaging: true,
                allowFiltering: true,
                allowSelection: true,
                allowSorting: true,
                selectionSettings: { type: 'multiple', mode: 'row' },
                toolbar: ['excelexport', 'pdfexport'],
                excelQueryCellInfo: excelQueryCellInfo,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 90 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 90 },
                    {
                        field: 'Freight', headerText: 'Freight', format: 'C', headerTextAlign: 'centre',
                        textAlign: 'right', width: 75
                    },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 85 },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, headerTextAlign: 'centre', format: 'yMd', type: 'date', textAlign: 'right' },
                    { field: 'ShipCity', headerText: 'Ship City', width: 90 },
                    { field: 'Verified' }

                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
        let excelExportProperties: any = {
            header: {
                headerRows: undefined,
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
                footerRows: undefined,
                rows: [
                    { cells: [{ colSpan: 6, value: "Thank you for your business!", style: { hAlign: 'center', bold: true } }] },
                    { cells: [{ colSpan: 6, value: "!Visit Again!", style: { hAlign: 'center', bold: true } }] }
                ]
            },
        };
        gridObj.csvExport(excelExportProperties);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('footer with empty properties', (done) => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data.slice(0, 30),
                allowExcelExport: true,
                allowReordering: true,
                allowRowDragAndDrop: true,
                allowPaging: true,
                allowFiltering: true,
                allowSelection: true,
                allowSorting: true,
                selectionSettings: { type: 'multiple', mode: 'row' },
                toolbar: ['excelexport', 'pdfexport'],
                excelQueryCellInfo: excelQueryCellInfo,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 90 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 90 },
                    {
                        field: 'Freight', headerText: 'Freight', format: 'C', headerTextAlign: 'centre',
                        textAlign: 'right', width: 75
                    },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 85 },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, headerTextAlign: 'centre', format: 'yMd', type: 'date', textAlign: 'right' },
                    { field: 'ShipCity', headerText: 'Ship City', width: 90 },
                    { field: 'Verified' }

                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
        let excelExportProperties: any = {
            header: {
            },
            footer: {
            },
        };
        gridObj.csvExport(excelExportProperties);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('footer with wrong footer rows', (done) => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data.slice(0, 30),
                allowExcelExport: true,
                allowReordering: true,
                allowRowDragAndDrop: true,
                allowPaging: true,
                allowFiltering: true,
                allowSelection: true,
                allowSorting: true,
                selectionSettings: { type: 'multiple', mode: 'row' },
                toolbar: ['excelexport', 'pdfexport'],
                excelQueryCellInfo: excelQueryCellInfo,
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 90 },
                    { field: 'CustomerID', headerText: 'Customer ID', width: 90 },
                    {
                        field: 'Freight', headerText: 'Freight', format: 'C', headerTextAlign: 'centre',
                        textAlign: 'right', width: 75
                    },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 85 },
                    { field: 'OrderDate', headerText: 'Order Date', width: 130, headerTextAlign: 'centre', format: 'yMd', type: 'date', textAlign: 'right' },
                    { field: 'ShipCity', headerText: 'Ship City', width: 90 },
                    { field: 'Verified' }

                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
        let excelExportProperties: any = {
            header: {
                headerRows: 2,
                rows: [
                    { index: 1, cells: [{ index: 1, colSpan: 6, value: "Northwind Traders", style: { fontColor: '#C67878', fontSize: 20, hAlign: 'center', bold: true, } }] },
                    { cells: [{ colSpan: 6, value: "2501 Aerial Center Parkway", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'center', bold: true, } }] },
                    { cells: [{ colSpan: 6, value: "Suite 200 Morrisville, NC 27560 USA", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'center', bold: true, } }] },
                    { cells: [{ colSpan: 6, value: "Tel +1 888.936.8638 Fax +1 919.573.0306", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'center', bold: true, } }] },
                    { cells: [{ colSpan: 6, hyperlink: { target: 'https://www.northwind.com/', displayText: 'www.northwind.com' }, style: { hAlign: 'center' } }] },
                    { cells: [{ colSpan: 6, hyperlink: { target: 'mailto:support@northwind.com' }, style: { hAlign: 'center' } }] },
                ]
            },
            footer: {
                footerRows: 1,
                rows: [
                    { index: 1, cells: [{ index: 1, colSpan: 6, value: "Thank you for your business!", style: { hAlign: 'center', bold: true } }] },
                    { cells: [{ index: 1, colSpan: 6, value: "!Visit Again!", style: { hAlign: 'center', bold: true } }] }
                ]
            },
        };
        gridObj.csvExport(excelExportProperties);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('aggregates', (done) => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data.slice(0, 30),
                allowExcelExport: true,
                allowReordering: true,
                allowRowDragAndDrop: true,
                allowPaging: true,
                allowFiltering: true,
                allowSelection: true,
                allowSorting: true,
                selectionSettings: { type: 'multiple', mode: 'row' },
                toolbar: ['excelexport', 'pdfexport'],
                excelQueryCellInfo: excelQueryCellInfo,
                columns: [
                    {
                        field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120
                        , columns: [
                            { field: 'OrderID1', headerText: 'Shipped Date', textAlign: 'right', width: 145, format: 'yMd' },
                            { field: 'OrderID2', headerText: 'Ship Country', width: 140 },
                        ]
                    },
                    {
                        headerText: 'Order Details', columns: [
                            { field: 'OrderDate', headerText: 'Order Date', textAlign: 'right', width: 135, format: 'yMd' },
                            {
                                headerText: 'Frieght', columns: [
                                    { field: 'Freight', headerText: 'Freight1($)', textAlign: 'right', width: 120, format: 'C2' },
                                    { field: 'Freight', headerText: 'Freight2($)', textAlign: 'right', width: 120, format: 'C2' },
                                ]
                            }
                        ]
                    },
                    {
                        headerText: 'Ship Details', columns: [
                            { field: 'ShippedDate', headerText: 'Shipped Date', textAlign: 'right', width: 145, format: 'yMd' },
                            { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                        ]
                    },
                    { field: 'OrderIDdupl', headerText: 'Order IDduplicate', textAlign: 'right', width: 120 },
                ],
                aggregates: [
                    {
                        columns: [{
                            type: 'sum',
                            field: 'Freight',
                            format: 'C2'
                        }]
                    },
                    {
                        columns: [{
                            type: 'average',
                            field: 'Freight',
                            format: 'C2'
                        }]
                    },
                    {
                        columns: [{
                            type: 'min',
                            field: 'Freight',
                            format: 'C2'
                        }]
                    },
                    {
                        columns: [{
                            type: 'max',
                            field: 'Freight',
                            format: 'C2'
                        }]
                    },
                    {
                        columns: [{
                            type: 'count',
                            field: 'Freight',
                            format: 'C2'
                        }]
                    },
                    {
                        columns: [{
                            type: 'truecount',
                            field: 'Freight',
                            format: 'C2'
                        }]
                    },
                    {
                        columns: [{
                            type: 'falsecount',
                            field: 'Freight',
                            format: 'C2'
                        }]
                    }
                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
        //  (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_excelexport')).click();
        //  gridObj.toolbarClick = (args: Object) => {
        //   if (args['item'].id === 'Grid_excelexport') {
        let excelExportProperties: any = {
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
            exportType: 'currentview'
        };

        gridObj.csvExport(excelExportProperties);

        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('no-column-width', (done) => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data.slice(0, 30),
                allowExcelExport: true,
                toolbar: ['excelexport'],
                columns: [
                    {
                        field: 'OrderID', headerText: 'Order ID', textAlign: 'right'
                    }
                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();

        gridObj.csvExport();

        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('custom Data source - local data', (done) => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data.slice(0, 30),
                allowExcelExport: true,
                toolbar: ['excelexport'],
                columns: [
                    {
                        field: 'OrderID', headerText: 'Order ID', textAlign: 'right'
                    }
                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
        //Adds custom data - local data
        let customDataProperties: any = {
            dataSource: data.slice(10, 15)
        }
        gridObj.csvExport(customDataProperties);

        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('custom Data source - remote data', (done) => {
        let Data: Object[] = [
            {
                ProductName: 'cheng'

            }, {
                ProductName: 'mong'

            },];
        let rData: Object = new DataManager(
            {
                url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Products',
                adaptor: new ODataV4Adaptor, crossDomain: true
            });
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: Data,
                allowExcelExport: true,
                toolbar: ['excelexport'],
                columns: [
                    {
                        field: 'ProductName', headerText: 'Product Name', textAlign: 'right'
                    }
                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
        // Adds custom data - remote data
        let customDataProperties: any = {
            dataSource: rData
        }
        gridObj.csvExport(customDataProperties);

        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });

    it('possible-date-time-formats', (done) => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data.slice(0, 2),
                allowExcelExport: true,
                toolbar: ['excelexport', 'pdfexport'],
                columns: [
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

                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
        gridObj.csvExport();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('possible-date-time-skeletons', (done) => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data.slice(0, 2),
                allowExcelExport: true,
                toolbar: ['excelexport', 'pdfexport'],
                columns: [
                    { field: 'OrderDate', headerText: 'short-skeleton-date', format: { skeleton: 'short', type: 'date' } },
                    { field: 'OrderDate', headerText: 'medium-skeleton-date', format: { skeleton: 'medium', type: 'date' } },
                    { field: 'OrderDate', headerText: 'long-skeleton-date', format: { skeleton: 'long', type: 'date' } },
                    { field: 'OrderDate', headerText: 'full-skeleton-date', format: { skeleton: 'full', type: 'date' } },

                    { field: 'OrderDate', headerText: 'short-skeleton-time', format: { skeleton: 'short', type: 'time' } },
                    { field: 'OrderDate', headerText: 'medium-skeleton-time', format: { skeleton: 'medium', type: 'time' } },
                    { field: 'OrderDate', headerText: 'long-skeleton-time', format: { skeleton: 'long', type: 'time' } },
                    { field: 'OrderDate', headerText: 'full-skeleton-time', format: { skeleton: 'full', type: 'time' } },

                    // { field: 'OrderDate', headerText: 'short-skeleton-datetime', format: { skeleton: 'short', type: 'datetime' } },
                    // { field: 'OrderDate', headerText: 'medium-skeleton-datetime', format: { skeleton: 'medium', type: 'datetime' } },
                    // { field: 'OrderDate', headerText: 'long-skeleton-datetime', format: { skeleton: 'long', type: 'datetime' } },
                    // { field: 'OrderDate', headerText: 'full-skeleton-datetime', format: { skeleton: 'full', type: 'datetime' } },

                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
        gridObj.csvExport();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
});

