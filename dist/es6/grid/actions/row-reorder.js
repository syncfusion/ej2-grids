import { Draggable } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base/util';
import { remove, createElement, closest as closestElement, classList } from '@syncfusion/ej2-base/dom';
import { parentsUntil, removeElement, getPosition } from '../base/util';
import * as events from '../base/constant';
var RowDD = (function () {
    function RowDD(parent) {
        this.selectedRows = [];
        this.parent = parent;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialEnd, this.initializeDrag, this);
        this.parent.on(events.columnDrop, this.columnDrop, this);
        this.parent.on(events.rowDragAndDropComplete, this.onActionComplete, this);
        this.parent.on(events.uiUpdate, this.enableAfterRender, this);
    }
    RowDD.prototype.initializeDrag = function () {
        var _this = this;
        var gObj = this.parent;
        var column;
        var drag;
        drag = new Draggable(gObj.getContent(), {
            dragTarget: '.e-rowcell',
            distance: 5,
            helper: function (e) {
                if (document.getElementsByClassName('e-griddragarea').length ||
                    !e.sender.target.classList.contains('e-selectionbackground')) {
                    return false;
                }
                var visualElement = createElement('div', {
                    className: 'e-cloneproperties e-draganddrop e-grid e-dragclone',
                    styles: 'height:"auto", z-index:2, width:' + gObj.element.offsetWidth
                });
                var table = createElement('table', { styles: 'width:' + gObj.element.offsetWidth });
                var tbody = createElement('tbody');
                var selectedRows = gObj.getSelectedRows();
                for (var i = 0, len = selectedRows.length; i < len; i++) {
                    var selectedRow = selectedRows[i].cloneNode(true);
                    removeElement(selectedRow, '.e-indentcell');
                    tbody.appendChild(selectedRow);
                }
                table.appendChild(tbody);
                visualElement.appendChild(table);
                gObj.element.appendChild(visualElement);
                return visualElement;
            },
            dragStart: function (e) {
                if (document.getElementsByClassName('e-griddragarea').length) {
                    return;
                }
                gObj.trigger(events.rowDragStart, {
                    rows: gObj.getSelectedRecords(),
                    target: e.target, draggableType: 'rows', data: gObj.getSelectedRecords()
                });
                var dropElem = document.getElementById(gObj.rowDropSettings.targetID);
                if (gObj.rowDropSettings.targetID && dropElem && dropElem.ej2_instances) {
                    dropElem.ej2_instances[0].getContent().classList.add('e-allowRowDrop');
                }
                _this.dragStop = false;
            },
            drag: function (e) {
                var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
                var target = _this.getElementFromPosition(cloneElement, e.event);
                classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
                gObj.trigger(events.rowDrag, {
                    rows: gObj.getSelectedRecords(),
                    target: target, draggableType: 'rows', data: gObj.getSelectedRecords()
                });
                gObj.element.classList.add('e-rowdrag');
                if (!parentsUntil(target, 'e-gridcontent') ||
                    parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(target, 'e-grid').id) {
                    classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                }
            },
            dragStop: function (e) {
                var target = _this.getElementFromPosition(e.helper, e.event);
                gObj.element.classList.remove('e-rowdrag');
                if (!parentsUntil(target, 'e-gridcontent')) {
                    remove(e.helper);
                    return;
                }
                var dropElem = document.getElementById(gObj.rowDropSettings.targetID);
                if (gObj.rowDropSettings.targetID && dropElem && dropElem.ej2_instances) {
                    dropElem.ej2_instances[0].getContent().classList.remove('e-allowRowDrop');
                }
                gObj.trigger(events.rowDrop, {
                    target: target, draggableType: 'rows',
                    rows: gObj.getSelectedRows(), data: gObj.getSelectedRecords()
                });
            }
        });
    };
    RowDD.prototype.getElementFromPosition = function (element, event) {
        var target;
        var position = getPosition(event);
        element.style.display = 'none';
        target = document.elementFromPoint(position.x, position.y);
        element.style.display = '';
        return target;
    };
    RowDD.prototype.onActionComplete = function (e) {
        this.parent.trigger(events.actionComplete, extend(e, { type: events.actionComplete }));
    };
    RowDD.prototype.columnDrop = function (e) {
        var gObj = this.parent;
        if (e.droppedElement.getAttribute('action') !== 'grouping') {
            var targetRow = closestElement(e.target, 'tr');
            var srcControl = void 0;
            var currentIndex = void 0;
            if (e.droppedElement.parentElement.id !== gObj.element.id) {
                srcControl = e.droppedElement.parentElement.ej2_instances[0];
            }
            else {
                return;
            }
            if (srcControl.element.id !== gObj.element.id && srcControl.rowDropSettings.targetID !== gObj.element.id) {
                return;
            }
            var records = srcControl.getSelectedRecords();
            var targetIndex = currentIndex = targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
            var count = 0;
            if (isNaN(targetIndex)) {
                targetIndex = currentIndex = 0;
            }
            if (gObj.allowPaging) {
                targetIndex = targetIndex + (gObj.pageSettings.currentPage * gObj.pageSettings.pageSize) - gObj.pageSettings.pageSize;
            }
            gObj.notify(events.rowsAdded, { toIndex: targetIndex, records: records });
            gObj.notify(events.modelChanged, {
                type: events.actionBegin, requestType: 'rowdraganddrop'
            });
            var selectedRows = srcControl.getSelectedRowIndexes();
            var skip = srcControl.allowPaging ?
                (srcControl.pageSettings.currentPage * srcControl.pageSettings.pageSize) - srcControl.pageSettings.pageSize : 0;
            this.selectedRows = [];
            for (var i = 0, len = records.length; i < len; i++) {
                this.selectedRows.push(skip + selectedRows[i]);
            }
            srcControl.notify(events.rowsRemoved, { indexes: this.selectedRows });
            srcControl.notify(events.modelChanged, {
                type: events.actionBegin, requestType: 'rowdraganddrop'
            });
        }
    };
    RowDD.prototype.enableAfterRender = function (e) {
        if (e.module === this.getModuleName() && e.enable) {
            this.initializeDrag();
        }
    };
    RowDD.prototype.destroy = function () {
        this.parent.off(events.initialEnd, this.initializeDrag);
        this.parent.off(events.columnDrop, this.columnDrop);
        this.parent.off(events.rowDragAndDropComplete, this.onActionComplete);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
    };
    RowDD.prototype.getModuleName = function () {
        return 'rowDragAndDrop';
    };
    return RowDD;
}());
export { RowDD };
