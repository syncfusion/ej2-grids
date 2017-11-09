import { L10n, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { ContextMenu as Menu, MenuItemModel } from '@syncfusion/ej2-navigations';
import { MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { IGrid, ContextMenuItemModel, IAction } from '../base/interface';
import { Column } from '../models/column';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { SortDescriptorModel } from '../base/grid-model';
import { Resize } from '../actions/resize';
import { Page } from '../actions/page';
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
        this.parent.on(events.initialLoad, this.render, this);
    }

    /**
     * @hidden
     */
    public removeEventListener() : void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialLoad, this.render);
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
    private contextMenuItemClick(args: MenuEventArgs): void {
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
                this.parent.editModule.endEdit();
                this.selectRow(this.eventArgs);
                this.parent.editModule.startEdit();
                break;
            case 'delete':
                this.parent.editModule.endEdit();
                this.selectRow(this.eventArgs);
                this.parent.editModule.deleteRow(this.parent.getRowByIndex(this.parent.selectedRowIndex) as HTMLTableRowElement);
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

    private contextMenuBeforeOpen(args: BeforeOpenCloseMenuEventArgs): void {
        this.targetColumn = this.getColumn(args.event);
        if (args.event && (closest(args.event.target as Element, '.' + menuClass.groupHeader)
            || closest(args.event.target as Element, '.' + menuClass.touchPop))) {
            args.cancel = true;
            return;
        }
        for (let item of args.items) {
            let key: string = this.getKeyFromId(item.id);
            let dItem: ContextMenuItemModel = this.defaultItems[key];
            if (this.getDefaultItems().indexOf(key) !== -1) {
                if (this.ensureDisabledStatus(key)) {
                    this.disableItems.push(item.text);
                }
                if (args.event && closest(args.event.target as Element, menuClass.edit)) {
                    if (key !== 'save' && key !== 'cancel') {
                        this.hiddenItems.push(item.text);
                    }
                } else if (isNullOrUndefined(args.parentItem) && args.event
                    && !closest(args.event.target as Element, dItem.target)) {
                    this.hiddenItems.push(item.text);
                }
            }
        }
        this.contextMenu.enableItems(this.disableItems, false);
        this.contextMenu.hideItems(this.hiddenItems);
        this.eventArgs = args.event;
        this.parent.trigger(events.contextMenuOpen, args);
        if (this.hiddenItems.indexOf('Export') >= 0) {
            if (this.hiddenItems.length === this.parent.contextMenuItems.length - 2) {
                this.updateItemStatus();
                args.cancel = true;
            }
        } else {
            if (this.hiddenItems.length === this.parent.contextMenuItems.length) {
                this.updateItemStatus();
                args.cancel = true;
            }
        }
    }

    private ensureDisabledStatus(item: string): Boolean {
        let status: Boolean = false;
        switch (item) {
            case 'autoFitAll':
            case 'autoFit':
                status = !this.parent.ensureModuleInjected(Resize);
                break;
            case 'group':
                if (!this.parent.allowGrouping || (this.parent.ensureModuleInjected(Group) && this.targetColumn
                    && this.parent.groupSettings.columns.indexOf(this.targetColumn.field) >= 0)) {
                    status = true;
                }
                break;
            case 'ungroup':
                if (!this.parent.ensureModuleInjected(Group) || (this.parent.ensureModuleInjected(Group) && this.targetColumn
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
                if (this.parent.getSelectedRowIndexes().length === 0) {
                    status = true;
                }
                break;
            case 'export':
                if (!this.parent.ensureModuleInjected(PdfExport) && !this.parent.ensureModuleInjected(ExcelExport)) {
                    status = true;
                }
                break;
            case 'pdfExport':
                if (!this.parent.ensureModuleInjected(PdfExport)) {
                    status = true;
                }
                break;
            case 'excelExport':
            case 'csvExport':
                if (!this.parent.ensureModuleInjected(ExcelExport)) {
                    status = true;
                }
                break;
            case 'sortAscending':
            case 'sortDescending':
                if (!this.parent.ensureModuleInjected(Sort)) {
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
                if (!this.parent.ensureModuleInjected(Page) ||
                    (this.parent.ensureModuleInjected(Page) && this.parent.pageSettings.currentPage === 1)) {
                    status = true;
                }
                break;
            case 'lastPage':
            case 'nextPage':
                if (!this.parent.ensureModuleInjected(Page) ||
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

    private selectRow(e: Event): void {
        let row: HTMLTableRowElement = <HTMLElement>closest(<HTMLElement>e.target, 'tr.e-row') as HTMLTableRowElement;
        if (row) {
            this.parent.selectRow(this.parent.getDataRows().indexOf(row));
        }
    }
}
