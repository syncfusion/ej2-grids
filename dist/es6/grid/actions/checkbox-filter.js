/* tslint:disable-next-line:max-line-length */
import { EventHandler, L10n, isNullOrUndefined, extend, classList, addClass, removeClass, Browser, getValue, setValue } from '@syncfusion/ej2-base';
import { parentsUntil, getUid, appendChildren } from '../base/util';
import { remove, createElement } from '@syncfusion/ej2-base';
import { DataUtil, Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { createCheckBox } from '@syncfusion/ej2-buttons';
import * as events from '../base/constant';
import { ValueFormatter } from '../services/value-formatter';
import { getActualProperties } from '../base/util';
import { Dialog } from '@syncfusion/ej2-popups';
import { Input } from '@syncfusion/ej2-inputs';
import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';
import { getFilterMenuPostion, toogleCheckbox, createCboxWithWrap, removeAddCboxClasses } from '../base/util';
/**
 * @hidden
 * `CheckBoxFilter` module is used to handle filtering action.
 */
var CheckBoxFilter = /** @class */ (function () {
    /**
     * Constructor for checkbox filtering module
     * @hidden
     */
    function CheckBoxFilter(parent, filterSettings, serviceLocator) {
        this.defaultConstants = {
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
        this.values = {};
        this.cBoxTrue = createCheckBox(false, { checked: true, label: ' ' });
        this.cBoxFalse = createCheckBox(false, { checked: false, label: ' ' });
        this.parent = parent;
        this.id = this.parent.element.id;
        this.serviceLocator = serviceLocator;
        this.valueFormatter = new ValueFormatter(this.parent.locale);
        this.initLocale(this.defaultConstants);
        this.cBoxTrue.insertBefore(createElement('input', {
            className: 'e-chk-hidden', attrs: { type: 'checkbox' }
        }), this.cBoxTrue.firstChild);
        this.cBoxFalse.insertBefore(createElement('input', {
            className: 'e-chk-hidden', attrs: { 'type': 'checkbox' }
        }), this.cBoxFalse.firstChild);
        this.cBoxFalse.querySelector('.e-frame').classList.add('e-uncheck');
        if (this.parent.enableRtl) {
            addClass([this.cBoxTrue, this.cBoxFalse], ['e-rtl']);
        }
    }
    CheckBoxFilter.prototype.initLocale = function (constants) {
        this.localeObj = new L10n(this.getModuleName(), this.defaultConstants, this.parent.locale || 'en-US');
    };
    /**
     * To destroy the filter bar.
     * @return {void}
     * @hidden
     */
    CheckBoxFilter.prototype.destroy = function () {
        this.closeDialog();
    };
    CheckBoxFilter.prototype.wireEvents = function () {
        EventHandler.add(this.dlg, 'click', this.clickHandler, this);
        EventHandler.add(this.dlg.querySelector('.e-searchinput'), 'keyup', this.searchBoxKeyUp, this);
    };
    CheckBoxFilter.prototype.unWireEvents = function () {
        EventHandler.remove(this.dlg, 'click', this.clickHandler);
        var elem = this.dlg.querySelector('.e-searchinput');
        if (elem) {
            EventHandler.remove(elem, 'keyup', this.searchBoxKeyUp);
        }
    };
    CheckBoxFilter.prototype.searchBoxClick = function (e) {
        var target = e.target;
        if (target.classList.contains('e-searchclear')) {
            this.sInput.value = '';
            this.refreshCheckboxes();
            this.updateSearchIcon();
            this.sInput.focus();
        }
    };
    CheckBoxFilter.prototype.searchBoxKeyUp = function (e) {
        this.refreshCheckboxes();
        this.updateSearchIcon();
    };
    CheckBoxFilter.prototype.updateSearchIcon = function () {
        if (this.sInput.value.length) {
            classList(this.sIcon, ['e-chkcancel-icon'], ['e-search-icon']);
        }
        else {
            classList(this.sIcon, ['e-search-icon'], ['e-chkcancel-icon']);
        }
    };
    /**
     * Gets the localized label by locale keyword.
     * @param  {string} key
     * @return {string}
     */
    CheckBoxFilter.prototype.getLocalizedLabel = function (key) {
        return this.localeObj.getConstant(key);
    };
    CheckBoxFilter.prototype.updateDataSource = function () {
        var dataSource = this.options.dataSource;
        if (!(dataSource instanceof DataManager)) {
            for (var i = 0; i < dataSource.length; i++) {
                if (typeof dataSource !== 'object') {
                    var obj = {};
                    obj[this.options.field] = dataSource[i];
                    dataSource[i] = obj;
                }
            }
        }
    };
    CheckBoxFilter.prototype.updateModel = function (options) {
        this.options = options;
        this.options.dataSource = options.dataSource;
        this.updateDataSource();
        this.options.type = options.type || 'string';
        this.options.format = options.format || '';
        this.options.filteredColumns = options.filteredColumns || this.parent.filterSettings.columns;
        this.options.sortedColumns = options.sortedColumns || this.parent.sortSettings.columns;
        this.options.query = options.query || new Query();
        this.options.allowCaseSensitive = options.allowCaseSensitive || false;
        this.values = {};
        this.isFiltered = options.filteredColumns.length;
        extend(this.defaultConstants, options.localizedStrings);
    };
    CheckBoxFilter.prototype.getAndSetChkElem = function (options) {
        this.dlg = createElement('div', {
            id: this.id + this.options.type + '_excelDlg',
            className: 'e-checkboxfilter e-filter-popup'
        });
        this.sBox = createElement('div', { className: 'e-searchcontainer' });
        if (!options.hideSearchbox) {
            this.sInput = createElement('input', {
                id: this.id + '_SearchBox',
                className: 'e-searchinput'
            });
            this.sIcon = createElement('span', {
                className: 'e-searchclear e-search-icon e-icons', attrs: {
                    type: 'text', placeholder: this.getLocalizedLabel('Search')
                }
            });
            this.searchBox = createElement('span', { className: 'e-searchbox e-fields' });
            this.searchBox.appendChild(this.sInput);
            this.sBox.appendChild(this.searchBox);
            Input.createInput({
                element: this.sInput, floatLabelType: 'Never', properties: {
                    placeholder: this.getLocalizedLabel('Search')
                }
            });
            this.searchBox.querySelector('.e-input-group').appendChild(this.sIcon);
        }
        this.spinner = createElement('div', { className: 'e-spinner' }); //for spinner
        this.cBox = createElement('div', {
            id: this.id + this.options.type + '_CheckBoxList',
            className: 'e-checkboxlist e-fields'
        });
        this.spinner.appendChild(this.cBox);
        this.sBox.appendChild(this.spinner);
        return this.sBox;
    };
    CheckBoxFilter.prototype.showDialog = function (options) {
        var args = {
            requestType: events.filterBeforeOpen, filterModel: this,
            columnName: this.options.field, columnType: this.options.type
        };
        this.parent.trigger(events.actionBegin, args);
        this.dialogObj = new Dialog({
            visible: false, content: this.sBox,
            close: this.closeDialog.bind(this),
            width: (!isNullOrUndefined(parentsUntil(options.target, 'e-bigger')))
                || this.parent.element.classList.contains('e-device') ? 260 : 250,
            target: this.parent.element, animationSettings: { effect: 'None' },
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
        this.dialogObj.appendTo(this.dlg);
        this.dialogObj.element.style.maxHeight = '800px';
        this.dialogObj.show();
        this.wireEvents();
        createSpinner({ target: this.spinner });
        showSpinner(this.spinner);
        this.getAllData();
    };
    CheckBoxFilter.prototype.dialogCreated = function (e) {
        if (!Browser.isDevice) {
            getFilterMenuPostion(this.options.target, this.dialogObj);
        }
        else {
            this.dialogObj.position = { X: 'center', Y: 'center' };
        }
        this.parent.notify(events.filterDialogCreated, e);
    };
    CheckBoxFilter.prototype.openDialog = function (options) {
        this.updateModel(options);
        this.getAndSetChkElem(options);
        this.showDialog(options);
    };
    CheckBoxFilter.prototype.closeDialog = function () {
        if (this.dialogObj && !this.dialogObj.isDestroyed) {
            this.parent.notify(events.filterMenuClose, { field: this.options.field });
            this.dialogObj.destroy();
            this.unWireEvents();
            remove(this.dlg);
            this.dlg = null;
        }
    };
    CheckBoxFilter.prototype.btnClick = function (e) {
        var text = e.target.innerText.toLowerCase();
        if (this.getLocalizedLabel(this.isExcel ? 'OK' : 'Filter').toLowerCase() === text) {
            this.fltrBtnHandler();
        }
        else if (this.getLocalizedLabel('Clear').toLowerCase() === text) {
            this.options.handler({ action: 'clear-filter', field: this.options.field });
        }
        this.closeDialog();
    };
    CheckBoxFilter.prototype.fltrBtnHandler = function () {
        var checked = [].slice.call(this.cBox.querySelectorAll('.e-check:not(.e-selectall)'));
        var optr = 'equal';
        var caseSen = this.options.type === 'string' ?
            this.options.allowCaseSensitive : true;
        var defaults = {
            field: this.options.field, predicate: 'or',
            operator: optr, matchcase: caseSen
        };
        var isNotEqual = this.itemsCnt !== checked.length && this.itemsCnt - checked.length < checked.length;
        if (isNotEqual) {
            optr = 'notequal';
            checked = [].slice.call(this.cBox.querySelectorAll('.e-uncheck:not(.e-selectall)'));
            defaults.predicate = 'and';
            defaults.operator = 'notequal';
        }
        var value;
        var fObj;
        var coll = [];
        for (var i = 0; i < checked.length; i++) {
            value = this.values[parentsUntil(checked[i], 'e-ftrchk').getAttribute('uid')];
            fObj = extend({}, { value: value }, defaults);
            if (value && !value.toString().length) {
                fObj.operator = isNotEqual ? 'notequal' : 'equal';
            }
            coll.push(this.options.type === 'date' ? CheckBoxFilter.setDateObject(fObj) : fObj);
        }
        this.initiateFilter(coll);
    };
    CheckBoxFilter.prototype.initiateFilter = function (fColl) {
        var firstVal = fColl[0];
        var predicate;
        if (!isNullOrUndefined(firstVal)) {
            predicate = firstVal.ejpredicate ? firstVal.ejpredicate :
                new Predicate(firstVal.field, firstVal.operator, firstVal.value, !firstVal.matchcase);
            for (var j = 1; j < fColl.length; j++) {
                predicate = fColl[j].ejpredicate !== undefined ?
                    predicate[fColl[j].predicate](fColl[j].ejpredicate) :
                    predicate[fColl[j].predicate](fColl[j].field, fColl[j].operator, fColl[j].value, !fColl[j].matchcase);
            }
            var args = {
                action: 'filtering', filterCollection: fColl, field: this.options.field,
                ejpredicate: Predicate.or(predicate)
            };
            this.options.handler(args);
        }
    };
    CheckBoxFilter.prototype.refreshCheckboxes = function () {
        var val = this.sInput.value;
        var query = this.options.query.clone();
        var parsed = (this.options.type !== 'string' && parseFloat(val)) ? parseFloat(val) : val;
        var operator = 'contains';
        var matchcase = true;
        parsed = (parsed === '' || parsed === undefined) ? undefined : parsed;
        if (this.options.type === 'boolean') {
            if (parsed !== undefined &&
                this.getLocalizedLabel('True').toLowerCase().indexOf(parsed.toLowerCase()) !== -1) {
                parsed = 'true';
            }
            else if (parsed !== undefined &&
                this.getLocalizedLabel('False').toLowerCase().indexOf(parsed.toLowerCase()) !== -1) {
                parsed = 'false';
            }
        }
        if (this.options.type === 'date' || this.options.type === 'datetime') {
            parsed = this.valueFormatter.fromView(val, this.options.parserFn, this.options.type);
            operator = 'equal';
            if (isNullOrUndefined(parsed) && val.length) {
                return;
            }
        }
        if (val.length) {
            query.where(this.options.field, operator, parsed, matchcase);
        }
        this.processDataSource(query);
    };
    CheckBoxFilter.prototype.getPredicateFromCols = function (columns) {
        var predicate;
        var predicates = CheckBoxFilter.getPredicate(columns);
        for (var _i = 0, _a = Object.keys(predicates); _i < _a.length; _i++) {
            var prop = _a[_i];
            var and = 'and';
            var obj = predicates[prop];
            predicate = !isNullOrUndefined(predicate) ?
                predicate[and](obj) :
                obj;
        }
        return predicate;
    };
    CheckBoxFilter.prototype.getAllData = function () {
        var _this = this;
        var query = new Query();
        query.requiresCount(); //consider take query
        this.options.dataSource = this.options.dataSource instanceof DataManager ?
            this.options.dataSource : new DataManager(this.options.dataSource);
        var promise = this.options.dataSource.executeQuery(query);
        promise.then(function (e) { return _this.dataSuccess(e); });
    };
    CheckBoxFilter.prototype.dataSuccess = function (e) {
        this.fullData = e.result;
        var query = new Query();
        if ((this.options.filteredColumns.length)) {
            var cols = [];
            for (var i = 0; i < this.options.filteredColumns.length; i++) {
                if (this.options.filteredColumns[i].field !== this.options.field) {
                    cols.push(this.options.filteredColumns[i]);
                }
            }
            var predicate = this.getPredicateFromCols(cols);
            if (predicate) {
                query.where(predicate);
            }
        }
        // query.select(this.options.field);
        var result = new DataManager(this.fullData).executeLocal(query);
        var res = CheckBoxFilter.getDistinct(result, this.options.field);
        this.filteredData = res.records;
        this.processDataSource(null, true);
        var args = {
            requestType: events.filterAfterOpen,
            filterModel: this, columnName: this.options.field, columnType: this.options.type
        };
        this.parent.trigger(events.actionComplete, args);
    };
    CheckBoxFilter.prototype.processDataSource = function (query, isInitial) {
        showSpinner(this.spinner);
        query = query ? query : this.options.query.clone();
        query.requiresCount();
        var args = {
            requestType: events.filterChoiceRequest, filterModel: this, query: query,
            dataSource: this.filteredData
        };
        this.parent.trigger(events.actionBegin, args);
        var result = new DataManager(args.dataSource).executeLocal(args.query);
        var res = result;
        this.updateResult();
        this.createFilterItems(res.result, isInitial);
    };
    CheckBoxFilter.prototype.updateResult = function () {
        this.result = {};
        var predicate = this.getPredicateFromCols(this.options.filteredColumns);
        var query = new Query();
        if (predicate) {
            query.where(predicate);
        }
        var result = new DataManager(this.fullData).executeLocal(query);
        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
            var res = result_1[_i];
            this.result[res[this.options.field]] = true;
        }
    };
    CheckBoxFilter.prototype.clickHandler = function (e) {
        var target = e.target;
        var elem = parentsUntil(target, 'e-checkbox-wrapper');
        if (parentsUntil(target, 'e-searchbox')) {
            this.searchBoxClick(e);
        }
        if (elem) {
            var selectAll = elem.querySelector('.e-selectall');
            if (selectAll) {
                this.updateAllCBoxes(!selectAll.classList.contains('e-check'));
            }
            else {
                toogleCheckbox(elem.parentElement);
            }
            this.updateIndeterminatenBtn();
            elem.querySelector('.e-chk-hidden').focus();
        }
    };
    CheckBoxFilter.prototype.updateAllCBoxes = function (checked) {
        var cBoxes = [].slice.call(this.cBox.querySelectorAll('.e-frame'));
        for (var _i = 0, cBoxes_1 = cBoxes; _i < cBoxes_1.length; _i++) {
            var cBox = cBoxes_1[_i];
            removeAddCboxClasses(cBox, checked);
        }
    };
    CheckBoxFilter.prototype.dialogOpen = function () {
        if (this.parent.element.classList.contains('e-device')) {
            this.dialogObj.element.querySelector('.e-input-group').classList.remove('e-input-focus');
            this.dialogObj.element.querySelector('.e-btn').focus();
        }
    };
    CheckBoxFilter.prototype.createCheckbox = function (value, checked) {
        var elem = checked ? this.cBoxTrue.cloneNode(true) :
            this.cBoxFalse.cloneNode(true);
        var label = elem.querySelector('.e-label');
        label.innerHTML = !isNullOrUndefined(value) && value.toString().length ? value :
            this.getLocalizedLabel('Blanks');
        if (this.options.template) {
            label.innerHTML = '';
            var args = {};
            args[this.options.field] = value;
            appendChildren(label, this.options.template(args));
        }
        return elem;
    };
    CheckBoxFilter.prototype.updateIndeterminatenBtn = function () {
        var cnt = this.cBox.children.length - 1;
        var className = [];
        var elem = this.cBox.querySelector('.e-selectall');
        var selected = this.cBox.querySelectorAll('.e-check:not(.e-selectall)').length;
        var btn = this.dlg.querySelector('.e-footer-content').querySelector('.e-btn').ej2_instances[0];
        btn.disabled = false;
        if (cnt === selected) {
            className = ['e-check'];
        }
        else if (selected) {
            className = ['e-stop'];
        }
        else {
            btn.disabled = true;
        }
        removeClass([elem], ['e-check', 'e-stop', 'e-uncheck']);
        addClass([elem], className);
    };
    CheckBoxFilter.prototype.createFilterItems = function (data, isInitial) {
        var cBoxes = createElement('div');
        this.itemsCnt = data.length;
        if (data.length) {
            var selectAll = createCboxWithWrap(getUid('cbox'), this.createCheckbox(this.getLocalizedLabel('SelectAll'), false), 'e-ftrchk');
            selectAll.querySelector('.e-frame').classList.add('e-selectall');
            cBoxes.appendChild(selectAll);
            var isColFiltered = new DataManager(this.options.filteredColumns).executeLocal(new Query().where('field', 'equal', this.options.field)).length;
            for (var i = 0; i < data.length; i++) {
                var uid = getUid('cbox');
                this.values[uid] = getValue(this.options.field, data[i]);
                var value = this.valueFormatter.toView(getValue(this.options.field, data[i]), this.options.formatFn);
                cBoxes.appendChild(createCboxWithWrap(uid, this.createCheckbox(value, this.getCheckedState(isColFiltered, this.values[uid])), 'e-ftrchk'));
            }
            this.cBox.innerHTML = cBoxes.innerHTML;
            this.updateIndeterminatenBtn();
        }
        else {
            cBoxes.appendChild(createElement('span', { innerHTML: this.getLocalizedLabel('NoResult') }));
            this.cBox.innerHTML = cBoxes.innerHTML;
        }
        var args = { requestType: events.filterChoiceRequest, filterModel: this, dataSource: data };
        this.parent.trigger(events.actionComplete, args);
        hideSpinner(this.spinner);
    };
    CheckBoxFilter.prototype.getCheckedState = function (isColFiltered, value) {
        if (!this.isFiltered || !isColFiltered) {
            return true;
        }
        else {
            return this.result[value];
        }
    };
    CheckBoxFilter.getDistinct = function (json, field) {
        var len = json.length;
        var result = [];
        var value;
        var ejValue = 'ejValue';
        var lookup = {};
        while (len--) {
            value = json[len];
            value = getValue(field, value); //local remote diff, check with mdu           
            if (!isNullOrUndefined(value)) {
                if (!(value in lookup)) {
                    var obj = {};
                    obj[ejValue] = value;
                    setValue(field, value, obj);
                    result.push(obj);
                }
                lookup[value] = true;
            }
        }
        return DataUtil.group(DataUtil.sort(result, field, DataUtil.fnAscending), 'ejValue');
    };
    CheckBoxFilter.setDateObject = function (filterObject) {
        var prevObj = extend({}, getActualProperties(filterObject));
        var nextObj = extend({}, getActualProperties(filterObject));
        var value = new Date(filterObject.value);
        var prevDate = new Date(value.setDate(value.getDate() - 1));
        var nextDate = new Date(value.setDate(value.getDate() + 2));
        prevObj.value = prevDate;
        nextObj.value = nextDate;
        if (filterObject.operator === 'equal') {
            nextObj.operator = 'lessthan';
            nextObj.predicate = 'and';
            prevObj.operator = 'greaterthan';
            prevObj.predicate = 'and';
        }
        else if (filterObject.operator === 'notequal') {
            nextObj.operator = 'greaterthanorequal';
            nextObj.predicate = 'or';
            prevObj.operator = 'lessthanorequal';
            prevObj.predicate = 'or';
        }
        var predicateSt = new Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
        var predicateEnd = new Predicate(nextObj.field, nextObj.operator, nextObj.value, false);
        filterObject.ejpredicate = filterObject.operator === 'equal' ? predicateSt.and(predicateEnd) :
            predicateSt.or(predicateEnd);
        filterObject.type = 'date';
        return filterObject;
    };
    CheckBoxFilter.getPredicate = function (columns) {
        var cols = CheckBoxFilter.getDistinct(columns, 'field').records;
        var collection;
        var pred = {};
        for (var i = 0; i < cols.length; i++) {
            collection = new DataManager(columns).executeLocal(new Query().where('field', 'equal', cols[i].field));
            pred[cols[i].field] = CheckBoxFilter.generatePredicate(collection);
        }
        return pred;
    };
    CheckBoxFilter.generatePredicate = function (cols) {
        var len = cols ? cols.length : 0;
        var predicate;
        var first;
        first = CheckBoxFilter.updateDateFilter(cols[0]);
        if (first.type === 'date' || first.type === 'datetime') {
            predicate = CheckBoxFilter.getDatePredicate(first);
        }
        else {
            predicate = first.ejpredicate ? first.ejpredicate :
                new Predicate(first.field, first.operator, first.value, first.ignoreCase || !first.matchcase);
        }
        for (var p = 1; p < len; p++) {
            cols[p] = CheckBoxFilter.updateDateFilter(cols[p]);
            if (len > 2 && p > 1 && cols[p].predicate === 'or') {
                if (cols[p].type === 'date' || cols[p].type === 'datetime') {
                    predicate.predicates.push(CheckBoxFilter.getDatePredicate(cols[p]));
                }
                else {
                    predicate.predicates.push(new Predicate(cols[p].field, cols[p].operator, cols[p].value, cols[p].ignoreCase || !cols[p].matchcase));
                }
            }
            else {
                if (cols[p].type === 'date' || cols[p].type === 'datetime') {
                    predicate = predicate[(cols[p].predicate)](CheckBoxFilter.getDatePredicate(cols[p]));
                }
                else {
                    predicate = cols[p].ejpredicate ?
                        predicate[cols[p].predicate](cols[p].ejpredicate) :
                        predicate[(cols[p].predicate)](cols[p].field, cols[p].operator, cols[p].value, cols[p].ignoreCase || !cols[p].matchcase);
                }
            }
        }
        return predicate || null;
    };
    CheckBoxFilter.getDatePredicate = function (predicate) {
        return new Predicate(predicate.field, predicate.operator, predicate.value, predicate.ignoreCase || !predicate.matchcase);
    };
    CheckBoxFilter.updateDateFilter = function (filter) {
        if (filter.type !== 'date' && !(filter.value instanceof Date)) {
            return filter;
        }
        return ['equal', 'notequal'].indexOf(filter.operator) === -1 ? filter :
            CheckBoxFilter.setDateObject(filter);
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    CheckBoxFilter.prototype.getModuleName = function () {
        return 'checkboxFilter';
    };
    return CheckBoxFilter;
}());
export { CheckBoxFilter };
