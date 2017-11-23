var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { EventHandler, getValue, closest, isNullOrUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { CellType } from '../base/enum';
import * as event from '../base/constant';
var FocusStrategy = (function () {
    function FocusStrategy(parent) {
        this.currentInfo = {};
        this.oneTime = true;
        this.forget = true;
        this.skipFocus = false;
        this.prevIndexes = {};
        this.parent = parent;
        this.addEventListener();
    }
    FocusStrategy.prototype.focusCheck = function (e) {
        var target = e.target;
        this.skipFocus = closest(target, 'e-pager') !== null;
    };
    FocusStrategy.prototype.onFocus = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.setActive(true);
        var current = this.getContent().matrix.get(0, -1, [0, 1], null, this.getContent().validator());
        this.getContent().matrix.select(current[0], current[1]);
        if (this.skipFocus) {
            this.focus();
            this.skipFocus = false;
        }
    };
    FocusStrategy.prototype.onClick = function (e, force) {
        var isContent = !isNullOrUndefined(closest(e.target, '.e-gridcontent'));
        if (!isContent && isNullOrUndefined(closest(e.target, '.e-gridheader')) ||
            e.target.classList.contains('e-filtermenudiv')) {
            return;
        }
        var beforeArgs = { cancel: false, byKey: false, byClick: !isNullOrUndefined(e.target), clickArgs: e };
        this.parent.notify(event.beforeCellFocused, beforeArgs);
        if (beforeArgs.cancel) {
            return;
        }
        this.setActive(isContent);
        var returnVal = this.getContent().onClick(e, force);
        if (returnVal === false) {
            return;
        }
        this.focus();
    };
    FocusStrategy.prototype.onKeyPress = function (e) {
        if (this.skipOn(e)) {
            return;
        }
        var beforeArgs = { cancel: false, byKey: true, byClick: false, keyArgs: e };
        this.parent.notify(event.beforeCellFocused, beforeArgs);
        if (beforeArgs.cancel) {
            return;
        }
        var bValue = this.getContent().matrix.current;
        this.currentInfo.outline = true;
        this.swap = this.getContent().jump(e.action, bValue);
        if (this.swap) {
            var isHeader = this.header === this.getContent();
            this.setActive(isHeader);
            var rowInitVal = isHeader ? -1 : this.header.matrix.matrix.length;
            var current = this.getContent().matrix.get(rowInitVal, bValue[1], [0, 0], e.action, this.getContent().validator());
            this.getContent().matrix.current = [rowInitVal, current[1]];
            this.prevIndexes = {};
        }
        e.preventDefault();
        this.getContent().onKeyPress(e);
        this.focus(e);
    };
    FocusStrategy.prototype.skipOn = function (e) {
        var target = e.target;
        if (!target) {
            return false;
        }
        return (this.parent.editSettings.mode !== 'batch' && (this.parent.isEdit || ['insert', 'f2', 'delete'].indexOf(e.action) > -1)
            || (closest(document.activeElement, '.e-filterbarcell') !== null && ['leftArrow', 'rightArrow'].indexOf(e.action) > -1)
            || (closest(target, '.e-gridcontent') === null && closest(target, '.e-gridheader') === null)
            || (e.action === 'space' && (!target.classList.contains('e-gridchkbox') && closest(target, '.e-gridchkbox') === null
                && closest(target, '.e-headerchkcelldiv') === null)));
    };
    FocusStrategy.prototype.getFocusedElement = function () {
        return this.currentInfo.elementToFocus;
    };
    FocusStrategy.prototype.getContent = function () {
        return this.active || this.content;
    };
    FocusStrategy.prototype.setActive = function (content) {
        this.active = content ? this.content : this.header;
    };
    FocusStrategy.prototype.setFocusedElement = function (element) {
        var _this = this;
        this.currentInfo.elementToFocus = element;
        setTimeout(function () { return _this.currentInfo.elementToFocus.focus(); }, 0);
    };
    FocusStrategy.prototype.focus = function (e) {
        this.removeFocus();
        this.addFocus(this.getContent().getFocusInfo(), e);
    };
    FocusStrategy.prototype.removeFocus = function () {
        if (!this.currentInfo.element) {
            return;
        }
        removeClass([this.currentInfo.element, this.currentInfo.elementToFocus], ['e-focused', 'e-focus']);
        this.currentInfo.elementToFocus.tabIndex = -1;
    };
    FocusStrategy.prototype.addFocus = function (info, e) {
        this.currentInfo = info;
        this.currentInfo.outline = info.outline && !isNullOrUndefined(e);
        if (!info.element) {
            return;
        }
        var isFocused = info.elementToFocus.classList.contains('e-focus');
        if (isFocused) {
            return;
        }
        if (this.currentInfo.outline) {
            addClass([info.element], ['e-focused']);
        }
        addClass([info.elementToFocus], ['e-focus']);
        info.element.tabIndex = 0;
        if (!isFocused) {
            this.setFocusedElement(info.elementToFocus);
        }
        this.parent.notify(event.cellFocused, {
            element: info.elementToFocus,
            parent: info.element,
            indexes: this.getContent().matrix.current,
            byKey: !isNullOrUndefined(e),
            byClick: isNullOrUndefined(e),
            keyArgs: e,
            isJump: this.swap,
            container: this.getContent().getInfo(e),
            outline: !isNullOrUndefined(e)
        });
        var _a = this.getContent().matrix.current, rowIndex = _a[0], cellIndex = _a[1];
        this.prevIndexes = { rowIndex: rowIndex, cellIndex: cellIndex };
    };
    FocusStrategy.prototype.refreshMatrix = function (content) {
        var _this = this;
        return function (e) {
            if (content && !_this.content) {
                _this.content = new ContentFocus(_this.parent);
            }
            if (!content && !_this.header) {
                _this.header = new HeaderFocus(_this.parent);
            }
            var cFocus = content ? _this.content : _this.header;
            cFocus.matrix.generate(e.rows, cFocus.selector);
            cFocus.generateRows(e.rows);
            var actions = ['paging', 'grouping'];
            if (e.args && actions.indexOf(e.args.requestType) > -1) {
                _this.skipFocus = true;
                _this.onFocus();
            }
        };
    };
    FocusStrategy.prototype.addEventListener = function () {
        var _this = this;
        if (this.parent.isDestroyed || this.parent.frozenColumns || this.parent.frozenRows) {
            return;
        }
        EventHandler.add(this.parent.element, 'mousedown', this.focusCheck, this);
        EventHandler.add(this.parent.element, 'focus', this.onFocus, this);
        this.parent.on(event.keyPressed, this.onKeyPress, this);
        this.parent.on(event.click, this.onClick, this);
        this.parent.on(event.contentReady, this.refreshMatrix(true), this);
        this.parent.on(event.headerRefreshed, this.refreshMatrix(), this);
        this.parent.on('close-edit', this.restoreFocus, this);
        ['start-edit', 'start-add'].forEach(function (evt) { return _this.parent.on(evt, _this.clearOutline, _this); });
        ['sorting'].forEach(function (action) { return _this.parent.on(action + "-complete", _this.restoreFocus, _this); });
        this.parent.on(event.batchAdd, this.refreshMatrix(true), this);
        this.parent.on(event.batchDelete, this.refreshMatrix(true), this);
        this.parent.on(event.detailDataBound, this.refreshMatrix(true), this);
        this.parent.on(event.onEmpty, this.refreshMatrix(true), this);
    };
    FocusStrategy.prototype.removeEventListener = function () {
        var _this = this;
        if (this.parent.isDestroyed) {
            return;
        }
        EventHandler.remove(this.parent.element, 'mousedown', this.focusCheck);
        EventHandler.remove(this.parent.element, 'focus', this.onFocus);
        this.parent.off(event.keyPressed, this.onKeyPress);
        this.parent.off(event.click, this.onClick);
        this.parent.off(event.contentReady, this.refreshMatrix(true));
        this.parent.off(event.headerRefreshed, this.refreshMatrix());
        this.parent.off('close-edit', this.restoreFocus);
        ['start-edit', 'start-add'].forEach(function (evt) { return _this.parent.off(evt, _this.clearOutline); });
        ['sorting'].forEach(function (action) { return _this.parent.off(action + "-complete", _this.restoreFocus); });
        this.parent.off(event.batchAdd, this.refreshMatrix(true));
        this.parent.off(event.batchDelete, this.refreshMatrix(true));
        this.parent.off(event.detailDataBound, this.refreshMatrix(true));
        this.parent.off(event.onEmpty, this.refreshMatrix(true));
    };
    FocusStrategy.prototype.destroy = function () {
        this.removeEventListener();
    };
    FocusStrategy.prototype.restoreFocus = function () {
        this.addFocus(this.getContent().getFocusInfo());
    };
    FocusStrategy.prototype.clearOutline = function () {
        this.getContent().matrix.current = this.getContent().matrix.get(0, -1, [0, 1], 'downArrow', this.getContent().validator());
        if (!this.currentInfo.element || !this.currentInfo.elementToFocus) {
            return;
        }
        removeClass([this.currentInfo.element, this.currentInfo.elementToFocus], ['e-focus', 'e-focused']);
    };
    FocusStrategy.prototype.getPrevIndexes = function () {
        var forget = this.forget;
        this.forget = false;
        return forget ? { rowIndex: null, cellIndex: null } : this.prevIndexes;
    };
    FocusStrategy.prototype.forgetPrevious = function () {
        this.forget = true;
    };
    return FocusStrategy;
}());
export { FocusStrategy };
var Matrix = (function () {
    function Matrix() {
        this.matrix = [];
        this.current = [];
    }
    Matrix.prototype.set = function (rowIndex, columnIndex, allow) {
        rowIndex = Math.max(0, Math.min(rowIndex, this.rows));
        columnIndex = Math.max(0, Math.min(columnIndex, this.columns));
        this.matrix[rowIndex] = this.matrix[rowIndex] || [];
        this.matrix[rowIndex][columnIndex] = allow ? 1 : 0;
    };
    Matrix.prototype.get = function (rowIndex, columnIndex, navigator, action, validator) {
        var tmp = columnIndex;
        if (rowIndex + navigator[0] < 0) {
            return [rowIndex, columnIndex];
        }
        rowIndex = Math.max(0, Math.min(rowIndex + navigator[0], this.rows));
        columnIndex = Math.max(0, Math.min(columnIndex + navigator[1], this.matrix[rowIndex].length - 1));
        var first = this.first(this.matrix[rowIndex], columnIndex, navigator, true, action);
        columnIndex = first === null ? tmp : first;
        var val = getValue(rowIndex + "." + columnIndex, this.matrix);
        return this.inValid(val) || !validator(rowIndex, columnIndex, action) ?
            this.get(rowIndex, tmp, navigator, action, validator) : [rowIndex, columnIndex];
    };
    Matrix.prototype.first = function (vector, index, navigator, moveTo, action) {
        if (((index < 0 || index === vector.length) && this.inValid(vector[index])
            && (action !== 'upArrow' && action !== 'downArrow')) || !vector.some(function (v) { return v === 1; })) {
            return null;
        }
        return !this.inValid(vector[index]) ? index :
            this.first(vector, (['upArrow', 'downArrow', 'shiftUp', 'shiftDown'].indexOf(action) !== -1) ? moveTo ? 0 : ++index : index + navigator[1], navigator, false, action);
    };
    Matrix.prototype.select = function (rowIndex, columnIndex) {
        rowIndex = Math.max(0, Math.min(rowIndex, this.rows));
        columnIndex = Math.max(0, Math.min(columnIndex, this.matrix[rowIndex].length - 1));
        this.current = [rowIndex, columnIndex];
    };
    Matrix.prototype.generate = function (rows, selector) {
        var _this = this;
        this.rows = rows.length - 1;
        this.matrix = [];
        rows.forEach(function (row, rIndex) {
            var cells = row.cells.filter(function (c) { return c.isSpanned !== true; });
            _this.columns = Math.max(cells.length - 1, _this.columns | 0);
            cells.forEach(function (cell, cIndex) {
                _this.set(rIndex, cIndex, selector(row, cell));
            });
        });
        return this.matrix;
    };
    Matrix.prototype.inValid = function (value) {
        return value === 0 || value === undefined;
    };
    return Matrix;
}());
export { Matrix };
var ContentFocus = (function () {
    function ContentFocus(parent) {
        var _this = this;
        this.matrix = new Matrix();
        this.parent = parent;
        this.keyActions = {
            'rightArrow': [0, 1],
            'tab': [0, 1],
            'leftArrow': [0, -1],
            'shiftTab': [0, -1],
            'upArrow': [-1, 0],
            'downArrow': [1, 0],
            'shiftUp': [-1, 0],
            'shiftDown': [1, 0],
            'shiftRight': [0, 1],
            'shiftLeft': [0, -1],
            'enter': [1, 0],
            'shiftEnter': [-1, 0]
        };
        this.indexesByKey = function (action) {
            var opt = {
                'home': [_this.matrix.current[0], -1, 0, 1],
                'end': [_this.matrix.current[0], _this.matrix.columns + 1, 0, -1],
                'ctrlHome': [0, -1, 0, 1],
                'ctrlEnd': [_this.matrix.rows, _this.matrix.columns + 1, 0, -1]
            };
            return opt[action] || null;
        };
    }
    ContentFocus.prototype.onKeyPress = function (e) {
        var navigator = this.keyActions[e.action];
        var current = this.getCurrentFromAction(e.action, navigator, e.action in this.keyActions, e);
        if (!current) {
            return;
        }
        this.matrix.select(current[0], current[1]);
    };
    ContentFocus.prototype.getCurrentFromAction = function (action, navigator, isPresent, e) {
        if (navigator === void 0) { navigator = [0, 0]; }
        if (!isPresent && !this.indexesByKey(action)) {
            return null;
        }
        if (!this.shouldFocusChange(e)) {
            return this.matrix.current;
        }
        var _a = this.indexesByKey(action) || this.matrix.current.concat(navigator), rowIndex = _a[0], cellIndex = _a[1], rN = _a[2], cN = _a[3];
        var current = this.matrix.get(rowIndex, cellIndex, [rN, cN], action, this.validator());
        return current;
    };
    ContentFocus.prototype.onClick = function (e, force) {
        var target = e.target;
        target = (target.classList.contains('e-rowcell') ? target : closest(target, 'td'));
        if (!target) {
            return;
        }
        var _a = [target.parentElement.rowIndex, target.cellIndex], rowIndex = _a[0], cellIndex = _a[1];
        var _b = this.matrix.current, oRowIndex = _b[0], oCellIndex = _b[1];
        var val = getValue(rowIndex + "." + cellIndex, this.matrix.matrix);
        if (this.matrix.inValid(val) || (!force && oRowIndex === rowIndex && oCellIndex === cellIndex)) {
            return false;
        }
        this.matrix.select(rowIndex, cellIndex);
    };
    ContentFocus.prototype.getFocusInfo = function () {
        var info = {};
        var _a = this.matrix.current, _b = _a[0], rowIndex = _b === void 0 ? 0 : _b, _c = _a[1], cellIndex = _c === void 0 ? 0 : _c;
        this.matrix.current = [rowIndex, cellIndex];
        info.element = this.parent.getContentTable()
            .rows[rowIndex].cells[cellIndex];
        info.elementToFocus = this.getFocusable(info.element);
        info.outline = !info.element.classList.contains('e-detailcell');
        return info;
    };
    ContentFocus.prototype.getFocusable = function (element) {
        var child = [].slice
            .call(element.querySelectorAll('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'));
        return child.length ? child[0] : element;
    };
    ContentFocus.prototype.selector = function (row, cell) {
        var types = [CellType.Expand, CellType.GroupCaption, CellType.CaptionSummary, CellType.GroupSummary];
        return ((row.isDataRow && cell.visible && (cell.isDataCell || cell.isTemplate))
            || (row.isDataRow && cell.cellType === CellType.DetailExpand)
            || (!row.isDataRow && types.indexOf(cell.cellType) > -1)
            || (cell.column && cell.column.type === 'checkbox'))
            && !(row.edit === 'delete' && row.isDirty);
    };
    ContentFocus.prototype.jump = function (action, current) {
        return action === 'upArrow' && current[0] === 0;
    };
    ContentFocus.prototype.generateRows = function (rows) {
    };
    ContentFocus.prototype.getInfo = function (e) {
        var info = this.getFocusInfo();
        var _a = this.matrix.current, rIndex = _a[0], cIndex = _a[1];
        var isData = info.element.classList.contains('e-rowcell');
        var isSelectable = isData || (e && e.action !== 'enter' && (info.element.classList.contains('e-detailrowcollapse')
            || info.element.classList.contains('e-detailrowexpand')));
        var _b = [Math.min(parseInt(info.element.parentElement.getAttribute('aria-rowindex'), 10), rIndex),
            Math.min(parseInt(info.element.getAttribute('aria-colindex'), 10), cIndex)], rowIndex = _b[0], cellIndex = _b[1];
        return { isContent: true, isDataCell: isData, indexes: [rowIndex, cellIndex], isSelectable: isSelectable };
    };
    ContentFocus.prototype.validator = function () {
        var table = this.parent.getContentTable();
        return function (rowIndex, cellIndex, action) {
            var cell = table.rows[rowIndex].cells[cellIndex];
            if (action === 'enter' || action === 'shiftEnter') {
                return cell.classList.contains('e-rowcell');
            }
            if ((action === 'shiftUp' || action === 'shiftDown') && cell.classList.contains('e-rowcell')) {
                return true;
            }
            else if (action !== 'shiftUp' && action !== 'shiftDown') {
                return cell.getBoundingClientRect().width !== 0;
            }
            return false;
        };
    };
    ContentFocus.prototype.shouldFocusChange = function (e) {
        var _a = this.matrix.current, _b = _a[0], rIndex = _b === void 0 ? -1 : _b, _c = _a[1], cIndex = _c === void 0 ? -1 : _c;
        if (rIndex < 0 || cIndex < 0) {
            return true;
        }
        var cell = this.parent.getContentTable().rows[rIndex].cells[cIndex];
        return e.action === 'enter' || e.action === 'shiftEnter' ? cell.classList.contains('e-rowcell') : true;
    };
    return ContentFocus;
}());
export { ContentFocus };
var HeaderFocus = (function (_super) {
    __extends(HeaderFocus, _super);
    function HeaderFocus(parent) {
        return _super.call(this, parent) || this;
    }
    HeaderFocus.prototype.onClick = function (e) {
        var target = e.target;
        target = (target.classList.contains('e-headercell') ? target : closest(target, 'th'));
        if (!target) {
            return;
        }
        var _a = [target.parentElement.rowIndex, target.cellIndex], rowIndex = _a[0], cellIndex = _a[1];
        var val = getValue(rowIndex + "." + cellIndex, this.matrix.matrix);
        if (this.matrix.inValid(val)) {
            return false;
        }
        this.matrix.select(target.parentElement.rowIndex, target.cellIndex);
    };
    HeaderFocus.prototype.getFocusInfo = function () {
        var info = {};
        var _a = this.matrix.current, _b = _a[0], rowIndex = _b === void 0 ? 0 : _b, _c = _a[1], cellIndex = _c === void 0 ? 0 : _c;
        info.element = this.parent.getHeaderTable()
            .rows[rowIndex].cells[cellIndex];
        info.elementToFocus = this.getFocusable(info.element);
        info.outline = !info.element.classList.contains('e-filterbarcell');
        return info;
    };
    HeaderFocus.prototype.selector = function (row, cell) {
        return (cell.visible && (cell.column.field !== undefined || cell.isTemplate)) || cell.column.type === 'checkbox';
    };
    HeaderFocus.prototype.jump = function (action, current) {
        return action === 'downArrow' && current[0] === this.matrix.matrix.length - 1;
    };
    HeaderFocus.prototype.generateRows = function (rows) {
        var _this = this;
        var length = this.matrix.matrix.length;
        if (this.parent.allowFiltering && this.parent.filterSettings.type === 'filterbar') {
            this.matrix.rows = ++this.matrix.rows;
            rows[0].cells.forEach(function (cell, cIndex) {
                return _this.matrix.set(length, cIndex, cell.visible && cell.column.allowFiltering !== false);
            });
        }
    };
    HeaderFocus.prototype.getInfo = function () {
        return { isContent: false, isHeader: true };
    };
    HeaderFocus.prototype.validator = function () {
        return function () { return true; };
    };
    HeaderFocus.prototype.shouldFocusChange = function (e) {
        var _a = this.matrix.current, rIndex = _a[0], cIndex = _a[1];
        if (rIndex < 0 || cIndex < 0) {
            return true;
        }
        var cell = this.parent.getHeaderTable().rows[rIndex].cells[cIndex];
        return e.action === 'enter' ? !cell.classList.contains('e-headercell') : true;
    };
    return HeaderFocus;
}(ContentFocus));
export { HeaderFocus };
