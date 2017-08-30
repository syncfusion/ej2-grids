import { L10n, EventHandler } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Toolbar as tool, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { IGrid, NotifyArgs } from '../base/interface';
import * as events from '../base/constant';
import { ServiceLocator } from '../services/service-locator';

/**
 * `Toolbar` module used to handle toolbar actions.
 * @hidden
 */
export class Toolbar {
    //internal variables
    private element: HTMLElement;
    private predefinedItems: { [key: string]: ItemModel } = {};
    private toolbar: tool;
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
        let preItems: string[] = ['add', 'edit', 'update', 'delete', 'cancel', 'print', 'pdfexport', 'excelexport', 'wordexport'];
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
        this.element = createElement('div', { id: this.gridID + '_toolbarItems' });
        this.parent.element.insertBefore(this.element, this.parent.getHeaderContent());
        if (!Array.isArray(this.parent.toolbar)) {
            this.element.appendChild(document.querySelector(this.parent.toolbar));
        }
        this.toolbar.appendTo(this.element);
        this.searchElement = (<HTMLInputElement>this.element.querySelector('#' + this.gridID + '_searchbar'));
        this.wireEvent();
        this.enableItems([this.gridID + '_update', this.gridID + '_cancel', this.gridID + '_delete', this.gridID + '_edit'], false);
        if (this.parent.searchSettings) {
            this.updateSearchBox();
        }
    }

    private getItems(): ItemModel[] {
        let items: ItemModel[] = [];
        if (typeof (this.parent.toolbar) === 'string') {
            return [];
        }
        for (let item of this.parent.toolbar) {
            typeof (item) === 'string' ? items.push(this.getItemObject(item)) : items.push(item);
        }
        return items;
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
                this.toolbar.enableItems(element, isEnable);
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
            // case gID + '_edit':
            //     break;
            // case gID + '_update':
            //     break;
            // case gID + '_cancel':
            //     break;
            // case gID + '_add':
            //     break;
            // case gID + '_delete':
            //     break;
            // case gID + '_pdfexport':
            //     break;
            // case gID + '_wordexport':
            //     break;
            // case gID + '_excelexport':
            //     break;
            case gID + '_search':
                if ((<HTMLElement>args.originalEvent.target).id === gID + '_searchbutton') {
                    this.search();
                }
                break;
            default:
                gObj.trigger(events.toolbarClick, args);
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

    private selectAction(args: { name: string }): void {
        let gID: string = this.gridID;
        switch (args.name) {
            case 'rowSelected':
                this.enableItems([gID + '_edit', gID + '_delete', gID + '_add'], true);
                this.enableItems([gID + '_update', gID + '_cancel'], false);
                break;
            case 'rowDeselected':
                if (!this.parent.getSelectedRecords().length) {
                    this.enableItems([gID + '_add'], true);
                    this.enableItems([gID + '_edit', gID + '_delete', gID + '_update', gID + '_cancel'], false);
                }
                break;
            case 'cellDeselected':
                this.enableItems([gID + '_add'], true);
                this.enableItems([gID + '_delete', gID + '_cancel', gID + '_update', gID + '_edit'], false);
                break;
            case 'cellSelected':
                this.enableItems([gID + '_edit', gID + '_add'], true);
                this.enableItems([gID + '_delete', gID + '_cancel', gID + '_update'], false);
                break;
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
        this.parent.addEventListener(events.rowSelected, this.selectAction.bind(this));
        this.parent.addEventListener(events.rowDeselected, this.selectAction.bind(this));
        this.parent.addEventListener(events.cellSelected, this.selectAction.bind(this));
        this.parent.addEventListener(events.cellDeselected, this.selectAction.bind(this));
    }

    protected removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.initialEnd, this.render);
        this.parent.off(events.uiUpdate, this.onPropertyChanged);
        this.parent.off(events.inBoundModelChanged, this.updateSearchBox);
        this.parent.removeEventListener(events.rowSelected, this.selectAction);
        this.parent.removeEventListener(events.rowDeselected, this.selectAction);
        this.parent.removeEventListener(events.cellSelected, this.selectAction);
        this.parent.removeEventListener(events.cellDeselected, this.selectAction);
    }
    /**
     * For internal use only - Get the module name.
     */
    private getModuleName(): string {
        return 'toolbar';
    }
}