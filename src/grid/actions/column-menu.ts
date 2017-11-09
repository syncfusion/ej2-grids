import { L10n, EventHandler, closest, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { ContextMenu as Menu, MenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { IGrid, IAction, ColumnMenuItemModel, ColumnMenuOpenEventArgs } from '../base/interface';
import { parentsUntil } from '../base/util';
import { Column } from '../models/column';
import { ServiceLocator } from '../services/service-locator';
import * as events from '../base/constant';
import { OffsetPosition, calculatePosition } from '@syncfusion/ej2-popups';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { Group } from '../actions/group';
import { Sort } from '../actions/sort';
import { SortDescriptorModel } from '../base/grid-model';
import { Filter } from '../actions/filter';
import { Resize } from '../actions/resize';

/**
 * 'column menu module used to handle column menu actions'
 */
export class ColumnMenu implements IAction {
    //internal variables
    private element: HTMLUListElement;
    private gridID: string;
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private columnMenu: Menu;
    private l10n: L10n;
    private defaultItems: { [key: string]: ColumnMenuItemModel } = {};
    private localeText: { [key: string]: string } = this.setLocaleKey();
    private targetColumn: Column;
    private disableItems: string[] = [];
    private headerCell: HTMLElement;
    private isOpen: boolean = false;
    private eventArgs: Event;
    // default class names
    private GROUP: string = 'e-icon-group';
    private UNGROUP: string = 'e-icon-ungroup';
    private ASCENDING: string = 'e-icon-ascending';
    private DESCENDING: string = 'e-icon-descending';
    private ROOT: string = 'e-columnmenu';
    private FILTER: string = 'e-icon-filter';
    private POP: string = 'e-filter-popup';
    private WRAP: string = 'e-col-menu';
    private CHOOSER: string = '_chooser_';

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.gridID = parent.element.id;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    public wireEvents(): void {
        this.getColumnMenuHandlers().forEach((ele: HTMLElement) => {
            EventHandler.add(ele, 'mousedown', this.columnMenuHandlerDown, this);
        });
    }

    public unwireEvents(): void {
        this.getColumnMenuHandlers().forEach((ele: HTMLElement) => {
            EventHandler.remove(ele, 'mousedown', this.columnMenuHandlerDown);
        });
    }

    /**
     * To destroy the resize 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.columnMenu.destroy();
        this.removeEventListener();
        this.unwireFilterEvents();
        this.unwireEvents();
        remove(this.element);
    }

    public columnMenuHandlerClick(e: Event): void {
        if ((e.target as HTMLElement).classList.contains('e-columnmenu')) {
            if (!this.isOpen) {
                this.openColumnMenu(e);
            } else if (this.isOpen && this.headerCell !== this.getHeaderCell(e)) {
                this.columnMenu.close();
                this.openColumnMenu(e);
            } else {
                this.columnMenu.close();
            }
        }
    }

    private openColumnMenu(e: Event): void {
        let pos: OffsetPosition = { top: 0, left: 0 };
        this.element.style.cssText = 'display:block;visibility:hidden';
        let elePos: ClientRect = this.element.getBoundingClientRect();
        this.element.style.cssText = 'display:none;visibility:visible';
        this.headerCell = this.getHeaderCell(e);
        if (Browser.isDevice) {
            pos.top = ((window.innerHeight / 2) - (elePos.height / 2));
            pos.left = ((window.innerWidth / 2) - (elePos.width / 2));
        } else {
            if (this.parent.enableRtl) {
                pos = calculatePosition(this.headerCell, 'left', 'bottom');
            } else {
                pos = calculatePosition(this.headerCell, 'right', 'bottom');
                pos.left -= elePos.width;
            }
        }
        this.columnMenu.open(pos.top, pos.left);
        e.preventDefault();
    }

    public columnMenuHandlerDown(e: Event): void {
        this.isOpen = !(this.element.style.display === 'none' || this.element.style.display === '');
    }

    private getColumnMenuHandlers(): HTMLElement[] {
        return [].slice.call(this.parent.getHeaderTable().querySelectorAll('.' + this.ROOT));
    }

    /**
     * @hidden
     */
    public addEventListener() : void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.headerRefreshed, this.wireEvents, this);
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.on(events.filterDialogCreated, this.filterPosition, this);
        this.parent.on(events.click, this.columnMenuHandlerClick, this);
    }

    /**
     * @hidden
     */
    public removeEventListener() : void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.headerRefreshed, this.unwireEvents);
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.filterDialogCreated, this.filterPosition);
        this.parent.off(events.click, this.columnMenuHandlerClick);
    }

    private render(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        this.element = createElement('ul', { id: this.gridID + '_columnmenu', className: 'e-colmenu' }) as HTMLUListElement;
        this.parent.element.appendChild(this.element);
        this.columnMenu = new Menu({
            cssClass: 'e-grid-menu',
            enableRtl: this.parent.enableRtl,
            enablePersistence: this.parent.enablePersistence,
            locale: this.parent.locale,
            items: this.getItems(),
            select: this.columnMenuItemClick.bind(this),
            beforeOpen: this.columnMenuBeforeOpen.bind(this),
            onClose: this.columnMenuOnClose.bind(this),
            beforeItemRender: this.beforeMenuItemRender.bind(this),
            beforeClose: this.columnMenuBeforeClose.bind(this)
        });
        this.columnMenu.appendTo(this.element);
        this.wireFilterEvents();
    }

    private wireFilterEvents(): void {
        if (!Browser.isDevice) {
            EventHandler.add(this.element, 'mouseover', this.appendFilter, this);
        }
    }

    private unwireFilterEvents(): void {
        if (!Browser.isDevice) {
            EventHandler.remove(this.element, 'mouseover', this.appendFilter);
        }
    }

    private beforeMenuItemRender(args: MenuEventArgs): void {
        if (this.isChooserItem(args.item)) {
            let field: string = this.getKeyFromId(args.item.id, this.CHOOSER);
            let column: Column = this.parent.getColumnByField(field);
            let check: Element = createCheckBox(false, {
                label: args.item.text,
                checked: column.visible
            });
            if (this.parent.enableRtl) {
                check.classList.add('e-rtl');
            }
            args.element.innerHTML = '';
            args.element.appendChild(check);
        } else if (this.getKeyFromId(args.item.id) === 'filter') {
            args.element.appendChild(createElement('span', { className: 'e-icons e-caret' }));
            args.element.className += 'e-filter-item e-menu-caret-icon';
        }
    }

    private columnMenuBeforeClose(args: ColumnMenuOpenEventArgs): void {
        if (!isNullOrUndefined(args.parentItem) &&
            this.getKeyFromId(args.parentItem.id) === 'columnChooser' &&
            closest(args.event.target as Node, '.e-menu-parent')) {
            args.cancel = true;
        } else if (args.event && (closest(args.event.target as Element, '.' + this.POP)
            || (parentsUntil(args.event.target as Element, 'e-popup')))) {
            args.cancel = true;
        }
    }

    private isChooserItem(item: ColumnMenuItemModel): boolean {
        return this.getKeyFromId(item.id, this.CHOOSER).indexOf(this.gridID) === -1;
    }


    private columnMenuBeforeOpen(args: ColumnMenuOpenEventArgs): void {
        args.column = this.targetColumn = this.getColumn();
        this.parent.trigger(events.columnMenuOpen, args);
        for (let item of args.items) {
            let key: string = this.getKeyFromId(item.id);
            let dItem: ColumnMenuItemModel = this.defaultItems[key];
            if (this.getDefaultItems().indexOf(key) !== -1) {
                if (this.ensureDisabledStatus(key) && !dItem.hide) {
                    this.disableItems.push(item.text);
                }
            }
        }
        this.columnMenu.enableItems(this.disableItems, false);
    }

    private ensureDisabledStatus(item: string): Boolean {
        let status: Boolean = false;
        switch (item) {
            case 'group':
                if (!this.parent.allowGrouping || (this.parent.ensureModuleInjected(Group) && this.targetColumn
                    && this.parent.groupSettings.columns.indexOf(this.targetColumn.field) >= 0)) {
                    status = true;
                }
                break;
            case 'autoFitAll':
            case 'autoFit':
                status = !this.parent.ensureModuleInjected(Resize);
                break;
            case 'ungroup':
                if (!this.parent.ensureModuleInjected(Group) || (this.parent.ensureModuleInjected(Group) && this.targetColumn
                    && this.parent.groupSettings.columns.indexOf(this.targetColumn.field) < 0)) {
                    status = true;
                }
                break;
            case 'sortDescending':
            case 'sortAscending':
                if (this.parent.ensureModuleInjected(Sort) && this.parent.sortSettings.columns.length > 0 && this.targetColumn) {
                    this.parent.sortSettings.columns.forEach((ele: SortDescriptorModel) => {
                        if (ele.field === this.targetColumn.field
                            && ele.direction === item.replace('sort', '').toLocaleLowerCase()) {
                            status = true;
                        }
                    });
                } else if (!this.parent.ensureModuleInjected(Sort)) {
                    status = true;
                }
                break;
        }
        return status;
    }

    private columnMenuItemClick(args: MenuEventArgs): void {
        let item: string = this.isChooserItem(args.item) ? 'columnChooser' : this.getKeyFromId(args.item.id);
        switch (item) {
            case 'autoFit':
                this.parent.autoFitColumns(this.targetColumn.field);
                break;
            case 'autoFitAll':
                this.parent.autoFitColumns([]);
                break;
            case 'ungroup':
                this.parent.ungroupColumn(this.targetColumn.field);
                break;
            case 'group':
                this.parent.groupColumn(this.targetColumn.field);
                break;
            case 'sortAscending':
                this.parent.sortColumn(this.targetColumn.field, 'ascending');
                break;
            case 'sortDescending':
                this.parent.sortColumn(this.targetColumn.field, 'descending');
                break;
            case 'columnChooser':
                let key: string = this.getKeyFromId(args.item.id, this.CHOOSER);
                let checkbox: HTMLElement = args.element.querySelector('.e-checkbox-wrapper .e-frame') as HTMLElement;
                if (checkbox && checkbox.classList.contains('e-check')) {
                    checkbox.classList.remove('e-check');
                    this.parent.hideColumn(key, 'field');
                } else if (checkbox) {
                    this.parent.showColumn(key, 'field');
                    checkbox.classList.add('e-check');
                }
                break;
            case 'filter':
                this.getFilter(args.element, args.item.id);
                break;
        }
        this.parent.trigger(events.columnMenuClick, args);
    }

    private columnMenuOnClose(args: OpenCloseMenuEventArgs): void {
        let parent: string = 'parentObj';
        if (args.items.length > 0 && args.items[0][parent] instanceof Menu) {
            this.columnMenu.enableItems(this.disableItems);
            this.disableItems = [];
        }
    }

    private getDefaultItems(): string[] {
        return ['autoFitAll', 'autoFit', 'sortAscending', 'sortDescending', 'group', 'ungroup', 'columnChooser', 'filter'];
    }

    private getItems(): ColumnMenuItemModel[] {
        let items: ColumnMenuItemModel[] = [];
        let defultItems: string[] | ColumnMenuItemModel[] = this.parent.columnMenuItems ? this.parent.columnMenuItems : this.getDefault();
        for (let item of defultItems) {
            if (typeof item === 'string') {
                if (item === 'columnChooser') {
                    let col: ColumnMenuItemModel = this.getDefaultItem(item);
                    col.items = this.createChooserItems();
                    items.push(col);
                } else {
                    items.push(this.getDefaultItem(item));
                }

            } else {
                items.push(item);
            }
        }
        return items;
    }

    private getDefaultItem(item: string): ColumnMenuItemModel {
        let menuItem: ColumnMenuItemModel = {};
        switch (item) {
            case 'sortAscending':
                menuItem = { iconCss: this.ASCENDING };
                break;
            case 'sortDescending':
                menuItem = { iconCss: this.DESCENDING };
                break;
            case 'group':
                menuItem = { iconCss: this.GROUP };
                break;
            case 'ungroup':
                menuItem = { iconCss: this.UNGROUP };
                break;
            case 'filter':
                menuItem = { iconCss: this.FILTER };
                break;
        }
        this.defaultItems[item] = {
            text: this.getLocaleText(item), id: this.generateID(item),
            iconCss: menuItem.iconCss ? 'e-icons ' + menuItem.iconCss : ''
        };
        return this.defaultItems[item];
    }

    private getLocaleText(item: string): string {
        return this.l10n.getConstant(this.localeText[item]);
    }

    private generateID(item: string, append?: string): string {
        return this.gridID + '_colmenu_' + (append ? append + item : item);
    }

    private getKeyFromId(id: string, append?: string): string {
        return id.replace(this.gridID + '_colmenu_' + (append ? append : ''), '');
    }

    public getColumnMenu(): HTMLElement {
        return this.element;
    }

    private getModuleName(): string {
        return 'columnMenu';
    }

    private setLocaleKey(): { [key: string]: string } {
        return {
            'autoFitAll': 'autoFitAll',
            'autoFit': 'autoFit',
            'group': 'Group',
            'ungroup': 'Ungroup',
            'sortAscending': 'SortAscending',
            'sortDescending': 'SortDescending',
            'columnChooser': 'Columnchooser',
            'filter': 'FilterMenu'
        };
    }

    private getHeaderCell(e: Event): HTMLElement {
        return <HTMLElement>closest(<HTMLElement>e.target, 'th.e-headercell');
    }

    private getColumn(): Column {
        if (this.headerCell) {
            let uid: string = this.headerCell.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
            return this.parent.getColumnByUid(uid);
        }
        return null;
    }

    private createChooserItems(): ColumnMenuItemModel[] {
        let items: ColumnMenuItemModel[] = [];
        for (let col of this.parent.getColumns()) {
            if (col.showInColumnChooser) {
                items.push({ id: this.generateID(col.field, this.CHOOSER), text: col.headerText ? col.headerText : col.field });
            }
        }
        return items;
    }

    private appendFilter(e: Event): void {
        let filter: string = 'filter';
        let key: string = this.defaultItems[filter].id;
        if (closest((e as Event).target as Element, '#' + key) && !this.isFilterPopupOpen()) {
            this.getFilter((e as Event).target as Element, key);
        } else if (!closest((e as Event).target as Element, '#' + key) && this.isFilterPopupOpen()) {
            this.getFilter((e as Event).target as Element, key, true);
        }
    }

    private getFilter(target: Element, id: string, isClose?: boolean): void {
        let filterPopup: HTMLElement = this.getFilterPoup();
        if (filterPopup) {
            filterPopup.style.display = isClose ? 'none' : 'block';
        } else {
            this.parent.notify(events.filterOpen, {
                col: this.targetColumn, target: target, isClose: isClose, id: id
            });
        }
    }

    private setPosition(li: Element, ul: HTMLElement): void {
        let gridPos: ClientRect = this.parent.element.getBoundingClientRect();
        let liPos: ClientRect = li.getBoundingClientRect();
        let left: number = liPos.left - gridPos.left;
        let top: number = liPos.top - gridPos.top;
        if (gridPos.height < top) {
            top = top - ul.offsetHeight + liPos.height;
        } else if (gridPos.height < top + ul.offsetHeight) {
            top = gridPos.height - ul.offsetHeight;
        }
        if (window.innerHeight < ul.offsetHeight + top + gridPos.top) {
            top = window.innerHeight - ul.offsetHeight - gridPos.top;
        }
        left += (this.parent.enableRtl ? - ul.offsetWidth : liPos.width);
        if (gridPos.width <= left + ul.offsetWidth) {
            left -= liPos.width + ul.offsetWidth;
        } else if (left < 0) {
            left += ul.offsetWidth + liPos.width;
        }
        ul.style.top = top + 'px';
        ul.style.left = left + 'px';
    }

    private filterPosition(e: Event): void {
        let filterPopup: HTMLElement = this.getFilterPoup();
        filterPopup.classList.add(this.WRAP);
        if (!Browser.isDevice) {
            let disp: string = filterPopup.style.display;
            filterPopup.style.display = 'block';
            filterPopup.classList.add(this.WRAP);
            let li: HTMLElement = this.element.querySelector('.' + this.FILTER) as HTMLElement;
            if (li) {
                this.setPosition(li.parentElement, filterPopup);
                filterPopup.style.display = disp;
            }
        }
    }

    private getDefault(): string[] {
        let items: string[] = [];
        if (this.parent.ensureModuleInjected(Resize)) {
            items.push('autoFitAll');
            items.push('autoFit');
        }
        if (this.parent.ensureModuleInjected(Group)) {
            items.push('group');
            items.push('ungroup');
        }
        if (this.parent.ensureModuleInjected(Sort)) {
            items.push('sortAscending');
            items.push('sortDescending');
        }
        items.push('columnChooser');
        if (this.parent.ensureModuleInjected(Filter)) {
            items.push('filter');
        }
        return items;
    }

    private isFilterPopupOpen(): boolean {
        let filterPopup: HTMLElement = this.getFilterPoup();
        return filterPopup && filterPopup.style.display !== 'none';
    }

    private getFilterPoup(): HTMLElement {
        return document.querySelector('.' + this.POP) as HTMLElement;
    }
}
