import { createElement, remove } from '@syncfusion/ej2-base/dom';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base/util';
import { RenderType, CellType } from '../base/enum';
import { Data } from '../actions/data';
import * as events from '../base/constant';
import { prepareColumns } from '../base/util';
import { ContentRender } from '../renderer/content-renderer';
import { HeaderRender } from '../renderer/header-renderer';
import { CellRenderer } from '../renderer/cell-renderer';
import { HeaderCellRenderer } from '../renderer/header-cell-renderer';
import { StackedHeaderCellRenderer } from '../renderer/stacked-cell-renderer';
import { IndentCellRenderer } from '../renderer/indent-cell-renderer';
import { GroupCaptionCellRenderer } from '../renderer/caption-cell-renderer';
import { ExpandCellRenderer } from '../renderer/expand-cell-renderer';
import { HeaderIndentCellRenderer } from '../renderer/header-indent-renderer';
import { DetailHeaderIndentCellRenderer } from '../renderer/detail-header-indent-renderer';
import { DetailExpandCellRenderer } from '../renderer/detail-expand-cell-renderer';
var Render = (function () {
    function Render(parent, locator) {
        this.parent = parent;
        this.locator = locator;
        this.data = new Data(parent);
        this.l10n = locator.getService('localization');
        this.ariaService = this.locator.getService('ariaService');
        this.addEventListener();
    }
    Render.prototype.render = function () {
        var gObj = this.parent;
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
        this.parent.trigger(events.actionBegin, e);
        this.refreshDataManager(e);
    };
    Render.prototype.refreshComplete = function (e) {
        this.parent.trigger(events.actionComplete, e);
    };
    Render.prototype.refreshDataManager = function (args) {
        var _this = this;
        this.ariaService.setBusy(this.parent.getContent().firstChild, true);
        var dataManager = this.data.getData(this.data.generateQuery().requiresCount());
        dataManager.then(function (e) { return _this.dataManagerSuccess(e, args); })
            .catch(function (e) { return _this.dataManagerFailure(e); });
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
        this.contentRenderer.getTable().appendChild(tbody);
        if (isTrigger) {
            this.parent.trigger(events.dataBound, {});
        }
    };
    Render.prototype.updateColumnType = function (record) {
        var columns = this.parent.getColumns();
        var value;
        var fmtr = this.locator.getService('valueFormatter');
        for (var i = 0, len = columns.length; i < len; i++) {
            value = getValue(columns[i].field || '', record);
            if (!isNullOrUndefined(value)) {
                this.isColTypeDef = true;
                if (!columns[i].type) {
                    columns[i].type = value.getDay ? (value.getHours() > 0 || value.getMinutes() > 0 ||
                        value.getSeconds() > 0 || value.getMilliseconds() > 0 ? 'datetime' : 'date') : typeof (value);
                }
                if (typeof (columns[i].format) === 'string') {
                    switch (columns[i].type) {
                        case 'date':
                            columns[i].setFormatter(fmtr.getFormatFunction({ type: 'date', skeleton: columns[i].format }));
                            columns[i].setParser(fmtr.getParserFunction({ type: 'date', skeleton: columns[i].format }));
                            break;
                        case 'datetime':
                            columns[i].setFormatter(fmtr.getFormatFunction({ type: 'dateTime', skeleton: columns[i].format }));
                            columns[i].setParser(fmtr.getParserFunction({ type: 'dateTime', skeleton: columns[i].format }));
                            break;
                        case 'number':
                            columns[i].setFormatter(fmtr.getFormatFunction({ format: columns[i].format }));
                            columns[i].setParser(fmtr.getParserFunction({ format: columns[i].format }));
                            break;
                    }
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
        var len = Object.keys(e.result).length;
        if (this.parent.isDestroyed) {
            return;
        }
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
            this.updateColumnType(e.result[0]);
        }
        this.parent.notify(events.dataReady, { count: e.count, result: e.result });
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
        }
    };
    Render.prototype.dataManagerFailure = function (e) {
        this.ariaService.setOptions(this.parent.getContent().firstChild, { busy: false, invalid: true });
        this.parent.trigger(events.actionFailure, { error: e });
        this.parent.currentViewData = [];
        this.renderEmptyRow();
    };
    Render.prototype.updatesOnInitialRender = function (e) {
        this.buildColumns(e.result[0]);
        prepareColumns(this.parent.columns);
        this.headerRenderer.renderTable();
        this.contentRenderer.renderTable();
    };
    Render.prototype.buildColumns = function (record) {
        var columns = Object.keys(record);
        var cols = [];
        for (var i = 0, len = columns.length; i < len; i++) {
            cols[i] = { 'field': columns[i] };
        }
        this.parent.columns = cols;
    };
    Render.prototype.instantiateRenderer = function () {
        var renderer = this.locator.getService('rendererFactory');
        renderer.addRenderer(RenderType.Header, this.headerRenderer = new HeaderRender(this.parent, this.locator));
        renderer.addRenderer(RenderType.Content, this.contentRenderer = new ContentRender(this.parent, this.locator));
        var cellrender = this.locator.getService('cellRendererFactory');
        cellrender.addCellRenderer(CellType.Header, new HeaderCellRenderer(this.locator));
        cellrender.addCellRenderer(CellType.Data, new CellRenderer(this.locator));
        cellrender.addCellRenderer(CellType.StackedHeader, new StackedHeaderCellRenderer(this.locator));
        cellrender.addCellRenderer(CellType.Indent, new IndentCellRenderer(this.locator));
        cellrender.addCellRenderer(CellType.GroupCaption, new GroupCaptionCellRenderer(this.locator));
        cellrender.addCellRenderer(CellType.Expand, new ExpandCellRenderer(this.locator));
        cellrender.addCellRenderer(CellType.HeaderIndent, new HeaderIndentCellRenderer(this.locator));
        cellrender.addCellRenderer(CellType.StackedHeader, new StackedHeaderCellRenderer(this.locator));
        cellrender.addCellRenderer(CellType.DetailHeader, new DetailHeaderIndentCellRenderer(this.locator));
        cellrender.addCellRenderer(CellType.DetailExpand, new DetailExpandCellRenderer(this.locator));
    };
    Render.prototype.addEventListener = function () {
        this.parent.on(events.initialLoad, this.instantiateRenderer, this);
        this.parent.on(events.modelChanged, this.refresh, this);
        this.parent.on(events.refreshComplete, this.refreshComplete, this);
    };
    return Render;
}());
export { Render };
