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
            expect(menuItem.target === menuClass.header);
            expect(menuItem.iconCss).toBeFalsy();
            break;
        case 'group':
            expect(menuItem.target === menuClass.header);
            expect(menuItem.iconCss === menuClass.group);
            break;
        case 'ungroup':
            expect(menuItem.target === menuClass.header);
            expect(menuItem.iconCss === menuClass.ungroup);
            break;
        case 'edit':
            expect(menuItem.target === menuClass.content);
            expect(menuItem.iconCss === menuClass.editIcon);
            break;
        case 'delete':
            expect(menuItem.target === menuClass.content);
            expect(menuItem.iconCss === menuClass.delete);
            break;
        case 'save':
            expect(menuItem.target === menuClass.edit);
            expect(menuItem.iconCss === menuClass.save);
            break;
        case 'cancel':
            expect(menuItem.target === menuClass.edit);
            expect(menuItem.iconCss === menuClass.cancel);
            break;
        case 'copy':
            expect(menuItem.target === menuClass.content);
            expect(menuItem.iconCss === menuClass.copy);
            break;
        case 'export':
            expect(menuItem.target === menuClass.content);
            expect(menuItem.iconCss).toBeFalsy();
            break;
        case 'pdfExport':
            expect(menuItem.target === menuClass.content);
            expect(menuItem.iconCss === menuClass.pdf);
            break;
        case 'excelExport':
            expect(menuItem.target === menuClass.content);
            expect(menuItem.iconCss === menuClass.excel);
            break;
        case 'csvExport':
            expect(menuItem.target === menuClass.content);
            expect(menuItem.iconCss === menuClass.csv);
            break;
        case 'sortAscending':
            expect(menuItem.target === menuClass.header);
            expect(menuItem.iconCss === menuClass.ascending);
            break;
        case 'sortDescending':
            expect(menuItem.target === menuClass.header);
            expect(menuItem.iconCss === menuClass.descending);
            break;
        case 'firstPage':
            expect(menuItem.target === menuClass.pager);
            expect(menuItem.iconCss === menuClass.fPage);
            break;
        case 'prevPage':
            expect(menuItem.target === menuClass.pager);
            expect(menuItem.iconCss === menuClass.pdf);
            break;
        case 'lastPage':
            expect(menuItem.target === menuClass.pager);
            expect(menuItem.iconCss === menuClass.lPage);
            break;
        case 'nextPage':
            expect(menuItem.target === menuClass.pager);
            expect(menuItem.iconCss === menuClass.nPage);
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
            expect(gridObj.contextMenuModule.contextMenu.cssClass).toBe('e-grid');
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
                    targetAndIconCheck(itemModel);
                    expect(itemModel).not.toBe(null);
                    (gridObj.contextMenuModule as any).contextMenuItemClick({ item: itemModel });
                }
            }
        });
        it('header', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items,
                parentItem: document.querySelector('tr.edoas')
            };
            gridObj.sortColumn('OrderID', 'ascending');
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });
        it('content', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContent().querySelector('tr').querySelector('td') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });
        it('pager', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: (gridObj.pagerModule as any).element };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });
        it('edited row', () => {
            gridObj.editModule.startEdit(gridObj.getContent().querySelector('tr'));
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getContentTable().querySelector('.e-inline-edit') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
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
                    allowPaging: true,
                    pageSettings: {
                        pageSize: 10
                    },
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

        it('header', () => {
            (gridObj.contextMenuModule as any).eventArgs = { target: gridObj.getHeaderTable().querySelector('th') };
            let e = {
                event: (gridObj.contextMenuModule as any).eventArgs,
                items: gridObj.contextMenuModule.contextMenu.items
            };
            (gridObj.contextMenuModule as any).contextMenuBeforeOpen(e);
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
            (gridObj.contextMenuModule as any).contextMenuOpen();
            (gridObj.contextMenuModule as any).contextMenuOnClose(e);
        });

        afterAll(() => {
            gridObj.destroy();
            remove(elem);
        });
    });
    describe('custom items without required module', () => {
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
                    contextMenuItems: [{text:'item1'}],
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
        });       

        afterAll(() => {
            gridObj.destroy();
            remove(elem);
        });
    });
});