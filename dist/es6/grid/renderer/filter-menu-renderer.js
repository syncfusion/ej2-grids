import { isNullOrUndefined, getValue, remove } from '@syncfusion/ej2-base';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { FlMenuOptrUI } from './filter-menu-operator';
import { StringFilterUI } from './string-filter-ui';
import { NumberFilterUI } from './number-filter-ui';
import { BooleanFilterUI } from './boolean-filter-ui';
import { DateFilterUI } from './date-filter-ui';
import { getFilterMenuPostion, parentsUntil } from '../base/util';
import * as events from '../base/constant';
var FilterMenuRenderer = (function () {
    function FilterMenuRenderer(parent, filterSettings, serviceLocator, customFltrOperators, fltrObj) {
        this.colTypes = {
            'string': StringFilterUI, 'number': NumberFilterUI, 'date': DateFilterUI, 'boolean': BooleanFilterUI, 'datetime': DateFilterUI
        };
        this.parent = parent;
        this.filterSettings = filterSettings;
        this.serviceLocator = serviceLocator;
        this.customFilterOperators = customFltrOperators;
        this.filterObj = fltrObj;
        this.flMuiObj = new FlMenuOptrUI(this.parent, this.customFilterOperators, this.serviceLocator);
        this.l10n = this.serviceLocator.getService('localization');
    }
    FilterMenuRenderer.prototype.openDialog = function (args) {
        this.col = this.parent.getColumnByField(args.field);
        if (isNullOrUndefined(this.col.filter) || (isNullOrUndefined(this.col.filter.type) || this.col.filter.type === 'menu')) {
            this.renderDlgContent(args.target, this.col);
        }
    };
    FilterMenuRenderer.prototype.closeDialog = function () {
        var elem = document.getElementById(this.dlgObj.element.id);
        if (this.dlgObj && !this.dlgObj.isDestroyed && elem) {
            this.parent.notify(events.filterMenuClose, { field: this.col.field });
            this.dlgObj.destroy();
            remove(elem);
        }
    };
    FilterMenuRenderer.prototype.renderDlgContent = function (target, column) {
        var mainDiv = createElement('div', { className: 'e-flmenu-maindiv', id: column.uid + '-flmenu' });
        this.dlgDiv = createElement('div', { className: 'e-flmenu', id: column.uid + '-flmdlg' });
        this.parent.element.appendChild(this.dlgDiv);
        this.dlgObj = new Dialog({
            showCloseIcon: false,
            closeOnEscape: false,
            locale: this.parent.locale,
            visible: false,
            enableRtl: this.parent.enableRtl,
            created: this.dialogCreated.bind(this, target, column),
            position: this.parent.element.classList.contains('e-device') ? { X: 'center', Y: 'center' } : { X: '', Y: '' },
            target: this.parent.element.classList.contains('e-device') ? document.body : this.parent.element,
            buttons: [{
                    click: this.filterBtnClick.bind(this, column),
                    buttonModel: {
                        content: this.l10n.getConstant('FilterButton'), isPrimary: true, cssClass: 'e-flmenu-okbtn'
                    }
                },
                {
                    click: this.clearBtnClick.bind(this, column),
                    buttonModel: { content: this.l10n.getConstant('ClearButton'), cssClass: 'e-flmenu-cancelbtn' }
                }],
            content: mainDiv,
            width: (!isNullOrUndefined(parentsUntil(target, 'e-bigger'))) || this.parent.element.classList.contains('e-device') ? 260 : 250,
            animationSettings: { effect: 'None' },
            cssClass: 'e-filter-popup'
        });
        this.dlgObj.appendTo(this.dlgDiv);
    };
    FilterMenuRenderer.prototype.dialogCreated = function (target, column) {
        if (!Browser.isDevice) {
            getFilterMenuPostion(target, this.dlgObj);
        }
        this.renderFilterUI(target, column);
        this.parent.notify(events.filterDialogCreated, {});
        this.dlgObj.element.style.maxHeight = '350px';
        this.dlgObj.show();
        this.writeMethod(column, this.dlgObj.element.querySelector('#' + column.uid + '-flmenu'));
    };
    FilterMenuRenderer.prototype.renderFilterUI = function (target, col) {
        var dlgConetntEle = this.dlgObj.element.querySelector('.e-flmenu-maindiv');
        this.renderOperatorUI(dlgConetntEle, target, col);
        this.renderFlValueUI(dlgConetntEle, target, col);
    };
    FilterMenuRenderer.prototype.renderOperatorUI = function (dlgConetntEle, target, column) {
        this.flMuiObj.renderOperatorUI(dlgConetntEle, target, column, this.dlgObj);
    };
    FilterMenuRenderer.prototype.renderFlValueUI = function (dlgConetntEle, target, column) {
        var valueDiv = createElement('div', { className: 'e-flmenu-valuediv' });
        dlgConetntEle.appendChild(valueDiv);
        var args = { target: valueDiv, column: column, getOptrInstance: this.flMuiObj, dialogObj: this.dlgObj };
        var instanceofFilterUI = new this.colTypes[column.type](this.parent, this.serviceLocator, this.parent.filterSettings);
        if (!isNullOrUndefined(column.filter) && !isNullOrUndefined(column.filter.ui)
            && !isNullOrUndefined(column.filter.ui.create)) {
            var temp = column.filter.ui.create;
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
            }
            column.filter.ui.create({
                column: column, target: valueDiv,
                getOptrInstance: this.flMuiObj, dialogObj: this.dlgObj
            });
        }
        else {
            instanceofFilterUI.create({
                column: column, target: valueDiv,
                getOptrInstance: this.flMuiObj, localizeText: this.l10n, dialogObj: this.dlgObj
            });
        }
    };
    FilterMenuRenderer.prototype.writeMethod = function (col, dlgContentEle) {
        var flValue;
        var target = dlgContentEle.querySelector('.e-flmenu-valinput');
        var instanceofFilterUI = new this.colTypes[col.type](this.parent, this.serviceLocator, this.parent.filterSettings);
        var columns = this.filterSettings.columns;
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var column = columns_1[_i];
            if (col.field === column.field) {
                flValue = column.value;
            }
        }
        if (!isNullOrUndefined(col.filter) && !isNullOrUndefined(col.filter.ui)
            && !isNullOrUndefined(col.filter.ui.write)) {
            var temp = col.filter.ui.write;
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
            }
            col.filter.ui.write({ column: col, target: target, parent: this.parent, filteredValue: flValue });
        }
        else {
            instanceofFilterUI.write({ column: col, target: target, parent: this.parent, filteredValue: flValue });
        }
    };
    FilterMenuRenderer.prototype.filterBtnClick = function (col) {
        var flValue;
        var flOptrValue;
        var targ = this.dlgObj.element.querySelector('.e-flmenu-valuediv input');
        flOptrValue = this.flMuiObj.getFlOperator();
        var instanceofFilterUI = new this.colTypes[col.type](this.parent, this.serviceLocator, this.parent.filterSettings);
        if (!isNullOrUndefined(col.filter) &&
            !isNullOrUndefined(col.filter.ui) && !isNullOrUndefined(col.filter.ui.read)) {
            var temp = col.filter.ui.read;
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
            }
            flValue = col.filter.ui.read({ element: targ, column: col, operator: flOptrValue, fltrObj: this.filterObj });
        }
        else {
            instanceofFilterUI.read(targ, col, flOptrValue, this.filterObj);
        }
        var iconClass = this.parent.showColumnMenu ? '.e-columnmenu' : '.e-icon-filter';
        var column = this.parent.element.querySelector('[e-mappinguid="' + col.uid + '"]').parentElement;
        var flIcon = column.querySelector(iconClass);
        if (flIcon) {
            flIcon.classList.add('e-filtered');
        }
        this.closeDialog();
    };
    FilterMenuRenderer.prototype.clearBtnClick = function (column) {
        this.filterObj.removeFilteredColsByField(column.field);
        this.closeDialog();
        var iconClass = this.parent.showColumnMenu ? '.e-columnmenu' : '.e-icon-filter';
        var col = this.parent.element.querySelector('[e-mappinguid="' + column.uid + '"]').parentElement;
        var flIcon = col.querySelector(iconClass);
        if (flIcon) {
            flIcon.classList.remove('e-filtered');
        }
    };
    FilterMenuRenderer.prototype.destroy = function () {
    };
    return FilterMenuRenderer;
}());
export { FilterMenuRenderer };
