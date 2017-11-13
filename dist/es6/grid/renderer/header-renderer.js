import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, setStyleAttribute, closest as getClosest, remove } from '@syncfusion/ej2-base';
import { classList } from '@syncfusion/ej2-base';
import { CellType } from '../base/enum';
import { RowRenderer } from './row-renderer';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import * as events from '../base/constant';
import { Draggable, Droppable } from '@syncfusion/ej2-base';
import { parentsUntil, wrap } from '../base/util';
var HeaderRender = (function () {
    function HeaderRender(parent, serviceLocator) {
        var _this = this;
        this.helper = function (e) {
            var gObj = _this.parent;
            if (!(gObj.allowReordering || gObj.allowGrouping)) {
                return false;
            }
            var visualElement = createElement('div', { className: 'e-cloneproperties e-dragclone e-headerclone' });
            var target = e.sender.target;
            var element = target.classList.contains('e-headercell') ? target :
                parentsUntil(target, 'e-headercell');
            if (!element) {
                return false;
            }
            var height = element.offsetHeight;
            var headercelldiv = element.querySelector('.e-headercelldiv');
            var col = gObj.getColumnByUid(headercelldiv.getAttribute('e-mappinguid'));
            if (!isNullOrUndefined(col.headerTemplate)) {
                if (col.headerTemplate.indexOf('#') !== -1) {
                    visualElement.innerHTML = document.querySelector(col.headerTemplate).innerHTML.trim();
                }
                else {
                    visualElement.innerHTML = col.headerTemplate;
                }
            }
            else {
                visualElement.textContent = headercelldiv ?
                    gObj.getColumnByUid(headercelldiv.getAttribute('e-mappinguid')).headerText : element.firstElementChild.innerHTML;
            }
            visualElement.style.width = element.offsetWidth + 'px';
            visualElement.style.height = element.offsetHeight + 'px';
            visualElement.style.lineHeight = (height - 6).toString() + 'px';
            if (element.querySelector('.e-headercelldiv')) {
                _this.column = gObj.getColumnByUid(element.querySelector('.e-headercelldiv').getAttribute('e-mappinguid'));
                visualElement.setAttribute('e-mappinguid', _this.column.uid);
            }
            gObj.element.appendChild(visualElement);
            return visualElement;
        };
        this.dragStart = function (e) {
            var gObj = _this.parent;
            gObj.element.querySelector('.e-gridpopup').style.display = 'none';
            gObj.notify(events.columnDragStart, { target: e.target, column: _this.column, event: e.event });
        };
        this.drag = function (e) {
            var gObj = _this.parent;
            var target = e.target;
            if (target) {
                var closest = getClosest(target, '.e-grid');
                var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
                if (!closest || closest.getAttribute('id') !== gObj.element.getAttribute('id')) {
                    classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                    if (gObj.allowReordering) {
                        gObj.element.querySelector('.e-reorderuparrow').style.display = 'none';
                        gObj.element.querySelector('.e-reorderdownarrow').style.display = 'none';
                    }
                    return;
                }
                gObj.notify(events.columnDrag, { target: e.target, column: _this.column, event: e.event });
            }
        };
        this.dragStop = function (e) {
            var gObj = _this.parent;
            var cancel;
            gObj.element.querySelector('.e-gridpopup').style.display = 'none';
            if ((!parentsUntil(e.target, 'e-headercell') && !parentsUntil(e.target, 'e-groupdroparea')) ||
                (!gObj.allowReordering && parentsUntil(e.target, 'e-headercell')) ||
                (!e.helper.getAttribute('e-mappinguid') && parentsUntil(e.target, 'e-groupdroparea'))) {
                remove(e.helper);
                cancel = true;
            }
            gObj.notify(events.columnDragStop, { target: e.target, event: e.event, column: _this.column, cancel: cancel });
        };
        this.drop = function (e) {
            var gObj = _this.parent;
            var uid = e.droppedElement.getAttribute('e-mappinguid');
            var closest = getClosest(e.target, '.e-grid');
            remove(e.droppedElement);
            if (closest && closest.getAttribute('id') !== gObj.element.getAttribute('id') ||
                !(gObj.allowReordering || gObj.allowGrouping)) {
                return;
            }
            gObj.notify(events.headerDrop, { target: e.target, uid: uid });
        };
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.ariaService = this.serviceLocator.getService('ariaService');
        this.widthService = this.serviceLocator.getService('widthService');
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.columnVisibilityChanged, this.setVisible, this);
        this.parent.on(events.columnPositionChanged, this.refreshUI, this);
    }
    HeaderRender.prototype.renderPanel = function () {
        var div = createElement('div', { className: 'e-gridheader' });
        var innerDiv = createElement('div', { className: 'e-headercontent' });
        div.appendChild(innerDiv);
        this.setPanel(div);
        this.parent.element.appendChild(div);
    };
    HeaderRender.prototype.renderTable = function () {
        var headerDiv = this.getPanel();
        headerDiv.appendChild(this.createHeaderTable());
        this.setTable(headerDiv.querySelector('.e-table'));
        this.initializeHeaderDrag();
        this.initializeHeaderDrop();
        this.parent.notify(events.headerRefreshed, { rows: this.rows });
    };
    HeaderRender.prototype.getPanel = function () {
        return this.headerPanel;
    };
    HeaderRender.prototype.setPanel = function (panel) {
        this.headerPanel = panel;
    };
    HeaderRender.prototype.getTable = function () {
        return this.headerTable;
    };
    HeaderRender.prototype.setTable = function (table) {
        this.headerTable = table;
    };
    HeaderRender.prototype.getColGroup = function () {
        return this.colgroup;
    };
    HeaderRender.prototype.setColGroup = function (colGroup) {
        return this.colgroup = colGroup;
    };
    HeaderRender.prototype.getRows = function () {
        var table = this.getTable();
        return table.tHead.rows;
    };
    HeaderRender.prototype.createHeaderTable = function () {
        var table = this.createTable();
        var innerDiv = this.getPanel().firstChild;
        innerDiv.appendChild(table);
        return innerDiv;
    };
    HeaderRender.prototype.createTable = function () {
        var gObj = this.parent;
        var columns = gObj.getColumns();
        var table = createElement('table', { className: 'e-table', attrs: { cellspacing: '0.25px', role: 'grid' } });
        var innerDiv = this.getPanel().firstChild;
        var findHeaderRow = this.createHeaderContent();
        var thead = findHeaderRow.thead;
        var tbody = createElement('tbody', { className: 'e-hide' });
        var colGroup = createElement('colgroup');
        var rowBody = createElement('tr');
        var bodyCell;
        var rows = this.rows = findHeaderRow.rows;
        var rowRenderer = new RowRenderer(this.serviceLocator, CellType.Header);
        for (var i = 0, len = rows.length; i < len; i++) {
            for (var j = 0, len_1 = rows[i].cells.length; j < len_1; j++) {
                var cell = rows[i].cells[j];
                bodyCell = createElement('td');
                rowBody.appendChild(bodyCell);
            }
        }
        if (gObj.allowFiltering || gObj.allowSorting || gObj.allowGrouping) {
            table.classList.add('e-sortfilter');
        }
        this.updateColGroup(colGroup);
        tbody.appendChild(rowBody);
        table.appendChild(this.setColGroup(colGroup));
        table.appendChild(thead);
        table.appendChild(tbody);
        this.ariaService.setOptions(table, { colcount: gObj.getColumns().length.toString() });
        return table;
    };
    HeaderRender.prototype.createHeaderContent = function () {
        var gObj = this.parent;
        var columns = gObj.getColumns();
        var thead = createElement('thead');
        var colHeader = createElement('tr', { className: 'e-columnheader' });
        var rowRenderer = new RowRenderer(this.serviceLocator, CellType.Header, gObj);
        rowRenderer.element = colHeader;
        var rows = [];
        var headerRow;
        this.colDepth = this.getObjDepth();
        for (var i = 0, len = this.colDepth; i < len; i++) {
            rows[i] = this.generateRow(i);
            rows[i].cells = [];
        }
        rows = this.ensureColumns(rows);
        rows = this.getHeaderCells(rows);
        for (var i = 0, len = this.colDepth; i < len; i++) {
            headerRow = rowRenderer.render(rows[i], columns);
            thead.appendChild(headerRow);
        }
        var findHeaderRow = {
            thead: thead,
            rows: rows
        };
        return findHeaderRow;
    };
    HeaderRender.prototype.updateColGroup = function (colGroup) {
        var cols = this.parent.getColumns();
        var col;
        var indexes = this.parent.getColumnIndexesInView();
        if (this.parent.allowGrouping) {
            for (var i = 0, len = this.parent.groupSettings.columns.length; i < len; i++) {
                if (this.parent.enableColumnVirtualization && indexes.indexOf(i) === -1) {
                    continue;
                }
                col = createElement('col');
                colGroup.appendChild(col);
            }
        }
        if (this.parent.detailTemplate || this.parent.childGrid) {
            col = createElement('col');
            colGroup.appendChild(col);
        }
        for (var i = 0, len = cols.length; i < len; i++) {
            col = createElement('col');
            if (cols[i].visible === false) {
                setStyleAttribute(col, { 'display': 'none' });
            }
            colGroup.appendChild(col);
        }
        return colGroup;
    };
    HeaderRender.prototype.ensureColumns = function (rows) {
        var gObj = this.parent;
        var indexes = this.parent.getColumnIndexesInView();
        for (var i = 0, len = rows.length; i < len; i++) {
            if (gObj.allowGrouping) {
                for (var c = 0, len_2 = gObj.groupSettings.columns.length; c < len_2; c++) {
                    if (this.parent.enableColumnVirtualization && indexes.indexOf(c) === -1) {
                        continue;
                    }
                    rows[i].cells.push(this.generateCell({}, CellType.HeaderIndent));
                }
            }
            if (gObj.detailTemplate || gObj.childGrid) {
                rows[i].cells.push(this.generateCell({}, CellType.DetailHeader));
            }
        }
        return rows;
    };
    HeaderRender.prototype.getHeaderCells = function (rows) {
        var column;
        if (this.parent.frozenColumns) {
            if (this.parent.getHeaderTable() && this.parent.getHeaderTable().querySelector('thead')) {
                column = this.parent.columns.slice(this.parent.frozenColumns, this.parent.columns.length);
            }
            else {
                column = this.parent.columns.slice(0, this.parent.frozenColumns);
            }
        }
        var cols = this.parent.enableColumnVirtualization ? this.parent.getColumns()
            : (this.parent.frozenColumns ? column : this.parent.columns);
        for (var i = 0, len = cols.length; i < len; i++) {
            rows = this.appendCells(cols[i], rows, 0, i === 0, false, i === (len - 1));
        }
        return rows;
    };
    HeaderRender.prototype.appendCells = function (cols, rows, index, isFirstObj, isFirstCol, isLastCol) {
        var lastCol = isLastCol ? 'e-lastcell' : '';
        if (!cols.columns) {
            rows[index].cells.push(this.generateCell(cols, CellType.Header, this.colDepth - index, (isFirstObj ? '' : (isFirstCol ? 'e-firstcell' : '')) + lastCol, index, this.parent.getColumnIndexByUid(cols.uid)));
        }
        else {
            var colSpan = this.getCellCnt(cols, 0);
            if (colSpan) {
                rows[index].cells.push(new Cell({
                    cellType: CellType.StackedHeader, column: cols, colSpan: colSpan
                }));
            }
            for (var i = 0, len = cols.columns.length; i < len; i++) {
                rows = this.appendCells(cols.columns[i], rows, index + 1, isFirstObj, i === 0, i === (len - 1) && isLastCol);
            }
        }
        return rows;
    };
    HeaderRender.prototype.generateRow = function (index) {
        return new Row({});
    };
    HeaderRender.prototype.generateCell = function (column, cellType, rowSpan, className, rowIndex, colIndex) {
        var opt = {
            'visible': column.visible,
            'isDataCell': false,
            'isTemplate': !isNullOrUndefined(column.headerTemplate),
            'rowID': '',
            'column': column,
            'cellType': cellType,
            'rowSpan': rowSpan,
            'className': className,
            'index': rowIndex,
            'colIndex': colIndex
        };
        if (!opt.rowSpan || opt.rowSpan < 2) {
            delete opt.rowSpan;
        }
        return new Cell(opt);
    };
    HeaderRender.prototype.setVisible = function (columns) {
        var rows = [].slice.call(this.getRows());
        var displayVal = '';
        var idx;
        var className;
        var element;
        for (var c = 0, clen = columns.length; c < clen; c++) {
            var column = columns[c];
            idx = this.parent.getNormalizedColumnIndex(column.uid);
            if (column.visible === false) {
                displayVal = 'none';
            }
            setStyleAttribute(this.getColGroup().childNodes[idx], { 'display': displayVal });
            this.refreshUI();
        }
    };
    HeaderRender.prototype.refreshUI = function () {
        var headerDiv = this.getPanel();
        var table = this.getTable();
        remove(this.getTable());
        table.removeChild(table.firstChild);
        table.removeChild(table.childNodes[0]);
        var colGroup = createElement('colgroup');
        var findHeaderRow = this.createHeaderContent();
        this.rows = findHeaderRow.rows;
        table.insertBefore(findHeaderRow.thead, table.firstChild);
        this.updateColGroup(colGroup);
        table.insertBefore(this.setColGroup(colGroup), table.firstChild);
        this.setTable(table);
        this.appendContent(table);
        this.parent.notify(events.colGroupRefresh, {});
        this.widthService.setWidthToColumns();
        this.initializeHeaderDrag();
        var rows = [].slice.call(headerDiv.querySelectorAll('tr.e-columnheader'));
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            var gCells = [].slice.call(row.querySelectorAll('.e-grouptopleftcell'));
            if (gCells.length) {
                gCells[gCells.length - 1].classList.add('e-lastgrouptopleftcell');
            }
        }
        this.parent.notify(events.headerRefreshed, { rows: this.rows });
        if (this.parent.allowTextWrap && this.parent.textWrapSettings.wrapMode === 'header') {
            wrap(rows, true);
        }
    };
    HeaderRender.prototype.appendContent = function (table) {
        this.getPanel().firstChild.appendChild(table);
    };
    HeaderRender.prototype.getObjDepth = function () {
        var max = 0;
        var cols = this.parent.columns;
        for (var i = 0, len = cols.length; i < len; i++) {
            var depth = this.checkDepth(cols[i], 0);
            if (max < depth) {
                max = depth;
            }
        }
        return max + 1;
    };
    HeaderRender.prototype.checkDepth = function (col, index) {
        if (col.columns) {
            index++;
            for (var i = 0, len = col.columns.length; i < len; i++) {
                index = this.checkDepth(col.columns[i], index);
            }
        }
        return index;
    };
    HeaderRender.prototype.getCellCnt = function (col, cnt) {
        if (col.columns) {
            for (var i = 0, len = col.columns.length; i < len; i++) {
                cnt = this.getCellCnt(col.columns[i], cnt);
            }
        }
        else {
            if (col.visible) {
                cnt++;
            }
        }
        return cnt;
    };
    HeaderRender.prototype.initializeHeaderDrag = function () {
        var gObj = this.parent;
        if (!(this.parent.allowReordering || (this.parent.allowGrouping && this.parent.groupSettings.showDropArea))) {
            return;
        }
        var headerRows = [].slice.call(gObj.getHeaderContent().querySelectorAll('.e-columnheader'));
        for (var i = 0, len = headerRows.length; i < len; i++) {
            var drag = new Draggable(headerRows[i], {
                dragTarget: '.e-headercell',
                distance: 5,
                helper: this.helper,
                dragStart: this.dragStart,
                drag: this.drag,
                dragStop: this.dragStop,
                abort: '.e-rhandler'
            });
        }
    };
    HeaderRender.prototype.initializeHeaderDrop = function () {
        var gObj = this.parent;
        var drop = new Droppable(gObj.getHeaderContent(), {
            accept: '.e-dragclone',
            drop: this.drop
        });
    };
    return HeaderRender;
}());
export { HeaderRender };
