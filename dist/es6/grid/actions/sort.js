import { Browser } from '@syncfusion/ej2-base';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, closest, classList } from '@syncfusion/ej2-base';
import { setCssInGridPopUp, getActualPropFromColl, isActionPrevent } from '../base/util';
import * as events from '../base/constant';
import { AriaService } from '../services/aria-service';
/**
 *
 * `Sort` module is used to handle sorting action.
 */
var Sort = /** @class */ (function () {
    /**
     * Constructor for Grid sorting module
     * @hidden
     */
    function Sort(parent, sortSettings, sortedColumns, locator) {
        this.contentRefresh = true;
        this.isModelChanged = true;
        this.aria = new AriaService();
        this.parent = parent;
        this.sortSettings = sortSettings;
        this.sortedColumns = sortedColumns;
        this.focus = locator.getService('focus');
        this.addEventListener();
    }
    /**
     * The function used to update sortSettings
     * @return {void}
     * @hidden
     */
    Sort.prototype.updateModel = function () {
        var sortedColumn = { field: this.columnName, direction: this.direction };
        var index;
        var gCols = this.parent.groupSettings.columns;
        var flag = false;
        if (!this.isMultiSort) {
            if (!gCols.length) {
                this.sortSettings.columns = [sortedColumn];
            }
            else {
                var sortedCols = [];
                for (var i = 0, len = gCols.length; i < len; i++) {
                    index = this.getSortedColsIndexByField(gCols[i], sortedCols);
                    if (this.columnName === gCols[i]) {
                        flag = true;
                        sortedCols.push(sortedColumn);
                    }
                    else {
                        var sCol = this.getSortColumnFromField(gCols[i]);
                        sortedCols.push({ field: sCol.field, direction: sCol.direction });
                    }
                }
                if (!flag) {
                    sortedCols.push(sortedColumn);
                }
                this.sortSettings.columns = sortedCols;
            }
        }
        else {
            index = this.getSortedColsIndexByField(this.columnName);
            if (index > -1) {
                this.sortSettings.columns[index] = sortedColumn;
            }
            else {
                this.sortSettings.columns.push(sortedColumn);
            }
            this.sortSettings.columns = this.sortSettings.columns;
        }
        this.parent.dataBind();
        this.lastSortedCol = this.columnName;
    };
    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    Sort.prototype.onActionComplete = function (e) {
        var args = !this.isRemove ? {
            columnName: this.columnName, direction: this.direction, requestType: 'sorting', type: events.actionComplete
        } : { requestType: 'sorting', type: events.actionComplete };
        this.isRemove = false;
        this.parent.trigger(events.actionComplete, extend(e, args));
    };
    /**
     * Sorts a column with given options.
     * @param {string} columnName - Defines the column name to sort.
     * @param {SortDirection} direction - Defines the direction of sorting for field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns to be maintained.
     * @return {void}
     */
    Sort.prototype.sortColumn = function (columnName, direction, isMultiSort) {
        var gObj = this.parent;
        if (this.parent.getColumnByField(columnName).allowSorting === false || this.parent.isContextMenuOpen()) {
            return;
        }
        if (!gObj.allowMultiSorting) {
            isMultiSort = gObj.allowMultiSorting;
        }
        if (this.isActionPrevent()) {
            gObj.notify(events.preventBatch, {
                instance: this, handler: this.sortColumn,
                arg1: columnName, arg2: direction, arg3: isMultiSort
            });
            return;
        }
        this.columnName = columnName;
        this.direction = direction;
        this.isMultiSort = isMultiSort;
        this.removeSortIcons();
        var column = gObj.getColumnHeaderByField(columnName);
        this.updateSortedCols(columnName, isMultiSort);
        this.updateModel();
    };
    Sort.prototype.updateSortedCols = function (columnName, isMultiSort) {
        if (!isMultiSort) {
            if (this.parent.allowGrouping) {
                for (var i = 0, len = this.sortedColumns.length; i < len; i++) {
                    if (this.parent.groupSettings.columns.indexOf(this.sortedColumns[i]) < 0) {
                        this.sortedColumns.splice(i, 1);
                        len--;
                        i--;
                    }
                }
            }
            else {
                this.sortedColumns.splice(0, this.sortedColumns.length);
            }
        }
        if (this.sortedColumns.indexOf(columnName) < 0) {
            this.sortedColumns.push(columnName);
        }
    };
    /**
     * @hidden
     */
    Sort.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        if (this.contentRefresh) {
            var args = this.sortSettings.columns.length ? {
                columnName: this.columnName, direction: this.direction, requestType: 'sorting', type: events.actionBegin
            } : { requestType: 'sorting', type: events.actionBegin };
            this.parent.notify(events.modelChanged, args);
        }
        this.removeSortIcons();
        this.addSortIcons();
    };
    /**
     * Clears all the sorted columns of Grid.
     * @return {void}
     */
    Sort.prototype.clearSorting = function () {
        var cols = getActualPropFromColl(this.sortSettings.columns);
        if (this.isActionPrevent()) {
            this.parent.notify(events.preventBatch, { instance: this, handler: this.clearSorting });
            return;
        }
        for (var i = 0, len = cols.length; i < len; i++) {
            this.removeSortColumn(cols[i].field);
        }
    };
    Sort.prototype.isActionPrevent = function () {
        return isActionPrevent(this.parent);
    };
    /**
     * Remove sorted column by field name.
     * @param {string} field - Defines the column field name to remove sort.
     * @return {void}
     * @hidden
     */
    Sort.prototype.removeSortColumn = function (field) {
        var gObj = this.parent;
        var cols = this.sortSettings.columns;
        if (this.isActionPrevent()) {
            this.parent.notify(events.preventBatch, { instance: this, handler: this.removeSortColumn, arg1: field });
            return;
        }
        this.removeSortIcons();
        for (var i = 0, len = cols.length; i < len; i++) {
            if (cols[i].field === field) {
                if (gObj.allowGrouping && gObj.groupSettings.columns.indexOf(cols[i].field) > -1) {
                    continue;
                }
                this.sortedColumns.splice(this.sortedColumns.indexOf(cols[i].field), 1);
                cols.splice(i, 1);
                this.isRemove = true;
                if (this.isModelChanged) {
                    this.parent.notify(events.modelChanged, {
                        requestType: 'sorting', type: events.actionBegin
                    });
                }
                break;
            }
        }
        this.addSortIcons();
    };
    Sort.prototype.getSortedColsIndexByField = function (field, sortedColumns) {
        var cols = sortedColumns ? sortedColumns : this.sortSettings.columns;
        for (var i = 0, len = cols.length; i < len; i++) {
            if (cols[i].field === field) {
                return i;
            }
        }
        return -1;
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Sort.prototype.getModuleName = function () {
        return 'sort';
    };
    Sort.prototype.initialEnd = function () {
        this.parent.off(events.contentReady, this.initialEnd);
        if (this.parent.getColumns().length && this.sortSettings.columns.length) {
            var gObj = this.parent;
            this.contentRefresh = false;
            this.isMultiSort = this.sortSettings.columns.length > 1;
            for (var _i = 0, _a = gObj.sortSettings.columns; _i < _a.length; _i++) {
                var col = _a[_i];
                if (this.sortedColumns.indexOf(col.field) > -1) {
                    this.sortColumn(col.field, col.direction, true);
                }
            }
            this.isMultiSort = false;
            this.contentRefresh = true;
        }
    };
    /**
     * @hidden
     */
    Sort.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.on(events.sortComplete, this.onActionComplete, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.headerRefreshed, this.refreshSortIcons, this);
        this.parent.on(events.keyPressed, this.keyPressed, this);
    };
    /**
     * @hidden
     */
    Sort.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.sortComplete, this.onActionComplete);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.headerRefreshed, this.refreshSortIcons);
        this.parent.off(events.keyPressed, this.keyPressed);
    };
    /**
     * To destroy the sorting
     * @return {void}
     * @hidden
     */
    Sort.prototype.destroy = function () {
        this.isModelChanged = false;
        if (this.parent.element.querySelector('.e-gridpopup').querySelectorAll('.e-sortdirect').length) {
            this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
        }
        this.clearSorting();
        this.isModelChanged = true;
        this.removeEventListener();
    };
    Sort.prototype.clickHandler = function (e) {
        this.popUpClickHandler(e);
        var target = closest(e.target, '.e-headercell');
        if (target && !e.target.classList.contains('e-grptogglebtn') &&
            !e.target.classList.contains('e-stackedheadercell') &&
            !e.target.classList.contains('e-stackedheadercelldiv') &&
            !e.target.classList.contains('e-rhandler') &&
            !e.target.classList.contains('e-columnmenu') &&
            !e.target.classList.contains('e-filtermenudiv')) {
            var gObj = this.parent;
            var colObj = gObj.getColumnByUid(target.querySelector('.e-headercelldiv').getAttribute('e-mappinguid'));
            var direction = !target.querySelectorAll('.e-ascending').length ? 'ascending' :
                'descending';
            if (colObj.type !== 'checkbox') {
                this.initiateSort(target, e, colObj);
                if (Browser.isDevice) {
                    this.showPopUp(e);
                }
            }
        }
    };
    Sort.prototype.keyPressed = function (e) {
        if (!this.parent.isEdit && (e.action === 'enter' || e.action === 'ctrlEnter' || e.action === 'shiftEnter')) {
            var target = this.focus.getFocusedElement();
            if (!target || !target.classList.contains('e-headercell') || (this.parent.frozenColumns || this.parent.frozenRows)) {
                return;
            }
            var col = this.parent.getColumnByUid(target.querySelector('.e-headercelldiv').getAttribute('e-mappinguid'));
            this.initiateSort(target, e, col);
        }
    };
    Sort.prototype.initiateSort = function (target, e, column) {
        var gObj = this.parent;
        var field = column.field;
        var direction = !target.querySelectorAll('.e-ascending').length ? 'ascending' :
            'descending';
        if (e.shiftKey || (this.sortSettings.allowUnsort && target.querySelectorAll('.e-descending').length)
            && !(gObj.groupSettings.columns.indexOf(field) > -1)) {
            this.removeSortColumn(field);
        }
        else {
            this.sortColumn(field, direction, e.ctrlKey || this.enableSortMultiTouch);
        }
    };
    Sort.prototype.showPopUp = function (e) {
        var target = closest(e.target, '.e-headercell');
        if (!isNullOrUndefined(target) || this.parent.isContextMenuOpen()) {
            setCssInGridPopUp(this.parent.element.querySelector('.e-gridpopup'), e, 'e-sortdirect e-icons e-icon-sortdirect' + (this.sortedColumns.length > 1 ? ' e-spanclicked' : ''));
        }
    };
    Sort.prototype.popUpClickHandler = function (e) {
        var target = e.target;
        if (closest(target, '.e-headercell') || e.target.classList.contains('e-rowcell') ||
            closest(target, '.e-gridpopup')) {
            if (target.classList.contains('e-sortdirect')) {
                if (!target.classList.contains('e-spanclicked')) {
                    target.classList.add('e-spanclicked');
                    this.enableSortMultiTouch = true;
                }
                else {
                    target.classList.remove('e-spanclicked');
                    this.enableSortMultiTouch = false;
                    this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
                }
            }
        }
        else {
            this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
        }
    };
    Sort.prototype.addSortIcons = function () {
        var gObj = this.parent;
        var header;
        var filterElement;
        var cols = this.sortSettings.columns;
        var fieldNames = this.parent.getColumns().map(function (c) { return c.field; });
        for (var i = 0, len = cols.length; i < len; i++) {
            if (fieldNames.indexOf(cols[i].field) === -1) {
                continue;
            }
            header = gObj.getColumnHeaderByField(cols[i].field);
            this.aria.setSort(header, cols[i].direction);
            if (this.isMultiSort && cols.length > 1) {
                header.querySelector('.e-headercelldiv').insertBefore(createElement('span', { className: 'e-sortnumber', innerHTML: (i + 1).toString() }), header.querySelector('.e-headertext'));
            }
            filterElement = header.querySelector('.e-sortfilterdiv');
            if (cols[i].direction === 'ascending') {
                classList(filterElement, ['e-ascending', 'e-icon-ascending'], []);
            }
            else {
                classList(filterElement, ['e-descending', 'e-icon-descending'], []);
            }
        }
    };
    Sort.prototype.removeSortIcons = function (position) {
        var gObj = this.parent;
        var header;
        var cols = this.sortSettings.columns;
        var fieldNames = this.parent.getColumns().map(function (c) { return c.field; });
        for (var i = position ? position : 0, len = !isNullOrUndefined(position) ? position + 1 : cols.length; i < len; i++) {
            if (gObj.allowGrouping && gObj.groupSettings.columns.indexOf(cols[i].field) > -1) {
                continue;
            }
            if (fieldNames.indexOf(cols[i].field) === -1) {
                continue;
            }
            header = gObj.getColumnHeaderByField(cols[i].field);
            this.aria.setSort(header, 'none');
            classList(header.querySelector('.e-sortfilterdiv'), [], ['e-descending', 'e-icon-descending', 'e-ascending', 'e-icon-ascending']);
            if (header.querySelector('.e-sortnumber')) {
                header.querySelector('.e-headercelldiv').removeChild(header.querySelector('.e-sortnumber'));
            }
        }
    };
    Sort.prototype.getSortColumnFromField = function (field) {
        for (var i = 0, len = this.sortSettings.columns.length; i < len; i++) {
            if (this.sortSettings.columns[i].field === field) {
                return this.sortSettings.columns[i];
            }
        }
        return false;
    };
    Sort.prototype.updateAriaAttr = function () {
        var fieldNames = this.parent.getColumns().map(function (c) { return c.field; });
        for (var _i = 0, _a = this.sortedColumns; _i < _a.length; _i++) {
            var col = _a[_i];
            if (fieldNames.indexOf(col) === -1) {
                continue;
            }
            var header = this.parent.getColumnHeaderByField(col);
            this.aria.setSort(header, this.getSortColumnFromField(col).direction);
        }
    };
    Sort.prototype.refreshSortIcons = function () {
        this.removeSortIcons();
        this.isMultiSort = true;
        this.removeSortIcons();
        this.addSortIcons();
        this.isMultiSort = false;
        this.updateAriaAttr();
    };
    return Sort;
}());
export { Sort };
