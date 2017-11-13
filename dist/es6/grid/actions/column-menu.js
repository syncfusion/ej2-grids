import { EventHandler, closest, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { ContextMenu as Menu } from '@syncfusion/ej2-navigations';
import { parentsUntil } from '../base/util';
import * as events from '../base/constant';
import { calculatePosition } from '@syncfusion/ej2-popups';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { Group } from '../actions/group';
import { Sort } from '../actions/sort';
import { Filter } from '../actions/filter';
import { Resize } from '../actions/resize';
var ColumnMenu = (function () {
    function ColumnMenu(parent, serviceLocator) {
        this.defaultItems = {};
        this.localeText = this.setLocaleKey();
        this.disableItems = [];
        this.isOpen = false;
        this.GROUP = 'e-icon-group';
        this.UNGROUP = 'e-icon-ungroup';
        this.ASCENDING = 'e-icon-ascending';
        this.DESCENDING = 'e-icon-descending';
        this.ROOT = 'e-columnmenu';
        this.FILTER = 'e-icon-filter';
        this.POP = 'e-filter-popup';
        this.WRAP = 'e-col-menu';
        this.CHOOSER = '_chooser_';
        this.parent = parent;
        this.gridID = parent.element.id;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }
    ColumnMenu.prototype.wireEvents = function () {
        var _this = this;
        this.getColumnMenuHandlers().forEach(function (ele) {
            EventHandler.add(ele, 'mousedown', _this.columnMenuHandlerDown, _this);
        });
    };
    ColumnMenu.prototype.unwireEvents = function () {
        var _this = this;
        this.getColumnMenuHandlers().forEach(function (ele) {
            EventHandler.remove(ele, 'mousedown', _this.columnMenuHandlerDown);
        });
    };
    ColumnMenu.prototype.destroy = function () {
        this.columnMenu.destroy();
        this.removeEventListener();
        this.unwireFilterEvents();
        this.unwireEvents();
        remove(this.element);
    };
    ColumnMenu.prototype.columnMenuHandlerClick = function (e) {
        if (e.target.classList.contains('e-columnmenu')) {
            if (!this.isOpen) {
                this.openColumnMenu(e);
            }
            else if (this.isOpen && this.headerCell !== this.getHeaderCell(e)) {
                this.columnMenu.close();
                this.openColumnMenu(e);
            }
            else {
                this.columnMenu.close();
            }
        }
    };
    ColumnMenu.prototype.openColumnMenu = function (e) {
        var pos = { top: 0, left: 0 };
        this.element.style.cssText = 'display:block;visibility:hidden';
        var elePos = this.element.getBoundingClientRect();
        this.element.style.cssText = 'display:none;visibility:visible';
        this.headerCell = this.getHeaderCell(e);
        if (Browser.isDevice) {
            pos.top = ((window.innerHeight / 2) - (elePos.height / 2));
            pos.left = ((window.innerWidth / 2) - (elePos.width / 2));
        }
        else {
            if (this.parent.enableRtl) {
                pos = calculatePosition(this.headerCell, 'left', 'bottom');
            }
            else {
                pos = calculatePosition(this.headerCell, 'right', 'bottom');
                pos.left -= elePos.width;
            }
        }
        this.columnMenu.open(pos.top, pos.left);
        e.preventDefault();
    };
    ColumnMenu.prototype.columnMenuHandlerDown = function (e) {
        this.isOpen = !(this.element.style.display === 'none' || this.element.style.display === '');
    };
    ColumnMenu.prototype.getColumnMenuHandlers = function () {
        return [].slice.call(this.parent.getHeaderTable().querySelectorAll('.' + this.ROOT));
    };
    ColumnMenu.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.headerRefreshed, this.wireEvents, this);
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.on(events.filterDialogCreated, this.filterPosition, this);
        this.parent.on(events.click, this.columnMenuHandlerClick, this);
    };
    ColumnMenu.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.headerRefreshed, this.unwireEvents);
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.filterDialogCreated, this.filterPosition);
        this.parent.off(events.click, this.columnMenuHandlerClick);
    };
    ColumnMenu.prototype.render = function () {
        this.l10n = this.serviceLocator.getService('localization');
        this.element = createElement('ul', { id: this.gridID + '_columnmenu', className: 'e-colmenu' });
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
    };
    ColumnMenu.prototype.wireFilterEvents = function () {
        if (!Browser.isDevice) {
            EventHandler.add(this.element, 'mouseover', this.appendFilter, this);
        }
    };
    ColumnMenu.prototype.unwireFilterEvents = function () {
        if (!Browser.isDevice) {
            EventHandler.remove(this.element, 'mouseover', this.appendFilter);
        }
    };
    ColumnMenu.prototype.beforeMenuItemRender = function (args) {
        if (this.isChooserItem(args.item)) {
            var field = this.getKeyFromId(args.item.id, this.CHOOSER);
            var column = this.parent.getColumnByField(field);
            var check = createCheckBox(false, {
                label: args.item.text,
                checked: column.visible
            });
            if (this.parent.enableRtl) {
                check.classList.add('e-rtl');
            }
            args.element.innerHTML = '';
            args.element.appendChild(check);
        }
        else if (this.getKeyFromId(args.item.id) === 'filter') {
            args.element.appendChild(createElement('span', { className: 'e-icons e-caret' }));
            args.element.className += 'e-filter-item e-menu-caret-icon';
        }
    };
    ColumnMenu.prototype.columnMenuBeforeClose = function (args) {
        if (!isNullOrUndefined(args.parentItem) &&
            this.getKeyFromId(args.parentItem.id) === 'columnChooser' &&
            closest(args.event.target, '.e-menu-parent')) {
            args.cancel = true;
        }
        else if (args.event && (closest(args.event.target, '.' + this.POP)
            || (parentsUntil(args.event.target, 'e-popup')))) {
            args.cancel = true;
        }
    };
    ColumnMenu.prototype.isChooserItem = function (item) {
        return this.getKeyFromId(item.id, this.CHOOSER).indexOf(this.gridID) === -1;
    };
    ColumnMenu.prototype.columnMenuBeforeOpen = function (args) {
        args.column = this.targetColumn = this.getColumn();
        this.parent.trigger(events.columnMenuOpen, args);
        for (var _i = 0, _a = args.items; _i < _a.length; _i++) {
            var item = _a[_i];
            var key = this.getKeyFromId(item.id);
            var dItem = this.defaultItems[key];
            if (this.getDefaultItems().indexOf(key) !== -1) {
                if (this.ensureDisabledStatus(key) && !dItem.hide) {
                    this.disableItems.push(item.text);
                }
            }
        }
        this.columnMenu.enableItems(this.disableItems, false);
    };
    ColumnMenu.prototype.ensureDisabledStatus = function (item) {
        var _this = this;
        var status = false;
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
                    this.parent.sortSettings.columns.forEach(function (ele) {
                        if (ele.field === _this.targetColumn.field
                            && ele.direction === item.replace('sort', '').toLocaleLowerCase()) {
                            status = true;
                        }
                    });
                }
                else if (!this.parent.ensureModuleInjected(Sort)) {
                    status = true;
                }
                break;
        }
        return status;
    };
    ColumnMenu.prototype.columnMenuItemClick = function (args) {
        var item = this.isChooserItem(args.item) ? 'columnChooser' : this.getKeyFromId(args.item.id);
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
                var key = this.getKeyFromId(args.item.id, this.CHOOSER);
                var checkbox = args.element.querySelector('.e-checkbox-wrapper .e-frame');
                if (checkbox && checkbox.classList.contains('e-check')) {
                    checkbox.classList.remove('e-check');
                    this.parent.hideColumn(key, 'field');
                }
                else if (checkbox) {
                    this.parent.showColumn(key, 'field');
                    checkbox.classList.add('e-check');
                }
                break;
            case 'filter':
                this.getFilter(args.element, args.item.id);
                break;
        }
        this.parent.trigger(events.columnMenuClick, args);
    };
    ColumnMenu.prototype.columnMenuOnClose = function (args) {
        var parent = 'parentObj';
        if (args.items.length > 0 && args.items[0][parent] instanceof Menu) {
            this.columnMenu.enableItems(this.disableItems);
            this.disableItems = [];
        }
    };
    ColumnMenu.prototype.getDefaultItems = function () {
        return ['autoFitAll', 'autoFit', 'sortAscending', 'sortDescending', 'group', 'ungroup', 'columnChooser', 'filter'];
    };
    ColumnMenu.prototype.getItems = function () {
        var items = [];
        var defultItems = this.parent.columnMenuItems ? this.parent.columnMenuItems : this.getDefault();
        for (var _i = 0, defultItems_1 = defultItems; _i < defultItems_1.length; _i++) {
            var item = defultItems_1[_i];
            if (typeof item === 'string') {
                if (item === 'columnChooser') {
                    var col = this.getDefaultItem(item);
                    col.items = this.createChooserItems();
                    items.push(col);
                }
                else {
                    items.push(this.getDefaultItem(item));
                }
            }
            else {
                items.push(item);
            }
        }
        return items;
    };
    ColumnMenu.prototype.getDefaultItem = function (item) {
        var menuItem = {};
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
    };
    ColumnMenu.prototype.getLocaleText = function (item) {
        return this.l10n.getConstant(this.localeText[item]);
    };
    ColumnMenu.prototype.generateID = function (item, append) {
        return this.gridID + '_colmenu_' + (append ? append + item : item);
    };
    ColumnMenu.prototype.getKeyFromId = function (id, append) {
        return id.replace(this.gridID + '_colmenu_' + (append ? append : ''), '');
    };
    ColumnMenu.prototype.getColumnMenu = function () {
        return this.element;
    };
    ColumnMenu.prototype.getModuleName = function () {
        return 'columnMenu';
    };
    ColumnMenu.prototype.setLocaleKey = function () {
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
    };
    ColumnMenu.prototype.getHeaderCell = function (e) {
        return closest(e.target, 'th.e-headercell');
    };
    ColumnMenu.prototype.getColumn = function () {
        if (this.headerCell) {
            var uid = this.headerCell.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
            return this.parent.getColumnByUid(uid);
        }
        return null;
    };
    ColumnMenu.prototype.createChooserItems = function () {
        var items = [];
        for (var _i = 0, _a = this.parent.getColumns(); _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.showInColumnChooser) {
                items.push({ id: this.generateID(col.field, this.CHOOSER), text: col.headerText ? col.headerText : col.field });
            }
        }
        return items;
    };
    ColumnMenu.prototype.appendFilter = function (e) {
        var filter = 'filter';
        var key = this.defaultItems[filter].id;
        if (closest(e.target, '#' + key) && !this.isFilterPopupOpen()) {
            this.getFilter(e.target, key);
        }
        else if (!closest(e.target, '#' + key) && this.isFilterPopupOpen()) {
            this.getFilter(e.target, key, true);
        }
    };
    ColumnMenu.prototype.getFilter = function (target, id, isClose) {
        var filterPopup = this.getFilterPoup();
        if (filterPopup) {
            filterPopup.style.display = isClose ? 'none' : 'block';
        }
        else {
            this.parent.notify(events.filterOpen, {
                col: this.targetColumn, target: target, isClose: isClose, id: id
            });
        }
    };
    ColumnMenu.prototype.setPosition = function (li, ul) {
        var gridPos = this.parent.element.getBoundingClientRect();
        var liPos = li.getBoundingClientRect();
        var left = liPos.left - gridPos.left;
        var top = liPos.top - gridPos.top;
        if (gridPos.height < top) {
            top = top - ul.offsetHeight + liPos.height;
        }
        else if (gridPos.height < top + ul.offsetHeight) {
            top = gridPos.height - ul.offsetHeight;
        }
        if (window.innerHeight < ul.offsetHeight + top + gridPos.top) {
            top = window.innerHeight - ul.offsetHeight - gridPos.top;
        }
        left += (this.parent.enableRtl ? -ul.offsetWidth : liPos.width);
        if (gridPos.width <= left + ul.offsetWidth) {
            left -= liPos.width + ul.offsetWidth;
        }
        else if (left < 0) {
            left += ul.offsetWidth + liPos.width;
        }
        ul.style.top = top + 'px';
        ul.style.left = left + 'px';
    };
    ColumnMenu.prototype.filterPosition = function (e) {
        var filterPopup = this.getFilterPoup();
        filterPopup.classList.add(this.WRAP);
        if (!Browser.isDevice) {
            var disp = filterPopup.style.display;
            filterPopup.style.display = 'block';
            filterPopup.classList.add(this.WRAP);
            var li = this.element.querySelector('.' + this.FILTER);
            if (li) {
                this.setPosition(li.parentElement, filterPopup);
                filterPopup.style.display = disp;
            }
        }
    };
    ColumnMenu.prototype.getDefault = function () {
        var items = [];
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
    };
    ColumnMenu.prototype.isFilterPopupOpen = function () {
        var filterPopup = this.getFilterPoup();
        return filterPopup && filterPopup.style.display !== 'none';
    };
    ColumnMenu.prototype.getFilterPoup = function () {
        return document.querySelector('.' + this.POP);
    };
    return ColumnMenu;
}());
export { ColumnMenu };
