
import { isNullOrUndefined, getValue, L10n, } from '@syncfusion/ej2-base';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { FilterSettings } from '../base/grid';
import { IGrid, IValueFormatter } from '../base/interface';
import { PredicateModel } from '../base/grid-model';
import { ServiceLocator } from '../services/service-locator';
import { Filter } from '../actions/filter';
import { Column } from '../models/column';
import { Dialog, calculateRelativeBasedPosition } from '@syncfusion/ej2-popups';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { FlMenuOptrUI } from './filter-menu-operator';
import { StringFilterUI } from './string-filter-ui';
import { NumberFilterUI } from './number-filter-ui';
import { BooleanFilterUI } from './boolean-filter-ui';
import { DateFilterUI } from './date-filter-ui';
import { parentsUntil } from '../base/util';

/**
 * `filter menu` render boolean column.
 * @hidden
 */
export class FilterMenuRenderer {
    private parent: IGrid;
    private filterObj: Filter;
    private serviceLocator: ServiceLocator;
    private dlgDiv: HTMLElement;
    private l10n: L10n;
    public dlgObj: Dialog;
    private valueFormatter: IValueFormatter;
    private filterSettings: FilterSettings;
    private customFilterOperators: Object;
    private dropOptr: DropDownList;
    private flMuiObj: FlMenuOptrUI;

    private colTypes: Object = {
        'string': StringFilterUI, 'number': NumberFilterUI, 'date': DateFilterUI, 'boolean': BooleanFilterUI, 'datetime': DateFilterUI
    };
    constructor(
        parent?: IGrid, filterSettings?: FilterSettings, serviceLocator?: ServiceLocator, customFltrOperators?: Object,
        fltrObj?: Filter) {
        this.parent = parent;
        this.filterSettings = filterSettings;
        this.serviceLocator = serviceLocator;
        this.customFilterOperators = customFltrOperators;
        this.filterObj = fltrObj;
        this.flMuiObj = new FlMenuOptrUI(this.parent, this.customFilterOperators, this.serviceLocator);
        this.l10n = this.serviceLocator.getService<L10n>('localization');
    }

    private openDialog(args: {
        type?: string, field?: string, displayName?: string,
        query?: Query, dataSource?: DataManager | Object[], filteredColumns?: PredicateModel, sortedColumns?: Column,
        blank?: string, localizedStrings?: {}, pos?: { X: 0, Y: 0 }, target?: Element, coluid?: string, isNextMenuOpen?: boolean
    }): void {
        if (args.isNextMenuOpen) {
            let ele: Element;
            this.closeDialog(ele, args.isNextMenuOpen);
        }
        let column: Column = this.parent.getColumnByUid(args.coluid);
        if (isNullOrUndefined(column.filter) || (isNullOrUndefined(column.filter.type) || column.filter.type === 'menu')) {///
            this.renderDlgContent(args.target, column);
        }

    }

    private closeDialog(target?: Element, isNextMenuOpen?: boolean): void {
        let elem: Element = parentsUntil(target, 'e-popup');
        let calEle: boolean = !isNullOrUndefined(target) && !target.classList.contains('e-day');
        if (calEle && target.classList.contains('e-cell')) {
            calEle = !target.firstElementChild.classList.contains('e-day');
        }
        if ((!isNullOrUndefined(this.dlgObj) && !isNullOrUndefined(document.getElementById(this.dlgObj.element.id)))
            && (isNextMenuOpen || (isNullOrUndefined(elem) && calEle && !this.dlgObj.open))) {
            this.dlgObj.destroy();
            document.getElementById(this.dlgObj.element.id).remove();
        }
    }

