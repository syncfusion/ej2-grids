var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { extend, createElement, EventHandler, remove } from '@syncfusion/ej2-base';
import { parentsUntil } from '../base/util';
import { ContextMenu } from '@syncfusion/ej2-navigations';
import { CheckBoxFilter } from '../actions/checkbox-filter';
/**
 * @hidden
 * `ExcelFilter` module is used to handle filtering action.
 */
var ExcelFilter = /** @class */ (function (_super) {
    __extends(ExcelFilter, _super);
    /**
     * Constructor for excel filtering module
     * @hidden
     */
    function ExcelFilter(parent, filterSettings, serviceLocator) {
        var _this = _super.call(this, parent, filterSettings, serviceLocator) || this;
        _this.localeConstants = {
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
        extend(_this.defaultConstants, _this.localeConstants);
        _this.isExcel = true;
        _this.initLocale(_this.defaultConstants);
        return _this;
    }
    ExcelFilter.prototype.getCMenuDS = function (type, operator) {
        var options = {
            number: ['Equal', 'NotEqual', '', 'LessThan', 'LessThanOrEqual', 'GreaterThan',
                'GreaterThanOrEqual', 'Between', '', 'CustomFilter'],
            string: ['Equal', 'NotEqual', '', 'StartsWith', 'EndsWith', '', 'Contains', '', 'CustomFilter'],
        };
        options.date = options.number;
        options.datetime = options.number;
        var model = [];
        for (var i = 0; i < options[type].length; i++) {
            if (options[type][i].length) {
                if (operator) {
                    model.push({
                        text: this.getLocalizedLabel(options[type][i]) + '...',
                        iconCss: 'e-icons e-icon-check ' + (operator === options[type][i] ? '' : 'e-emptyicon')
                    });
                }
                else {
                    model.push({
                        text: this.getLocalizedLabel(options[type][i]) + '...'
                    });
                }
            }
            else {
                model.push({ separator: true });
            }
        }
        return model;
    };
    /**
     * To destroy the filter bar.
     * @return {void}
     * @hidden
     */
    ExcelFilter.prototype.destroy = function () {
        // this.removeEventListener();
        _super.prototype.destroy.call(this);
        remove(this.cmenu);
    };
    ExcelFilter.prototype.createMenu = function (type, isFiltered) {
        var options = { string: 'TextFilter', date: 'DateFilter', datetime: 'DateFilter', number: 'NumberFilter' };
        this.menu = createElement('div', { className: 'e-contextmenu-wrapper' });
        var ul = createElement('ul');
        var icon = isFiltered ? 'e-icon-filter e-filtered' : 'e-icon-filter';
        ul.appendChild(this.createMenuElem(this.getLocalizedLabel('ClearFilter'), isFiltered ? '' : 'e-disabled', icon));
        if (type !== 'boolean') {
            ul.appendChild(this.createMenuElem(this.getLocalizedLabel(options[type]), 'e-submenu', isFiltered ? 'e-icon-check' : icon + ' e-emptyicon', true));
        }
        this.menu.appendChild(ul);
    };
    ExcelFilter.prototype.createMenuElem = function (val, className, iconName, isSubMenu) {
        var li = createElement('li', { className: className + ' e-menu-item' });
        li.innerHTML = val;
        li.insertBefore(createElement('span', { className: 'e-menu-icon e-icons ' + iconName }), li.firstChild);
        if (isSubMenu) {
            li.appendChild(createElement('span', { className: 'e-icons e-caret' }));
        }
        return li;
    };
    ExcelFilter.prototype.wireExEvents = function () {
        EventHandler.add(this.dlg, 'mouseover', this.hoverHandler, this);
        EventHandler.add(this.dlg, 'click', this.clickExHandler, this);
    };
    ExcelFilter.prototype.unwireEvents = function () {
        EventHandler.remove(this.dlg, 'mouseover', this.hoverHandler);
        EventHandler.remove(this.dlg, 'click', this.clickExHandler);
    };
    ExcelFilter.prototype.clickExHandler = function (e) {
        var menuItem = parentsUntil(e.target, 'e-menu-item');
        if (menuItem && this.getLocalizedLabel('ClearFilter') === menuItem.innerText) {
            //for clear filter
        }
    };
    ExcelFilter.prototype.destroyCMenu = function () {
        if (this.menuObj && !this.menuObj.isDestroyed) {
            this.menuObj.destroy();
        }
    };
    ExcelFilter.prototype.hoverHandler = function (e) {
        var target = e.target.querySelector('.e-contextmenu');
        var li = parentsUntil(e.target, 'e-menu-item');
        var focused = this.menu.querySelector('.e-focused');
        var isSubMenu;
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
            var submenu = this.menu.querySelector('.e-submenu');
            submenu.classList.remove('e-selected');
            this.isCMenuOpen = false;
            this.destroyCMenu();
        }
        if (!this.isCMenuOpen && isSubMenu) {
            li.classList.add('e-selected');
            this.isCMenuOpen = true;
            var menuOptions = {
                items: this.getCMenuDS(this.options.type),
                select: this.selectHandler.bind(this),
                onClose: this.destroyCMenu.bind(this),
            };
            this.parent.element.appendChild(this.cmenu);
            this.menuObj = new ContextMenu(menuOptions, this.cmenu);
            var client = this.menu.querySelector('.e-submenu').getBoundingClientRect();
            this.menuObj.open(client.top, this.dlg.getBoundingClientRect().right + 1);
        }
    };
    ExcelFilter.prototype.openDialog = function (options) {
        this.updateModel(options);
        this.getAndSetChkElem(options);
        this.showDialog(options);
        this.dialogObj.height = '345px';
        this.dialogObj.dataBind();
        this.createMenu(options.type, false); //isfilted to update icon for clear filter and enable/disable
        this.dlg.insertBefore(this.menu, this.dlg.firstChild);
        this.dlg.classList.add('e-excelfilter');
        this.cmenu = createElement('ul', { className: 'e-excel-menu' });
        this.wireExEvents();
    };
    ExcelFilter.prototype.closeDialog = function () {
        _super.prototype.closeDialog.call(this);
        this.unwireEvents();
    };
    ExcelFilter.prototype.selectHandler = function (e) {
        //context menu click
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    ExcelFilter.prototype.getModuleName = function () {
        return 'excelFilter';
    };
    return ExcelFilter;
}(CheckBoxFilter));
export { ExcelFilter };
