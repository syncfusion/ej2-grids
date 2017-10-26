import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { getActualProperties } from '../base/util';
import * as events from '../base/constant';
var Data = (function () {
    function Data(parent) {
        this.parent = parent;
        this.initDataManager();
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.rowsAdded, this.addRows, this);
        this.parent.on(events.rowsRemoved, this.removeRows, this);
        this.parent.on(events.dataSourceModified, this.initDataManager, this);
        this.parent.on(events.destroy, this.destroy, this);
        this.parent.on(events.updateData, this.crudActions, this);
        this.parent.on(events.addDeleteAction, this.getData, this);
    }
    Data.prototype.initDataManager = function () {
        var gObj = this.parent;
        this.dataManager = gObj.dataSource instanceof DataManager ? gObj.dataSource :
            (isNullOrUndefined(gObj.dataSource) ? new DataManager() : new DataManager(gObj.dataSource));
        gObj.query = gObj.query instanceof Query ? gObj.query : new Query();
    };
    Data.prototype.generateQuery = function (skipPage) {
        var gObj = this.parent;
        var query = gObj.query.clone();
        if (gObj.allowFiltering && gObj.filterSettings.columns.length) {
            var columns = gObj.filterSettings.columns;
            for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                var col = columns_1[_i];
                var sType = gObj.getColumnByField(col.field).type;
                if (sType !== 'date' && sType !== 'datetime') {
                    query.where(col.field, col.operator, col.value, !col.matchCase);
                }
                else {
                    query.where(this.getDatePredicate(col));
                }
            }
        }
        if (gObj.searchSettings.key.length) {
            var sSettings = gObj.searchSettings;
            sSettings.fields = sSettings.fields.length ? sSettings.fields : gObj.getColumnFieldNames();
            query.search(sSettings.key, sSettings.fields, sSettings.operator, sSettings.ignoreCase);
        }
        gObj.aggregates.forEach(function (row) {
            row.columns.forEach(function (column) {
                var types = column.type instanceof Array ? column.type : [column.type];
                types.forEach(function (type) { return query.aggregate(type, column.field); });
            });
        });
        if ((gObj.allowSorting || gObj.allowGrouping) && gObj.sortSettings.columns.length) {
            var columns = gObj.sortSettings.columns;
            var sortGrp = [];
            for (var i = columns.length - 1; i > -1; i--) {
                if (gObj.groupSettings.columns.indexOf(columns[i].field) === -1) {
                    query.sortBy(columns[i].field, columns[i].direction);
                }
                else {
                    sortGrp.push(columns[i]);
                }
            }
            for (var i = 0, len = sortGrp.length; i < len; i++) {
                query.sortBy(sortGrp[i].field, sortGrp[i].direction);
            }
        }
        if ((gObj.allowPaging || gObj.enableVirtualization) && skipPage !== true) {
            query.page(gObj.pageSettings.currentPage, gObj.pageSettings.pageSize);
        }
        if (gObj.allowGrouping && gObj.groupSettings.columns.length) {
            var columns = gObj.groupSettings.columns;
            for (var i = 0, len = columns.length; i < len; i++) {
                query.group(columns[i]);
            }
        }
        return query;
    };
    Data.prototype.getData = function (args, query) {
        var _this = this;
        if (args === void 0) { args = { requestType: '' }; }
        var key = this.getKey(args.foreignKeyData &&
            Object.keys(args.foreignKeyData).length ?
            args.foreignKeyData : this.parent.getPrimaryKeyFieldNames());
        switch (args.requestType) {
            case 'delete':
                query = query ? query : this.generateQuery();
                this.dataManager.remove(key, args.data[0], null, query);
                break;
            case 'save':
                query = query ? query : this.generateQuery();
                this.dataManager.insert(args.data, null, query, 0);
                break;
        }
        if (this.dataManager.ready) {
            var ready = this.dataManager.ready;
            ready.then(function (e) {
                _this.dataManager = new DataManager(e.result);
                _this.parent.refresh();
            }).catch(function (e) {
                _this.parent.trigger(events.actionFailure, { error: e });
            });
        }
        return this.dataManager.executeQuery(query);
    };
    Data.prototype.crudActions = function (args) {
        this.generateQuery();
        var promise = null;
        var pr = 'promise';
        var key = this.getKey(args.foreignKeyData &&
            Object.keys(args.foreignKeyData).length ? args.foreignKeyData :
            this.parent.getPrimaryKeyFieldNames());
        switch (args.requestType) {
            case 'save':
                promise = this.dataManager.update(key, args.data, null, this.generateQuery());
                break;
        }
        args[pr] = promise;
        this.parent.notify(events.crudAction, args);
    };
    Data.prototype.saveChanges = function (changes, key) {
        var promise = this.dataManager.saveChanges(changes, key, null, this.generateQuery().requiresCount());
        return promise;
    };
    Data.prototype.getKey = function (keys) {
        if (keys && keys.length) {
            return keys[0];
        }
        return undefined;
    };
    Data.prototype.isRemote = function () {
        return this.dataManager.dataSource.offline !== true && this.dataManager.dataSource.url !== undefined;
    };
    Data.prototype.getDatePredicate = function (filterObject) {
        var prevDate;
        var nextDate;
        var prevObj = extend({}, getActualProperties(filterObject));
        var nextObj = extend({}, getActualProperties(filterObject));
        var value = new Date(filterObject.value);
        prevDate = new Date(value.setDate(value.getDate() - 1));
        nextDate = new Date(value.setDate(value.getDate() + 2));
        prevObj.value = prevDate;
        nextObj.value = nextDate;
        if (filterObject.operator === 'equal') {
            prevObj.operator = 'greaterthan';
            nextObj.operator = 'lessthan';
        }
        else {
            prevObj.operator = 'lessthanorequal';
            nextObj.operator = 'greaterthanorequal';
        }
        var predicateSt = new Predicate(prevObj.field, prevObj.operator, prevObj.value, false);
        var predicateEnd = new Predicate(nextObj.field, nextObj.operator, nextObj.value, false);
        return filterObject.operator === 'equal' ? predicateSt.and(predicateEnd) : predicateSt.or(predicateEnd);
    };
    Data.prototype.addRows = function (e) {
        for (var i = e.records.length; i > 0; i--) {
            this.dataManager.dataSource.json.splice(e.toIndex, 0, e.records[i - 1]);
        }
    };
    Data.prototype.removeRows = function (e) {
        var json = this.dataManager.dataSource.json;
        this.dataManager.dataSource.json = json.filter(function (value, index) { return e.indexes.indexOf(index) === -1; });
    };
    Data.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.rowsAdded, this.addRows);
        this.parent.off(events.rowsRemoved, this.removeRows);
        this.parent.off(events.dataSourceModified, this.initDataManager);
        this.parent.off(events.dataSourceModified, this.destroy);
        this.parent.off(events.updateData, this.crudActions);
        this.parent.off(events.addDeleteAction, this.getData);
    };
    return Data;
}());
export { Data };
