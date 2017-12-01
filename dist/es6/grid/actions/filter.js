import { EventHandler, isNullOrUndefined, extend, closest } from '@syncfusion/ej2-base';
import { getActualPropFromColl, isActionPrevent } from '../base/util';
import { remove, createElement, matches } from '@syncfusion/ej2-base';
import { DataUtil, Query, DataManager } from '@syncfusion/ej2-data';
import * as events from '../base/constant';
import { CellType } from '../base/enum';
import { RowRenderer } from '../renderer/row-renderer';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import { FilterCellRenderer } from '../renderer/filter-cell-renderer';
import { parentsUntil } from '../base/util';
import { FilterMenuRenderer } from '../renderer/filter-menu-renderer';
import { CheckBoxFilter } from '../actions/checkbox-filter';
import { ExcelFilter } from '../actions/excel-filter';
/**
 *
 * `Filter` module is used to handle filtering action.
 */
var Filter = /** @class */ (function () {
    /**
     * Constructor for Grid filtering module
     * @hidden
     */
    function Filter(parent, filterSettings, serviceLocator) {
        this.predicate = 'and';
        this.contentRefresh = true;
        this.values = {};
        this.nextFlMenuOpen = '';
        this.type = { 'menu': FilterMenuRenderer, 'checkbox': CheckBoxFilter, 'excel': ExcelFilter };
        this.filterOperators = {
            contains: 'contains', endsWith: 'endswith', equal: 'equal', greaterThan: 'greaterthan', greaterThanOrEqual: 'greaterthanorequal',
            lessThan: 'lessthan', lessThanOrEqual: 'lessthanorequal', notEqual: 'notequal', startsWith: 'startswith'
        };
        this.fltrDlgDetails = { field: '', isOpen: false };
        this.parent = parent;
        this.filterSettings = filterSettings;
        this.serviceLocator = serviceLocator;
        this.addEventListener();
    }
    /**
     * To render filter bar when filtering enabled.
     * @return {void}
     * @hidden
     */
    Filter.prototype.render = function () {
        var gObj = this.parent;
        this.l10n = this.serviceLocator.getService('localization');
        this.getLocalizedCustomOperators();
        if (this.parent.filterSettings.type === 'filterbar') {
            if (gObj.columns.length) {
                var fltrElem = gObj.element.querySelector('.e-filterbar');
                if (fltrElem) {
                    remove(fltrElem);
                }
                var rowRenderer = new RowRenderer(this.serviceLocator, CellType.Filter, gObj);
                var row = void 0;
                var cellrender = this.serviceLocator.getService('cellRendererFactory');
                cellrender.addCellRenderer(CellType.Filter, new FilterCellRenderer(this.parent, this.serviceLocator));
                this.valueFormatter = this.serviceLocator.getService('valueFormatter');
                rowRenderer.element = createElement('tr', { className: 'e-filterbar' });
                row = this.generateRow();
                row.data = this.values;
                this.element = rowRenderer.render(row, gObj.getColumns());
                this.parent.getHeaderContent().querySelector('thead').appendChild(this.element);
                var detail = this.element.querySelector('.e-detailheadercell');
                if (detail) {
                    detail.className = 'e-filterbarcell e-mastercell';
                }
                var gCells = [].slice.call(this.element.querySelectorAll('.e-grouptopleftcell'));
                if (gCells.length) {
                    gCells[gCells.length - 1].classList.add('e-lastgrouptopleftcell');
                }
                this.wireEvents();
                this.parent.notify(events.freezeRender, { case: 'filter' });
            }
        }
    };
    /**
     * To destroy the filter bar.
     * @return {void}
     * @hidden
     */
    Filter.prototype.destroy = function () {
        if (this.filterModule) {
            this.filterModule.destroy();
        }
        this.filterSettings.columns = [];
        this.updateFilterMsg();
        this.removeEventListener();
        this.unWireEvents();
        if (this.element) {
            remove(this.element);
            if (this.parent.frozenColumns) {
                remove(this.parent.getHeaderContent().querySelector('.e-filterbar'));
            }
        }
    };
    Filter.prototype.generateRow = function (index) {
        var options = {};
        var row = new Row(options);
        row.cells = this.generateCells();
        return row;
    };
    Filter.prototype.generateCells = function () {
        //TODO: generate dummy column for group, detail, stacked row here for filtering;
        var cells = [];
        if (this.parent.allowGrouping) {
            for (var c = 0, len = this.parent.groupSettings.columns.length; c < len; c++) {
                cells.push(this.generateCell({}, CellType.HeaderIndent));
            }
        }
        if (this.parent.detailTemplate || this.parent.childGrid) {
            cells.push(this.generateCell({}, CellType.DetailHeader));
        }
        for (var _i = 0, _a = this.parent.getColumns(); _i < _a.length; _i++) {
            var dummy = _a[_i];
            cells.push(this.generateCell(dummy));
        }
        return cells;
    };
    Filter.prototype.generateCell = function (column, cellType) {
        var opt = {
            'visible': column.visible,
            'isDataCell': false,
            'rowId': '',
            'column': column,
            'cellType': cellType ? cellType : CellType.Filter,
            'attributes': { title: this.l10n.getConstant('FilterbarTitle') }
        };
        return new Cell(opt);
    };
    /**
     * To update filterSettings when applying filter.
     * @return {void}
     * @hidden
     */
    Filter.prototype.updateModel = function () {
        this.currentFilterObject = {
            field: this.fieldName, operator: this.operator, value: this.value, predicate: this.predicate,
            matchCase: this.matchCase, actualFilterValue: {}, actualOperator: {}
        };
        var index = this.getFilteredColsIndexByField(this.fieldName);
        if (index > -1) {
            this.filterSettings.columns[index] = this.currentFilterObject;
        }
        else {
            this.filterSettings.columns.push(this.currentFilterObject);
        }
        this.filterSettings.columns = this.filterSettings.columns;
        this.parent.dataBind();
    };
    Filter.prototype.getFilteredColsIndexByField = function (field) {
        var cols = this.filterSettings.columns;
        for (var i = 0, len = cols.length; i < len; i++) {
            if (cols[i].field === field) {
                return i;
            }
        }
        return -1;
    };
    /**
     * To trigger action complete event.
     * @return {void}
     * @hidden
     */
    Filter.prototype.onActionComplete = function (e) {
        var args = !this.isRemove ? {
            currentFilterObject: this.currentFilterObject, currentFilteringColumn: this.column.field,
            columns: this.filterSettings.columns, requestType: 'filtering', type: events.actionComplete
        } : {
            requestType: 'filtering', type: events.actionComplete
        };
        this.parent.trigger(events.actionComplete, extend(e, args));
        this.isRemove = false;
    };
    Filter.prototype.wireEvents = function () {
        EventHandler.add(this.parent.getHeaderContent(), 'mousedown', this.updateSpanClass, this);
        EventHandler.add(this.parent.element, 'focusin', this.updateSpanClass, this);
        EventHandler.add(this.parent.getHeaderContent(), 'keyup', this.keyUpHandler, this);
    };
    Filter.prototype.unWireEvents = function () {
        EventHandler.remove(this.parent.element, 'focusin', this.updateSpanClass);
        EventHandler.remove(this.parent.getHeaderContent(), 'mousedown', this.updateSpanClass);
        EventHandler.remove(this.parent.getHeaderContent(), 'keyup', this.keyUpHandler);
    };
    Filter.prototype.enableAfterRender = function (e) {
        if (e.module === this.getModuleName() && e.enable) {
            this.render();
        }
    };
    Filter.prototype.initialEnd = function () {
        this.parent.off(events.contentReady, this.initialEnd);
        if (this.parent.getColumns().length && this.filterSettings.columns.length) {
            var gObj = this.parent;
            this.contentRefresh = false;
            for (var _i = 0, _a = gObj.filterSettings.columns; _i < _a.length; _i++) {
                var col = _a[_i];
                this.filterByColumn(col.field, col.operator, col.value, col.predicate, col.matchCase, col.actualFilterValue, col.actualOperator);
            }
            this.updateFilterMsg();
            this.contentRefresh = true;
        }
    };
    /**
     * @hidden
     */
    Filter.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.filterComplete, this.onActionComplete, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.keyPressed, this.keyUpHandler, this);
        this.parent.on(events.columnPositionChanged, this.columnPositionChanged, this);
        this.parent.on(events.headerRefreshed, this.render, this);
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.on(events.filterMenuClose, this.filterMenuClose, this);
        EventHandler.add(document, 'click', this.clickHandler, this);
        this.parent.on(events.filterOpen, this.columnMenuFilter, this);
        this.parent.on(events.click, this.filterIconClickHandler, this);
    };
    /**
     * @hidden
     */
    Filter.prototype.removeEventListener = function () {
        EventHandler.remove(document, 'click', this.clickHandler);
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        this.parent.off(events.filterComplete, this.onActionComplete);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.keyPressed, this.keyUpHandler);
        this.parent.off(events.columnPositionChanged, this.columnPositionChanged);
        this.parent.off(events.headerRefreshed, this.render);
        this.parent.off(events.filterOpen, this.columnMenuFilter);
        this.parent.off(events.filterMenuClose, this.filterMenuClose);
        this.parent.off(events.click, this.filterIconClickHandler);
    };
    Filter.prototype.filterMenuClose = function (args) {
        this.fltrDlgDetails.isOpen = false;
    };
    Filter.prototype.columnMenuFilter = function (args) {
        this.column = args.col;
        var ele = closest(args.target, '#' + args.id);
        if (args.isClose && !ele) {
            this.filterModule.closeDialog();
        }
        else if (ele) {
            this.filterDialogOpen(this.column, args.target);
        }
    };
    Filter.prototype.filterDialogOpen = function (col, target, left, top) {
        var gObj = this.parent;
        if (this.filterModule) {
            this.filterModule.closeDialog();
        }
        this.filterModule = new this.type[col.filter.type || this.parent.filterSettings.type](this.parent, gObj.filterSettings, this.serviceLocator, this.customOperators, this);
        this.filterModule.openDialog({
            type: col.type, field: col.field, displayName: col.headerText,
            dataSource: col.filter.dataSource || gObj.dataSource, format: col.format,
            filteredColumns: gObj.filterSettings.columns, target: target,
            sortedColumns: gObj.sortSettings.columns, formatFn: col.getFormatter(),
            parserFn: col.getParser(), query: gObj.query, template: col.getFilterItemTemplate(),
            hideSearchbox: isNullOrUndefined(col.filter.hideSearchbox) ? false : col.filter.hideSearchbox,
            handler: this.filterHandler.bind(this), localizedStrings: {},
            position: { X: left, Y: top }
        });
    };
    /**
     * Filters grid row by column name with given options.
     * @param  {string} fieldName - Defines the field name of the filter column.
     * @param  {string} filterOperator - Defines the operator by how to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value which is used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query with another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case set to true, then filter records with exact match or else
     * filter records with case insensitive(uppercase and lowercase letters treated as same).
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column.
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column.
     * @return {void}
     */
    Filter.prototype.filterByColumn = function (fieldName, filterOperator, filterValue, predicate, matchCase, actualFilterValue, actualOperator) {
        var gObj = this.parent;
        var filterCell;
        this.column = gObj.getColumnByField(fieldName);
        if (this.filterSettings.type === 'filterbar') {
            filterCell = gObj.getHeaderContent().querySelector('#' + this.column.field + '_filterBarcell');
        }
        if (!isNullOrUndefined(this.column.allowFiltering) && !this.column.allowFiltering) {
            return;
        }
        if (isActionPrevent(gObj)) {
            gObj.notify(events.preventBatch, {
                instance: this, handler: this.filterByColumn, arg1: fieldName, arg2: filterOperator, arg3: filterValue, arg4: predicate,
                arg5: matchCase, arg6: actualFilterValue, arg7: actualOperator
            });
            return;
        }
        this.value = filterValue;
        this.matchCase = matchCase || false;
        this.fieldName = fieldName;
        this.predicate = predicate || 'and';
        this.operator = filterOperator;
        filterValue = !isNullOrUndefined(filterValue) && filterValue.toString();
        if (this.column.type === 'number' || this.column.type === 'date') {
            this.matchCase = true;
        }
        this.values[this.column.field] = filterValue;
        gObj.getColumnHeaderByField(fieldName).setAttribute('aria-filtered', 'true');
        if (filterValue.length < 1 || this.checkForSkipInput(this.column, filterValue)) {
            this.filterStatusMsg = filterValue.length < 1 ? '' : this.l10n.getConstant('InvalidFilterMessage');
            this.updateFilterMsg();
            return;
        }
        if (this.filterSettings.type === 'filterbar' && filterCell.value !== filterValue) {
            filterCell.value = filterValue;
        }
        if (this.checkAlreadyColFiltered(this.column.field)) {
            return;
        }
        this.updateModel();
    };
    Filter.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        for (var _i = 0, _a = Object.keys(e.properties); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'columns':
                    if (this.contentRefresh) {
                        this.parent.notify(events.modelChanged, {
                            currentFilterObject: this.currentFilterObject, currentFilteringColumn: this.column ?
                                this.column.field : undefined,
                            columns: this.filterSettings.columns, requestType: 'filtering', type: events.actionBegin
                        });
                        this.updateFilterMsg();
                    }
                    break;
                case 'showFilterBarStatus':
                    if (e.properties[prop]) {
                        this.updateFilterMsg();
                    }
                    else if (this.parent.allowPaging) {
                        this.parent.updateExternalMessage('');
                    }
                    break;
                case 'type':
                    this.parent.refreshHeader();
                    break;
            }
        }
    };
    /**
     * Clears all the filtered rows of Grid.
     * @return {void}
     */
    Filter.prototype.clearFiltering = function () {
        var cols = getActualPropFromColl(this.filterSettings.columns);
        if (isActionPrevent(this.parent)) {
            this.parent.notify(events.preventBatch, { instance: this, handler: this.clearFiltering });
            return;
        }
        for (var i = 0, len = cols.length; i < len; i++) {
            this.removeFilteredColsByField(cols[i].field, true);
        }
        this.isRemove = true;
        this.filterStatusMsg = '';
        this.updateFilterMsg();
    };
    Filter.prototype.checkAlreadyColFiltered = function (field) {
        var columns = this.filterSettings.columns;
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var col = columns_1[_i];
            if (col.field === field && col.value === this.value &&
                col.operator === this.operator && col.predicate === this.predicate) {
                return true;
            }
        }
        return false;
    };
    /**
     * Removes filtered column by field name.
     * @param  {string} field - Defines column field name to remove filter.
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.
     * @return {void}
     * @hidden
     */
    Filter.prototype.removeFilteredColsByField = function (field, isClearFilterBar) {
        var fCell;
        var cols = this.filterSettings.columns;
        if (isActionPrevent(this.parent)) {
            this.parent.notify(events.preventBatch, {
                instance: this, handler: this.removeFilteredColsByField,
                arg1: field, arg2: isClearFilterBar
            });
            return;
        }
        for (var i = 0, len = cols.length; i < len; i++) {
            if (cols[i].field === field) {
                if (this.filterSettings.type === 'filterbar' && !isClearFilterBar) {
                    fCell = this.parent.getHeaderContent().querySelector('#' + cols[i].field + '_filterBarcell');
                    delete this.values[field];
                }
                cols.splice(i, 1);
                var fltrElement = this.parent.getColumnHeaderByField(field);
                fltrElement.removeAttribute('aria-filtered');
                if (this.filterSettings.type !== 'filterbar') {
                    fltrElement.querySelector('.e-icon-filter').classList.remove('e-filtered');
                }
                this.isRemove = true;
                this.parent.notify(events.modelChanged, {
                    requestType: 'filtering', type: events.actionBegin
                });
                break;
            }
        }
        this.updateFilterMsg();
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Filter.prototype.getModuleName = function () {
        return 'filter';
    };
    Filter.prototype.keyUpHandler = function (e) {
        var gObj = this.parent;
        var target = e.target;
        if (target && matches(target, '.e-filterbar input')) {
            this.column = gObj.getColumnByField(target.id.split('_')[0]);
            if (!this.column) {
                return;
            }
            this.updateCrossIcon(target);
            if ((this.filterSettings.mode === 'immediate' || e.keyCode === 13) && e.keyCode !== 9) {
                this.value = target.value.trim();
                this.processFilter(e);
            }
        }
    };
    Filter.prototype.updateSpanClass = function (e) {
        var target = e.target;
        if (e.type === 'mousedown' && target.classList.contains('e-cancel')) {
            var targetText = target.previousElementSibling;
            targetText.value = '';
            target.classList.add('e-hide');
            targetText.focus();
            e.preventDefault();
        }
        if (e.type === 'focusin' && target.classList.contains('e-filtertext') && !target.disabled) {
            if (this.lastFilterElement) {
                this.lastFilterElement.nextElementSibling.classList.add('e-hide');
            }
            this.updateCrossIcon(target);
            this.lastFilterElement = target;
        }
        if (e.type === 'focusin' && !target.classList.contains('e-filtertext') && this.lastFilterElement) {
            this.lastFilterElement.nextElementSibling.classList.add('e-hide');
        }
        return false;
    };
    Filter.prototype.updateCrossIcon = function (element) {
        if (element.value.length) {
            element.nextElementSibling.classList.remove('e-hide');
        }
    };
    Filter.prototype.updateFilterMsg = function () {
        if (this.filterSettings.type === 'filterbar') {
            var gObj = this.parent;
            var columns = this.filterSettings.columns;
            var formater = this.serviceLocator.getService('valueFormatter');
            var column = void 0;
            var value = void 0;
            if (!this.filterSettings.showFilterBarStatus) {
                return;
            }
            if (columns.length > 0 && this.filterStatusMsg !== this.l10n.getConstant('InvalidFilterMessage')) {
                this.filterStatusMsg = '';
                for (var index = 0; index < columns.length; index++) {
                    column = gObj.getColumnByField(columns[index].field);
                    if (index) {
                        this.filterStatusMsg += ' && ';
                    }
                    this.filterStatusMsg += column.headerText + ': ' + this.values[column.field];
                }
            }
            if (gObj.allowPaging) {
                gObj.updateExternalMessage(this.filterStatusMsg);
            }
            //TODO: virtual paging       
            this.filterStatusMsg = '';
        }
    };
    Filter.prototype.checkForSkipInput = function (column, value) {
        var isSkip;
        var skipInput;
        if (column.type === 'number') {
            skipInput = ['=', ' ', '!'];
            if (DataUtil.operatorSymbols[value] || skipInput.indexOf(value) > -1) {
                isSkip = true;
            }
        }
        else if (column.type === 'string') {
            skipInput = ['>', '<', '=', '!'];
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var val = value_1[_i];
                if (skipInput.indexOf(val) > -1) {
                    isSkip = true;
                }
            }
        }
        return isSkip;
    };
    Filter.prototype.processFilter = function (e) {
        this.stopTimer();
        this.startTimer(e);
    };
    Filter.prototype.startTimer = function (e) {
        var _this = this;
        this.timer = window.setInterval(function () { _this.onTimerTick(); }, e.keyCode === 13 ? 0 : this.filterSettings.immediateModeDelay);
    };
    Filter.prototype.stopTimer = function () {
        window.clearInterval(this.timer);
    };
    Filter.prototype.onTimerTick = function () {
        var filterElement = this.parent.getHeaderContent()
            .querySelector('#' + this.column.field + '_filterBarcell');
        var filterValue = JSON.parse(JSON.stringify(filterElement.value));
        this.stopTimer();
        if (this.value === '') {
            this.removeFilteredColsByField(this.column.field);
            return;
        }
        this.validateFilterValue(this.value);
        this.filterByColumn(this.column.field, this.operator, this.value, this.predicate, this.matchCase);
        this.values[this.column.field] = filterValue;
        filterElement.value = filterValue;
        this.updateFilterMsg();
    };
    Filter.prototype.validateFilterValue = function (value) {
        var gObj = this.parent;
        var skipInput;
        var index;
        this.matchCase = true;
        switch (this.column.type) {
            case 'number':
                this.operator = this.filterOperators.equal;
                skipInput = ['>', '<', '=', '!'];
                for (var i = 0; i < value.length; i++) {
                    if (skipInput.indexOf(value[i]) > -1) {
                        index = i;
                        break;
                    }
                }
                this.getOperator(value.substring(index));
                if (index !== 0) {
                    this.value = value.substring(0, index);
                }
                if (this.value !== '' && value.length >= 1) {
                    this.value = this.valueFormatter.fromView(this.value, this.column.getParser(), this.column.type);
                }
                if (isNaN(this.value)) {
                    this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                }
                break;
            case 'date':
            case 'datetime':
                this.operator = this.filterOperators.equal;
                this.getOperator(value);
                if (this.value !== '') {
                    this.value = this.valueFormatter.fromView(this.value, this.column.getParser(), this.column.type);
                    if (isNullOrUndefined(this.value)) {
                        this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                    }
                }
                break;
            case 'string':
                this.matchCase = false;
                if (value.charAt(0) === '*') {
                    this.value = this.value.slice(1);
                    this.operator = this.filterOperators.startsWith;
                }
                else if (value.charAt(value.length - 1) === '%') {
                    this.value = this.value.slice(0, -1);
                    this.operator = this.filterOperators.startsWith;
                }
                else if (value.charAt(0) === '%') {
                    this.value = this.value.slice(1);
                    this.operator = this.filterOperators.endsWith;
                }
                else {
                    this.operator = this.filterOperators.startsWith;
                }
                break;
            case 'boolean':
                if (value.toLowerCase() === 'true' || value === '1') {
                    this.value = true;
                }
                else if (value.toLowerCase() === 'false' || value === '0') {
                    this.value = false;
                }
                else if (value.length) {
                    this.filterStatusMsg = this.l10n.getConstant('InvalidFilterMessage');
                }
                this.operator = this.filterOperators.equal;
                break;
            default:
                this.operator = this.filterOperators.equal;
        }
    };
    Filter.prototype.getOperator = function (value) {
        var singleOp = value.charAt(0);
        var multipleOp = value.slice(0, 2);
        var operators = extend({ '=': this.filterOperators.equal, '!': this.filterOperators.notEqual }, DataUtil.operatorSymbols);
        if (operators.hasOwnProperty(singleOp) || operators.hasOwnProperty(multipleOp)) {
            this.operator = operators[singleOp];
            this.value = value.substring(1);
            if (!this.operator) {
                this.operator = operators[multipleOp];
                this.value = value.substring(2);
            }
        }
        if (this.operator === this.filterOperators.lessThan || this.operator === this.filterOperators.greaterThan) {
            if (this.value.charAt(0) === '=') {
                this.operator = this.operator + 'orequal';
                this.value = this.value.substring(1);
            }
        }
    };
    Filter.prototype.columnPositionChanged = function (e) {
        var filterCells = [].slice.call(this.element.querySelectorAll('.e-filterbarcell'));
        filterCells.splice(e.toIndex, 0, filterCells.splice(e.fromIndex, 1)[0]);
        this.element.innerHTML = '';
        for (var _i = 0, filterCells_1 = filterCells; _i < filterCells_1.length; _i++) {
            var cell = filterCells_1[_i];
            this.element.appendChild(cell);
        }
    };
    Filter.prototype.getLocalizedCustomOperators = function () {
        var numOptr = [
            { value: 'equal', text: this.l10n.getConstant('Equal') },
            { value: 'greaterThan', text: this.l10n.getConstant('GreaterThan') },
            { value: 'greaterThanOrEqual', text: this.l10n.getConstant('GreaterThanOrEqual') },
            { value: 'lessThan', text: this.l10n.getConstant('LessThan') },
            { value: 'lessThanOrEqual', text: this.l10n.getConstant('LessThanOrEqual') },
            { value: 'notEqual', text: this.l10n.getConstant('NotEqual') }
        ];
        this.customOperators = {
            stringOperator: [
                { value: 'startsWith', text: this.l10n.getConstant('StartsWith') },
                { value: 'endsWith', text: this.l10n.getConstant('EndsWith') },
                { value: 'contains', text: this.l10n.getConstant('Contains') },
                { value: 'equal', text: this.l10n.getConstant('Equal') }, { value: 'notEqual', text: this.l10n.getConstant('NotEqual') }
            ],
            numberOperator: numOptr,
            dateOperator: numOptr,
            datetimeOperator: numOptr,
            booleanOperator: [
                { value: 'equal', text: this.l10n.getConstant('Equal') }, { value: 'notEqual', text: this.l10n.getConstant('NotEqual') }
            ]
        };
    };
    ;
    Filter.prototype.filterIconClickHandler = function (e) {
        var target = e.target;
        if (target.classList.contains('e-filtermenudiv') && (this.parent.filterSettings.type === 'menu' ||
            this.parent.filterSettings.type === 'checkbox' || this.parent.filterSettings.type === 'excel')) {
            var gObj = this.parent;
            var col = gObj.getColumnByUid(parentsUntil(target, 'e-headercell').firstElementChild.getAttribute('e-mappinguid'));
            var gClient = gObj.element.getBoundingClientRect();
            var fClient = target.getBoundingClientRect();
            this.column = col;
            if (this.fltrDlgDetails.field === col.field && this.fltrDlgDetails.isOpen) {
                return;
            }
            if (this.filterModule) {
                this.filterModule.closeDialog();
            }
            this.fltrDlgDetails = { field: col.field, isOpen: true };
            this.filterDialogOpen(this.column, target, fClient.right - gClient.left, fClient.bottom - gClient.top);
        }
    };
    Filter.prototype.clickHandler = function (e) {
        if (this.parent.filterSettings.type === 'menu' ||
            this.parent.filterSettings.type === 'checkbox' || this.parent.filterSettings.type === 'excel') {
            var gObj = this.parent;
            var target = e.target;
            var datepickerEle = target.classList.contains('e-day'); // due to datepicker popup cause
            if (parentsUntil(target, 'e-filter-popup') || target.classList.contains('e-filtermenudiv')) {
                return;
            }
            else if (this.filterModule &&
                (!parentsUntil(target, 'e-popup-wrapper')
                    && (!closest(target, '.e-filter-item.e-menu-item'))
                    && (!parentsUntil(target, 'e-popup'))) && !datepickerEle) {
                this.filterModule.closeDialog(target);
            }
        }
    };
    Filter.prototype.filterHandler = function (args) {
        var filterIconElement;
        var dataManager = new DataManager(this.filterSettings.columns);
        var query = new Query().where('field', this.filterOperators.equal, args.field);
        var result = dataManager.executeLocal(query);
        for (var i = 0; i < result.length; i++) {
            var index = -1;
            for (var j = 0; j < this.filterSettings.columns.length; j++) {
                if (result[i].field === this.filterSettings.columns[j].field) {
                    index = j;
                    break;
                }
            }
            if (index !== -1) {
                this.filterSettings.columns.splice(index, 1);
            }
        }
        var iconClass = this.parent.showColumnMenu ? '.e-columnmenu' : '.e-icon-filter';
        filterIconElement = this.parent.getColumnHeaderByField(args.field).querySelector(iconClass);
        if (args.action === 'filtering') {
            this.filterSettings.columns = this.filterSettings.columns.concat(args.filterCollection);
            if (this.filterSettings.columns.length && filterIconElement) {
                filterIconElement.classList.add('e-filtered');
            }
        }
        else {
            if (filterIconElement) {
                filterIconElement.classList.remove('e-filtered');
            }
            this.parent.refresh(); //hot-fix onpropertychanged not working for object { array }           
        }
        this.parent.dataBind();
    };
    return Filter;
}());
export { Filter };
