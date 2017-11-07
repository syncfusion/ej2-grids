import { EventHandler, L10n, isNullOrUndefined, extend, classList, addClass, removeClass, Browser } from '@syncfusion/ej2-base';
import { parentsUntil, getUid, appendChildren } from '../base/util';
import { remove, createElement } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { DataUtil, Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import { ReturnType } from '../base/type';
import { FilterSettings } from '../base/grid';
import { IGrid, IFilterArgs, EJ2Intance } from '../base/interface';
import * as events from '../base/constant';
import { ServiceLocator } from '../services/service-locator';
import { PredicateModel } from '../base/grid-model';
import { ValueFormatter } from '../services/value-formatter';
import { getActualProperties } from '../base/util';
import { Dialog } from '@syncfusion/ej2-popups';
import { Input } from '@syncfusion/ej2-inputs';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { getFilterMenuPostion } from '../base/util';
/**
 * @hidden
 * `CheckBoxFilter` module is used to handle filtering action.
 */
export class CheckBoxFilter {
    //Internal variables     
    protected sBox: HTMLElement;
    protected isExcel: boolean;
    protected id: string;
    protected colType: string;
    protected fullData: Object[];
    protected isFiltered: boolean | number;
    protected dlg: Element;
    protected dialogObj: Dialog;
    protected cBox: HTMLElement;
    protected spinner: HTMLElement;
    protected searchBox: Element;
    protected sInput: HTMLInputElement;
    protected sIcon: Element;
    protected options: IFilterArgs;
    protected defaultConstants: Object = {
        Search: 'Search',
        OK: 'OK',
        Cancel: 'Cancel',
        Filter: 'Filter',
        Clear: 'Clear',
        SelectAll: 'Select All',
        Blanks: 'Blanks',
        True: 'True',
        False: 'False',
        NoResult: 'No Matches Found'
    };
    protected values: Object = {};
    private cBoxTrue: Element = createCheckBox(false, { checked: true, label: ' ' });
    private cBoxFalse: Element = createCheckBox(false, { checked: false, label: ' ' });
    private itemsCnt: number;
    private result: Object;

    //Module declarations
    protected parent: IGrid;
    protected serviceLocator: ServiceLocator;
    protected localeObj: L10n;
    protected valueFormatter: ValueFormatter;

    /**
     * Constructor for checkbox filtering module
     * @hidden
     */
    constructor(parent?: IGrid, filterSettings?: FilterSettings, serviceLocator?: ServiceLocator) {
        this.parent = parent;
        this.id = this.parent.element.id;
        this.serviceLocator = serviceLocator;
        this.valueFormatter = new ValueFormatter(this.parent.locale);
        this.initLocale(this.defaultConstants);
        this.cBoxTrue.insertBefore(
            createElement('input', {
                className: 'e-chk-hidden', attrs: { type: 'checkbox' }
            }),
            this.cBoxTrue.firstChild);
        this.cBoxFalse.insertBefore(
            createElement('input', {
                className: 'e-chk-hidden', attrs: { 'type': 'checkbox' }
            }),
            this.cBoxFalse.firstChild);
        this.cBoxFalse.querySelector('.e-frame').classList.add('e-uncheck');
        if (this.parent.enableRtl) {
            addClass([this.cBoxTrue, this.cBoxFalse], ['e-rtl']);
        }
    }

    protected initLocale(constants: Object): void {
        this.localeObj = new L10n(this.getModuleName(), this.defaultConstants, this.parent.locale || 'en-US');
    }

    /** 
     * To destroy the filter bar. 
     * @return {void} 
     * @hidden
     */
    public destroy(): void {
        this.closeDialog();
        this.unWireEvents();
    }


    private wireEvents(): void {
        EventHandler.add(this.dlg, 'click', this.clickHandler, this);
        EventHandler.add(this.dlg.querySelector('.e-searchinput'), 'keyup', this.searchBoxKeyUp, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(this.dlg, 'click', this.clickHandler);
        let elem: Element = this.dlg.querySelector('.e-searchinput');
        if (elem) {
            EventHandler.remove(elem, 'keyup', this.searchBoxKeyUp);
        }
    }

    private searchBoxClick(e: MouseEvent): void {
        let target: Element = e.target as Element;
        if (target.classList.contains('e-searchclear')) {
            this.sInput.value = '';
            this.refreshCheckboxes();
            this.updateSearchIcon();
            this.sInput.focus();
        }
    }

    private searchBoxKeyUp(e?: KeyboardEvent): void {
        this.refreshCheckboxes();
        this.updateSearchIcon();
    }

    private updateSearchIcon(): void {
        if (this.sInput.value.length) {
            classList(this.sIcon, ['e-chkcancel-icon'], ['e-search-icon']);
        } else {
            classList(this.sIcon, ['e-search-icon'], ['e-chkcancel-icon']);
        }
    }

    /** 
     * Gets the localized label by locale keyword. 
     * @param  {string} key  
     * @return {string}  
     */
    public getLocalizedLabel(key: string): string {
        return this.localeObj.getConstant(key);
    }

    private updateDataSource(): void {
        let dataSource: Object[] = this.options.dataSource as Object[];
        if (!(dataSource instanceof DataManager)) {
            for (let i: number = 0; i < dataSource.length; i++) {
                if (typeof dataSource !== 'object') {
                    let obj: Object = {};
                    obj[this.options.field] = dataSource[i];
                    dataSource[i] = obj;
                }
            }
        }
    }

    protected updateModel(options: IFilterArgs): void {
        this.options = options;
        this.options.dataSource = options.dataSource;
        this.updateDataSource();
        this.options.type = options.type || 'string';
        this.options.format = options.format || '';
        this.options.filteredColumns = options.filteredColumns || this.parent.filterSettings.columns;
        this.options.sortedColumns = options.sortedColumns || this.parent.sortSettings.columns as string[];
        this.options.query = options.query || new Query();
        this.options.allowCaseSensitive = options.allowCaseSensitive || false;
        this.values = {};
        this.isFiltered = options.filteredColumns.length;
        extend(this.defaultConstants, options.localizedStrings);
    }

    protected getAndSetChkElem(options: IFilterArgs): HTMLElement {
        this.dlg = createElement('div', {
            id: this.id + this.options.type + '_excelDlg',
            className: 'e-checkboxfilter e-filter-popup'
        });

        this.sBox = createElement('div', { className: 'e-searchcontainer' });

        if (!options.hideSearchbox) {
            this.sInput = createElement('input', {
                id: this.id + '_SearchBox',
                className: 'e-searchinput'
            }) as HTMLInputElement;
            this.sIcon = createElement('span', {
                className: 'e-searchclear e-search-icon e-icons', attrs: {
                    type: 'text', placeholder: this.getLocalizedLabel('Search')
                }
            });
            this.searchBox = createElement('span', { className: 'e-searchbox e-fields' });
            this.searchBox.appendChild(this.sInput);
            this.sBox.appendChild(this.searchBox);
            Input.createInput({
                element: this.sInput as HTMLInputElement, floatLabelType: 'Never', properties: {
                    placeholder: this.getLocalizedLabel('Search')
                }
            });
            this.searchBox.querySelector('.e-input-group').appendChild(this.sIcon);
        }

        this.spinner = createElement('div', { className: 'e-spinner' }); //for spinner
        this.cBox = createElement('div', {
            id: this.id + this.options.type + '_CheckBoxList',
            className: 'e-checkboxlist e-fields'
        }) as HTMLElement;


        this.spinner.appendChild(this.cBox);
        this.sBox.appendChild(this.spinner);
        return this.sBox;
    }

    protected showDialog(options: IFilterArgs): void {
        let args: Object = {
            requestType: events.filterBeforeOpen, filterModel: this,
            columnName: this.options.field, columnType: this.options.type
        };
        this.parent.trigger(events.actionBegin, args);
        this.dialogObj = new Dialog({
            visible: false, content: this.sBox as HTMLElement,
            close: this.closeDialog.bind(this),
            width: (!isNullOrUndefined(parentsUntil(options.target, 'e-bigger')))
                || this.parent.element.classList.contains('e-device') ? 260 : 250,
            target: this.parent.element, animationSettings:
            { effect: 'None' },
            buttons: [{
                click: this.btnClick.bind(this),
                buttonModel: { content: this.getLocalizedLabel(this.isExcel ? 'OK' : 'Filter'), cssClass: 'e-primary', isPrimary: true }
            },
            {
                click: this.btnClick.bind(this),
                buttonModel: { cssClass: 'e-flat', content: this.getLocalizedLabel(this.isExcel ? 'Cancel' : 'Clear') }
            }],
            created: this.dialogCreated.bind(this),
            open: this.dialogOpen.bind(this)
        });
        this.dialogObj.appendTo(this.dlg as HTMLElement);
        this.dialogObj.element.style.maxHeight = '800px';
        this.dialogObj.show();
        this.wireEvents();
        createSpinner({ target: this.spinner });
        showSpinner(this.spinner);
        this.getAllData();
    }

    private dialogCreated(e: {}): void {
        if (!Browser.isDevice) {
            getFilterMenuPostion(this.options.target, this.dialogObj);
        } else {
            this.dialogObj.position = { X: 'center', Y: 'center' };
        }
        this.parent.notify(events.filterDialogCreated, e);
    }

    public openDialog(options: IFilterArgs): void {
        this.updateModel(options);
        this.getAndSetChkElem(options);
        this.showDialog(options);
    }

    public closeDialog(): void {
        if (this.dialogObj && !this.dialogObj.isDestroyed) {
            this.parent.notify(events.filterMenuClose, { field: this.options.field });
            this.dialogObj.destroy();
            remove(this.dlg);
            this.dlg = null;
        }
    }

    private btnClick(e: MouseEvent): void {
        let text: string = (e.target as HTMLInputElement).innerText.toLowerCase();
        if (this.getLocalizedLabel(this.isExcel ? 'OK' : 'Filter').toLowerCase() === text) {
            this.fltrBtnHandler();
        } else if (this.getLocalizedLabel('Clear').toLowerCase() === text) {
            this.options.handler({ action: 'clear-filter', field: this.options.field });
        }
        this.closeDialog();
    }

    private fltrBtnHandler(): void {
        let checked: Element[] = [].slice.call(this.cBox.querySelectorAll('.e-check:not(.e-selectall)'));
        if (this.fullData.length === checked.length) {
            return;
        }
        let optr: string = 'equal';
        let caseSen: boolean = this.options.type === 'string' ?
            this.options.allowCaseSensitive : true;
        let defaults: { predicate?: string, field?: string, operator?: string, matchcase?: boolean } = {
            field: this.options.field, predicate: 'or',
            operator: optr, matchcase: caseSen
        };
        let isNotEqual: boolean = this.itemsCnt !== checked.length && this.itemsCnt - checked.length < checked.length;
        if (isNotEqual) {
            optr = 'notequal';
            checked = [].slice.call(this.cBox.querySelectorAll('.e-uncheck:not(.e-selectall)'));
            defaults.predicate = 'and';
            defaults.operator = 'notequal';
        }
        let value: string;
        let fObj: PredicateModel;
        let coll: PredicateModel[] = [];
        for (let i: number = 0; i < checked.length; i++) {
            value = this.values[parentsUntil(checked[i], 'e-ftrchk').getAttribute('uid')];
            fObj = extend({}, { value: value }, defaults) as {
                field: string, predicate: string, operator: string, matchcase: boolean, value: string
            };
            if (value && !value.toString().length) {
                fObj.operator = isNotEqual ? 'notequal' : 'equal';
            }
            coll.push(this.options.type === 'date' ? CheckBoxFilter.setDateObject(fObj) : fObj);
        }
        this.initiateFilter(coll);
    }

    private initiateFilter(fColl: PredicateModel[]): void {
        let firstVal: PredicateModel = fColl[0];
        let predicate: PredicateModel;
        if (!isNullOrUndefined(firstVal)) {
            predicate = firstVal.ejpredicate ? firstVal.ejpredicate :
                new Predicate(firstVal.field, firstVal.operator, firstVal.value, !firstVal.matchcase);
            for (let j: number = 1; j < fColl.length; j++) {
                predicate = fColl[j].ejpredicate !== undefined ?
                    predicate[fColl[j].predicate](fColl[j].ejpredicate) :
                    predicate[fColl[j].predicate](fColl[j].field, fColl[j].operator, fColl[j].value, !fColl[j].matchcase);
            }
            let args: Object = {
                action: 'filtering', filterCollection: fColl, field: this.options.field,
                ejpredicate: Predicate.or(predicate)
            };
            this.options.handler(args);
        }
    }

    private refreshCheckboxes(): void {
        let val: string = this.sInput.value;
        let query: Query = this.options.query.clone();
        let parsed: string | number | Date | boolean = (this.options.type !== 'string' && parseFloat(val)) ? parseFloat(val) : val;
        let operator: string = 'contains';
        let matchcase: boolean = true;
        parsed = (parsed === '' || parsed === undefined) ? undefined : parsed;
        if (this.options.type === 'boolean') {
            if (parsed !== undefined &&
                this.getLocalizedLabel('True').toLowerCase().indexOf((parsed as string).toLowerCase()) !== -1) {
                parsed = 'true';
            } else if (parsed !== undefined &&
                this.getLocalizedLabel('False').toLowerCase().indexOf((parsed as string).toLowerCase()) !== -1) {
                parsed = 'false';
            }
        }
        if (this.options.type === 'date' || this.options.type === 'datetime') {
            parsed = this.valueFormatter.fromView(val, this.options.parserFn, this.options.type);
            operator = 'equal';
            if (isNullOrUndefined(parsed)) {
                return;
            }
        }
        if (val.length) {
            query.where(this.options.field, operator, parsed, matchcase);
        }
        this.processDataSource(query);
    }

    private getPredicateFromCols(columns: Object[]): Predicate {
        let predicate: Predicate;
        let predicates: Predicate = CheckBoxFilter.getPredicate(columns);
        for (let prop of Object.keys(predicates)) {
            let and: string = 'and';
            let obj: Predicate | string = predicates[prop] as Predicate | string;
            predicate = !isNullOrUndefined(predicate) ?
                (predicate as Object)[and](obj as string) as Predicate :
                obj as Predicate;
        }
        return predicate;
    }

    private getAllData(): void {
        let query: Query = new Query();
        if ((this.options.filteredColumns.length)) {
            let cols: Object[] = [];
            for (let i: number = 0; i < this.options.filteredColumns.length; i++) {
                if ((this.options.filteredColumns[i] as { field: string }).field !== this.options.field) {
                    cols.push(this.options.filteredColumns[i]);
                }
            }
            let predicate: Predicate = this.getPredicateFromCols(cols);
            if (predicate) {
                query.where(predicate);
            }
        }
        query.select(this.options.field);
        query.requiresCount(); //consider take query
        this.options.dataSource = this.options.dataSource instanceof DataManager ?
            this.options.dataSource : new DataManager(this.options.dataSource as JSON[]);
        let promise: Promise<Object> = this.options.dataSource.executeQuery(query);
        promise.then((e: ReturnType) => this.dataSuccess(e));
    }

    private dataSuccess(e: ReturnType): void {
        let result: { records: Object[] } = CheckBoxFilter.getDistinct(e.result, this.options.field) as { records: Object[] };
        this.fullData = result.records;
        this.processDataSource(null, true);
        let args: Object = {
            requestType: events.filterAfterOpen,
            filterModel: this, columnName: this.options.field, columnType: this.options.type
        };
        this.parent.trigger(events.actionComplete, args);
    }


    private processDataSource(query?: Query, isInitial?: boolean): void {
        showSpinner(this.spinner);
        query = query ? query : this.options.query.clone();
        query.requiresCount();
        let args: {
            dataSource?: Object[], requestType?: string,
            filterModel: CheckBoxFilter, query: Query
        } = {
                requestType: events.filterChoiceRequest, filterModel: this, query: query,
                dataSource: this.fullData
            };
        this.parent.trigger(events.actionBegin, args);
        let result: Object = new DataManager(args.dataSource as JSON[]).executeLocal(args.query);
        let res: { result: Object[] } = result as { result: Object[] };
        this.updateResult();
        this.createFilterItems(res.result, isInitial);
    }

    private updateResult(): void {
        this.result = {};
        let predicate: Predicate = this.getPredicateFromCols(this.options.filteredColumns);
        let query: Query = new Query();
        if (predicate) {
            query.where(predicate);
        }
        let result: Object[] = new DataManager(this.fullData as JSON[]).executeLocal(query);
        for (let res of result) {
            this.result[res[this.options.field]] = true;
        }
    }

    private clickHandler(e: MouseEvent): void {
        let target: Element = e.target as Element;
        let elem: Element = parentsUntil(target, 'e-checkbox-wrapper');
        if (parentsUntil(target, 'e-searchbox')) {
            this.searchBoxClick(e);
        }
        if (elem) {
            let selectAll: Element = elem.querySelector('.e-selectall');
            if (selectAll) {
                this.updateAllCBoxes(!selectAll.classList.contains('e-check'));
            } else {
                this.toogleCheckbox(elem.parentElement);
            }
            this.updateIndeterminatenBtn();
        }
    }

    private updateAllCBoxes(checked: boolean): void {
        let cBoxes: Element[] = [].slice.call(this.cBox.querySelectorAll('.e-frame'));
        for (let cBox of cBoxes) {
            removeClass([cBox], ['e-check', 'e-stop', 'e-uncheck']);
            if (checked) {
                cBox.classList.add('e-check');
            } else {
                cBox.classList.add('e-uncheck');
            }
        }
    }

    private isChecked(elem: Element): boolean {
        return elem.querySelectorAll('e-check').length > 0;
    }

    private dialogOpen(): void {
        if (this.parent.element.classList.contains('e-device')) {
            this.dialogObj.element.querySelector('.e-input-group').classList.remove('e-input-focus');
            (<HTMLElement>this.dialogObj.element.querySelector('.e-checkboxlist')).focus();
        }
    }

    private toogleCheckbox(elem: Element): void {
        let span: Element = elem.querySelector('.e-frame');
        span.classList.contains('e-check') ? classList(span, ['e-uncheck'], ['e-check']) :
            classList(span, ['e-check'], ['e-uncheck']);
    }

    private createCboxWithWrap(value: string, checked: boolean, uid: string): Element {
        let div: Element = createElement('div', { className: 'e-ftrchk' });
        div.appendChild(this.createCheckbox(value, checked));
        div.setAttribute('uid', uid);
        return div;
    }

    private createCheckbox(value: string, checked: boolean): Element {
        let elem: Element = checked ? this.cBoxTrue.cloneNode(true) as Element :
            this.cBoxFalse.cloneNode(true) as Element;
        let label: Element = elem.querySelector('.e-label');
        label.innerHTML = !isNullOrUndefined(value) && value.toString().length ? value :
            this.getLocalizedLabel('Blanks');
        if (this.options.template) {
            label.innerHTML = '';
            let args: Object = {};
            args[this.options.field] = value;
            appendChildren(label, this.options.template(args));
        }
        return elem;
    }

    private updateIndeterminatenBtn(): void {
        let cnt: number = this.cBox.children.length - 1;
        let className: string[] = [];
        let elem: Element = this.cBox.querySelector('.e-selectall');
        let selected: number = this.cBox.querySelectorAll('.e-check:not(.e-selectall)').length;
        let btn: Button = (this.dlg.querySelector('.e-footer-content').querySelector('.e-btn') as EJ2Intance).ej2_instances[0] as Button;
        btn.disabled = false;
        if (cnt === selected) {
            className = ['e-check'];
        } else if (selected) {
            className = ['e-stop'];
        } else {
            btn.disabled = true;
        }
        removeClass([elem], ['e-check', 'e-stop', 'e-uncheck']);
        addClass([elem], className);
    }

    private createFilterItems(data: Object[], isInitial?: boolean): void {
        let cBoxes: Element = createElement('div');
        this.itemsCnt = data.length;
        if (data.length || isInitial) {
            let selectAll: Element = this.createCboxWithWrap(
                this.getLocalizedLabel('SelectAll'), false, getUid('cbox'));
            selectAll.querySelector('.e-frame').classList.add('e-selectall');
            cBoxes.appendChild(selectAll);
            let isColFiltered: number = new DataManager(this.options.filteredColumns as JSON[]).executeLocal(
                new Query().where('field', 'equal', this.options.field)).length;
            for (let i: number = 0; i < data.length; i++) {
                let uid: string = getUid('cbox');
                this.values[uid] = data[i][this.options.field];
                let value: string = this.valueFormatter.toView(data[i][this.options.field], this.options.formatFn) as string;
                cBoxes.appendChild(
                    this.createCboxWithWrap(value, this.getCheckedState(isColFiltered, this.values[uid]), uid));
            }
            this.cBox.innerHTML = cBoxes.innerHTML;
            this.updateIndeterminatenBtn();
        } else {
            cBoxes.appendChild(createElement('span', { innerHTML: this.getLocalizedLabel('NoResult') }));
            this.cBox.innerHTML = cBoxes.innerHTML;
        }
        let args: {
            dataSource?: Object[], requestType?: string,
            filterModel: CheckBoxFilter
        } = { requestType: events.filterChoiceRequest, filterModel: this, dataSource: data };
        this.parent.trigger(events.actionComplete, args);
        hideSpinner(this.spinner);
    }

    private getCheckedState(isColFiltered: number | boolean, value: string): boolean {
        if (!this.isFiltered || !isColFiltered) {
            return true;
        } else {
            return this.result[value];
        }
    }

    public static getDistinct(json: Object[], field: string): Object {
        let len: number = json.length;
        let result: Object[] = [];
        let value: string;
        let ejValue: string = 'ejValue';
        let lookup: Object = {};

        while (len--) {
            value = json[len] as string;
            value = typeof value === 'object' && !(value instanceof Date) ?
                value[field] : value; //local remote diff, check with mdu           
            if (!isNullOrUndefined(value)) {
                if (!(value in lookup)) {
                    let obj: Object = {};
                    obj[ejValue] = value;
                    obj[field] = value;
                    result.push(obj);
                }
                lookup[value] = true;
            }
        }
        return DataUtil.group(DataUtil.sort(result, field, DataUtil.fnAscending), 'ejValue');
    }

    public static setDateObject(filterObject: PredicateModel): PredicateModel {
        let prevObj: PredicateModel = extend({}, getActualProperties(filterObject)) as PredicateModel;
        let nextObj: PredicateModel = extend({}, getActualProperties(filterObject)) as PredicateModel;
        let value: Date = new Date(filterObject.value as string);
        let prevDate: Date = new Date(value.setDate(value.getDate() - 1));
        let nextDate: Date = new Date(value.setDate(value.getDate() + 2));
        prevObj.value = prevDate;
        nextObj.value = nextDate;
        if (filterObject.operator === 'equal') {
            nextObj.operator = 'lessthan';
            nextObj.predicate = 'and';
            prevObj.operator = 'greaterthan';
            prevObj.predicate = 'and';

        } else if (filterObject.operator === 'notequal') {
            nextObj.operator = 'greaterthanorequal';
            nextObj.predicate = 'or';
            prevObj.operator = 'lessthanorequal';
            prevObj.predicate = 'or';
        }
        let predicateSt: Predicate = new Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
        let predicateEnd: Predicate = new Predicate(nextObj.field, nextObj.operator, nextObj.value, false);
        filterObject.ejpredicate = filterObject.operator === 'equal' ? predicateSt.and(predicateEnd) :
            predicateSt.or(predicateEnd);
        filterObject.type = 'date';
        return filterObject;
    }


    public static getPredicate(columns: PredicateModel[]): Predicate {
        let cols: PredicateModel[] = (CheckBoxFilter.getDistinct(columns, 'field') as { records: Object[] }).records;
        let collection: Object[];
        let pred: Predicate = {} as Predicate;
        for (let i: number = 0; i < cols.length; i++) {
            collection = new DataManager(columns as JSON[]).executeLocal(
                new Query().where('field', 'equal', cols[i].field));
            pred[cols[i].field] = CheckBoxFilter.generatePredicate(collection);
        }
        return pred;
    }

    private static generatePredicate(cols: PredicateModel[]): Predicate {
        let len: number = cols ? cols.length : 0;
        let predicate: Predicate;
        let first: PredicateModel;
        first = CheckBoxFilter.updateDateFilter(cols[0]);
        if (first.type === 'date' || first.type === 'datetime') {
            predicate = CheckBoxFilter.getDatePredicate(first) as Predicate;
        } else {
            predicate = first.ejpredicate ? first.ejpredicate as Predicate :
                new Predicate(
                    first.field, first.operator, first.value, first.ignoreCase || !first.matchcase) as Predicate;
        }
        for (let p: number = 1; p < len; p++) {
            cols[p] = CheckBoxFilter.updateDateFilter(cols[p]);
            if (len > 2 && p > 1 && cols[p].predicate === 'or') {
                if (cols[p].type === 'date' || cols[p].type === 'datetime') {
                    predicate.predicates.push(CheckBoxFilter.getDatePredicate(cols[p]));
                } else {
                    predicate.predicates.push(new Predicate(
                        cols[p].field, cols[p].operator, cols[p].value, cols[p].ignoreCase || !cols[p].matchcase));
                }
            } else {
                if (cols[p].type === 'date' || cols[p].type === 'datetime') {
                    predicate = (predicate[((cols[p] as Predicate).predicate) as string] as Function)(
                        CheckBoxFilter.getDatePredicate(cols[p]));
                } else {
                    predicate = cols[p].ejpredicate ?
                        (predicate[(cols[p] as Predicate).predicate as string] as Function)(cols[p].ejpredicate) :
                        (predicate[(cols[p].predicate) as string] as Function)(
                            cols[p].field, cols[p].operator, cols[p].value, cols[p].ignoreCase || !cols[p].matchcase);
                }
            }
        }
        return predicate || null;
    }

    private static getDatePredicate(predicate: PredicateModel): Predicate {
        return new Predicate(predicate.field, predicate.operator, predicate.value, predicate.ignoreCase || !predicate.matchcase);
    }

    private static updateDateFilter(filter: PredicateModel): PredicateModel {
        if (filter.type !== 'date' && !(filter.value instanceof Date)) {
            return filter;
        }
        return ['equal', 'notequal'].indexOf(filter.operator) === -1 ? filter :
            CheckBoxFilter.setDateObject(filter);
    }

    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string {
        return 'checkboxFilter';
    }

}
