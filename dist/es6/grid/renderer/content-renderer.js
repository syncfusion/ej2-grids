import { Droppable, Browser } from '@syncfusion/ej2-base';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { createElement, setStyleAttribute, remove } from '@syncfusion/ej2-base';
import { getUpdateUsingRaf } from '../base/util';
import * as events from '../base/constant';
import { RowRenderer } from './row-renderer';
import { RowModelGenerator } from '../services/row-model-generator';
import { GroupModelGenerator } from '../services/group-model-generator';
var ContentRender = (function () {
    function ContentRender(parent, serviceLocator) {
        var _this = this;
        this.rows = [];
        this.drop = function (e) {
            _this.parent.notify(events.columnDrop, { target: e.target, droppedElement: e.droppedElement });
            remove(e.droppedElement);
        };
        this.rafCallback = function () {
            _this.ariaService.setBusy(_this.getPanel().firstChild, false);
            if (_this.parent.isDestroyed) {
                return;
            }
            _this.parent.notify(events.contentReady, {});
            _this.parent.trigger(events.dataBound, {});
            if (_this.args) {
                var action = (_this.args.requestType || '').toLowerCase() + '-complete';
                _this.parent.notify(action, _this.args);
            }
            _this.parent.hideSpinner();
        };
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService('ariaService');
        this.generator = this.getModelGenerator();
        if (this.parent.isDestroyed) {
            return;
        }
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
        var table = createElement('table', {
            className: 'e-table', attrs: {
                cellspacing: '0.25px', role: 'grid',
                id: this.parent.element.id + '_content_table'
            }
        });
        this.setColGroup(this.parent.element.querySelector('.e-gridheader').querySelector('colgroup').cloneNode(true));
        table.appendChild(this.getColGroup());
        table.appendChild(createElement('tbody'));
        innerDiv.appendChild(table);
        return innerDiv;
    };
    ContentRender.prototype.refreshContentRows = function (args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        var gObj = this.parent;
        var dataSource = gObj.currentViewData;
        var frag = document.createDocumentFragment();
        var columns = gObj.getColumns();
        var tr;
        var row = new RowRenderer(this.serviceLocator, null, this.parent);
        this.rowElements = [];
        var modelData = this.generator.generateRows(dataSource, args);
        var tbody = this.getTable().querySelector('tbody');
        for (var i = 0, len = modelData.length; i < len; i++) {
            if (!gObj.rowTemplate) {
                tr = row.render(modelData[i], columns);
            }
            else {
                var elements = gObj.getRowTemplate()(extend({ index: i }, dataSource[i]));
                for (var j = 0; j < elements.length; j++) {
                    var isTR = elements[j].nodeName.toLowerCase() === 'tr';
                    if (isTR || (elements[j].querySelectorAll && elements[j].querySelectorAll('tr').length)) {
                        tr = isTR ? elements[j] : elements[j].querySelector('tr');
                    }
                }
            }
            frag.appendChild(tr);
            this.rows.push(modelData[i]);
            if (modelData[i].isDataRow) {
                var td = tr.querySelectorAll('.e-rowcell:not(.e-hide)')[0];
                if (td) {
                    td.classList.add('e-detailrowvisible');
                }
                this.rowElements.push(tr);
            }
            this.ariaService.setOptions(this.getTable(), { colcount: gObj.getColumns().length.toString() });
        }
        this.args = args;
        getUpdateUsingRaf(function () {
            remove(tbody);
            tbody = createElement('tbody');
            _this.appendContent(tbody, frag, args);
        }, this.rafCallback);
    };
    ContentRender.prototype.appendContent = function (tbody, frag, args) {
        tbody.appendChild(frag);
        this.getTable().appendChild(tbody);
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
    ContentRender.prototype.setRowElements = function (elements) {
        this.rowElements = elements;
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
            drop: this.drop
        });
    };
    ContentRender.prototype.canSkip = function (column, row, index) {
        return isNullOrUndefined(row) ||
            isNullOrUndefined(column.visible) ||
            row.cells[index].visible === column.visible;
    };
    ContentRender.prototype.getModelGenerator = function () {
        return this.generator = this.parent.allowGrouping ? new GroupModelGenerator(this.parent) : new RowModelGenerator(this.parent);
    };
    ContentRender.prototype.renderEmpty = function (tbody) {
        this.getTable().appendChild(tbody);
    };
    ContentRender.prototype.setSelection = function (uid, set, clearAll) {
        this.getRows().filter(function (row) { return clearAll || uid === row.uid; })
            .forEach(function (row) { return row.isSelected = set; });
    };
    ContentRender.prototype.getRowByIndex = function (index) {
        return this.parent.getDataRows()[index];
    };
    return ContentRender;
}());
export { ContentRender };
