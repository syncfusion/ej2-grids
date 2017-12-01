import { Draggable } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { remove, createElement, closest as closestElement, classList } from '@syncfusion/ej2-base';
import { parentsUntil, removeElement, getPosition } from '../base/util';
import * as events from '../base/constant';
/**
 *
 * Reorder module is used to handle row reordering.
 * @hidden
 */
var RowDD = /** @class */ (function () {
    /**
     * Constructor for the Grid print module
     * @hidden
     */
    function RowDD(parent) {
        var _this = this;
        //Internal variables    
        this.selectedRows = [];
        this.helper = function (e) {
            var gObj = _this.parent;
            if (document.getElementsByClassName('e-griddragarea').length ||
                (!e.sender.target.classList.contains('e-selectionbackground') && gObj.selectionSettings.type !== 'single')) {
                return false;
            }
            var visualElement = createElement('div', {
                className: 'e-cloneproperties e-draganddrop e-grid e-dragclone',
                styles: 'height:"auto", z-index:2, width:' + gObj.element.offsetWidth
            });
            var table = createElement('table', { styles: 'width:' + gObj.element.offsetWidth });
            var tbody = createElement('tbody');
            if (gObj.selectionSettings.mode === 'row' && gObj.selectionSettings.type === 'single') {
                var index = parseInt(e.sender.target.parentElement.getAttribute('aria-rowindex'), 10);
                gObj.selectRow(index);
            }
            var selectedRows = gObj.getSelectedRows();
            for (var i = 0, len = selectedRows.length; i < len; i++) {
                var selectedRow = selectedRows[i].cloneNode(true);
                removeElement(selectedRow, '.e-indentcell');
                removeElement(selectedRow, '.e-detailrowcollapse');
                removeElement(selectedRow, '.e-detailrowexpand');
                tbody.appendChild(selectedRow);
            }
            table.appendChild(tbody);
            visualElement.appendChild(table);
            gObj.element.appendChild(visualElement);
            return visualElement;
        };
        this.dragStart = function (e) {
            var gObj = _this.parent;
            if (document.getElementsByClassName('e-griddragarea').length) {
                return;
            }
            gObj.trigger(events.rowDragStart, {
                rows: gObj.getSelectedRows(),
                target: e.target, draggableType: 'rows', data: gObj.getSelectedRecords()
            });
            var dropElem = document.getElementById(gObj.rowDropSettings.targetID);
            if (gObj.rowDropSettings.targetID && dropElem && dropElem.ej2_instances) {
                dropElem.ej2_instances[0].getContent().classList.add('e-allowRowDrop');
            }
            _this.isDragStop = false;
        };
        this.drag = function (e) {
            var gObj = _this.parent;
            var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
            var target = _this.getElementFromPosition(cloneElement, e.event);
            classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
            gObj.trigger(events.rowDrag, {
                rows: gObj.getSelectedRows(),
                target: target, draggableType: 'rows', data: gObj.getSelectedRecords()
            });
            gObj.element.classList.add('e-rowdrag');
            if (!parentsUntil(target, 'e-gridcontent') ||
                parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(target, 'e-grid').id) {
                classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            }
        };
        this.dragStop = function (e) {
            var gObj = _this.parent;
            if (_this.parent.isDestroyed) {
                return;
            }
            var target = _this.getElementFromPosition(e.helper, e.event);
            gObj.element.classList.remove('e-rowdrag');
            var dropElem = document.getElementById(gObj.rowDropSettings.targetID);
            if (gObj.rowDropSettings.targetID && dropElem && dropElem.ej2_instances) {
                dropElem.ej2_instances[0].getContent().classList.remove('e-allowRowDrop');
            }
            gObj.trigger(events.rowDrop, {
                target: target, draggableType: 'rows',
                rows: gObj.getSelectedRows(), data: gObj.getSelectedRecords()
            });
            if (!parentsUntil(target, 'e-gridcontent')) {
                remove(e.helper);
                return;
            }
        };
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
        var gObj = this.parent;
        var column;
        var drag;
        drag = new Draggable(gObj.getContent(), {
            dragTarget: '.e-rowcell',
            distance: 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop
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
    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    RowDD.prototype.onActionComplete = function (e) {
        this.parent.trigger(events.actionComplete, extend(e, { type: events.actionComplete }));
    };
    RowDD.prototype.getTargetIdx = function (targetRow) {
        return targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
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
            var targetIndex = currentIndex = this.getTargetIdx(targetRow);
            var count = 0;
            if (isNaN(targetIndex)) {
                targetIndex = currentIndex = 0;
            }
            if (gObj.allowPaging) {
                targetIndex = targetIndex + (gObj.pageSettings.currentPage * gObj.pageSettings.pageSize) - gObj.pageSettings.pageSize;
            }
            //Todo: drag and drop mapper & BatchChanges                   
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
            srcControl.notify(events.rowsRemoved, { indexes: this.selectedRows, records: records });
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
    /**
     * To destroy the print
     * @return {void}
     * @hidden
     */
    RowDD.prototype.destroy = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialEnd, this.initializeDrag);
        this.parent.off(events.columnDrop, this.columnDrop);
        this.parent.off(events.rowDragAndDropComplete, this.onActionComplete);
        this.parent.off(events.uiUpdate, this.enableAfterRender);
        //destory ejdrag and drop
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    RowDD.prototype.getModuleName = function () {
        return 'rowDragAndDrop';
    };
    return RowDD;
}());
export { RowDD };
