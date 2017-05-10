import { extend } from '@syncfusion/ej2-base/util';
import { closest as closestElement, removeClass, classList, createElement, remove } from '@syncfusion/ej2-base/dom';
import { getElementIndex, inArray, iterateArrayOrObject, parentsUntil, getPosition } from '../base/util';
import * as events from '../base/constant';
var Reorder = (function () {
    function Reorder(parent) {
        this.parent = parent;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.headerDrop, this.headerDrop, this);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
        this.parent.on(events.reorderComplete, this.onActionComplete, this);
        this.parent.on(events.columnDrag, this.drag, this);
        this.parent.on(events.columnDragStart, this.dragStart, this);
        this.parent.on(events.columnDragStop, this.dragStop, this);
        this.parent.on(events.headerDrop, this.headerDrop, this);
        this.parent.on(events.headerRefreshed, this.createReorderElement, this);
    }
    Reorder.prototype.chkDropPosition = function (srcElem, destElem) {
        return srcElem.parentElement.isEqualNode(destElem.parentElement) && this.targetParentContainerIndex(srcElem, destElem) > -1;
    };
    Reorder.prototype.chkDropAllCols = function (srcElem, destElem) {
        var isFound;
        var headers = [].slice.call(this.parent.element.getElementsByClassName('e-headercell'));
        var header;
        while (!isFound && headers.length > 0) {
            header = headers.pop();
            isFound = srcElem !== header && this.targetParentContainerIndex(srcElem, destElem) > -1;
        }
        return isFound;
    };
    Reorder.prototype.findColParent = function (col, cols, parent) {
        parent = parent;
        for (var i = 0, len = cols.length; i < len; i++) {
            if (col === cols[i]) {
                return true;
            }
            else if (cols[i].columns) {
                var cnt = parent.length;
                parent.push(cols[i]);
                if (!this.findColParent(col, cols[i].columns, parent)) {
                    parent.splice(cnt, parent.length - cnt);
                }
                else {
                    return true;
                }
            }
        }
        return false;
    };
    Reorder.prototype.getColumnsModel = function (cols) {
        var columnModel = [];
        var subCols = [];
        for (var i = 0, len = cols.length; i < len; i++) {
            columnModel.push(cols[i]);
            if (cols[i].columns) {
                subCols = subCols.concat(cols[i].columns);
            }
        }
        if (subCols.length) {
            columnModel = columnModel.concat(this.getColumnsModel(subCols));
        }
        return columnModel;
    };
    Reorder.prototype.headerDrop = function (e) {
        var gObj = this.parent;
        if (!closestElement(e.target, 'th')) {
            return;
        }
        var destElem = closestElement(e.target, '.e-headercell');
        if (destElem && !(!this.chkDropPosition(this.element, destElem) || !this.chkDropAllCols(this.element, destElem))) {
            var headers = [].slice.call(this.parent.element.getElementsByClassName('e-headercell'));
            var oldIdx = getElementIndex(this.element, headers);
            var columns = this.getColumnsModel(this.parent.columns);
            var column = columns[oldIdx];
            var newIndex = this.targetParentContainerIndex(this.element, destElem);
            this.moveColumns(newIndex, column);
        }
    };
    Reorder.prototype.moveColumns = function (destIndex, column) {
        var gObj = this.parent;
        var parent = this.getColParent(column, this.parent.columns);
        var cols = parent ? parent.columns : this.parent.columns;
        var srcIdx = inArray(column, cols);
        if (!gObj.allowReordering || srcIdx === destIndex || srcIdx === -1 || destIndex === -1) {
            return;
        }
        cols.splice(destIndex, 0, cols.splice(srcIdx, 1)[0]);
        gObj.getColumns(true);
        gObj.notify(events.columnPositionChanged, { fromIndex: destIndex, toIndex: srcIdx });
        gObj.notify(events.modelChanged, {
            type: events.actionBegin, requestType: 'reorder'
        });
    };
    Reorder.prototype.targetParentContainerIndex = function (srcElem, destElem) {
        var headers = [].slice.call(this.parent.element.getElementsByClassName('e-headercell'));
        var cols = this.parent.columns;
        var flatColumns = this.getColumnsModel(cols);
        var parent = this.getColParent(flatColumns[getElementIndex(srcElem, headers)], cols);
        cols = parent ? parent.columns : cols;
        return inArray(flatColumns[getElementIndex(destElem, headers)], cols);
    };
    Reorder.prototype.getColParent = function (column, columns) {
        var parents = [];
        this.findColParent(column, columns, parents);
        return parents[parents.length - 1];
    };
    Reorder.prototype.reorderColumns = function (fromFName, toFName) {
        var column = this.getColumnByField(toFName);
        var parent = this.getColParent(column, this.parent.columns);
        var columns = parent ? parent.columns : this.parent.columns;
        var destIndex = inArray(column, columns);
        if (destIndex > -1) {
            this.moveColumns(destIndex, this.getColumnByField(fromFName));
        }
    };
    Reorder.prototype.enableAfterRender = function (e) {
        if (e.module === this.getModuleName() && e.enable) {
            this.createReorderElement();
        }
    };
    Reorder.prototype.createReorderElement = function () {
        var header = this.parent.element.querySelector('.e-headercontent');
        this.upArrow = header.appendChild(createElement('div', { className: 'e-icons e-icon-reorderuparrow e-reorderuparrow', attrs: { style: 'display:none' } }));
        this.downArrow = header.appendChild(createElement('div', { className: 'e-icons e-icon-reorderdownarrow e-reorderdownarrow', attrs: { style: 'display:none' } }));
    };
    Reorder.prototype.onActionComplete = function (e) {
        this.parent.trigger(events.actionComplete, extend(e, { type: events.actionComplete }));
    };
    Reorder.prototype.destroy = function () {
        remove(this.upArrow);
        remove(this.downArrow);
        this.parent.off(events.headerDrop, this.headerDrop);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        this.parent.off(events.reorderComplete, this.onActionComplete);
        this.parent.off(events.columnDrag, this.drag);
        this.parent.off(events.columnDragStart, this.dragStart);
        this.parent.off(events.columnDragStop, this.dragStop);
        this.parent.off(events.headerRefreshed, this.createReorderElement);
    };
    Reorder.prototype.drag = function (e) {
        var gObj = this.parent;
        var target = e.target;
        var closest = closestElement(target, '.e-headercell:not(.e-stackedHeaderCell)');
        var cloneElement = gObj.element.querySelector('.e-cloneproperties');
        var isLeft = this.x > getPosition(e.event).x + gObj.getContent().firstElementChild.scrollLeft;
        removeClass(gObj.getHeaderTable().querySelectorAll('.e-reorderindicate'), ['e-reorderindicate']);
        this.upArrow.style.display = 'none';
        this.downArrow.style.display = 'none';
        this.stopTimer();
        classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
        this.updateScrollPostion(e.event);
        if (closest && !closest.isEqualNode(this.element)) {
            target = closest;
            if (!(!this.chkDropPosition(this.element, target) || !this.chkDropAllCols(this.element, target))) {
                this.updateArrowPosition(target, isLeft);
                classList(target, ['e-allowDrop', 'e-reorderindicate'], []);
            }
            else if (!(gObj.allowGrouping && parentsUntil(e.target, 'e-groupdroparea'))) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            }
        }
        gObj.trigger(events.columnDrag, { target: target, draggableType: 'headercell', column: e.column });
    };
    Reorder.prototype.updateScrollPostion = function (e) {
        var _this = this;
        var x = getPosition(e).x;
        var cliRectBase = this.parent.element.getBoundingClientRect();
        var scrollElem = this.parent.getContent().firstElementChild;
        if (x > cliRectBase.left && x < cliRectBase.left + 35) {
            this.timer = window.setInterval(function () { _this.setScrollLeft(scrollElem, true); }, 50);
        }
        else if (x < cliRectBase.right && x > cliRectBase.right - 35) {
            this.timer = window.setInterval(function () { _this.setScrollLeft(scrollElem, false); }, 50);
        }
    };
    Reorder.prototype.setScrollLeft = function (scrollElem, isLeft) {
        var scrollLeft = scrollElem.scrollLeft;
        scrollElem.scrollLeft = scrollElem.scrollLeft + (isLeft ? -5 : 5);
        if (scrollLeft !== scrollElem.scrollLeft) {
            this.upArrow.style.display = 'none';
            this.downArrow.style.display = 'none';
        }
    };
    Reorder.prototype.stopTimer = function () {
        window.clearInterval(this.timer);
    };
    Reorder.prototype.updateArrowPosition = function (target, isLeft) {
        var cliRect = target.getBoundingClientRect();
        var cliRectBase = this.parent.element.getBoundingClientRect();
        if ((isLeft && cliRect.left < cliRectBase.left) || (!isLeft && cliRect.right > cliRectBase.right)) {
            return;
        }
        this.upArrow.style.top = cliRect.top + cliRect.height - cliRectBase.top + 'px';
        this.downArrow.style.top = cliRect.top - cliRectBase.top - 4 + 'px';
        this.upArrow.style.left = this.downArrow.style.left = (isLeft ? cliRect.left : cliRect.right) - cliRectBase.left - 4 + 'px';
        this.upArrow.style.display = '';
        this.downArrow.style.display = '';
    };
    Reorder.prototype.dragStart = function (e) {
        var gObj = this.parent;
        var target = e.target;
        this.element = target.classList.contains('e-headercell') ? target :
            parentsUntil(target, 'e-headercell');
        this.x = getPosition(e.event).x + gObj.getContent().firstElementChild.scrollLeft;
        gObj.trigger(events.columnDragStart, {
            target: target, draggableType: 'headercell', column: e.column
        });
    };
    Reorder.prototype.dragStop = function (e) {
        var gObj = this.parent;
        this.upArrow.style.display = 'none';
        this.downArrow.style.display = 'none';
        this.stopTimer();
        if (!e.cancel) {
            gObj.trigger(events.columnDrop, { target: e.target, draggableType: 'headercell', column: e.column });
        }
        removeClass(gObj.getHeaderTable().querySelectorAll('.e-reorderindicate'), ['e-reorderindicate']);
    };
    Reorder.prototype.getModuleName = function () {
        return 'reorder';
    };
    Reorder.prototype.getColumnByField = function (field) {
        return iterateArrayOrObject(this.getColumnsModel(this.parent.columns), function (item, index) {
            if (item.field === field) {
                return item;
            }
            return undefined;
        })[0];
    };
    return Reorder;
}());
export { Reorder };
