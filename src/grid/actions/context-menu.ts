import { L10n, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { ContextMenu as Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { IGrid, ContextMenuItemModel, IAction, NotifyArgs, ContextMenuOpenEventArgs, ContextMenuClickEventArgs } from '../base/interface';
import { Column } from '../models/column';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { SortDescriptorModel } from '../base/grid-model';
import { Resize } from '../actions/resize';
import { Page } from '../actions/page';
import { parentsUntil } from '../base/util';
import { Group } from '../actions/group';
import { Sort } from '../actions/sort';
import { PdfExport } from '../actions/pdf-export';
import { ExcelExport } from '../actions/excel-export';

export const menuClass: CMenuClassList = {
    header: '.e-gridheader',
    content: '.e-gridcontent',
    edit: '.e-inline-edit',
    editIcon: 'e-edit',
    pager: '.e-gridpager',
    delete: 'e-delete',
    save: 'e-save',
    cancel: 'e-cancel',
    copy: 'e-copy',
    pdf: 'e-pdfexport',
    group: 'e-icon-group',
    ungroup: 'e-icon-ungroup',
    csv: 'e-csvexport',
    excel: 'e-excelexport',
    fPage: 'e-icon-first',
    nPage: 'e-icon-next',
    lPage: 'e-icon-last',
    pPage: 'e-icon-prev',
    ascending: 'e-icon-ascending',
    descending: 'e-icon-descending',
    groupHeader: 'e-groupdroparea',
    touchPop: 'e-gridpopup'
};

export interface CMenuClassList {
    header: string;
    content: string;
    edit: string;
    editIcon: string;
    pager: string;
    cancel: string;
    save: string;
    delete: string;
    copy: string;
    pdf: string;
    group: string;
    ungroup: string;
    csv: string;
    excel: string;
    fPage: string;
    lPage: string;
    nPage: string;
    pPage: string;
    ascending: string;
    descending: string;
    groupHeader: string;
    touchPop: string;
}

/**
 * 'ContextMenu module used to handle context menu actions.'
 */
export class ContextMenu implements IAction {
    //internal variables
    private element: HTMLUListElement;
    public contextMenu: Menu;
    private defaultItems: { [key: string]: ContextMenuItemModel } = {};
    private disableItems: string[] = [];
    private hiddenItems: string[] = [];
    private gridID: string;
    // module declarations
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private l10n: L10n;
    private localeText: { [key: string]: string } = this.setLocaleKey();
    private targetColumn: Column;
    private eventArgs: Event;
    public isOpen: boolean;
    public row: HTMLTableRowElement;
    public cell: HTMLTableCellElement;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.gridID = parent.element.id;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }
    /**
     * @hidden
     */
    public addEventListener() : void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.uiUpdate, this.enableAfterRenderMenu, this);
        this.parent.on(events.initialLoad, this.render, this);
    }

    /**
     * @hidden
     */
    public removeEventListener() : void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialLoad, this.render);
        this.parent.off(events.uiUpdate, this.enableAfterRenderMenu);
    }

    private render(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.element = createElement('ul', { id: this.gridID + '_cmenu' }) as HTMLUListElement;
        this.parent.element.appendChild(this.element);
        let target: string = '#' + this.gridID;
        this.contextMenu = new Menu({
            items: this.getMenuItems(),
            enableRtl: this.parent.enableRtl,
            enablePersistence: this.parent.enablePersistence,
            locale: this.parent.locale,
            target: target,
            select: this.contextMenuItemClick.bind(this),
            beforeOpen: this.contextMenuBeforeOpen.bind(this),
            onOpen: this.contextMenuOpen.bind(this),
            onClose: this.contextMenuOnClose.bind(this),
            cssClass: 'e-grid-menu'
        });
        this.contextMenu.appendTo(this.element);
    }

    private enableAfterRenderMenu(e: NotifyArgs): void {
        if (e.module === this.getModuleName() && e.enable) {
            if (this.contextMenu) {
                this.contextMenu.destroy();
                remove(this.element);
            }
            this.render();
        }
    }

    private getMenuItems(): ContextMenuItemModel[] {
        let menuItems: MenuItemModel[] = [];
        let exportItems: MenuItemModel[] = [];
        for (let item of this.parent.contextMenuItems) {
            if (typeof item === 'string' && this.getDefaultItems().indexOf(item) !== -1) {
                if (item.toLocaleLowerCase().indexOf('export') !== -1) {
                    exportItems.push(this.buildDefaultItems(item));
                } else {
                    menuItems.push(this.buildDefaultItems(item));
                }
            } else if (typeof item !== 'string') {
                menuItems.push(item);
            }
        }
        if (exportItems.length > 0) {
            let exportGroup: ContextMenuItemModel = this.buildDefaultItems('export');
            exportGroup.items = exportItems;
            menuItems.push(exportGroup);
        }
        return menuItems;
    }

    private getLastPage(): number {
        let totalpage: number = Math.floor(this.parent.pageSettings.totalRecordsCount / this.parent.pageSettings.pageSize);
        if (this.parent.pageSettings.totalRecordsCount % this.parent.pageSettings.pageSize) {
            totalpage += 1;
        }
        return totalpage;
    }

    private contextMenuOpen(): void {
        this.isOpen = true;
    }
    private contextMenuItemClick(args: ContextMenuClickEventArgs): void {
        let item: string = this.getKeyFromId(args.item.id);
        switch (item) {
            case 'autoFitAll':
                this.parent.autoFitColumns([]);
                break;
            case 'autoFit':
                this.parent.autoFitColumns(this.targetColumn.field);
                break;
            case 'group':
                this.parent.groupColumn(this.targetColumn.field);
                break;
            case 'ungroup':
                this.parent.ungroupColumn(this.targetColumn.field);
                break;
            case 'edit':
                if (this.parent.editSettings.mode === 'batch') {
                    if (this.row && this.cell && !isNaN(parseInt(this.cell.getAttribute('aria-colindex'), 10))) {
                        this.parent.editModule.editCell(parseInt(this.row.getAttribute('aria-rowindex'), 10), (this.parent.getColumns()
                        [parseInt(this.cell.getAttribute('aria-colindex'), 10)] as Column).field);
                    }
                } else {
                    this.parent.editModule.endEdit();
                    this.parent.editModule.startEdit(this.row);
                }
                break;
            case 'delete':
                if (this.parent.editSettings.mode !== 'batch') {
                    this.parent.editModule.endEdit();
                }
                this.parent.editModule.deleteRow(this.row);
                break;
            case 'save':
                this.parent.editModule.endEdit();
                break;
            case 'cancel':
                this.parent.editModule.closeEdit();
                break;
            case 'copy':
                this.parent.copy();
                break;
            case 'pdfExport':
                this.parent.pdfExport();
                break;
            case 'excelExport':
                this.parent.excelExport();
                break;
            case 'csvExport':
                this.parent.csvExport();
                break;
            case 'sortAscending':
                this.isOpen = false;
                this.parent.sortColumn(this.targetColumn.field, 'ascending');
                break;
            case 'sortDescending':
                this.isOpen = false;
                this.parent.sortColumn(this.targetColumn.field, 'descending');
                break;
            case 'firstPage':
                this.parent.goToPage(1);
                break;
            case 'prevPage':
                this.parent.goToPage(this.parent.pageSettings.currentPage - 1);
                break;
            case 'lastPage':
                this.parent.goToPage(this.getLastPage());
                break;
            case 'nextPage':
                this.parent.goToPage(this.parent.pageSettings.currentPage + 1);
                break;
        }
        args.column = this.targetColumn;
        this.parent.trigger(events.contextMenuClick, args);
    }

    private contextMenuOnClose(args: OpenCloseMenuEventArgs): void {
        let parent: string = 'parentObj';
        if (args.items.length > 0 && args.items[0][parent] instanceof Menu) {
            this.updateItemStatus();
        }
    }
    private getLocaleText(item: string): string {
        return this.l10n.getConstant(this.localeText[item]);
    }

    private updateItemStatus(): void {
        this.contextMenu.showItems(this.hiddenItems);
        this.contextMenu.enableItems(this.disableItems);
        this.hiddenItems = [];
        this.disableItems = [];
        this.isOpen = false;
    }

    private contextMenuBeforeOpen(args: ContextMenuOpenEventArgs): void {
        let changedRecords: string = 'changedRecords';
        let addedRecords: string = 'addedRecords';
        let deletedRecords: string = 'deletedRecords';
        let closestGrid: Element = closest(args.event.target as Element, '.e-grid');
        if (args.event && closestGrid && closestGrid !== this.parent.element) {
            args.cancel = true;
        } else if (args.event && (closest(args.event.target as Element, '.' + menuClass.groupHeader)
            || closest(args.event.target as Element, '.' + menuClass.touchPop) ||
            closest(args.event.target as Element, '.e-summarycell') ||
            closest(args.event.target as Element, '.e-groupcaption') ||
            closest(args.event.target as Element, '.e-filterbarcell'))) {
            args.cancel = true;
        } else {
            this.targetColumn = this.getColumn(args.event);
            this.selectRow(args.event, this.parent.selectionSettings.type !== 'multiple');
            for (let item of args.items) {
                let key: string = this.getKeyFromId(item.id);
                let dItem: ContextMenuItemModel = this.defaultItems[key];
                if (this.getDefaultItems().indexOf(key) !== -1) {
                    if (this.ensureDisabledStatus(key)) {
                        this.disableItems.push(item.text);
                    }
                    if (args.event && this.ensureTarget(args.event.target as HTMLElement, menuClass.edit)) {
                        if (key !== 'save' && key !== 'cancel') {
                            this.hiddenItems.push(item.text);
                        }
                    } else if (this.parent.editSettings.mode === 'batch' && ((closest(args.event.target as Element, '.e-gridform')) ||
                        this.parent.editModule.getBatchChanges()[changedRecords].length ||
                        this.parent.editModule.getBatchChanges()[addedRecords].length ||
                        this.parent.editModule.getBatchChanges()[deletedRecords].length) && (key === 'save' || key === 'cancel')) {
                        continue;
                    } else if (isNullOrUndefined(args.parentItem) && args.event
                        && !this.ensureTarget(args.event.target as HTMLElement, dItem.target)) {
                        this.hiddenItems.push(item.text);
                    }
                } else if ((item as ContextMenuItemModel).target && args.event &&
                    !this.ensureTarget(args.event.target as HTMLElement, (item as ContextMenuItemModel).target)) {
                    this.hiddenItems.push(item.text);
                }
            }
            this.contextMenu.enableItems(this.disableItems, false);
            this.contextMenu.hideItems(this.hiddenItems);
            this.eventArgs = args.event;
            args.column = this.targetColumn;
            this.parent.trigger(events.contextMenuOpen, args);
            if (this.hiddenItems.length === args.items.length) {
                this.updateItemStatus();
                args.cancel = true;
            }
        }
    }

    private ensureTarget(targetElement: HTMLElement, selector: string): boolean {
        let target: Element = targetElement;
        if (selector === menuClass.header || selector === menuClass.content) {
            target = parentsUntil(closest(targetElement as Element, '.e-table'), selector.substr(1, selector.length));
        } else {
            target = closest(targetElement as Element, selector);
        }
        return target && parentsUntil(target, 'e-grid') === this.parent.element ? true : false;
    }

    private ensureDisabledStatus(item: string): Boolean {
        let status: Boolean = false;
        switch (item) {
            case 'autoFitAll':
            case 'autoFit':
                status = !(this.parent.ensureModuleInjected(Resize) && !this.parent.isEdit);
                break;
            case 'group':
                if (!this.parent.allowGrouping || (this.parent.ensureModuleInjected(Group) && this.targetColumn
                    && this.parent.groupSettings.columns.indexOf(this.targetColumn.field) >= 0)) {
                    status = true;
                }
                break;
            case 'ungroup':
                if (!this.parent.allowGrouping || !this.parent.ensureModuleInjected(Group)
                    || (this.parent.ensureModuleInjected(Group) && this.targetColumn
                        && this.parent.groupSettings.columns.indexOf(this.targetColumn.field) < 0)) {
                    status = true;
                }
                break;
            case 'edit':
            case 'delete':
            case 'save':
            case 'cancel':
                if (!this.parent.editModule) {
                    status = true;
                }
                break;
            case 'copy':
                if (this.parent.getSelectedRowIndexes().length === 0 ||
                    this.parent.getCurrentViewRecords().length === 0) {
                    status = true;
                }
                break;
            case 'export':
                if ((!this.parent.allowExcelExport || !this.parent.excelExport) ||
                    !this.parent.ensureModuleInjected(PdfExport) && !this.parent.ensureModuleInjected(ExcelExport)) {
                    status = true;
                }
                break;
            case 'pdfExport':
                if (!(this.parent.allowPdfExport) || !this.parent.ensureModuleInjected(PdfExport)) {
                    status = true;
                }
                break;
            case 'excelExport':
            case 'csvExport':
                if (!(this.parent.allowExcelExport) || !this.parent.ensureModuleInjected(ExcelExport)) {
                    status = true;
                }
                break;
            case 'sortAscending':
            case 'sortDescending':
                if ((!this.parent.allowSorting) || !this.parent.ensureModuleInjected(Sort)) {
                    status = true;
                } else if (this.parent.ensureModuleInjected(Sort) && this.parent.sortSettings.columns.length > 0 && this.targetColumn) {
                    this.parent.sortSettings.columns.forEach((element: SortDescriptorModel) => {
                        if (element.field === this.targetColumn.field
                            && element.direction === item.replace('sort', '').toLocaleLowerCase()) {
                            status = true;
                        }
                    });
                }
                break;
            case 'firstPage':
            case 'prevPage':
                if (!this.parent.allowPaging || !this.parent.ensureModuleInjected(Page) ||
                    this.parent.getCurrentViewRecords().length === 0 ||
                    (this.parent.ensureModuleInjected(Page) && this.parent.pageSettings.currentPage === 1)) {
                    status = true;
                }
                break;
            case 'lastPage':
            case 'nextPage':
                if (!this.parent.allowPaging || !this.parent.ensureModuleInjected(Page) ||
                    this.parent.getCurrentViewRecords().length === 0 ||
                    (this.parent.ensureModuleInjected(Page) && this.parent.pageSettings.currentPage === this.getLastPage())) {
                    status = true;
                }
                break;
        }
        return status;
    }

    /**
     * Gets the context menu of grid.
     * @return {Element}
     */
    public getContextMenu(): Element {
        return this.element;
    }

    /**
     * To destroy the Context menu.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        this.contextMenu.destroy();
        remove(this.element);
        this.removeEventListener();
    }


    private getModuleName(): string {
        return 'contextMenu';
    }

    private generateID(item: string): string {
        return this.gridID + '_cmenu_' + item;
    }

    private getKeyFromId(id: string): string {
        return id.replace(this.gridID + '_cmenu_', '');
    }

    private buildDefaultItems(item: string): ContextMenuItemModel {
        let menuItem: ContextMenuItemModel;
        switch (item) {
            case 'autoFitAll':
            case 'autoFit':
                menuItem = { target: menuClass.header };
                break;
            case 'group':
                menuItem = { target: menuClass.header, iconCss: menuClass.group };
                break;
            case 'ungroup':
                menuItem = { target: menuClass.header, iconCss: menuClass.ungroup };
                break;
            case 'edit':
                menuItem = { target: menuClass.content, iconCss: menuClass.editIcon };
                break;
            case 'delete':
                menuItem = { target: menuClass.content, iconCss: menuClass.delete };
                break;
            case 'save':
                menuItem = { target: menuClass.edit, iconCss: menuClass.save };
                break;
            case 'cancel':
                menuItem = { target: menuClass.edit, iconCss: menuClass.cancel };
                break;
            case 'copy':
                menuItem = { target: menuClass.content, iconCss: menuClass.copy };
                break;
            case 'export':
                menuItem = { target: menuClass.content };
                break;
            case 'pdfExport':
                menuItem = { target: menuClass.content, iconCss: menuClass.pdf };
                break;
            case 'excelExport':
                menuItem = { target: menuClass.content, iconCss: menuClass.excel };
                break;
            case 'csvExport':
                menuItem = { target: menuClass.content, iconCss: menuClass.csv };
                break;
            case 'sortAscending':
                menuItem = { target: menuClass.header, iconCss: menuClass.ascending };
                break;
            case 'sortDescending':
                menuItem = { target: menuClass.header, iconCss: menuClass.descending };
                break;
            case 'firstPage':
                menuItem = { target: menuClass.pager, iconCss: menuClass.fPage };
                break;
            case 'prevPage':
                menuItem = { target: menuClass.pager, iconCss: menuClass.pPage };
                break;
            case 'lastPage':
                menuItem = { target: menuClass.pager, iconCss: menuClass.lPage };
                break;
            case 'nextPage':
                menuItem = { target: menuClass.pager, iconCss: menuClass.nPage };
                break;
        }
        this.defaultItems[item] = {
            text: this.getLocaleText(item), id: this.generateID(item),
            target: menuItem.target, iconCss: menuItem.iconCss ? 'e-icons ' + menuItem.iconCss : ''
        };
        return this.defaultItems[item];
    }

    private getDefaultItems(): string[] {
        return ['autoFitAll', 'autoFit',
            'group', 'ungroup', 'edit', 'delete', 'save', 'cancel', 'copy', 'export',
            'pdfExport', 'excelExport', 'csvExport', 'sortAscending', 'sortDescending',
            'firstPage', 'prevPage', 'lastPage', 'nextPage'];
    }
    private setLocaleKey(): { [key: string]: string } {
        return {
            'autoFitAll': 'autoFitAll',
            'autoFit': 'autoFit',
            'copy': 'Copy',
            'group': 'Group',
            'ungroup': 'Ungroup',
            'edit': 'EditRecord',
            'delete': 'DeleteRecord',
            'save': 'Save',
            'cancel': 'CancelButton',
            'pdfExport': 'Pdfexport',
            'excelExport': 'Excelexport',
            'csvExport': 'Csvexport',
            'export': 'Export',
            'sortAscending': 'SortAscending',
            'sortDescending': 'SortDescending',
            'firstPage': 'FirstPage',
            'lastPage': 'LastPage',
            'prevPage': 'PreviousPage',
            'nextPage': 'NextPage'
        };
    }

    private getColumn(e: Event): Column {
        let cell: HTMLElement = <HTMLElement>closest(<HTMLElement>e.target, 'th.e-headercell');
        if (cell) {
            let uid: string = cell.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
            return this.parent.getColumnByUid(uid);
        }
        return null;
    }

    private selectRow(e: Event, isSelectable: boolean): void {
        this.cell = (<HTMLElement>e.target) as HTMLTableCellElement;
        this.row = <HTMLElement>closest(<HTMLElement>e.target, 'tr.e-row') as HTMLTableRowElement;
        if (this.row && isSelectable) {
            this.parent.selectRow(this.parent.getDataRows().indexOf(this.row));
        }
    }
}
