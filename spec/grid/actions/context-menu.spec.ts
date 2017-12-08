/**
 * Grid context menu spec document
 */
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Reorder } from '../../../src/grid/actions/reorder';
import { CommandColumn } from '../../../src/grid/actions/command-column';
import { ActionEventArgs } from '../../../src/grid/base/interface';
import { Grid } from '../../../src/grid/base/grid';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { data } from '../../../spec/grid/base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { ContextMenu, menuClass } from '../../../src/grid/actions/context-menu';
import { Sort } from '../../../src/grid/actions/sort';
import { Group } from '../../../src/grid/actions/group';
import { Resize } from '../../../src/grid/actions/resize';
import { Edit } from '../../../src/grid/actions/edit';
import { PdfExport } from '../../../src/grid/actions/pdf-export';
import { ExcelExport } from '../../../src/grid/actions/excel-export';
import { Column } from '../../../src/grid/models/column';
import { ContextMenuItemModel } from '../../../src/grid/base/interface';

Grid.Inject(Page, Selection, Reorder, CommandColumn, ContextMenu, Sort, Resize,
    Group, Edit, PdfExport, ExcelExport);

let targetAndIconCheck: Function = (menuItem: ContextMenuItemModel): void => {
    switch (menuItem.text) {
        case 'autoFitAll':
        case 'autoFit':
            expect(menuItem.target).toBe(menuClass.header);
            expect(menuItem.iconCss).toBeFalsy();
            break;
        case 'group':
            expect(menuItem.target).toBe(menuClass.header);
            expect(menuItem.iconCss).toBe(menuClass.group);
            break;
        case 'ungroup':
            expect(menuItem.target).toBe(menuClass.header);
            expect(menuItem.iconCss).toBe(menuClass.ungroup);
            break;
        case 'edit':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBe(menuClass.editIcon);
            break;
        case 'delete':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBe(menuClass.delete);
            break;
        case 'save':
            expect(menuItem.target).toBe(menuClass.edit);
            expect(menuItem.iconCss).toBe(menuClass.save);
            break;
        case 'cancel':
            expect(menuItem.target).toBe(menuClass.edit);
            expect(menuItem.iconCss).toBe(menuClass.cancel);
            break;
        case 'copy':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBe(menuClass.copy);
            break;
        case 'export':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBeFalsy();
            break;
        case 'pdfExport':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBe(menuClass.pdf);
            break;
        case 'excelExport':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBe(menuClass.excel);
            break;
        case 'csvExport':
            expect(menuItem.target).toBe(menuClass.content);
            expect(menuItem.iconCss).toBe(menuClass.csv);
            break;
        case 'sortAscending':
            expect(menuItem.target).toBe(menuClass.header);
            expect(menuItem.iconCss).toBe(menuClass.ascending);
            break;
        case 'sortDescending':
            expect(menuItem.target).toBe(menuClass.header);
            expect(menuItem.iconCss).toBe(menuClass.descending);
            break;
        case 'firstPage':
            expect(menuItem.target).toBe(menuClass.pager);
            expect(menuItem.iconCss).toBe(menuClass.fPage);
            break;
        case 'prevPage':
            expect(menuItem.target).toBe(menuClass.pager);
            expect(menuItem.iconCss).toBe(menuClass.pdf);
            break;
        case 'lastPage':
            expect(menuItem.target).toBe(menuClass.pager);
            expect(menuItem.iconCss).toBe(menuClass.lPage);
            break;
        case 'nextPage':
            expect(menuItem.target).toBe(menuClass.pager);
            expect(menuItem.iconCss).toBe(menuClass.nPage);
            break;
    };
}
describe('context menu module', () => {
    describe('default items', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    dataBound: dataBound,
                    allowGrouping: true,
                    groupSettings: { showGroupedColumn: true, showToggleButton: true, showUngroupButton: true },
                    allowResizing: true,
                    allowSorting: true,
                    editSettings: { allowDeleting: true, allowEditing: true },
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 10
                    },
                    allowExcelExport: true,
                    allowPdfExport: true,
                    contextMenuItems: ['autoFitAll', 'autoFit',
                        'group', 'ungroup', 'edit', 'delete', 'save', 'cancel',
                        'pdfExport', 'excelExport', 'csvExport', 'sortAscending', 'sortDescending',
                        'firstPage', 'prevPage', 'lastPage', 'nextPage', 'copy'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, textAlign: 'right' }
                    ]
                });
            gridObj.appendTo('#Grid');
        });
        it('render', () => {
            expect((gridObj.contextMenuModule as any).element).not.toBe(null);
            expect((gridObj.contextMenuModule as any).element.id).toBe(gridObj.element.id + '_cmenu');
            expect(gridObj.contextMenuModule.contextMenu.enableRtl).toBe(gridObj.enableRtl);
            expect(gridObj.contextMenuModule.contextMenu.locale).toBe(gridObj.locale);
            expect(gridObj.contextMenuModule.contextMenu.enablePersistence).toBe(gridObj.enablePersistence);
            expect(gridObj.contextMenuModule.contextMenu.target).toBe('#' + gridObj.element.id);
            expect(gridObj.contextMenuModule.contextMenu.cssClass).toBe('e-grid-menu');
            expect(gridObj.contextMenuModule.contextMenu.items.length).toBe(gridObj.contextMenuItems.length - 3 + 1);
            expect((gridObj.contextMenuModule as any).getModuleName()).toBe('contextMenu');
            expect(gridObj.contextMenuModule.getContextMenu()).toBe((gridObj.contextMenuModule as any).element);
        });

        it('build default item', () => {
            (gridObj.contextMenuModule as any).targetColumn = gridObj.getColumnByField('EmployeeID');
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getDataRows()[1].firstChild };
            for (let item of gridObj.contextMenuItems) {
                let itemModel = (gridObj.contextMenuModule as any).defaultItems[item as string];
                if ((item as string).toLocaleLowerCase().indexOf('export') !== -1) {
                    let itemModel: ContextMenuItemModel = (gridObj.contextMenuModule as any).defaultItems['export'];
                    expect(itemModel).not.toBe(null);
                    targetAndIconCheck(itemModel);
                    let presence = false;
                    for (let i of itemModel.items) {
                        if ((gridObj.contextMenuModule as any).getKeyFromId(i.id) === item as string) {
                            presence = true;
                            targetAndIconCheck(i);
                            (gridObj.contextMenuModule as any).contextMenuItemClick({ item: i });
                            break;
                        }
                    }
                    expect(presence).toBeTruthy();
                } else {
                    if ((item as string).toLocaleLowerCase().indexOf('delete') !== -1) {
                        (gridObj.contextMenuModule as any).selectRow({ target: gridObj.getDataRows()[1].firstChild });
                    }

                    targetAndIconCheck(itemModel);
                    expect(itemModel).not.toBe(null);
                    (gridObj.contextMenuModule as any).contextMenuItemClick({ item: itemModel });
                }
            }
            if (gridObj.element.querySelector('#GridEditAlert').querySelector('button')) {
                gridObj.element.querySelector('#GridEditAlert').querySelector('button').click();
            }
        });
        afterAll(() => {
            gridObj.destroy();
            remove(elem);
        });
    });
    describe('default items functionality', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    dataBound: dataBound,
                    allowGrouping: true,
                    groupSettings: { showGroupedColumn: true, showToggleButton: true, showUngroupButton: true },
                    allowResizing: true,
                    allowSorting: true,
                    editSettings: { allowDeleting: true, allowEditing: true },
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 5
                    },
                    allowExcelExport: true,
                    allowPdfExport: true,
                    contextMenuItems: ['autoFitAll', 'autoFit',
                        'group', 'ungroup', 'edit', 'delete', 'save', 'cancel',
                        'pdfExport', 'excelExport', 'csvExport', 'sortAscending', 'sortDescending',
                        'firstPage', 'prevPage', 'lastPage', 'nextPage', 'copy'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, textAlign: 'right' }
                    ]
                });
            gridObj.appendTo('#Grid');
        });
        it('do sort in header', (done) => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr.edoas')
            };
            gridObj.sortColumn('OrderID', 'ascending');
            gridObj.actionComplete = function (args) {
                if (args.requestType === 'sorting') {

                    gridObj.actionComplete = null;
                    done();
                }
            };
        });
        it('header with sort test', (done) => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr.edoas')
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBeGreaterThan(0);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(10);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Sort Ascending')).toBeGreaterThanOrEqual(0);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Ungroup by this column')).toBeGreaterThanOrEqual(0);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            expect((gridObj.contextMenuModule as any).isOpen).toBe(true);
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(0);
            expect((gridObj.contextMenuModule as any).disableItems.length).toBe(0);
            expect((gridObj.contextMenuModule as any).isOpen).toBe(false);
            gridObj.groupColumn('OrderID');
            gridObj.sortColumn('OrderID', 'descending');
            gridObj.actionComplete = function (args) {
                if (args.requestType === 'sorting') {
                    gridObj.actionComplete = null;
                    done();
                }
            };
        });
        it('header with sort and group test', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelectorAll('th')[1] };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr.edoas')
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Sort Descending')).toBeGreaterThanOrEqual(0);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Group by this column')).toBeGreaterThanOrEqual(0);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(0);
            expect((gridObj.contextMenuModule as any).disableItems.length).toBe(0);
        });
        it('content', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(12);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(0);
            expect((gridObj.contextMenuModule as any).disableItems.length).toBe(0);
            gridObj.clearSelection();
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Copy')).toBeGreaterThanOrEqual(0);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });
        it('page 1 test', (done) => {
            (gridObj.contextMenuModule as any).eventArgs = { target: (gridObj.pagerModule as any).element };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(12);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('First Page')).toBeGreaterThanOrEqual(0);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Previous Page')).toBeGreaterThanOrEqual(0);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            gridObj.goToPage(2);
            gridObj.dataBound = function () {
                gridObj.dataBound = null;
                done();               
            };
        });
        it('page 2 test', (done) => {
            (gridObj.contextMenuModule as any).eventArgs = { target: (gridObj.pagerModule as any).element };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('First Page')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Previous Page')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Next Page')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Last Page')).toBe(-1);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            let a = (gridObj.contextMenuModule as any).getLastPage();
            gridObj.goToPage(a);
            gridObj.dataBound = function () {
                gridObj.dataBound = null;
                done();                
            };
        });
        it('last page test', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: (gridObj.pagerModule as any).element };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('First Page')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Previous Page')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Next Page') >= 0).toBeTruthy();
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Last Page') >= 0).toBeTruthy();
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });
        it('edited row', () => {
            gridObj.editModule.startEdit(gridObj.getContent().querySelectorAll('tr')[1]);
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelector('.e-inline-edit') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(14);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Save')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Cancel')).toBe(-1);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            gridObj.editModule.endEdit();
        });
        it('sub menu', () => {
            let item = (gridObj.contextMenuModule as any).defaultItems['export'].items;
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            let subE = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: item
            };
            expect(subE.items.length).toBe(3);
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(subE);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });
        it('group header', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.element.querySelector('.e-groupdroparea') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(gridObj.contextMenuModule.isOpen).toBeFalsy();
        });
        it('content but not in table', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().firstChild };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                cancel: false
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(e.cancel).toBeTruthy();
        });
        it('heirarchy grid test', () => {
            let element = document.createElement('span');
            let gridEle = createElement('div', { className: 'e-grid' });
            gridEle.appendChild(element);
            document.body.appendChild(gridEle);
            (gridObj.contextMenuModule as any).eventArgs = { target: element };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                cancel: false
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(e.cancel).toBeTruthy();
            remove(gridEle);
        });

        afterAll(() => {
            gridObj.destroy();
            remove(elem);
        });
    });
    describe('default items without required module', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    dataBound: dataBound,
                    contextMenuItems: ['autoFitAll', 'autoFit',
                        'group', 'ungroup', 'edit', 'delete', 'save', 'cancel',
                        'pdfExport', 'excelExport', 'csvExport', 'sortAscending', 'sortDescending',
                        'firstPage', 'prevPage', 'lastPage', 'nextPage', 'copy'
                    ],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, textAlign: 'right' }
                    ]
                });
            gridObj.appendTo('#Grid');
        });

        it('disabled items', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            gridObj.clearSelection();
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('AutoFit this column')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('AutoFit all column')).toBe(-1);
            expect((gridObj.contextMenuModule as any).disableItems.length).toBe(14);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });
        it('sub menu', () => {
            let item = (gridObj.contextMenuModule as any).defaultItems['export'].items;
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            let subE = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: item
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(subE);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('PDF Export')).toBeGreaterThanOrEqual(0);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('CSV Export')).toBeGreaterThanOrEqual(0);
            expect((gridObj.contextMenuModule as any).disableItems.indexOf('Excel Export')).toBeGreaterThanOrEqual(0);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });

        afterAll(() => {
            gridObj.destroy();
            remove(elem);
        });
    });
    describe('custom items', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid' });
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            gridObj = new Grid(
                {
                    dataSource: data,
                    dataBound: dataBound,
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 10
                    },
                    contextMenuItems: [{ text: 'item1', target: '.e-header' }],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'left', width: 125, isPrimaryKey: true },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'right', width: 125 },
                        { field: 'ShipName', headerText: 'Ship Name', width: 120 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 170 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150, textAlign: 'right' }
                    ]
                });
            gridObj.appendTo('#Grid');
        });

        it('header', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
            expect(gridObj.contextMenuModule.contextMenu.items.length).toBe(1);
        });
        it('content', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            expect(gridObj.contextMenuModule.isOpen).toBe(false);
            expect((gridObj.contextMenuModule as any).disableItems.length).toBe(0);
            expect((gridObj.contextMenuModule as any).hiddenItems.length).toBe(0);
        });

        afterAll(() => {
            gridObj.destroy();
            remove(elem);
        });
    });
});