    private renderDlgContent(target: Element, column: Column): void {
        let mainDiv: HTMLElement = createElement('div', { className: 'e-flmenu-maindiv', id: column.uid + '-flmenu' });
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
            target: this.parent.element.classList.contains('e-device') ? document.body : null,
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
            width: 250,
            animationSettings: { effect: 'None' },
            cssClass: 'e-filter-popup'
        });
        this.dlgObj.appendTo(this.dlgDiv);
    }

    private dialogCreated(target: Element, column: Column): void {
        if (target.classList.contains('e-filtermenudiv')) {
            if (!Browser.isDevice) {
                let elementVisible: string = this.dlgObj.element.style.display;
                this.dlgObj.element.style.display = 'block';
                let dlgWidth: number = this.dlgObj.width as number;
                let newpos: { top: number, left: number } = calculateRelativeBasedPosition
                    ((<HTMLElement>target), this.dlgObj.element);
                this.dlgObj.element.style.display = elementVisible;
                this.dlgObj.element.style.top = newpos.top + target.getBoundingClientRect().height + 'px';
                let leftPos: number = ((newpos.left - dlgWidth) + target.clientWidth);
                if (leftPos < 1) {
                    this.dlgObj.element.style.left = (dlgWidth + leftPos) - 16 + 'px'; // right calculation
                } else {
                    this.dlgObj.element.style.left = leftPos + -4 + 'px';
                }
            }
            this.renderFilterUI(target, column);
            this.dlgObj.show();
            this.writeMethod(column, this.dlgObj.element.querySelector('#' + column.uid + '-flmenu'));
        }
    }

    private renderFilterUI(target: Element, col: Column): void {

        let dlgConetntEle: Element = this.dlgObj.element.querySelector('.e-flmenu-maindiv');

        this.renderOperatorUI(dlgConetntEle, target, col);
        this.renderFlValueUI(dlgConetntEle, target, col);
    }

    private renderOperatorUI(dlgConetntEle: Element, target: Element, column: Column): void {
        this.flMuiObj.renderOperatorUI(dlgConetntEle, target, column);
    }

    private renderFlValueUI(dlgConetntEle: Element, target: Element, column: Column): void {
        let valueDiv: HTMLElement = createElement('div', { className: 'e-flmenu-valuediv' });
        dlgConetntEle.appendChild(valueDiv);
        let args: Object = { target: valueDiv, column: column };
        let instanceofFilterUI: NumberFilterUI | StringFilterUI | DateFilterUI =
            new this.colTypes[column.type](this.parent, this.serviceLocator, this.parent.filterSettings);
        if (!isNullOrUndefined(column.filter) && !isNullOrUndefined(column.filter.ui)
            && !isNullOrUndefined(column.filter.ui.create as Function)) {
            let temp: Function = column.filter.ui.create as Function;
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
            }
            (column.filter.ui.create as Function)({ column: column, target: valueDiv, getOptrInstance: this.flMuiObj });
        } else {
            instanceofFilterUI.create({ column: column, target: valueDiv, getOptrInstance: this.flMuiObj, localizeText: this.l10n });
        }
    }


    private writeMethod(col: Column, dlgContentEle: Element): void {
        let flValue: string | number | Date | boolean;
        let target: Element = dlgContentEle.querySelector('.e-flmenu-valinput');
        let instanceofFilterUI: NumberFilterUI | StringFilterUI | DateFilterUI =
            new this.colTypes[col.type](this.parent, this.serviceLocator, this.parent.filterSettings);
        let columns: PredicateModel[] = this.filterSettings.columns;
        for (let column of columns) {
            if (col.field === column.field) {
                flValue = column.value;
            }
        }
        if (!isNullOrUndefined(col.filter) && !isNullOrUndefined(col.filter.ui)
            && !isNullOrUndefined(col.filter.ui.write as Function)) {
            let temp: Function = col.filter.ui.write as Function;
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
            }
            (col.filter.ui.write as Function)({ column: col, target: target, parent: this.parent, filteredValue: flValue });
        } else {
            instanceofFilterUI.write({ column: col, target: target, parent: this.parent, filteredValue: flValue });
        }
    }

    private filterBtnClick(col: Column): void {
        let flValue: string | number | Date | boolean;
        let flOptrValue: string;
        let targ: HTMLInputElement = this.dlgObj.element.querySelector('.e-flmenu-valuediv input') as HTMLInputElement;
        flOptrValue = this.flMuiObj.getFlOperator();
        let instanceofFilterUI: NumberFilterUI | StringFilterUI | DateFilterUI =
            new this.colTypes[col.type](this.parent, this.serviceLocator, this.parent.filterSettings);
        if (!isNullOrUndefined(col.filter) &&
            !isNullOrUndefined(col.filter.ui) && !isNullOrUndefined(col.filter.ui.read as Function)) {
            let temp: Function = col.filter.ui.read as Function;
            if (typeof temp === 'string') {
                temp = getValue(temp, window);
            }
            flValue = (col.filter.ui.read as Function)({ element: targ, column: col, operator: flOptrValue, fltrObj: this.filterObj });
        } else {
            instanceofFilterUI.read(targ, col, flOptrValue, this.filterObj);

        }
        let flMenuSelector: string = 'e-flmenu-' + col.uid;
        let flIcon: Element = this.parent.element.querySelector('[e-mappinguid="' + flMenuSelector + '"]');
        flIcon.classList.add('e-filtered');
        this.dlgObj.destroy();
        document.getElementById(this.dlgObj.element.id).remove();
    }

    private clearBtnClick(column: Column): void {
        this.filterObj.removeFilteredColsByField(column.field);
        this.dlgObj.destroy();
        this.dlgObj.element.remove();
        let flMenuSelector: string = 'e-flmenu-' + column.uid;
        let flIcon: Element = this.parent.element.querySelector('[e-mappinguid="' + flMenuSelector + '"]');
        flIcon.classList.remove('e-filtered');
    }
}