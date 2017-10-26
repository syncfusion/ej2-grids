import { EventHandler, extend } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Toolbar as tool } from '@syncfusion/ej2-navigations';
import * as events from '../base/constant';
import { templateCompiler, appendChildren } from '../base/util';
var Toolbar = (function () {
    function Toolbar(parent, serviceLocator) {
        this.predefinedItems = {};
        this.parent = parent;
        this.gridID = parent.element.id;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }
    Toolbar.prototype.render = function () {
        this.l10n = this.serviceLocator.getService('localization');
        var preItems = ['add', 'edit', 'update', 'delete', 'cancel', 'print',
            'pdfexport', 'excelexport', 'wordexport', 'csvexport'];
        for (var _i = 0, preItems_1 = preItems; _i < preItems_1.length; _i++) {
            var item = preItems_1[_i];
            var localeName = item[0].toUpperCase() + item.slice(1);
            this.predefinedItems[item] = {
                id: this.gridID + '_' + item, prefixIcon: 'e-' + item,
                text: this.l10n.getConstant(localeName), tooltipText: this.l10n.getConstant(localeName)
            };
        }
        this.predefinedItems.search = {
            id: this.gridID + '_search', template: '<div class="e-search" role="search" >\
                         <span id="' + this.gridID + '_searchbutton" class="e-searchfind e-icons" tabindex="-1"\
                         role="button" aria-label= "search"></span>\
                         <input id="' + this.gridID + '_searchbar" aria-multiline= "false" type="search"\
                         placeholder=' + this.l10n.getConstant('Search') + '>\
                         </input></div>', tooltipText: this.l10n.getConstant('Search'), align: 'right'
        };
        this.predefinedItems.columnchooser = {
            id: this.gridID + '_' + 'columnchooser', cssClass: 'e-cc e-ccdiv e-cc-toolbar', suffixIcon: 'e-' + 'columnchooser-btn',
            text: 'Columns', tooltipText: 'columns', align: 'right',
        };
        this.createToolbar();
    };
    Toolbar.prototype.getToolbar = function () {
        return this.toolbar.element;
    };
    Toolbar.prototype.destroy = function () {
        if (!this.toolbar.isDestroyed) {
            this.unWireEvent();
            this.toolbar.destroy();
            this.removeEventListener();
            remove(this.element);
        }
    };
    Toolbar.prototype.createToolbar = function () {
        var items = this.getItems();
        this.toolbar = new tool({
            items: items,
            clicked: this.toolbarClickHandler.bind(this),
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl
        });
        var viewStr = 'viewContainerRef';
        var registerTemp = 'registeredTemplate';
        if (this.parent[viewStr]) {
            this.toolbar[registerTemp] = {};
            this.toolbar[viewStr] = this.parent[viewStr];
        }
        this.element = createElement('div', { id: this.gridID + '_toolbarItems' });
        if (this.parent.toolbarTemplate) {
            if (typeof (this.parent.toolbarTemplate) === 'string') {
                this.toolbar.appendTo(this.parent.toolbarTemplate);
                this.element = this.toolbar.element;
            }
            else {
                appendChildren(this.element, templateCompiler(this.parent.toolbarTemplate)({}, this.parent, 'toolbarTemplate'));
            }
        }
        else {
            this.toolbar.appendTo(this.element);
        }
        this.parent.element.insertBefore(this.element, this.parent.getHeaderContent());
        this.searchElement = this.element.querySelector('#' + this.gridID + '_searchbar');
        this.wireEvent();
        this.refreshToolbarItems();
        if (this.parent.searchSettings) {
            this.updateSearchBox();
        }
    };
    Toolbar.prototype.refreshToolbarItems = function (args) {
        var gObj = this.parent;
        var enableItems = [];
        var disableItems = [];
        var edit = gObj.editSettings;
        edit.allowAdding ? enableItems.push(this.gridID + '_add') : disableItems.push(this.gridID + '_add');
        edit.allowEditing ? enableItems.push(this.gridID + '_edit') : disableItems.push(this.gridID + '_edit');
        edit.allowDeleting ? enableItems.push(this.gridID + '_delete') : disableItems.push(this.gridID + '_delete');
        if (gObj.editSettings.mode === 'batch') {
            if (gObj.element.querySelectorAll('.e-updatedtd').length && (edit.allowAdding || edit.allowEditing)) {
                enableItems.push(this.gridID + '_update');
                enableItems.push(this.gridID + '_cancel');
            }
            else {
                disableItems.push(this.gridID + '_update');
                disableItems.push(this.gridID + '_cancel');
            }
        }
        else {
            if (gObj.isEdit && (edit.allowAdding || edit.allowEditing)) {
                enableItems = [this.gridID + '_update', this.gridID + '_cancel'];
                disableItems = [this.gridID + '_add', this.gridID + '_edit', this.gridID + '_delete'];
            }
            else {
                disableItems.push(this.gridID + '_update');
                disableItems.push(this.gridID + '_cancel');
            }
        }
        this.enableItems(enableItems, true);
        this.enableItems(disableItems, false);
    };
    Toolbar.prototype.getItems = function () {
        var items = [];
        var toolbarItems = this.parent.toolbar || [];
        if (typeof (this.parent.toolbar) === 'string') {
            return [];
        }
        for (var _i = 0, toolbarItems_1 = toolbarItems; _i < toolbarItems_1.length; _i++) {
            var item = toolbarItems_1[_i];
            typeof (item) === 'string' ? items.push(this.getItemObject(item)) : items.push(this.getItem(item));
        }
        return items;
    };
    Toolbar.prototype.getItem = function (itemObject) {
        var item = this.predefinedItems[itemObject.text];
        if (item) {
            extend(item, item, itemObject);
        }
        else {
            item = itemObject;
        }
        return item;
    };
    Toolbar.prototype.getItemObject = function (itemName) {
        return this.predefinedItems[itemName] || { text: itemName, id: this.gridID + '_' + itemName };
    };
    Toolbar.prototype.enableItems = function (items, isEnable) {
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var element = this.element.querySelector('#' + item);
            if (element) {
                this.toolbar.enableItems(element.parentElement, isEnable);
            }
        }
    };
    Toolbar.prototype.toolbarClickHandler = function (args) {
        var gObj = this.parent;
        var gID = this.gridID;
        if (!args.item) {
            gObj.trigger(events.toolbarClick, args);
            return;
        }
        switch (args.item.id) {
            case gID + '_print':
                gObj.print();
                break;
            case gID + '_edit':
                gObj.startEdit();
                break;
            case gID + '_update':
                gObj.endEdit();
                break;
            case gID + '_cancel':
                gObj.closeEdit();
                break;
            case gID + '_add':
                gObj.addRecord();
                break;
            case gID + '_delete':
                gObj.deleteRecord();
                break;
            case gID + '_search':
                if (args.originalEvent.target.id === gID + '_searchbutton') {
                    this.search();
                }
                break;
            case gID + '_columnchooser':
                var tarElement = this.parent.element.querySelector('.e-ccdiv');
                var y = tarElement.getBoundingClientRect().top;
                var x = tarElement.getBoundingClientRect().left;
                var targetEle = args.originalEvent.target;
                y = tarElement.getBoundingClientRect().top + tarElement.offsetTop;
                gObj.createColumnchooser(x, y, targetEle);
                break;
            default:
                gObj.trigger(events.toolbarClick, args);
        }
    };
    Toolbar.prototype.modelChanged = function (e) {
        if (e.module === 'edit') {
            this.refreshToolbarItems();
        }
    };
    Toolbar.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName() || !this.parent.toolbar) {
            return;
        }
        if (this.element) {
            remove(this.element);
        }
        this.render();
    };
    Toolbar.prototype.keyUpHandler = function (e) {
        if (e.keyCode === 13) {
            this.search();
        }
    };
    Toolbar.prototype.search = function () {
        this.parent.search(this.searchElement.value);
    };
    Toolbar.prototype.updateSearchBox = function () {
        if (this.searchElement) {
            this.searchElement.value = this.parent.searchSettings.key;
        }
    };
    Toolbar.prototype.wireEvent = function () {
        if (this.searchElement) {
            EventHandler.add(this.searchElement, 'keyup', this.keyUpHandler, this);
        }
    };
    Toolbar.prototype.unWireEvent = function () {
        if (this.searchElement) {
            EventHandler.remove(this.searchElement, 'keyup', this.keyUpHandler);
        }
    };
    Toolbar.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.on(events.uiUpdate, this.onPropertyChanged, this);
        this.parent.on(events.inBoundModelChanged, this.updateSearchBox.bind(this));
        this.parent.on(events.modelChanged, this.refreshToolbarItems, this);
        this.parent.on(events.toolbarRefresh, this.refreshToolbarItems, this);
        this.parent.on(events.inBoundModelChanged, this.modelChanged, this);
        this.parent.on(events.dataBound, this.refreshToolbarItems, this);
    };
    Toolbar.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.uiUpdate, this.onPropertyChanged);
        this.parent.off(events.inBoundModelChanged, this.updateSearchBox);
        this.parent.off(events.modelChanged, this.refreshToolbarItems);
        this.parent.off(events.toolbarRefresh, this.refreshToolbarItems);
        this.parent.off(events.inBoundModelChanged, this.modelChanged);
        this.parent.off(events.dataBound, this.refreshToolbarItems);
    };
    Toolbar.prototype.getModuleName = function () {
        return 'toolbar';
    };
    return Toolbar;
}());
export { Toolbar };
