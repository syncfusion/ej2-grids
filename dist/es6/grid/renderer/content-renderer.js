import { Droppable, Browser } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base/util';
import { createElement, setStyleAttribute, remove } from '@syncfusion/ej2-base/dom';
import { getUpdateUsingRaf } from '../base/util';
import * as events from '../base/constant';
import { RowRenderer } from './row-renderer';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupModelGenerator } from '../services/group-model-generator';
var ContentRender = (function () {
    function ContentRender(parent, serviceLocator) {
        this.rows = [];
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService('ariaService');
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        this.parent.on(events.colGroupRefresh, this.colGroupRefresh, this);
    }
    ContentRender.prototype.renderPanel = function () {
        var gObj = this.parent;
        var div = createElement('div', { className: 'e-gridcontent' });
        var innerDiv = createElement('div', {
            className: 'e-content'
        });
        if (!Browser.isDevice) {
            innerDiv.setAttribute('tabindex', '0');
        }
        this.ariaService.setOptions(innerDiv, { busy: false });
        div.appendChild(innerDiv);
        this.setPanel(div);
        gObj.element.appendChild(div);
    };
    ContentRender.prototype.renderTable = function () {
        var contentDiv = this.getPanel();
        contentDiv.appendChild(this.createContentTable());
        this.setTable(contentDiv.querySelector('.e-table'));
        this.ariaService.setOptions(this.getTable(), {
            multiselectable: this.parent.selectionSettings.type === 'multiple'
        });
        this.initializeContentDrop();
    };
    ContentRender.prototype.createContentTable = function () {
        var innerDiv = this.getPanel().firstChild;
        var table = createElement('table', { className: 'e-table', attrs: { cellspacing: '0.25px', role: 'grid' } });
        this.setColGroup(this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true));
        table.appendChild(this.getColGroup());
        table.appendChild(createElement('tbody'));
        innerDiv.appendChild(table);
        return innerDiv;
    };
    ContentRender.prototype.refreshContentRows = function (args) {
        var _this = this;
        var gObj = this.parent;
        var dataSource = gObj.currentViewData;
        var frag = document.createDocumentFragment();
        var columns = gObj.getColumns();
        var tr;
        var row = new RowRenderer(this.serviceLocator, null, this.parent);
        this.rowElements = [];
        var model = gObj.allowGrouping && gObj.groupSettings.columns.length ?
            new GroupModelGenerator(this.parent) : new RowModelGenerator(this.parent);
        var modelData = model.generateRows(dataSource);
        var tbody = this.getTable().querySelector('tbody');
        for (var i = 0, len = modelData.length; i < len; i++) {
            if (!gObj.rowTemplate) {
                tr = row.render(modelData[i], columns);
            }
            else {
                var elem = createElement('div', {
                    innerHTML: '<table><tbody>' + gObj.getRowTemplate()(extend({ index: i }, dataSource[i])) + '</tbody></table>'
                });
                tr = elem.querySelector('tbody').firstElementChild;
            }
            frag.appendChild(tr);
            this.rows.push(modelData[i]);
            this.rowElements.push(tr);
            this.ariaService.setOptions(this.getTable(), { colcount: gObj.getColumns().length.toString() });
        }
        getUpdateUsingRaf(function () {
            remove(tbody);
            tbody = createElement('tbody');
            tbody.appendChild(frag);
            _this.getTable().appendChild(tbody);
        }, function () {
            _this.ariaService.setBusy(_this.getPanel().firstChild, false);
            if (_this.parent.isDestroyed) {
                return;
            }
            _this.parent.notify(events.contentReady, {});
            _this.parent.trigger(events.dataBound, {});
            if (args) {
                var action = (args.requestType || '').toLowerCase() + '-complete';
                _this.parent.notify(action, args);
            }
        });
    };
    ContentRender.prototype.getPanel = function () {
        return this.contentPanel;
    };
    ContentRender.prototype.setPanel = function (panel) {
        this.contentPanel = panel;
    };
    ContentRender.prototype.getTable = function () {
        return this.contentTable;
    };
    ContentRender.prototype.setTable = function (table) {
        this.contentTable = table;
    };
    ContentRender.prototype.getRows = function () {
        return this.rows;
    };
    ContentRender.prototype.getRowElements = function () {
        return this.rowElements;
    };
    ContentRender.prototype.getColGroup = function () {
        return this.colgroup;
    };
    ContentRender.prototype.setColGroup = function (colGroup) {
        return this.colgroup = colGroup;
    };
    ContentRender.prototype.setVisible = function (columns) {
        var rows = this.getRows();
        var element;
        var testRow;
        rows.some(function (r) { if (r.isDataRow) {
            testRow = r;
        } return r.isDataRow; });
        var tasks = [];
        for (var c = 0, clen = columns.length; c < clen; c++) {
            var column = columns[c];
            var idx = this.parent.getNormalizedColumnIndex(column.uid);
            if (this.canSkip(column, testRow, idx)) {
                continue;
            }
            var displayVal = column.visible === true ? '' : 'none';
            setStyleAttribute(this.getColGroup().childNodes[idx], { 'display': displayVal });
        }
        this.refreshContentRows({ requestType: 'refresh' });
    };
    ContentRender.prototype.colGroupRefresh = function () {
        if (this.getColGroup()) {
            var colGroup = this.getColGroup();
            colGroup.innerHTML = this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').innerHTML;
            this.setColGroup(colGroup);
        }
    };
    ContentRender.prototype.initializeContentDrop = function () {
        var gObj = this.parent;
        var drop = new Droppable(gObj.getContent(), {
            accept: '.e-dragclone',
            drop: function (e) {
                gObj.notify(events.columnDrop, { target: e.target, droppedElement: e.droppedElement });
                remove(e.droppedElement);
            }
        });
    };
    ContentRender.prototype.canSkip = function (column, row, index) {
        return isNullOrUndefined(row) ||
            isNullOrUndefined(column.visible) ||
            row.cells[index].visible === column.visible;
    };
    return ContentRender;
}());
export { ContentRender };
