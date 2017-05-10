import { Browser } from '@syncfusion/ej2-base';
import { extend, isNullOrUndefined } from '@syncfusion/ej2-base/util';
import { createElement, closest, classList } from '@syncfusion/ej2-base/dom';
import { setCssInGridPopUp, getActualPropFromColl } from '../base/util';
import * as events from '../base/constant';
import { AriaService } from '../services/aria-service';
var Sort = (function () {
    function Sort(parent, sortSettings, sortedColumns) {
        this.contentRefresh = true;
        this.isModelChanged = true;
        this.aria = new AriaService();
        this.parent = parent;
        this.sortSettings = sortSettings;
        this.sortedColumns = sortedColumns;
        this.addEventListener();
    }
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
    Sort.prototype.onActionComplete = function (e) {
        var args = !this.isRemove ? {
            columnName: this.columnName, direction: this.direction, requestType: 'sorting', type: events.actionComplete
        } : { requestType: 'sorting', type: events.actionComplete };
        this.isRemove = false;
        this.parent.trigger(events.actionComplete, extend(e, args));
    };
    Sort.prototype.sortColumn = function (columnName, direction, isMultiSort) {
        if (this.parent.getColumnByField(columnName).allowSorting === false) {
            return;
        }
        this.columnName = columnName;
        this.direction = direction;
        this.isMultiSort = isMultiSort;
        this.removeSortIcons();
        var column = this.parent.getColumnHeaderByField(columnName);
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
    Sort.prototype.clearSorting = function () {
        var cols = getActualPropFromColl(this.sortSettings.columns);
        for (var i = 0, len = cols.length; i < len; i++) {
            this.removeSortColumn(cols[i].field);
        }
    };
    Sort.prototype.removeSortColumn = function (field) {
        var gObj = this.parent;
        var cols = this.sortSettings.columns;
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
    Sort.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.on(events.sortComplete, this.onActionComplete, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.headerRefreshed, this.refreshSortIcons, this);
    };
    Sort.prototype.removeEventListener = function () {
        this.parent.off(events.sortComplete, this.onActionComplete);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.headerRefreshed, this.refreshSortIcons);
    };
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
            !e.target.classList.contains('e-stackedheadercell')) {
            var gObj = this.parent;
            var field = gObj.getColumnByUid(target.querySelector('.e-headercelldiv').getAttribute('e-mappinguid')).field;
            var direction = !target.querySelectorAll('.e-ascending').length ? 'ascending' :
                'descending';
            if (!e.shiftKey) {
                this.sortColumn(field, direction, e.ctrlKey || this.enableSortMultiTouch);
            }
            else {
                this.removeSortColumn(field);
            }
            if (Browser.isDevice) {
                this.showPopUp(e);
            }
        }
    };
    Sort.prototype.showPopUp = function (e) {
        var target = closest(e.target, '.e-headercell');
        if (!isNullOrUndefined(target)) {
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
        for (var i = 0, len = cols.length; i < len; i++) {
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
        for (var i = position ? position : 0, len = !isNullOrUndefined(position) ? position + 1 : cols.length; i < len; i++) {
            if (gObj.allowGrouping && gObj.groupSettings.columns.indexOf(cols[i].field) > -1) {
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
        for (var _i = 0, _a = this.sortedColumns; _i < _a.length; _i++) {
            var col = _a[_i];
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
