import { closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { ContextMenu as Menu } from '@syncfusion/ej2-navigations';
import * as events from '../base/constant';
import { Resize } from '../actions/resize';
import { Page } from '../actions/page';
import { Group } from '../actions/group';
import { Sort } from '../actions/sort';
import { PdfExport } from '../actions/pdf-export';
import { ExcelExport } from '../actions/excel-export';
export var menuClass = {
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
var ContextMenu = (function () {
    function ContextMenu(parent, serviceLocator) {
        this.defaultItems = {};
        this.disableItems = [];
        this.hiddenItems = [];
        this.localeText = this.setLocaleKey();
        this.parent = parent;
        this.gridID = parent.element.id;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }
    ContextMenu.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialLoad, this.render, this);
    };
    ContextMenu.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialLoad, this.render);
    };
    ContextMenu.prototype.render = function () {
        this.l10n = this.serviceLocator.getService('localization');
        this.element = createElement('ul', { id: this.gridID + '_cmenu' });
        this.parent.element.appendChild(this.element);
        var target = '#' + this.gridID;
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
    };
    ContextMenu.prototype.getMenuItems = function () {
        var menuItems = [];
        var exportItems = [];
        for (var _i = 0, _a = this.parent.contextMenuItems; _i < _a.length; _i++) {
            var item = _a[_i];
            if (typeof item === 'string' && this.getDefaultItems().indexOf(item) !== -1) {
                if (item.toLocaleLowerCase().indexOf('export') !== -1) {
                    exportItems.push(this.buildDefaultItems(item));
                }
                else {
                    menuItems.push(this.buildDefaultItems(item));
                }
            }
            else if (typeof item !== 'string') {
                menuItems.push(item);
            }
        }
        if (exportItems.length > 0) {
            var exportGroup = this.buildDefaultItems('export');
            exportGroup.items = exportItems;
            menuItems.push(exportGroup);
        }
        return menuItems;
    };
    ContextMenu.prototype.getLastPage = function () {
        var totalpage = Math.floor(this.parent.pageSettings.totalRecordsCount / this.parent.pageSettings.pageSize);
        if (this.parent.pageSettings.totalRecordsCount % this.parent.pageSettings.pageSize) {
            totalpage += 1;
        }
        return totalpage;
    };
    ContextMenu.prototype.contextMenuOpen = function () {
        this.isOpen = true;
    };
    ContextMenu.prototype.contextMenuItemClick = function (args) {
        var item = this.getKeyFromId(args.item.id);
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
                this.parent.editModule.deleteRow(this.parent.getRowByIndex(this.parent.selectedRowIndex));
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
    };
    ContextMenu.prototype.contextMenuOnClose = function (args) {
        var parent = 'parentObj';
        if (args.items.length > 0 && args.items[0][parent] instanceof Menu) {
            this.updateItemStatus();
        }
    };
    ContextMenu.prototype.getLocaleText = function (item) {
        return this.l10n.getConstant(this.localeText[item]);
    };
    ContextMenu.prototype.updateItemStatus = function () {
        this.contextMenu.showItems(this.hiddenItems);
        this.contextMenu.enableItems(this.disableItems);
        this.hiddenItems = [];
        this.disableItems = [];
        this.isOpen = false;
    };
    ContextMenu.prototype.contextMenuBeforeOpen = function (args) {
        this.targetColumn = this.getColumn(args.event);
        if (args.event && (closest(args.event.target, '.' + menuClass.groupHeader)
            || closest(args.event.target, '.' + menuClass.touchPop))) {
            args.cancel = true;
            return;
        }
        for (var _i = 0, _a = args.items; _i < _a.length; _i++) {
            var item = _a[_i];
            var key = this.getKeyFromId(item.id);
            var dItem = this.defaultItems[key];
            if (this.getDefaultItems().indexOf(key) !== -1) {
                if (this.ensureDisabledStatus(key)) {
                    this.disableItems.push(item.text);
                }
                if (args.event && closest(args.event.target, menuClass.edit)) {
                    if (key !== 'save' && key !== 'cancel') {
                        this.hiddenItems.push(item.text);
                    }
                }
                else if (isNullOrUndefined(args.parentItem) && args.event
                    && !closest(args.event.target, dItem.target)) {
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
        }
        else {
            if (this.hiddenItems.length === this.parent.contextMenuItems.length) {
                this.updateItemStatus();
                args.cancel = true;
            }
        }
    };
    ContextMenu.prototype.ensureDisabledStatus = function (item) {
        var _this = this;
        var status = false;
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
                }
                else if (this.parent.ensureModuleInjected(Sort) && this.parent.sortSettings.columns.length > 0 && this.targetColumn) {
                    this.parent.sortSettings.columns.forEach(function (element) {
                        if (element.field === _this.targetColumn.field
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
    };
    ContextMenu.prototype.getContextMenu = function () {
        return this.element;
    };
    ContextMenu.prototype.destroy = function () {
        this.contextMenu.destroy();
        remove(this.element);
        this.removeEventListener();
    };
    ContextMenu.prototype.getModuleName = function () {
        return 'contextMenu';
    };
    ContextMenu.prototype.generateID = function (item) {
        return this.gridID + '_cmenu_' + item;
    };
    ContextMenu.prototype.getKeyFromId = function (id) {
        return id.replace(this.gridID + '_cmenu_', '');
    };
    ContextMenu.prototype.buildDefaultItems = function (item) {
        var menuItem;
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
    };
    ContextMenu.prototype.getDefaultItems = function () {
        return ['autoFitAll', 'autoFit',
            'group', 'ungroup', 'edit', 'delete', 'save', 'cancel', 'copy', 'export',
            'pdfExport', 'excelExport', 'csvExport', 'sortAscending', 'sortDescending',
            'firstPage', 'prevPage', 'lastPage', 'nextPage'];
    };
    ContextMenu.prototype.setLocaleKey = function () {
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
    };
    ContextMenu.prototype.getColumn = function (e) {
        var cell = closest(e.target, 'th.e-headercell');
        if (cell) {
            var uid = cell.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
            return this.parent.getColumnByUid(uid);
        }
        return null;
    };
    ContextMenu.prototype.selectRow = function (e) {
        var row = closest(e.target, 'tr.e-row');
        if (row) {
            this.parent.selectRow(this.parent.getDataRows().indexOf(row));
        }
    };
    return ContextMenu;
}());
export { ContextMenu };
