import { createElement, remove } from '@syncfusion/ej2-base';
import { isNullOrUndefined, getValue, extend } from '@syncfusion/ej2-base';
import { DataManager, Query, Deferred, Predicate } from '@syncfusion/ej2-data';
import { RenderType, CellType } from '../base/enum';
import { Data } from '../actions/data';
import { Row } from '../models/row';
import { Cell } from '../models/cell';
import * as events from '../base/constant';
import { prepareColumns, calculateAggregate, setFormatter } from '../base/util';
import { ContentRender } from '../renderer/content-renderer';
import { HeaderRender } from '../renderer/header-renderer';
import { CellRenderer } from '../renderer/cell-renderer';
import { HeaderCellRenderer } from '../renderer/header-cell-renderer';
import { StackedHeaderCellRenderer } from '../renderer/stacked-cell-renderer';
import { IndentCellRenderer } from '../renderer/indent-cell-renderer';
import { GroupCaptionCellRenderer, GroupCaptionEmptyCellRenderer } from '../renderer/caption-cell-renderer';
import { ExpandCellRenderer } from '../renderer/expand-cell-renderer';
import { HeaderIndentCellRenderer } from '../renderer/header-indent-renderer';
import { DetailHeaderIndentCellRenderer } from '../renderer/detail-header-indent-renderer';
import { DetailExpandCellRenderer } from '../renderer/detail-expand-cell-renderer';
var Render = (function () {
    function Render(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.data = new Data(parent, locator);
        this.l10n = locator.getService('localization');
        this.ariaService = this.locator.getService('ariaService');
        this.renderer = this.locator.getService('rendererFactory');
        this.addEventListener();
    }
    Render.prototype.render = function () {
        var gObj = this.parent;
        this.headerRenderer = this.renderer.getRenderer(RenderType.Header);
        this.contentRenderer = this.renderer.getRenderer(RenderType.Content);
        this.headerRenderer.renderPanel();
        this.contentRenderer.renderPanel();
        if (gObj.getColumns().length) {
            this.headerRenderer.renderTable();
            this.contentRenderer.renderTable();
            this.emptyRow(false);
        }
        this.refreshDataManager();
    };
    Render.prototype.refresh = function (e) {
        if (e === void 0) { e = { requestType: 'refresh' }; }
        this.parent.notify(e.requestType + "-begin", e);
        this.parent.trigger(events.actionBegin, e);
        if (e.cancel) {
            return;
        }
        if (e.requestType === 'save' && e.action === 'add') {
            this.parent.isEdit = false;
        }
        this.refreshDataManager(e);
    };
    Render.prototype.refreshComplete = function (e) {
        this.parent.trigger(events.actionComplete, e);
    };
    Render.prototype.refreshDataManager = function (args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        if (args.requestType !== 'virtualscroll') {
            this.parent.showSpinner();
        }
        var ready = this.data.dataManager.ready;
        this.ariaService.setBusy(this.parent.getContent().firstChild, true);
        var dataManager = this.data.getData(args, this.data.generateQuery().requiresCount());
        if (!ready) {
            if (this.parent.groupSettings.disablePageWiseAggregates && this.parent.groupSettings.columns.length) {
                dataManager = dataManager.then(function (e) { return _this.validateGroupRecords(e); });
            }
            dataManager.then(function (e) { return _this.dataManagerSuccess(e, args); })
                .catch(function (e) { return _this.dataManagerFailure(e); });
        }
    };
    Render.prototype.sendBulkRequest = function (args) {
        var _this = this;
        var promise = this.data.saveChanges(args.changes, this.parent.getPrimaryKeyFieldNames()[0]);
        if (this.data.dataManager.dataSource.offline) {
            this.refreshDataManager({ requestType: 'batchsave' });
            return;
        }
        else {
            promise.then(function (e) { return _this.dmSuccess(e, args); })
                .catch(function (e) { return _this.dmFailure(e); });
        }
    };
    Render.prototype.dmSuccess = function (e, args) {
        this.dataManagerSuccess(e, args);
    };
    Render.prototype.dmFailure = function (e) {
        this.dataManagerFailure(e);
    };
    Render.prototype.renderEmptyRow = function () {
        this.emptyRow(true);
    };
    Render.prototype.emptyRow = function (isTrigger) {
        var gObj = this.parent;
        var tbody = this.contentRenderer.getTable().querySelector('tbody');
        var tr;
        remove(tbody);
        tbody = createElement('tbody');
        tr = createElement('tr', { className: 'e-emptyrow' });
        tr.appendChild(createElement('td', {
            innerHTML: this.l10n.getConstant('EmptyRecord'),
            attrs: { colspan: gObj.getColumns().length.toString() }
        }));
        tbody.appendChild(tr);
        this.contentRenderer.renderEmpty(tbody);
        if (isTrigger) {
            this.parent.trigger(events.dataBound, {});
            this.parent.notify(events.onEmpty, { rows: [new Row({ isDataRow: true, cells: [new Cell({ isDataCell: true, visible: true })] })] });
        }
    };
    Render.prototype.updateColumnType = function (record) {
        var columns = this.parent.getColumns();
        var value;
        var data = record && record.items ? record.items[0] : record;
        var fmtr = this.locator.getService('valueFormatter');
        for (var i = 0, len = columns.length; i < len; i++) {
            value = getValue(columns[i].field || '', data);
            if (!isNullOrUndefined(value)) {
                this.isColTypeDef = true;
                if (!columns[i].type) {
                    columns[i].type = value.getDay ? (value.getHours() > 0 || value.getMinutes() > 0 ||
                        value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
                }
                if (typeof (columns[i].format) === 'string') {
                    setFormatter(this.locator, columns[i]);
                }
                else if (!columns[i].format && columns[i].type === 'number') {
                    columns[i].setParser(fmtr.getParserFunction({ format: 'n2' }));
                }
            }
            else {
                columns[i].type = columns[i].type || null;
            }
        }
    };
    Render.prototype.dataManagerSuccess = function (e, args) {
        var gObj = this.parent;
        gObj.trigger(events.beforeDataBound, e);
        var len = Object.keys(e.result).length;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.notify(events.tooltipDestroy, {});
        gObj.currentViewData = e.result;
        if (!len && e.count && gObj.allowPaging) {
            gObj.pageSettings.currentPage = Math.ceil(e.count / gObj.pageSettings.pageSize);
            gObj.dataBind();
            return;
        }
        if (!gObj.getColumns().length && len) {
            this.updatesOnInitialRender(e);
        }
        if (!this.isColTypeDef) {
            this.updateColumnType(gObj.getCurrentViewRecords()[0]);
        }
        this.parent.notify(events.dataReady, extend({ count: e.count, result: e.result, aggregates: e.aggregates }, args));
        if (gObj.groupSettings.columns.length || (args && args.requestType === 'ungrouping')) {
            this.headerRenderer.refreshUI();
        }
        if (len) {
            this.contentRenderer.refreshContentRows(args);
        }
        else {
            if (!gObj.getColumns().length) {
                gObj.element.innerHTML = '';
                alert(this.l10n.getConstant('EmptyDataSourceError'));
                return;
            }
            this.contentRenderer.setRowElements([]);
            this.renderEmptyRow();
            if (args) {
                var action = (args.requestType || '').toLowerCase() + '-complete';
                this.parent.notify(action, args);
            }
            this.parent.hideSpinner();
        }
    };
    Render.prototype.dataManagerFailure = function (e) {
        this.ariaService.setOptions(this.parent.getContent().firstChild, { busy: false, invalid: true });
        this.parent.trigger(events.actionFailure, { error: e });
        this.parent.currentViewData = [];
        this.renderEmptyRow();
        this.parent.hideSpinner();
    };
    Render.prototype.updatesOnInitialRender = function (e) {
        this.buildColumns(e.result[0]);
        prepareColumns(this.parent.columns);
        this.headerRenderer.renderTable();
        this.contentRenderer.renderTable();
        this.parent.notify(events.autoCol, {});
    };
    Render.prototype.buildColumns = function (record) {
        var columns = Object.keys(record);
        var cols = [];
        for (var i = 0, len = columns.length; i < len; i++) {
            cols[i] = { 'field': columns[i] };
            if (this.parent.enableColumnVirtualization) {
                cols[i].width = !isNullOrUndefined(cols[i].width) ? cols[i].width : 200;
            }
        }
        this.parent.columns = cols;
    };
    Render.prototype.instantiateRenderer = function () {
        this.renderer.addRenderer(RenderType.Header, new HeaderRender(this.parent, this.locator));
        this.renderer.addRenderer(RenderType.Content, new ContentRender(this.parent, this.locator));
        var cellrender = this.locator.getService('cellRendererFactory');
        cellrender.addCellRenderer(CellType.Header, new HeaderCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.Data, new CellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.StackedHeader, new StackedHeaderCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.Indent, new IndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.GroupCaption, new GroupCaptionCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.GroupCaptionEmpty, new GroupCaptionEmptyCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.Expand, new ExpandCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.HeaderIndent, new HeaderIndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.StackedHeader, new StackedHeaderCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.DetailHeader, new DetailHeaderIndentCellRenderer(this.parent, this.locator));
        cellrender.addCellRenderer(CellType.DetailExpand, new DetailExpandCellRenderer(this.parent, this.locator));
    };
    Render.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.modelChanged, this.refresh, this);
        this.parent.on(events.refreshComplete, this.refreshComplete, this);
        this.parent.on(events.bulkSave, this.sendBulkRequest, this);
    };
    Render.prototype.validateGroupRecords = function (e) {
        var _this = this;
        var index = e.result.length - 1;
        if (index < 0) {
            return Promise.resolve(e);
        }
        var group0 = e.result[0];
        var groupN = e.result[index];
        var predicate = [];
        var addWhere = function (input) {
            [group0, groupN].forEach(function (group) {
                return predicate.push(new Predicate('field', '==', group.field).and(_this.getPredicate('key', 'equal', group.key)));
            });
            input.where(Predicate.or(predicate));
        };
        var query = new Query();
        addWhere(query);
        var curDm = new DataManager(e.result);
        var curFilter = curDm.executeLocal(query);
        var newQuery = this.data.generateQuery(true);
        var rPredicate = [];
        if (this.data.isRemote()) {
            [group0, groupN].forEach(function (group) {
                return rPredicate.push(_this.getPredicate(group.field, 'equal', group.key));
            });
            newQuery.where(Predicate.or(rPredicate));
        }
        else {
            addWhere(newQuery);
        }
        var deferred = new Deferred();
        this.data.getData({}, newQuery).then(function (r) {
            _this.updateGroupInfo(curFilter, r.result);
            deferred.resolve(e);
        }).catch(function (e) { return deferred.reject(e); });
        return deferred.promise;
    };
    Render.prototype.getPredicate = function (key, operator, value) {
        if (value instanceof Date) {
            return this.data.getDatePredicate({ field: key, operator: operator, value: value });
        }
        return new Predicate(key, operator, value);
    };
    Render.prototype.updateGroupInfo = function (current, untouched) {
        var _this = this;
        var dm = new DataManager(untouched);
        current.forEach(function (element, index, array) {
            var uGroup = dm.executeLocal(new Query()
                .where(new Predicate('field', '==', element.field).and(_this.getPredicate('key', 'equal', element.key))))[0];
            element.count = uGroup.count;
            var itemGroup = element.items;
            var uGroupItem = uGroup.items;
            if (itemGroup.GroupGuid) {
                element.items = _this.updateGroupInfo(element.items, uGroup.items);
            }
            _this.parent.aggregates.forEach(function (row) {
                return row.columns.forEach(function (column) {
                    var types = column.type instanceof Array ? column.type : [column.type];
                    types.forEach(function (type) {
                        var key = column.field + ' - ' + type;
                        element.aggregates[key] = calculateAggregate(type, itemGroup.level ? uGroupItem.records : uGroup.items, column);
                    });
                });
            });
        });
        return current;
    };
    return Render;
}());
export { Render };
