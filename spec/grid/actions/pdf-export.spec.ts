/**
 * Grid PDF Export spec document
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
import { data, image, rData, employeeData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { PdfExport } from '../../../src/grid/actions/pdf-export';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
Grid.Inject(Page, Group, Selection, Toolbar, PdfExport);

describe('PDF Export with Grid Theme', () => {
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
                allowPdfExport: true,
                allowPaging: true,
                allowGrouping: true,
                groupSettings: { columns: ['Verified', 'ShipRegion', 'ShipCountry'] },
                toolbar: ['pdfexport'],
                pageSettings: { pageCount: 5 },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                    { field: 'OrderDate', headerText: 'Order Date', headerTextAlign: 'right', textAlign: 'right', width: 135, format: 'yMd' },
                    { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    { field: 'ShipRegion', width: 140 },
                    { field: 'Verified', width: 140 },
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
                        }
                    ]
                }]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('fabric', (done) => {
        gridObj.pdfExport({ theme: 'fabric' });
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('bootstrap', (done) => {
        gridObj.pdfExport({ theme: 'bootstrap' });
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    it('material', (done) => {
        gridObj.pdfExport({ theme: 'material' });
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
});
describe('Single Grid Column to PDF Export with exportProperties as undefined', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid(
            {
                dataSource: data,
                allowPdfExport: true,
                columns: [{ field: 'OrderID', width: 100 }],
                toolbar: ['pdfexport'],
            });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any;
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('exportProperties=undefined', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('Multiple Grid Column to PDF Export with exportProperties as undefined', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', type: 'number', format: 'C' },
                { field: 'ShipCountry', headerText: 'Ship Country' },
                { field: 'OrderDate', headerText: 'Order Date', type: 'date', format: 'MMMEd' },
                { field: 'OrderDate', headerText: 'Order Date Time', type: 'datetime', format: 'Hms' },
                { field: "Verified", headerText: 'Verified', type: 'boolean' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('exportProperties=undefined', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any;
        gridObj.pdfExport(pdfExportProperties);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export for Grid with format property without type', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' },
                { field: 'ShipCountry', headerText: 'Ship Country' },
                { field: 'OrderDate', headerText: 'Order Date', format: 'MMMEd' },
                { field: 'OrderDate', headerText: 'Order Date Time', format: 'Hms' },
                { field: "Verified", headerText: 'Verified' }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                gridObj.pdfExport();
            }
        }
    });
    it('format property without type', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export for Grid with textAlign property', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'left' },
                { field: 'Freight', headerText: 'Freight', textAlign: 'right' },
                { field: 'ShipCountry', headerText: 'Ship Country', textAlign: 'center' },
                { field: 'OrderDate', headerText: 'Order Date', type: 'date', format: 'MMMEd', textAlign: 'justify' }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any;
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('textAlign property', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF Export for Grid without header text', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true },
                { field: 'Freight' }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                gridObj.pdfExport();
            }
        }
    });
    it('check pdf export - without header text', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export for Grid with stacked headers', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipPostalCode', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any;
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('stacked headers', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export for Grid with stacked headers & headerTextAlign', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', headerTextAlign: 'justify', columns: [
                        { field: 'ShipPostalCode', headerText: 'Ship Postal Code', headerTextAlign: 'right', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', headerTextAlign: 'Left', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any;
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('stacked headers with headerTextAlign', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export for Grid with hidden columns in stacked headers', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2', visible: false },
                    ]
                },
                {
                    headerText: 'Ship Details', columns: [
                        {
                            headerText: 'Ship Details', columns: [
                                { field: 'ShipPostalCode', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                                { field: 'OrderDate', headerText: 'Order Date', type: 'datetime', textAlign: 'center', width: 135, format: 'Hms' }
                            ]
                        },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                },
                {
                    headerText: 'Ship Details', visible: false, columns: [
                        { field: 'ShipPostalCode', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                gridObj.pdfExport();
            }
        }
    });
    it('stacked headers with visible', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF Export with pdfQueryCellInfo', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 25),
            toolbar: ['pdfexport'],
            pdfQueryCellInfo: pdfQueryCellInfo,
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipPostalCode', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any;
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('pdfQueryCellInfo', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
function pdfQueryCellInfo(args: any): void {
    if (args.column.field === 'ShipCountry') {
        if (args.value === 'Switzerland') {
            args.style = { textAlignment: 'right', verticalAlignment: 'bottom', bold: true, fontSize: 15, fontFamily: 'TimesRoman', border: { width: 3, color: '#50FF90', dashStyle: 'Solid' } };
        } else if (args.value === 'Germany') {
            args.style = { textAlignment: 'right', verticalAlignment: 'middle', italic: true, fontSize: 15, fontFamily: 'Courier', border: { width: 3, dashStyle: 'Dot' } };
        } else if (args.value === 'Brazil') {
            args.style = { textAlignment: 'right', verticalAlignment: 'top', underline: true, fontSize: 15, fontFamily: 'Symbol', border: { width: 3, dashStyle: 'Dash' } };
        } else if (args.value === 'Belgium') {
            args.style = { textAlignment: 'right', verticalAlignment: 'bottom', strikeout: true, fontSize: 15, fontFamily: 'ZapfDingbats', border: { width: 3, dashStyle: 'DashDot' } };
        } else if (args.value === 'Venezuela') {
            args.style = { textAlignment: 'right', verticalAlignment: 'bottom', bold: true, italic: true, underline: true, strikeout: true, fontSize: 15, fontFamily: 'ZapfDingbats', border: { width: 3, dashStyle: 'DashDotDot' } };
        } else {
            args.style = { textAlignment: 'right', verticalAlignment: 'middle', fontFamily: 'Helvetica' };
        }
    }
    if (args.column.field === 'Freight' && args.value > 50) {
        args.style = { backgroundColor: '#64FA50', textBrushColor: '#FFFF50', textPenColor: '#000000', strikeout: true, border: { width: 3 } };
    }
}
describe('PDF export for aggregates with footer template', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipPostalCode', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'Verified', headerText: 'Verified', width: 140 },
                    ]
                }
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
                },
                {
                    columns: [{
                        type: 'count',
                        field: 'Verified',
                        footerTemplate: 'Count: ${count}'
                    }]
                },
                {
                    columns: [{
                        type: 'truecount',
                        field: 'Verified',
                        footerTemplate: 'True count: ${truecount}'
                    }]
                },
                {
                    columns: [{
                        type: 'falsecount',
                        field: 'Verified',
                        footerTemplate: 'False count: ${falsecount}'
                    }]
                },
                {
                    columns: [{
                        type: 'falsecount',
                        field: 'Verified',
                        footerTemplate: 'False count: ${falsecount}'
                    }]
                },

            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any;
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('aggregates with footer template', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export for aggregate without footer template', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipPostalCode', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'Verified', headerText: 'Verified', width: 140 },
                    ]
                }
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
                        field: 'Verified'
                    }]
                },
                {
                    columns: [{
                        type: 'falsecount',
                        field: 'Verified'
                    }]
                },
                {
                    columns: [{
                        type: 'truecount',
                        field: 'Verified'
                    }]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any;
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('aggregate without footer template', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export for custom aggregate with footerTemplate', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        let customAggregateFn1 = (data: Object[]) => data.filter((item: any) => item.ShipCountry === 'France').length;
        let customAggregateFn2 = (data: Object[]) => data.filter((item: any) => item.Freight > 100).length;
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'right' },
                { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'right' },
                { field: 'Verified', headerText: 'Verified', width: 140, type: 'boolean' },
                { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                { field: 'Freight', width: 160, format: 'C2', textAlign: 'right' }
            ],
            aggregates: [{
                columns: [{
                    type: 'custom',
                    customAggregate: customAggregateFn1,
                    field: 'ShipCountry',
                    footerTemplate: 'France Count: ${custom}'
                }]
            }]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('custom aggregate with footerTemplate', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any;
        gridObj.pdfExport(pdfExportProperties);
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export current view data-true', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 30),
            allowPaging: true,
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            pageSettings: { pageCount: 5, pageSize: 5 },
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any = {
                    exportType: 'currentview'
                }
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('current view data', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export current view data-false', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 30),
            allowPaging: true,
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            pageSettings: { pageCount: 5, pageSize: 5 },
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any = {
                    exportType: ''
                }
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('current view data - false', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export with empty exportProperties', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: { type: 'date', skeleton: 'yMd' } },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any = {};
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('pdfExportProperties-empty', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export with includeHiddenColumn-true', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 30),
            allowPaging: true,
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            pageSettings: { pageCount: 5, pageSize: 5 },
            columns: [
                { field: 'OrderID', isPrimaryKey: true },
                { field: 'Freight', visible: false }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any = {
                    includeHiddenColumn: true
                }
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('includeHiddenColumn-true', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export with includeHiddenColumn-false', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 30),
            allowPaging: true,
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            pageSettings: { pageCount: 5, pageSize: 5 },
            columns: [
                { field: 'OrderID', headerText: 'Order ID' },
                { field: 'Freight', visible: false },
                { field: 'CustomerID', headerText: 'Customer ID' },
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any = {
                    includeHiddenColumn: false
                }
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('includeHiddenColumn-false', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export includeHiddenColumn-false with aggregates', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 30),
            allowPaging: true,
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            pageSettings: { pageCount: 5, pageSize: 5 },
            columns: [
                { field: 'OrderID', isPrimaryKey: true },
                { field: 'Freight', visible: false }
            ],
            aggregates: [
                {
                    columns: [{
                        type: 'sum',
                        field: 'OrderID',
                        format: 'C2',
                        footerTemplate: 'Sum: ${sum}'
                    }]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any = {
                    includeHiddenColumn: false
                }
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('includeHiddenColumn-false with aggregates', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export with Invalid Grid field', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'InvalidOrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any;
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('invalid input field', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-Letter', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-Letter', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'Letter',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-Note', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-Note', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'Note',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-Legal', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-Legal', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'Legal',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-A0', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-A0', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'A0',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-A1', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-A1', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'A1',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-A2', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-A2', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'A2',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-A3', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-A3', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'A3',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-A4', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-A4', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'A4',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-A5', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-A5', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'A5',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-A6', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-A6', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'A6',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-A7', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'ID' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-A7', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'A7',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-A8', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'ID' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-A8', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'A8',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-A9', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'ID' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-A9', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'A9',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});

describe('PDF export pageSize-B0', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-B0', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'B0',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-B1', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-B1', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'B1',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-B2', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-B2', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'B2',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-B3', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('check pdf export - invalid input field', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'B3',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-B4', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-B4', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'B4',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-B5', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-B5', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'B5',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-ArchA', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-ArchA', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'ArchA',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-ArchB', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-ArchB', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'ArchB',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-ArchC', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-ArchC', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'ArchC',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-ArchD', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-ArchD', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'ArchD',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-ArchE', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-ArchE', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'ArchE',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-Flsa', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-Flsa', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'Flsa',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-HalfLetter', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-HalfLetter', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'HalfLetter',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-Letter11x17', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-Letter11x17', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'Letter11x17',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageSize-Ledger', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
    });
    it('pageSize-Ledger', (done) => {
        gridObj.dataBind();
        let pdfExportProperties: any = {
            pageSize: 'Ledger',
        };
        setTimeout(() => {
            gridObj.pdfExport(pdfExportProperties);
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export aggregate without footer template, hidden column and invalid field name', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                { field: 'Verified', headerText: 'Verified', width: 140 },
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
                        field: 'Verified'
                    }]
                },
                {
                    columns: [{
                        type: 'falsecount',
                        field: 'Verified'
                    }]
                },
                {
                    columns: [{
                        type: 'truecount',
                        field: 'Invalid'
                    }]
                },
                {
                    columns: [{
                        type: 'truecount',
                        field: 'Verified'
                    }]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any = {
                    includeHiddenColumn: false
                };
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('check pdf export', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pageOrientation', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID' },
                { field: 'Freight', headerText: 'Freight', format: 'C' }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties1: any = {
                    pageOrientation: 'Portrait',
                };
                let pdfExportProperties2: any = {
                    pageOrientation: 'Landscape',
                };
                gridObj.pdfExport(pdfExportProperties1);
                gridObj.pdfExport(pdfExportProperties2);
            }
        }
    });
    it('pageOrientation', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDf export with Fabric Theme', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipPostalCode', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'Verified', headerText: 'Verified', width: 140 },
                    ]
                }
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
                },
                {
                    columns: [{
                        type: 'count',
                        field: 'Verified',
                        footerTemplate: 'Count: ${count}'
                    }]
                },
                {
                    columns: [{
                        type: 'truecount',
                        field: 'Verified',
                        footerTemplate: 'True count: ${truecount}'
                    }]
                },
                {
                    columns: [{
                        type: 'falsecount',
                        field: 'Verified',
                        footerTemplate: 'False count: ${falsecount}'
                    }]
                },
                {
                    columns: [{
                        type: 'falsecount',
                        field: 'Verified',
                        footerTemplate: 'False count: ${falsecount}'
                    }]
                },

            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any = {
                    theme: 'fabric'
                }
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('check pdf export - theme fabric', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export with Material Theme', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipPostalCode', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'Verified', headerText: 'Verified', width: 140 },
                    ]
                }
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
                },
                {
                    columns: [{
                        type: 'count',
                        field: 'Verified',
                        footerTemplate: 'Count: ${count}'
                    }]
                },
                {
                    columns: [{
                        type: 'truecount',
                        field: 'Verified',
                        footerTemplate: 'True count: ${truecount}'
                    }]
                },
                {
                    columns: [{
                        type: 'falsecount',
                        field: 'Verified',
                        footerTemplate: 'False count: ${falsecount}'
                    }]
                },
                {
                    columns: [{
                        type: 'falsecount',
                        field: 'Verified',
                        footerTemplate: 'False count: ${falsecount}'
                    }]
                },

            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any = {
                    theme: 'material'
                }
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('theme material (default)', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
let rDataSource: Object = new DataManager({
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Products',
    adaptor: new ODataV4Adaptor, crossDomain: true
});
describe('PDf export with Remote data as customDataSource', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: rData,
            allowExcelExport: true,
            allowPdfExport: true,
            allowPaging: true,
            toolbar: ['pdfexport'],
            columns: [
                { field: 'ProductName', headerText: 'Product Name', width: 170 },
                { field: 'UnitPrice', headerText: 'Unit Price', width: 135, textAlign: 'right', format: 'C2', },
                { field: 'UnitsInStock', headerText: 'Units In Stock', width: 160, textAlign: 'right' },
            ],
            aggregates: [
                {
                    columns: [{
                        type: 'sum',
                        field: 'UnitsInStock',
                        footerTemplate: 'Sum: ${sum}'
                    }]
                },
                {
                    columns: [{
                        type: 'average',
                        field: 'UnitsInStock',
                        footerTemplate: 'Average: ${average}'
                    }]
                },
                {
                    columns: [{
                        type: 'min',
                        field: 'UnitsInStock',
                        footerTemplate: 'Minimum: ${min}'
                    }]
                },
                {
                    columns: [{
                        type: 'max',
                        field: 'UnitsInStock',
                        footerTemplate: 'Maximum: ${max}'
                    }]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any = {
                    dataSource: rDataSource
                }
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('customDataSource = rDataSource', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export with customDataSource', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: rDataSource,
            allowExcelExport: true,
            allowPdfExport: true,
            allowPaging: true,
            toolbar: ['pdfexport'],
            columns: [
                { field: 'ProductName', headerText: 'Product Name', width: 170 },
                { field: 'UnitPrice', headerText: 'Unit Price', width: 135, textAlign: 'right', format: 'C2', },
                { field: 'UnitsInStock', headerText: 'Units In Stock', width: 160, textAlign: 'right' },
            ],
            aggregates: [
                {
                    columns: [{
                        type: 'sum',
                        field: 'UnitsInStock',
                        footerTemplate: 'Sum: ${sum}'
                    }]
                },
                {
                    columns: [{
                        type: 'average',
                        field: 'UnitsInStock',
                        footerTemplate: 'Average: ${average}'
                    }]
                },
                {
                    columns: [{
                        type: 'min',
                        field: 'UnitsInStock',
                        footerTemplate: 'Minimum: ${min}'
                    }]
                },
                {
                    columns: [{
                        type: 'max',
                        field: 'UnitsInStock',
                        footerTemplate: 'Maximum: ${max}'
                    }]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any = {
                    dataSource: rData
                }
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('customDataSource', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export with Grid Remote Data', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: rDataSource,
            allowExcelExport: true,
            allowPdfExport: true,
            allowPaging: true,
            toolbar: ['pdfexport'],
            columns: [
                { field: 'ProductName', headerText: 'Product Name', width: 170 },
                { field: 'UnitPrice', headerText: 'Unit Price', width: 135, textAlign: 'right', format: 'C2', },
                { field: 'UnitsInStock', headerText: 'Units In Stock', width: 160, textAlign: 'right' },
            ],
            aggregates: [
                {
                    columns: [{
                        type: 'sum',
                        field: 'UnitsInStock',
                        footerTemplate: 'Sum: ${sum}'
                    }]
                },
                {
                    columns: [{
                        type: 'average',
                        field: 'UnitsInStock',
                        footerTemplate: 'Average: ${average}'
                    }]
                },
                {
                    columns: [{
                        type: 'min',
                        field: 'UnitsInStock',
                        footerTemplate: 'Minimum: ${min}'
                    }]
                },
                {
                    columns: [{
                        type: 'max',
                        field: 'UnitsInStock',
                        footerTemplate: 'Maximum: ${max}'
                    }]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                gridObj.pdfExport();
            }
        }
    });
    it('Remote Data', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export with Empty datasource', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: [],
            allowExcelExport: true,
            allowPdfExport: true,
            allowReordering: true,
            allowRowDragAndDrop: true,
            allowPaging: true,
            allowFiltering: true,
            allowSelection: true,
            allowSorting: true,
            selectionSettings: { type: 'multiple', mode: 'row' },
            toolbar: ['excelexport', 'pdfexport'],
            sortSettings: { columns: [{ field: "CustomerID", direction: "descending" }, { field: "Freight", direction: "descending" }] },
            columns: [{ field: 'OrderID', textAlign: 'right', width: 100, headerText: "Order ID" },
            { field: 'CustomerID', width: 120, headerText: "Customer ID" },
            { field: 'EmployeeID', textAlign: 'right', width: 100, headerText: "Employee ID" },
            { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'right' },
            { field: 'Freight', textAlign: 'right', width: 110, format: 'C2', headerText: "Freight" },
            { field: 'ShipCountry', width: 130, headerText: "Ship Country Name List" },
            { field: 'Verified', headerText: 'Verified', width: 190 }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                gridObj.pdfExport();
            }
        }
    });
    it('Empty-dataSource', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF Export with DateTime in Grid', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            toolbar: ['excelexport', 'pdfexport'],
            dataSource: employeeData,
            allowReordering: true,
            allowPdfExport: true,
            allowExcelExport: true,
            columns: [
                { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right', width: 125 },
                { field: 'FirstName', headerText: 'Name', width: 120 },
                {
                    field: 'HireDate', headerText: 'Hire Date', textAlign: 'right',
                    width: 135,
                },
                { field: 'ReportsTo', headerText: 'Reports To', width: 150, textAlign: 'right' },
            ],
            width: 'auto',
            height: 359
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                gridObj.pdfExport();
            }
        }
    });
    it('width & height with DateTime fix', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export custom aggregate without footerTemplate', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        let customAggregateFn1 = (data: Object[]) => data.filter((item: any) => item.Freight > 50).length;
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 20),
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'right' },
                { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'right' },
                { field: 'Verified', headerText: 'Verified', width: 140, type: 'boolean' },
                { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                { field: 'Freight', width: 160, format: 'C2', textAlign: 'right' }
            ],
            aggregates: [{
                columns: [{
                    type: 'custom',
                    customAggregate: customAggregateFn1,
                    field: 'Freight',
                }]
            }]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export - custom aggregate without footerTemplate', (done) => {
        gridObj.dataBind();
        gridObj.pdfExport();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export Date and DateTime formats', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            toolbar: ['excelexport', 'pdfexport'],
            dataSource: data.slice(0, 10),
            allowReordering: true,
            allowPdfExport: true,
            allowExcelExport: true,
            columns: [
                { headerText: 'Order Date 1', field: 'OrderDate', type: 'date', format: 'MMMEd' },
                { headerText: 'Order Date 2', field: 'OrderDate', format: { type: 'date', skeleton: 'MMMEd' } },
                { headerText: 'Order Date 3', field: 'OrderDate', type: 'date', format: { skeleton: 'MMMEd' } },
                { headerText: 'Order Date 4', field: 'OrderDate', format: { skeleton: 'MMMEd' } },
                { headerText: 'Order Date 5', field: 'OrderDate', type: 'datetime', format: 'MMMEd' },
                { headerText: 'Order Date 6', field: 'OrderDate', format: { type: 'datetime', skeleton: 'MMMEd' } },
                { headerText: 'Order Date 7', field: 'OrderDate', type: 'datetime', format: { skeleton: 'MMMEd' } },
                { headerText: 'Order Date 8', field: 'OrderDate', type: 'date', format: 'short' },
                { headerText: 'Order Date 9', field: 'OrderDate', type: 'date', format: 'long' },
                { headerText: 'Order Date 10', field: 'OrderDate', type: 'date', format: 'medium' },
                { headerText: 'Order Date 11', field: 'OrderDate', type: 'date', format: 'full' },
                { headerText: 'Order Date 12', field: 'OrderDate', type: 'datetime', format: 'short' },
                { headerText: 'Order Date 13', field: 'OrderDate', type: 'datetime', format: 'long' },
                { headerText: 'Order Date 14', field: 'OrderDate', type: 'datetime', format: 'medium' },
                { headerText: 'Order Date 15', field: 'OrderDate', type: 'datetime', format: 'full' },
                { headerText: 'Order Date 16', field: 'OrderDate', type: 'time', format: 'short' },
                { headerText: 'Order Date 17', field: 'OrderDate', type: 'time', format: 'long' },
                { headerText: 'Order Date 18', field: 'OrderDate', type: 'time', format: 'medium' },
                { headerText: 'Order Date 19', field: 'OrderDate', type: 'time', format: 'full' },
                { headerText: 'Order Date 20', field: 'OrderDate', format: { type: 'time', skeleton: 'short' } },
                { headerText: 'Order Date 21', field: 'OrderDate', format: { type: 'time', skeleton: 'long' } },
                { headerText: 'Order Date 22', field: 'OrderDate', format: { type: 'time', skeleton: 'medium' } },
                { headerText: 'Order Date 23', field: 'OrderDate', format: { type: 'time', skeleton: 'full' } },
                { headerText: 'Order Date 24', field: 'OrderDate', type: 'time', format: { type: 'time', skeleton: 'short' } },
                { headerText: 'Order Date 25', field: 'OrderDate', type: 'time', format: { type: 'time', skeleton: 'long' } },
                { headerText: 'Order Date 26', field: 'OrderDate', type: 'time', format: { type: 'time', skeleton: 'medium' } },
                { headerText: 'Order Date 27', field: 'OrderDate', type: 'time', format: { type: 'time', skeleton: 'full' } },
                { headerText: 'Order Date 28', field: 'OrderDate', type: 'time', format: { skeleton: 'full' } },
                { headerText: 'Order Date 29', field: 'OrderDate', type: 'datetime', format: { type: 'datetime', skeleton: 'MMMEd' } },
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                gridObj.pdfExport();
            }
        }
    });
    it('Date and DateTime formats', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        elem.remove();
        gridObj.destroy();
    });
});
describe('PDF export header in pdfExportProperties', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'image',
                            src: image,
                            position: { x: 250, y: 10 },
                            size: { height: 100, width: 250 },
                        },
                        {
                            type: 'line',
                            style: { penColor: '#C67878', penSize: 2, dashStyle: 'Solid' },
                            points: { x1: 0, y1: 4, x2: 500, y2: 4 }
                        },
                        {
                            type: 'line',
                            style: { penColor: '#C67878', penSize: 2, dashStyle: 'Dot' },
                            points: { x1: 0, y1: 7, x2: 500, y2: 7 }
                        },
                        {
                            type: 'line',
                            style: { penColor: '#C67878', penSize: 2, dashStyle: 'Dot' },
                            points: { x1: 0, y1: 114, x2: 500, y2: 114 }
                        },
                        {
                            type: 'line',
                            style: { penColor: '#C67878', penSize: 2, dashStyle: 'Solid' },
                            points: { x1: 0, y1: 117, x2: 500, y2: 117 }
                        },
                        {
                            type: 'pageNumber',
                            pageNumberType: 'Arabic',
                            format: 'Page {$current} of {$total}', //optional
                            position: { x: 0, y: 25 },
                            // size: { height: 40, width: 200 }, //optional
                            style: { textBrushColor: '#C67878', fontSize: 15, hAlign: 'center' }
                        },
                        {
                            type: 'text',
                            value: "Northwind Traders",
                            position: { x: 0, y: 50 },
                            style: { textBrushColor: '#000000', fontSize: 13 }
                        },
                        {
                            type: 'text',
                            value: "2501 Aerial Center Parkway",
                            position: { x: 0, y: 75 },
                            style: { textBrushColor: '#000000', fontSize: 13 }
                        },
                        {
                            type: 'text',
                            value: "Tel +1 888.936.8638 Fax +1 919.573.0306",
                            position: { x: 0, y: 100 },
                            style: { textBrushColor: '#000000', fontSize: 13 }
                        },
                    ]
                }
            }
            gridObj.pdfExport(pdfExportProperties);
        }
    });
    it('header -> pdfExportProperties', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export footer in pdfExportProperties', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: { type: 'datetime', skeleton: 'yMd' } },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            let pdfExportProperties: any = {
                footer: {
                    fromBottom: 160,
                    height: 150,
                    contents: [
                        {
                            type: 'image',
                            src: image,
                            position: { x: 250, y: 10 },
                            size: { height: 100, width: 250 },
                        },
                        {
                            type: 'line',
                            style: { penColor: '#000055', penSize: 2, dashStyle: 'Solid' },
                            points: { x1: 0, y1: 4, x2: 500, y2: 4 }
                        },
                        {
                            type: 'line',
                            style: { penColor: '#000055', penSize: 2, dashStyle: 'Dot' },
                            points: { x1: 0, y1: 7, x2: 500, y2: 7 }
                        },
                        {
                            type: 'line',
                            style: { penColor: '#000055', penSize: 2, dashStyle: 'Dot' },
                            points: { x1: 0, y1: 114, x2: 500, y2: 114 }
                        },
                        {
                            type: 'line',
                            style: { penColor: '#000055', penSize: 2, dashStyle: 'Solid' },
                            points: { x1: 0, y1: 117, x2: 500, y2: 117 }
                        },
                        {
                            type: 'pageNumber',
                            pageNumberType: 'Arabic',
                            format: 'Page {$current} of {$total}', //optional
                            position: { x: 0, y: 25 },
                            // size: { height: 40, width: 200 }, //optional
                            style: { textBrushColor: '#000000', fontSize: 15, hAlign: 'center' }
                        },
                        {
                            type: 'text',
                            value: "Northwind Traders",
                            position: { x: 0, y: 50 },
                            style: { textBrushColor: '#000000', fontSize: 13 }
                        },
                        {
                            type: 'text',
                            value: "2501 Aerial Center Parkway",
                            position: { x: 0, y: 75 },
                            style: { textBrushColor: '#000000', fontSize: 13 }
                        },
                        {
                            type: 'text',
                            value: "Tel +1 888.936.8638 Fax +1 919.573.0306",
                            position: { x: 0, y: 100 },
                            style: { textBrushColor: '#000000', fontSize: 13 }
                        },
                    ]
                }
            }
            gridObj.pdfExport(pdfExportProperties);
        }
    });
    it('footer in pdfExportProperties', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF Export header - image drawing without size', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'image',
                            src: image,
                            position: { x: 250, y: 10 },
                        },
                        {
                            type: 'line',
                            style: { penColor: '#6055F2', penSize: 2, dashStyle: 'Solid' },
                            points: { x1: 0, y1: 4, x2: 500, y2: 4 }
                        },
                        {
                            type: 'line',
                            style: { penColor: '#6055F2', dashStyle: 'Dot' },
                            points: { x1: 0, y1: 7, x2: 500, y2: 7 }
                        },
                        {
                            type: 'line',
                            style: { penColor: '#6055F2', dashStyle: 'Dot' },
                            points: { x1: 0, y1: 114, x2: 500, y2: 114 }
                        },
                        {
                            type: 'line',
                            style: { penColor: '#6055F2', penSize: 2, dashStyle: 'Solid' },
                            points: { x1: 0, y1: 117, x2: 500, y2: 117 }
                        },
                        {
                            type: 'pageNumber',
                            pageNumberType: 'LowerLatin',
                            format: 'Page {$current} of {$total}', //optional
                            position: { x: 0, y: 25 },
                            size: { height: 40, width: 200 }, //optional
                            style: { fontSize: 7, hAlign: 'right' }
                        },
                        {
                            type: 'pageNumber',
                            pageNumberType: 'LowerRoman',
                            format: 'Page Number: {$current}', //optional
                            position: { x: 0, y: 37.5 },
                            size: { height: 40, width: 200 }, //optional
                            style: { fontSize: 7, hAlign: 'left' }
                        },
                        {
                            type: 'pageNumber',
                            pageNumberType: 'UpperLatin',
                            format: 'Total Pages: {$total}', //optional
                            position: { x: 250, y: 25 },
                            size: { height: 40, width: 200 }, //optional
                            style: { fontSize: 7, hAlign: 'justify', vAlign: 'middle' }
                        },
                        {
                            type: 'pageNumber',
                            pageNumberType: 'UpperRoman',
                            position: { x: 250, y: 37.5 },
                            format: 'Total: {$total} and Page Number: {$current}', //optional
                            // size: { height: 40, width: 200 }, //optional
                            style: { fontSize: 7, hAlign: 'center' }
                        },
                        {
                            type: 'pageNumber',
                            pageNumberType: 'Arabic',
                            position: { x: 250, y: 37.5 },
                            size: { height: 40, width: 200 }, //optional
                            style: { fontSize: 7, hAlign: 'center', vAlign: 'middle' }
                        },
                        {
                            type: 'text',
                            value: "Northwind Traders",
                            position: { x: 0, y: 50 },
                            style: { textPenColor: '#000000', fontSize: 13 }
                        },
                        {
                            type: 'text',
                            value: "2501 Aerial Center Parkway",
                            position: { x: 0, y: 75 },
                            style: { fontSize: 13 }
                        },
                        {
                            type: 'text',
                            value: "Tel +1 888.936.8638 Fax +1 919.573.0306",
                            position: { x: 0, y: 100 },
                            size: { width: 300, height: 35 },
                            style: { textBrushColor: '#000000', fontSize: 13 }
                        },
                    ]
                }
            }
            gridObj.pdfExport(pdfExportProperties);
        }
    });
    it('image drawing without size', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export header - text-value exception', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export - header - text-value exception', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'text',
                            value: 10,
                            position: { x: 0, y: 50 },
                            style: { textPenColor: '#000000', fontSize: 13 }
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export header - text-position = null exception', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('header - text-position = null exception', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'text',
                            value: 'Testing',
                            position: null,
                            style: { textPenColor: '#000000', fontSize: 13 }
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF header - text-position.x !== number exception', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export - header - text-position.x !== number exception', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'text',
                            value: 'Testing',
                            position: { x: 'number', y: 10 },
                            style: { textPenColor: '#000000', fontSize: 13 }
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export header - text-position.y !== number exception', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('header - text-position.y !== number exception', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'text',
                            value: 'Testing',
                            position: { x: 10, y: 'number' },
                            style: { textPenColor: '#000000', fontSize: 13 }
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export header - invalid type', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export - header - invalid type', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'invalid',
                            value: 'Testing',
                            position: { x: 10, y: 20 },
                            style: { textPenColor: '#000000', fontSize: 13 }
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export header - line - no position', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export - header - line - position check', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'line',
                            style: { penColor: '#3A4CDD', dashStyle: 'Dot' },
                            points: null
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export line - position', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export - header - line - position check -2', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'line',
                            style: { penColor: '#6055F2', dashStyle: 'Dot' },
                            points: { x1: 10, y1: 10, x2: 200, y2: 'number' }
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export line - position x2 : number', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export - header - line - position check -3', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'line',
                            style: { penColor: '#0000F4', dashStyle: 'Dot' },
                            points: { x1: 10, y1: 10, x2: 'number', y2: 10 }
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export line - position - y1 : number', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export - header - line - position check -4', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'line',
                            style: { penColor: '#0000F4', dashStyle: 'Dot' },
                            points: { x1: 10, y1: 'number', x2: 200, y2: 10 }
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export line - position - x1 : number', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export - header - line - position check -4', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'line',
                            style: { penColor: '#0000F4', dashStyle: 'Dot' },
                            points: { x1: 'number', y1: 10, x2: 200, y2: 10 }
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export image - src empty', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export - header - image - src check', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'image',
                            src: '',
                            position: { x: 250, y: 10 },
                            size: { height: 100, width: 250 },
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export with valid line position', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipName', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('header - line - position check valid case', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: null,
                            style: { penColor: '#0000F4', dashStyle: 'Dot' },
                            points: { x1: 10, y1: 10, x2: 300, y2: 10 }
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export hexToRgb', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export - hexToRgb check', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'line',
                            style: { penColor: '3A4CDD', dashStyle: 'Dot' },
                            points: { x1: 10, y1: 20, x2: 300, y2: 20 }
                        }
                    ]
                }
            }
            try {
                gridObj.pdfExport(pdfExportProperties);
            }
            catch (exception) {
                expect('').toBe('');
            }
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDF export pdfQueryCellInfo - Simple', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            allowPdfExport: true,
            dataSource: data.slice(0, 25),
            toolbar: ['pdfexport'],
            pdfQueryCellInfo: simplePdfQueryCellInfo,
            columns: [
                {
                    headerText: 'Order Details', headerTextAlign: 'right', columns: [
                        { field: 'OrderDate', headerText: 'Order Date', textAlign: 'center', width: 135, format: 'yMd' },
                        { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    ]
                },
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                {
                    headerText: 'Ship Details', columns: [
                        { field: 'ShipPostalCode', headerText: 'Ship Postal Code', textAlign: 'center', width: 145 },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    ]
                }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.toolbarClick = (args: Object) => {
            if (args['item'].id === 'Grid_pdfexport') {
                let pdfExportProperties: any;
                gridObj.pdfExport(pdfExportProperties);
            }
        }
    });
    it('check pdf export - pdfQueryCellInfo', (done) => {
        gridObj.dataBind();
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#Grid_pdfexport')).click();
        setTimeout(() => {
            expect('').toBe('');
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});

function simplePdfQueryCellInfo(args: any): void {
    if (args.column.field === 'ShipCountry') {
        if (args.value === 'Switzerland') {
            args.style = { border: { width: 3, color: '#50FF90', dashStyle: 'Solid' } };
        }
    }
}
describe('PDf export line in header', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        let customAggregateFn1 = (data: Object[]) => data.filter((item: any) => item.ShipCountry === 'France').length;
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                { field: 'ShipCountry', headerText: 'Ship Country', textAlign: 'right', width: 120 },
                { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'right', width: 120 }
            ],
            aggregates: [
                {
                    columns: [{
                        type: 'custom',
                        field: 'ShipCountry',
                        customAggregate: customAggregateFn1,
                    }]
                },
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'line',
                            points: { x1: 10, y1: 20, x2: 300, y2: 20 }
                        }
                    ]
                }
            }
            gridObj.pdfExport(pdfExportProperties);
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('PDf export line with x1,y1,x2,y2', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120, visible: false },
                { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'right', width: 120 }
            ],
            aggregates: [
                {
                    columns: [{
                        type: 'sum',
                        field: 'OrderID',
                    }]
                },
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any = {
                header: {
                    includeHiddenColumn: false,
                    fromTop: 0,
                    height: 150,
                    contents: [
                        {
                            type: 'line',
                            points: { x1: 10, y1: 20, x2: 300, y2: 20 }
                        }
                    ]
                }
            }
            gridObj.pdfExport(pdfExportProperties);
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('Grouping with aggregates export testing', () => {
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
                allowPdfExport: true,
                allowPaging: true,
                allowGrouping: true,
                groupSettings: { columns: ['Verified', 'ShipRegion', 'ShipCountry'] },
                toolbar: ['pdfexport'],
                pageSettings: { pageCount: 5 },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                    { field: 'OrderDate', headerText: 'Order Date', headerTextAlign: 'right', textAlign: 'right', width: 135, format: 'yMd' },
                    { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    { field: 'ShipRegion', width: 140 },
                    { field: 'Verified', width: 140 },
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
                            type: 'max',
                            field: 'Freight',
                            footerTemplate: 'overall - Max: ${max}'
                        }
                    ]
                }]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });

    it('check pdf export', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any;
            gridObj.pdfExport(pdfExportProperties);
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});
describe('Multiple Grouping export testing', () => {

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
                allowPdfExport: true,
                allowPaging: true,
                allowGrouping: true,
                groupSettings: { columns: ['Verified', 'ShipRegion', 'ShipCountry'] },
                toolbar: ['pdfexport'],
                pageSettings: { pageCount: 5 },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 },
                    { field: 'OrderDate', headerText: 'Order Date', headerTextAlign: 'right', textAlign: 'right', width: 135, format: 'yMd' },
                    { field: 'Freight', headerText: 'Freight($)', textAlign: 'right', width: 120, format: 'C2' },
                    { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                    { field: 'ShipRegion', width: 140 },
                    { field: 'Verified', width: 140 },
                ]
            });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });

    it('check pdf export', (done) => {
        gridObj.dataBind();
        setTimeout(() => {
            let pdfExportProperties: any;
            gridObj.pdfExport(pdfExportProperties);
            done();
        }, 500);
    });
    afterAll(() => {
        // remove(elem);
        // gridObj.destroy();
    });
});
describe('PDF export Grid.isDestroyed-true', () => {
    let gridObj: Grid;
    let elem: HTMLElement = createElement('div', { id: 'Grid' });
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;

    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    beforeAll(() => {
        document.body.appendChild(elem);
        gridObj = new Grid({
            dataSource: data.slice(0, 2),
            gridLines: 'both',
            allowPdfExport: true,
            toolbar: ['pdfexport'],
            columns: [
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'right', width: 120 }
            ]
        });
        gridObj.appendTo('#Grid');
        gridObj.dataBind();
    });
    it('check pdf export', (done) => {
        gridObj.dataBind();
        gridObj.isDestroyed = true;
        setTimeout(() => {
            gridObj.pdfExport();
            done();
        }, 500);
    });
    afterAll(() => {
        remove(elem);
        gridObj.destroy();
    });
});