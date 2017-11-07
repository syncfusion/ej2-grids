import { extend, createElement, EventHandler, remove } from '@syncfusion/ej2-base';
import { FilterSettings } from '../base/grid';
import { parentsUntil } from '../base/util';
import { IGrid, IFilterArgs } from '../base/interface';
import { ContextMenu, MenuItemModel, ContextMenuModel, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { ServiceLocator } from '../services/service-locator';
import { CheckBoxFilter } from '../actions/checkbox-filter';

/**
 * @hidden
 * `ExcelFilter` module is used to handle filtering action.
 */
export class ExcelFilter extends CheckBoxFilter {
    //Internal variables     
    private menu: Element;
    private cmenu: HTMLUListElement;
    protected menuObj: ContextMenu;
    private isCMenuOpen: boolean;
    private localeConstants: Object = {
        ClearFilter: 'Clear Filter',
        NumberFilter: 'Number Filters',
        TextFilter: 'Text Filters',
        DateFilter: 'Date Filters',
        MatchCase: 'Match Case',
        Equal: 'Equal',
        NotEqual: 'Not Equal',
        LessThan: 'Less Than',
        LessThanOrEqual: 'Less Than Or Equal',
        GreaterThan: 'Greater Than',
        GreaterThanOrEqual: 'Greater Than Or Equal',
        Between: 'Between',
        CustomFilter: 'Custom Filter',
        StartsWith: 'Starts With',
        EndsWith: 'Ends With',
        Contains: 'Contains',
        OK: 'OK',
        Cancel: 'Cancel'
    };

    /**
     * Constructor for excel filtering module
     * @hidden
     */
    constructor(parent?: IGrid, filterSettings?: FilterSettings, serviceLocator?: ServiceLocator) {
        super(parent, filterSettings, serviceLocator);
        extend(this.defaultConstants, this.localeConstants);
        this.isExcel = true;
        this.initLocale(this.defaultConstants);
    }

    private getCMenuDS(type: string, operator?: string): MenuItemModel[] {
        let options: { number?: string[], date?: string[], string?: string[], datetime?: string[] } = {
            number: ['Equal', 'NotEqual', '', 'LessThan', 'LessThanOrEqual', 'GreaterThan',
                'GreaterThanOrEqual', 'Between', '', 'CustomFilter'],
            string: ['Equal', 'NotEqual', '', 'StartsWith', 'EndsWith', '', 'Contains', '', 'CustomFilter'],
        };
        options.date = options.number;
        options.datetime = options.number;
        let model: MenuItemModel[] = [];
        for (let i: number = 0; i < options[type].length; i++) {
            if (options[type][i].length) {
                if (operator) {
                    model.push({
                        text: this.getLocalizedLabel(options[type][i]) + '...',
                        iconCss: 'e-icons e-icon-check ' + (operator === options[type][i] ? '' : 'e-emptyicon')
                    });
                } else {
                    model.push({
                        text: this.getLocalizedLabel(options[type][i]) + '...'
                    });
                }
            } else {
                model.push({ separator: true });
            }
        }
        return model;
    }

    /** 
     * To destroy the filter bar. 
     * @return {void} 
     * @hidden
     */
    public destroy(): void {
        // this.removeEventListener();
        super.destroy();
        remove(this.cmenu);
        this.unwireEvents();
    }

    private createMenu(type: string, isFiltered: boolean): void {
        let options: Object = { string: 'TextFilter', date: 'DateFilter', datetime: 'DateFilter', number: 'NumberFilter' };
        this.menu = createElement('div', { className: 'e-contextmenu-wrapper' });
        let ul: Element = createElement('ul');
        let icon: string = isFiltered ? 'e-icon-filter e-filtered' : 'e-icon-filter';
        ul.appendChild(this.createMenuElem(this.getLocalizedLabel('ClearFilter'), isFiltered ? '' : 'e-disabled', icon));
        if (type !== 'boolean') {
            ul.appendChild(this.createMenuElem(
                this.getLocalizedLabel(options[type]), 'e-submenu',
                isFiltered ? 'e-icon-check' : icon + ' e-emptyicon', true));
        }
        this.menu.appendChild(ul);
    }

    private createMenuElem(val: string, className?: string, iconName?: string, isSubMenu?: boolean): Element {
        let li: Element = createElement('li', { className: className + ' e-menu-item' });
        li.innerHTML = val;
        li.insertBefore(createElement('span', { className: 'e-menu-icon e-icons ' + iconName }), li.firstChild);
        if (isSubMenu) {
            li.appendChild(createElement('span', { className: 'e-icons e-caret' }));
        }
        return li;
    }

    private wireExEvents(): void {
        EventHandler.add(this.dlg, 'mouseover', this.hoverHandler, this);
        EventHandler.add(this.dlg, 'click', this.clickExHandler, this);
    }

    private unwireEvents(): void {
        EventHandler.remove(this.dlg, 'mouseover', this.hoverHandler);
        EventHandler.remove(this.dlg, 'click', this.clickExHandler);
    }

    private clickExHandler(e: MouseEvent): void {
        let menuItem: HTMLElement = parentsUntil(e.target as Element, 'e-menu-item') as HTMLElement;
        if (menuItem && this.getLocalizedLabel('ClearFilter') === menuItem.innerText) {
            //for clear filter
        }
    }

    private destroyCMenu(): void {
        if (this.menuObj && !this.menuObj.isDestroyed) {
            this.menuObj.destroy();
        }
    }

    private hoverHandler(e: MouseEvent): void {
        let target: Element = (e.target as Element).querySelector('.e-contextmenu');
        let li: Element = parentsUntil(e.target as Element, 'e-menu-item');
        let focused: Element = this.menu.querySelector('.e-focused');
        let isSubMenu: boolean;
        if (focused) {
            focused.classList.remove('e-focused');
        }
        if (li) {
            li.classList.add('e-focused');
            isSubMenu = li.classList.contains('e-submenu');
        }
        if (target) {
            return;
        }
        if (!isSubMenu) {
            let submenu: Element = this.menu.querySelector('.e-submenu');
            submenu.classList.remove('e-selected');
            this.isCMenuOpen = false;
            this.destroyCMenu();
        }
        if (!this.isCMenuOpen && isSubMenu) {
            li.classList.add('e-selected');
            this.isCMenuOpen = true;
            let menuOptions: ContextMenuModel = {
                items: this.getCMenuDS(this.options.type),
                select: this.selectHandler.bind(this),
                onClose: this.destroyCMenu.bind(this),
            };
            this.parent.element.appendChild(this.cmenu);
            this.menuObj = new ContextMenu(menuOptions, this.cmenu);
            let client: ClientRect = this.menu.querySelector('.e-submenu').getBoundingClientRect();
            this.menuObj.open(client.top, this.dlg.getBoundingClientRect().right + 1);
        }

    }

    public openDialog(options: IFilterArgs): void {
        this.updateModel(options);
        this.getAndSetChkElem(options);

        this.showDialog(options);
        this.dialogObj.height = '345px';
        this.dialogObj.dataBind();
        this.createMenu(options.type, false); //isfilted to update icon for clear filter and enable/disable
        this.dlg.insertBefore(this.menu, this.dlg.firstChild);
        this.dlg.classList.add('e-excelfilter');
        this.cmenu = createElement('ul', { className: 'e-excel-menu' }) as HTMLUListElement;
        this.wireExEvents();
    }

    public closeDialog(): void {
        super.closeDialog();
    }

    private selectHandler(e: MenuEventArgs): void {
        //context menu click
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'excelFilter';
    }

}
