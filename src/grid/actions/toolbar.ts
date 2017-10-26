import { L10n, EventHandler, extend } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Toolbar as tool, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { IGrid, NotifyArgs } from '../base/interface';
import * as events from '../base/constant';
import { ServiceLocator } from '../services/service-locator';
import { EditSettingsModel } from '../base/grid-model';
import { templateCompiler, appendChildren } from '../base/util';
import { ToolbarItems } from '../base/enum';

/**
 * `Toolbar` module used to handle toolbar actions.
 * @hidden
 */
export class Toolbar {
    //internal variables
    private element: HTMLElement;
    private predefinedItems: { [key: string]: ItemModel } = {};
    public toolbar: tool;
    private searchElement: HTMLInputElement;
    private gridID: string;
    // module declarations
    private parent: IGrid;
    private serviceLocator: ServiceLocator;
    private l10n: L10n;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.gridID = parent.element.id;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }

    private render(): void {
        this.l10n = this.serviceLocator.getService<L10n>('localization');
        let preItems: ToolbarItems[] = ['add', 'edit', 'update', 'delete', 'cancel', 'print',
            'pdfexport', 'excelexport', 'wordexport', 'csvexport'];
        for (let item of preItems) {
            let localeName: string = item[0].toUpperCase() + item.slice(1);
            this.predefinedItems[item] = {
                id: this.gridID + '_' + item, prefixIcon: 'e-' + item,
                text: this.l10n.getConstant(localeName), tooltipText: this.l10n.getConstant(localeName)
            };
        }
        (this.predefinedItems as { search: Object }).search = {
            id: this.gridID + '_search', template: '<div class="e-search" role="search" >\
                         <span id="' + this.gridID + '_searchbutton" class="e-searchfind e-icons" tabindex="-1"\
                         role="button" aria-label= "search"></span>\
                         <input id="' + this.gridID + '_searchbar" aria-multiline= "false" type="search"\
                         placeholder=' + this.l10n.getConstant('Search') + '>\
                         </input></div>', tooltipText: this.l10n.getConstant('Search'), align: 'right'
        };
        (this.predefinedItems as { columnchooser: Object }).columnchooser = {
            id: this.gridID + '_' + 'columnchooser', cssClass: 'e-cc e-ccdiv e-cc-toolbar', suffixIcon: 'e-' + 'columnchooser-btn',
            text: 'Columns', tooltipText: 'columns', align: 'right',
        };
        this.createToolbar();
    }

    /**
     * Gets the toolbar element of grid.
     * @return {Element}
     * @hidden
     */
    public getToolbar(): Element {
        return this.toolbar.element;
    }

    /**
     * To destroy the toolbar widget of the grid.
     * @method destroy
     * @return {void}
     */
    public destroy(): void {
        if (!this.toolbar.isDestroyed) {
            this.unWireEvent();
            this.toolbar.destroy();
            this.removeEventListener();
            remove(this.element);
        }
    }

    private createToolbar(): void {
        let items: ItemModel[] = this.getItems();
        this.toolbar = new tool({
            items: items,
            clicked: this.toolbarClickHandler.bind(this),
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl
        });
        let viewStr: string = 'viewContainerRef';
        let registerTemp: string = 'registeredTemplate';
        if (this.parent[viewStr]) {
            this.toolbar[registerTemp] = {};
            this.toolbar[viewStr] = this.parent[viewStr];
        }
        this.element = createElement('div', { id: this.gridID + '_toolbarItems' });
        if (this.parent.toolbarTemplate) {
            if (typeof (this.parent.toolbarTemplate) === 'string') {
                this.toolbar.appendTo(this.parent.toolbarTemplate);
                this.element = this.toolbar.element;
            } else {
                appendChildren(this.element, templateCompiler(this.parent.toolbarTemplate)({}, this.parent, 'toolbarTemplate'));
            }
        } else {
            this.toolbar.appendTo(this.element);
        }
        this.parent.element.insertBefore(this.element, this.parent.getHeaderContent());
        this.searchElement = (<HTMLInputElement>this.element.querySelector('#' + this.gridID + '_searchbar'));
        this.wireEvent();
        this.refreshToolbarItems();
        if (this.parent.searchSettings) {
            this.updateSearchBox();
        }
    }

    private refreshToolbarItems(args?: { editSettings: EditSettingsModel, name: string }): void {
        let gObj: IGrid = this.parent;
        let enableItems: string[] = [];
        let disableItems: string[] = [];
        let edit: EditSettingsModel = gObj.editSettings;
        edit.allowAdding ? enableItems.push(this.gridID + '_add') : disableItems.push(this.gridID + '_add');
        edit.allowEditing ? enableItems.push(this.gridID + '_edit') : disableItems.push(this.gridID + '_edit');
        edit.allowDeleting ? enableItems.push(this.gridID + '_delete') : disableItems.push(this.gridID + '_delete');
        if (gObj.editSettings.mode === 'batch') {
            if (gObj.element.querySelectorAll('.e-updatedtd').length && (edit.allowAdding || edit.allowEditing)) {
                enableItems.push(this.gridID + '_update');
                enableItems.push(this.gridID + '_cancel');
            } else {
                disableItems.push(this.gridID + '_update');
                disableItems.push(this.gridID + '_cancel');
            }
        } else {
            if (gObj.isEdit && (edit.allowAdding || edit.allowEditing)) {
                enableItems = [this.gridID + '_update', this.gridID + '_cancel'];
                disableItems = [this.gridID + '_add', this.gridID + '_edit', this.gridID + '_delete'];
            } else {
                disableItems.push(this.gridID + '_update');
                disableItems.push(this.gridID + '_cancel');
            }
        }
        this.enableItems(enableItems, true);
        this.enableItems(disableItems, false);
    }

    private getItems(): ItemModel[] {
        let items: ItemModel[] = [];
        let toolbarItems: string | string[] | ItemModel[] = this.parent.toolbar || [];
        if (typeof (this.parent.toolbar) === 'string') {
            return [];
        }
        for (let item of toolbarItems) {
            typeof (item) === 'string' ? items.push(this.getItemObject(item)) : items.push(this.getItem(item));
        }
        return items;
    }

    private getItem(itemObject: ItemModel): ItemModel {
        let item: ItemModel = this.predefinedItems[itemObject.text];
        if (item) {
            extend(item, item, itemObject);
        } else {
            item = itemObject;
        }
        return item;
    }

    private getItemObject(itemName: string): ItemModel {
        return this.predefinedItems[itemName] || { text: itemName, id: this.gridID + '_' + itemName };
    }

    /**
     * Enable or disable toolbar items.
     * @param {string[]} items - Define the collection of itemID of toolbar items.
     * @param {boolean} isEnable - Define the items to be enable or disable.
     * @return {void}
     * @hidden
     */
    public enableItems(items: string[], isEnable: boolean): void {
        for (let item of items) {
            let element: HTMLElement = <HTMLElement>this.element.querySelector('#' + item);
            if (element) {
                this.toolbar.enableItems(element.parentElement, isEnable);
            }
        }
    }

    private toolbarClickHandler(args: ClickEventArgs): void {
        let gObj: IGrid = this.parent;
        let gID: string = this.gridID;
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
            // case gID + '_pdfexport':
            //     break;
            // case gID + '_wordexport':
            //     break;
            // case gID + '_excelexport':
            //     break;
            // case gID + '_csvexport':
            //     break;
            case gID + '_search':
                if ((<HTMLElement>args.originalEvent.target).id === gID + '_searchbutton') {
                    this.search();
                }
                break;
            case gID + '_columnchooser':
                let tarElement: Element = this.parent.element.querySelector('.e-ccdiv');
                let y: number = tarElement.getBoundingClientRect().top;
                let x: number = tarElement.getBoundingClientRect().left;
                let targetEle: Element = (<HTMLElement>args.originalEvent.target);
                y = tarElement.getBoundingClientRect().top + (<HTMLElement>tarElement).offsetTop;
                gObj.createColumnchooser(x, y, targetEle);
                break;
            default:
                gObj.trigger(events.toolbarClick, args);
        }
    }

    private modelChanged(e: { module: string, properties: EditSettingsModel }): void {
        if (e.module === 'edit') {
            this.refreshToolbarItems();
        }
    }

    protected onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName() || !this.parent.toolbar) {
            return;
        }
        if (this.element) {
            remove(this.element);
        }
        this.render();
    }

    private keyUpHandler(e: KeyboardEvent): void {
        if (e.keyCode === 13) {
            this.search();
        }
    }

    private search(): void {
        this.parent.search(this.searchElement.value);
    }

    private updateSearchBox(): void {
        if (this.searchElement) {
            this.searchElement.value = this.parent.searchSettings.key;
        }
    }

    private wireEvent(): void {
        if (this.searchElement) {
            EventHandler.add(this.searchElement, 'keyup', this.keyUpHandler, this);
        }
    }

    private unWireEvent(): void {
        if (this.searchElement) {
            EventHandler.remove(this.searchElement, 'keyup', this.keyUpHandler);
        }
    }

    protected addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on(events.initialEnd, this.render, this);
        this.parent.on(events.uiUpdate, this.onPropertyChanged, this);
        this.parent.on(events.inBoundModelChanged, this.updateSearchBox.bind(this));
        this.parent.on(events.modelChanged, this.refreshToolbarItems, this);
        this.parent.on(events.toolbarRefresh, this.refreshToolbarItems, this);
        this.parent.on(events.inBoundModelChanged, this.modelChanged, this);
        this.parent.on(events.dataBound, this.refreshToolbarItems, this);
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.uiUpdate, this.onPropertyChanged);
        this.parent.off(events.inBoundModelChanged, this.updateSearchBox);
        this.parent.off(events.modelChanged, this.refreshToolbarItems);
        this.parent.off(events.toolbarRefresh, this.refreshToolbarItems);
        this.parent.off(events.inBoundModelChanged, this.modelChanged);
        this.parent.off(events.dataBound, this.refreshToolbarItems);
    }
    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'toolbar';
    }
}