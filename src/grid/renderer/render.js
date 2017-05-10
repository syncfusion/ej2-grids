define(["require", "exports", "@syncfusion/ej2-base/dom", "@syncfusion/ej2-base/util", "../base/enum", "../actions/data", "../base/constant", "../base/util", "../renderer/content-renderer", "../renderer/header-renderer", "../renderer/cell-renderer", "../renderer/header-cell-renderer", "../renderer/stacked-cell-renderer", "../renderer/indent-cell-renderer", "../renderer/caption-cell-renderer", "../renderer/expand-cell-renderer", "../renderer/header-indent-renderer"], function (require, exports, dom_1, util_1, enum_1, data_1, events, util_2, content_renderer_1, header_renderer_1, cell_renderer_1, header_cell_renderer_1, stacked_cell_renderer_1, indent_cell_renderer_1, caption_cell_renderer_1, expand_cell_renderer_1, header_indent_renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Render = (function () {
        function Render(parent, locator) {
            this.parent = parent;
            this.locator = locator;
            this.data = new data_1.Data(parent);
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
            dom_1.remove(tbody);
            tbody = dom_1.createElement('tbody');
            tr = dom_1.createElement('tr', { className: 'e-emptyrow' });
            tr.appendChild(dom_1.createElement('td', {
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
                value = util_1.getValue(columns[i].field || '', record);
                if (!util_1.isNullOrUndefined(value)) {
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
            util_2.prepareColumns(this.parent.columns);
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
            renderer.addRenderer(enum_1.RenderType.Header, this.headerRenderer = new header_renderer_1.HeaderRender(this.parent, this.locator));
            renderer.addRenderer(enum_1.RenderType.Content, this.contentRenderer = new content_renderer_1.ContentRender(this.parent, this.locator));
            var cellrender = this.locator.getService('cellRendererFactory');
            cellrender.addCellRenderer(enum_1.CellType.Header, new header_cell_renderer_1.HeaderCellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.Data, new cell_renderer_1.CellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.StackedHeader, new stacked_cell_renderer_1.StackedHeaderCellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.Indent, new indent_cell_renderer_1.IndentCellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.GroupCaption, new caption_cell_renderer_1.GroupCaptionCellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.Expand, new expand_cell_renderer_1.ExpandCellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.HeaderIndent, new header_indent_renderer_1.HeaderIndentCellRenderer(this.locator));
            cellrender.addCellRenderer(enum_1.CellType.StackedHeader, new stacked_cell_renderer_1.StackedHeaderCellRenderer(this.locator));
        };
        Render.prototype.addEventListener = function () {
            this.parent.on(events.initialLoad, this.instantiateRenderer, this);
            this.parent.on(events.modelChanged, this.refresh, this);
            this.parent.on(events.refreshComplete, this.refreshComplete, this);
        };
        return Render;
    }());
    exports.Render = Render;
});
