import { EventHandler, createElement, detach, formatUnit, Browser, closest } from '@syncfusion/ej2-base';
import { ColumnWidthService } from '../services/width-controller';
import * as events from '../base/constant';
import { getScrollBarWidth } from '../base/util';
export var resizeClassList = {
    root: 'e-rhandler',
    suppress: 'e-rsuppress',
    icon: 'e-ricon',
    helper: 'e-rhelper',
    header: 'th.e-headercell',
    cursor: 'e-rcursor',
    lines: 'e-rlines'
};
var Resize = (function () {
    function Resize(parent) {
        this.tapped = false;
        this.isDblClk = true;
        this.parent = parent;
        if (this.parent.isDestroyed) {
            return;
        }
        this.widthService = new ColumnWidthService(parent);
        this.addEventListener();
    }
    Resize.prototype.autoFitColumns = function (fName) {
        var columnName = (fName === undefined || fName === null || fName.length <= 0) ?
            this.parent.getColumns().map(function (x) { return x.field; }) : (typeof fName === 'string') ? [fName] : fName;
        this.findColumn(columnName);
    };
    Resize.prototype.resizeColumn = function (fName, index, id) {
        var gObj = this.parent;
        var tWidth = 0;
        var headerTable = this.parent.getHeaderTable();
        var contentTable = this.parent.getContentTable();
        var headerDivTag = 'e-gridheader';
        var contentDivTag = 'e-gridcontent';
        var indentWidthClone = gObj.getHeaderTable().querySelector('tr').querySelectorAll('.e-grouptopleftcell');
        var indentWidth = 0;
        if (indentWidthClone.length > 0) {
            for (var i = 0; i < indentWidthClone.length; i++) {
                indentWidth += indentWidthClone[i].offsetWidth;
            }
        }
        var uid = id ? id : this.parent.getUidByColumnField(fName);
        var columnIndex = this.parent.getNormalizedColumnIndex(uid);
        var headerTextClone = headerTable.querySelectorAll('th')[columnIndex].cloneNode(true);
        var headerText = [headerTextClone];
        var contentTextClone = contentTable.querySelectorAll("td:nth-child(" + (columnIndex + 1) + ")");
        var contentText = [];
        for (var i = 0; i < contentTextClone.length; i++) {
            contentText[i] = contentTextClone[i].cloneNode(true);
        }
        var wHeader = this.createTable(headerTable, headerText, headerDivTag);
        var wContent = this.createTable(contentTable, contentText, contentDivTag);
        var columnbyindex = gObj.getColumns()[index];
        var result;
        var width = (wHeader > wContent) ? columnbyindex.width = formatUnit(wHeader) : columnbyindex.width = formatUnit(wContent);
        this.widthService.setColumnWidth(gObj.getColumns()[index]);
        if (!this.parent.allowResizing) {
            result = gObj.getColumns().some(function (x) { return x.width === null || x.width === undefined || x.width.length <= 0; });
            if (result === false) {
                gObj.getColumns().forEach(function (element) {
                    if (element.visible) {
                        tWidth = tWidth + parseInt(element.width, 10);
                    }
                });
            }
            var tableWidth_1 = tWidth + indentWidth;
            if (tWidth > 0) {
                headerTable.style.width = formatUnit(tableWidth_1);
                contentTable.style.width = formatUnit(tableWidth_1);
            }
        }
        var tableWidth = headerTable.offsetWidth;
        var contentwidth = (gObj.getContent().scrollWidth);
        if (contentwidth > tableWidth) {
            headerTable.classList.add('e-tableborder');
            contentTable.classList.add('e-tableborder');
        }
        else {
            headerTable.classList.remove('e-tableborder');
            contentTable.classList.remove('e-tableborder');
        }
    };
    Resize.prototype.destroy = function () {
        this.widthService = null;
        this.unwireEvents();
        this.removeEventListener();
    };
    Resize.prototype.getModuleName = function () {
        return 'resize';
    };
    Resize.prototype.findColumn = function (fName) {
        var _this = this;
        fName.forEach(function (element) {
            var fieldName = element;
            var columnIndex = _this.parent.getColumnIndexByField(fieldName);
            if (_this.parent.getColumns()[columnIndex].visible === true) {
                _this.resizeColumn(fieldName, columnIndex);
            }
        });
    };
    Resize.prototype.createTable = function (table, text, tag) {
        var myTableDiv = createElement('div');
        myTableDiv.className = this.parent.element.className;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        var mySubDiv = createElement('div');
        mySubDiv.className = tag;
        var myTable = createElement('table');
        myTable.className = table.className;
        myTable.style.cssText = 'table-layout: auto;width: auto';
        var myTr = createElement('tr');
        text.forEach(function (element) {
            var tr = myTr.cloneNode();
            tr.className = table.querySelector('tr').className;
            tr.appendChild(element);
            myTable.appendChild(tr);
        });
        mySubDiv.appendChild(myTable);
        myTableDiv.appendChild(mySubDiv);
        document.body.appendChild(myTableDiv);
        var offsetWidthValue = myTable.getBoundingClientRect().width;
        document.body.removeChild(myTableDiv);
        return Math.ceil(offsetWidthValue);
    };
    Resize.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.headerRefreshed, this.render, this);
    };
    Resize.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.headerRefreshed, this.render);
    };
    Resize.prototype.render = function () {
        this.wireEvents();
        if (!(this.parent.gridLines === 'vertical' || this.parent.gridLines === 'both')) {
            this.parent.element.classList.add(resizeClassList.lines);
        }
        this.setHandlerHeight();
    };
    Resize.prototype.wireEvents = function () {
        var _this = this;
        this.getResizeHandlers().forEach(function (ele) {
            ele.style.height = ele.parentElement.offsetHeight + 'px';
            EventHandler.add(ele, Browser.touchStartEvent, _this.resizeStart, _this);
            EventHandler.add(ele, events.dblclick, _this.callAutoFit, _this);
        });
    };
    Resize.prototype.unwireEvents = function () {
        var _this = this;
        this.getResizeHandlers().forEach(function (ele) {
            EventHandler.remove(ele, Browser.touchStartEvent, _this.resizeStart);
            EventHandler.remove(ele, events.dblclick, _this.callAutoFit);
        });
    };
    Resize.prototype.getResizeHandlers = function () {
        return [].slice.call(this.parent.getHeaderTable().querySelectorAll('.' + resizeClassList.root));
    };
    Resize.prototype.setHandlerHeight = function () {
        [].slice.call(this.parent.getHeaderTable().querySelectorAll('.' + resizeClassList.suppress)).forEach(function (ele) {
            ele.style.height = ele.parentElement.offsetHeight + 'px';
        });
    };
    Resize.prototype.callAutoFit = function (e) {
        var col = this.getTargetColumn(e);
        this.resizeColumn(col.field, this.parent.getNormalizedColumnIndex(col.uid), col.uid);
    };
    Resize.prototype.resizeStart = function (e) {
        if (!this.helper) {
            if (this.getScrollBarWidth() === 0) {
                for (var _i = 0, _a = this.refreshColumnWidth(); _i < _a.length; _i++) {
                    var col = _a[_i];
                    this.widthService.setColumnWidth(col);
                }
                this.widthService.setWidthToTable();
            }
            this.element = e.target;
            this.appendHelper();
            this.column = this.getTargetColumn(e);
            this.pageX = this.getPointX(e);
            if (this.parent.enableRtl) {
                this.minMove = parseInt(this.column.width.toString(), 10)
                    - (this.column.minWidth ? parseInt(this.column.minWidth.toString(), 10) : 0);
            }
            else {
                this.minMove = (this.column.minWidth ? parseInt(this.column.minWidth.toString(), 10) : 0)
                    - parseInt(this.column.width.toString(), 10);
            }
            this.minMove += this.pageX;
        }
        if (Browser.isDevice && !this.helper.classList.contains(resizeClassList.icon)) {
            this.helper.classList.add(resizeClassList.icon);
            EventHandler.add(document, Browser.touchStartEvent, this.removeHelper, this);
            EventHandler.add(this.helper, Browser.touchStartEvent, this.resizeStart, this);
        }
        else {
            var args = {
                e: e,
                column: this.column
            };
            this.parent.trigger(events.resizeStart, args);
            if (args.cancel) {
                this.cancelResizeAction();
                return;
            }
            EventHandler.add(document, Browser.touchEndEvent, this.resizeEnd, this);
            EventHandler.add(this.parent.element, Browser.touchMoveEvent, this.resizing, this);
            this.updateCursor('add');
        }
    };
    Resize.prototype.cancelResizeAction = function (removeEvents) {
        if (removeEvents) {
            EventHandler.remove(this.parent.element, Browser.touchMoveEvent, this.resizing);
            EventHandler.remove(document, Browser.touchEndEvent, this.resizeEnd);
            this.updateCursor('remove');
        }
        if (Browser.isDevice) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
        }
        detach(this.helper);
        this.refresh();
    };
    Resize.prototype.getWidth = function (width, minWidth, maxWidth) {
        if (minWidth && width < minWidth) {
            return minWidth;
        }
        else if ((maxWidth && width > maxWidth)) {
            return maxWidth;
        }
        else {
            return width;
        }
    };
    Resize.prototype.resizing = function (e) {
        var pageX = this.getPointX(e);
        var mousemove = this.parent.enableRtl ? -(pageX - this.pageX) : (pageX - this.pageX);
        var colData = {
            width: parseInt(this.widthService.getWidth(this.column).toString(), 10) + mousemove,
            minWidth: this.column.minWidth ? parseInt(this.column.minWidth.toString(), 10) : null,
            maxWidth: this.column.maxWidth ? parseInt(this.column.maxWidth.toString(), 10) : null
        };
        var width = this.getWidth(colData.width, colData.minWidth, colData.maxWidth);
        if ((!this.parent.enableRtl && this.minMove >= pageX) || (this.parent.enableRtl && this.minMove <= pageX)) {
            width = this.column.minWidth ? parseInt(this.column.minWidth.toString(), 10) : 0;
            this.pageX = pageX = this.minMove;
        }
        if (width !== parseInt(this.column.width.toString(), 10)) {
            this.pageX = pageX;
            this.column.width = formatUnit(width);
            var args = {
                e: e,
                column: this.column
            };
            this.parent.trigger(events.onResize, args);
            if (args.cancel) {
                this.cancelResizeAction(true);
                return;
            }
            this.widthService.setColumnWidth(this.column, null, 'resize');
            this.updateHelper();
        }
        this.isDblClk = false;
    };
    Resize.prototype.resizeEnd = function (e) {
        if (!this.helper) {
            return;
        }
        EventHandler.remove(this.parent.element, Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(document, Browser.touchEndEvent, this.resizeEnd);
        this.updateCursor('remove');
        detach(this.helper);
        var args = {
            e: e,
            column: this.column
        };
        this.parent.trigger(events.resizeStop, args);
        this.refresh();
        this.doubleTapEvent(e);
        this.isDblClk = true;
    };
    Resize.prototype.getPointX = function (e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageX;
        }
        else {
            return e.pageX;
        }
    };
    Resize.prototype.refreshColumnWidth = function () {
        var columns = this.parent.getColumns();
        for (var _i = 0, _a = [].slice.apply(this.parent.getHeaderTable().querySelectorAll('th.e-headercell')); _i < _a.length; _i++) {
            var ele = _a[_i];
            for (var _b = 0, columns_1 = columns; _b < columns_1.length; _b++) {
                var column = columns_1[_b];
                if (ele.querySelector('[e-mappinguid]') &&
                    ele.querySelector('[e-mappinguid]').getAttribute('e-mappinguid') === column.uid && column.visible) {
                    column.width = ele.getBoundingClientRect().width;
                    break;
                }
            }
        }
        return columns;
    };
    Resize.prototype.getTargetColumn = function (e) {
        var cell = closest(e.target, resizeClassList.header);
        var uid = cell.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
        return this.parent.getColumnByUid(uid);
    };
    Resize.prototype.updateCursor = function (action) {
        var headerRows = [].slice.call(this.parent.getHeaderContent().querySelectorAll('th'));
        headerRows.push(this.parent.element);
        for (var _i = 0, headerRows_1 = headerRows; _i < headerRows_1.length; _i++) {
            var row = headerRows_1[_i];
            row.classList[action](resizeClassList.cursor);
        }
    };
    Resize.prototype.refresh = function () {
        this.column = null;
        this.pageX = null;
        this.element = null;
        this.helper = null;
    };
    Resize.prototype.appendHelper = function () {
        this.helper = createElement('div', {
            className: resizeClassList.helper
        });
        this.parent.element.appendChild(this.helper);
        var height = this.parent.getContent().offsetHeight - this.getScrollBarWidth();
        var rect = closest(this.element, resizeClassList.header);
        var tr = [].slice.call(this.parent.getHeaderTable().querySelectorAll('tr'));
        for (var i = tr.indexOf(rect.parentElement); i < tr.length; i++) {
            height += tr[i].offsetHeight;
        }
        var pos = this.calcPos(rect);
        pos.left += (this.parent.enableRtl ? 0 - 1 : rect.offsetWidth - 2);
        this.helper.style.cssText = 'height: ' + height + 'px; top: ' + pos.top + 'px; left:' + Math.floor(pos.left) + 'px;';
    };
    Resize.prototype.getScrollBarWidth = function (height) {
        var ele = this.parent.getContent().firstChild;
        return (ele.scrollHeight > ele.clientHeight && height) ||
            ele.scrollWidth > ele.clientWidth ? getScrollBarWidth() : 0;
    };
    Resize.prototype.removeHelper = function (e) {
        var cls = e.target.classList;
        if (!(cls.contains(resizeClassList.root) || cls.contains(resizeClassList.icon)) && this.helper) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
            detach(this.helper);
            this.refresh();
        }
    };
    Resize.prototype.updateHelper = function () {
        var rect = closest(this.element, resizeClassList.header);
        this.helper.style.left = Math.floor(this.calcPos(rect).left + (this.parent.enableRtl ? 0 - 1 : rect.offsetWidth - 2)) + 'px';
    };
    Resize.prototype.calcPos = function (elem) {
        var parentOffset = {
            top: 0,
            left: 0
        };
        var offset = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var offsetParent = elem.offsetParent || doc.documentElement;
        while (offsetParent &&
            (offsetParent === doc.body || offsetParent === doc.documentElement) &&
            offsetParent.style.position === 'static') {
            offsetParent = offsetParent.parentNode;
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = offsetParent.getBoundingClientRect();
        }
        return {
            top: offset.top - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    };
    Resize.prototype.doubleTapEvent = function (e) {
        if (this.getUserAgent() && this.isDblClk) {
            if (!this.tapped) {
                this.tapped = setTimeout(this.timeoutHandler(), 300);
            }
            else {
                clearTimeout(this.tapped);
                this.callAutoFit(e);
                this.tapped = null;
            }
        }
    };
    Resize.prototype.getUserAgent = function () {
        var userAgent = Browser.userAgent.toLowerCase();
        return /iphone|ipod|ipad/.test(userAgent);
    };
    Resize.prototype.timeoutHandler = function () {
        this.tapped = null;
    };
    return Resize;
}());
export { Resize };
