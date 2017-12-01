import { Browser, EventHandler } from '@syncfusion/ej2-base';
import { isNullOrUndefined, isUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import { remove, createElement, closest } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { setCssInGridPopUp, getPosition, parentsUntil, addRemoveActiveClasses, removeAddCboxClasses } from '../base/util';
import * as events from '../base/constant';
import { RenderType } from '../base/enum';
/**
 * `Selection` module is used to handle cell and row selection.
 */
var Selection = /** @class */ (function () {
    /**
     * Constructor for the Grid selection module
     * @hidden
     */
    function Selection(parent, selectionSettings, locator) {
        //Internal variables       
        /**
         * @hidden
         */
        this.selectedRowIndexes = [];
        /**
         * @hidden
         */
        this.selectedRowCellIndexes = [];
        /**
         * @hidden
         */
        this.selectedRecords = [];
        this.preventFocus = false;
        this.isMultiShiftRequest = false;
        this.isMultiCtrlRequest = false;
        this.enableSelectMultiTouch = false;
        this.persistSelection = false;
        this.selectedRowState = {};
        this.isBatchEdit = false;
        this.prevKey = 0;
        this.totalRecordsCount = 0;
        this.isChkAll = false;
        this.isUnChkAll = false;
        this.chkAllCollec = [];
        this.isCheckedOnAdd = false;
        this.persistSelectedData = [];
        this.selectionRequest = false;
        this.parent = parent;
        this.selectionSettings = selectionSettings;
        this.factory = locator.getService('rendererFactory');
        this.focus = locator.getService('focus');
        this.addEventListener();
    }
    Selection.prototype.initializeSelection = function () {
        EventHandler.add(this.parent.getContent(), 'mousedown', this.mouseDownHandler, this);
    };
    /**
     * The function used to trigger onActionBegin
     * @return {void}
     * @hidden
     */
    Selection.prototype.onActionBegin = function (args, type) {
        this.parent.trigger(type, args);
    };
    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    Selection.prototype.onActionComplete = function (args, type) {
        this.parent.trigger(type, args);
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Selection.prototype.getModuleName = function () {
        return 'selection';
    };
    /**
     * To destroy the selection
     * @return {void}
     * @hidden
     */
    Selection.prototype.destroy = function () {
        this.hidePopUp();
        this.clearSelection();
        this.removeEventListener();
        EventHandler.remove(this.parent.getContent(), 'mousedown', this.mouseDownHandler);
    };
    Selection.prototype.isEditing = function () {
        return this.parent.editSettings.mode !== 'batch' && this.parent.isEdit && !this.persistSelection;
    };
    /**
     * Selects a row by given index.
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    Selection.prototype.selectRow = function (index, isToggle) {
        var gObj = this.parent;
        var selectedRow = gObj.getRowByIndex(index);
        var selectData = gObj.getCurrentViewRecords()[index];
        if (!this.isRowType() || !selectedRow || this.isEditing()) {
            // if (this.isEditing()) {
            //     gObj.selectedRowIndex = index;
            // }
            return;
        }
        var isRowSelected = selectedRow.hasAttribute('aria-selected');
        isToggle = !isToggle ? isToggle : index === this.prevRowIndex && isRowSelected;
        if (!isToggle) {
            this.onActionBegin({
                data: selectData, rowIndex: index, isCtrlPressed: this.isMultiCtrlRequest,
                isShiftPressed: this.isMultiShiftRequest, row: selectedRow, previousRow: gObj.getRows()[this.prevRowIndex],
                previousRowIndex: this.prevRowIndex, target: this.target
            }, events.rowSelecting);
        }
        this.clearRow();
        if (!isToggle) {
            this.updateRowSelection(selectedRow, index);
            this.parent.selectedRowIndex = index;
        }
        this.updateRowProps(index);
        if (!isToggle) {
            this.onActionComplete({
                data: selectData, rowIndex: index,
                row: selectedRow, previousRow: gObj.getRows()[this.prevRowIndex],
                previousRowIndex: this.prevRowIndex, target: this.target
            }, events.rowSelected);
        }
    };
    /**
     * Selects a range of rows from start and end row index.
     * @param  {number} startIndex - Specifies the start row index.
     * @param  {number} endIndex - Specifies the end row index.
     * @return {void}
     */
    Selection.prototype.selectRowsByRange = function (startIndex, endIndex) {
        this.selectRows(this.getCollectionFromIndexes(startIndex, endIndex));
        this.parent.selectedRowIndex = endIndex;
    };
    /**
     * Selects a collection of rows by indexes.
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     * @return {void}
     */
    Selection.prototype.selectRows = function (rowIndexes) {
        var gObj = this.parent;
        var selectedRow = gObj.getRowByIndex(rowIndexes[0]);
        var selectedData = gObj.getCurrentViewRecords()[rowIndexes[0]];
        if (this.isSingleSel() || !this.isRowType() || this.isEditing()) {
            return;
        }
        this.onActionBegin({
            rowIndexes: rowIndexes, row: selectedRow, rowIndex: rowIndexes[0], target: this.target,
            prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
            isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest,
            data: selectedData
        }, events.rowSelecting);
        this.clearRow();
        for (var _i = 0, rowIndexes_1 = rowIndexes; _i < rowIndexes_1.length; _i++) {
            var rowIndex = rowIndexes_1[_i];
            this.updateRowSelection(gObj.getRowByIndex(rowIndex), rowIndex);
        }
        this.updateRowProps(rowIndexes[0]);
        this.onActionComplete({
            rowIndexes: rowIndexes, row: selectedRow, rowIndex: rowIndexes[0], target: this.target,
            prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
            data: selectedData
        }, events.rowSelected);
    };
    /**
     * Select rows with existing row selection by passing row indexes.
     * @param  {number} startIndex - Specifies the row indexes.
     * @return {void}
     * @hidden
     */
    Selection.prototype.addRowsToSelection = function (rowIndexes) {
        var gObj = this.parent;
        var selectedRow = gObj.getRowByIndex(rowIndexes[0]);
        if (this.isSingleSel() || !this.isRowType() || this.isEditing()) {
            return;
        }
        for (var _i = 0, rowIndexes_2 = rowIndexes; _i < rowIndexes_2.length; _i++) {
            var rowIndex = rowIndexes_2[_i];
            var data = gObj.getCurrentViewRecords()[rowIndex];
            var isUnSelected = this.selectedRowIndexes.indexOf(rowIndex) > -1;
            gObj.selectedRowIndex = rowIndex;
            if (isUnSelected) {
                this.rowDeselect(events.rowDeselecting, [rowIndex], data, [selectedRow]);
                this.selectedRowIndexes.splice(this.selectedRowIndexes.indexOf(rowIndex), 1);
                this.selectedRecords.splice(this.selectedRecords.indexOf(selectedRow), 1);
                selectedRow.removeAttribute('aria-selected');
                this.addRemoveClassesForRow(selectedRow, false, null, 'e-selectionbackground', 'e-active');
                this.rowDeselect(events.rowDeselecting, [rowIndex], data, [selectedRow]);
            }
            else {
                this.onActionBegin({
                    data: data, rowIndex: rowIndex, row: selectedRow, target: this.target,
                    prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex,
                    isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest
                }, events.rowSelecting);
                this.updateRowSelection(selectedRow, rowIndex);
            }
            this.updateRowProps(rowIndex);
            if (!isUnSelected) {
                this.onActionComplete({
                    data: data, rowIndex: rowIndex, row: selectedRow, target: this.target,
                    prevRow: gObj.getRows()[this.prevRowIndex], previousRowIndex: this.prevRowIndex
                }, events.rowSelected);
            }
        }
    };
    Selection.prototype.getCollectionFromIndexes = function (startIndex, endIndex) {
        var indexes = [];
        var _a = (startIndex < endIndex) ?
            { i: startIndex, max: endIndex } : { i: endIndex, max: startIndex }, i = _a.i, max = _a.max;
        for (; i <= max; i++) {
            indexes.push(i);
        }
        if (startIndex > endIndex) {
            indexes.reverse();
        }
        return indexes;
    };
    Selection.prototype.clearRow = function () {
        this.clearRowSelection();
        this.selectedRowIndexes = [];
        this.selectedRecords = [];
        this.parent.selectedRowIndex = -1;
        if (this.selectionSettings.type === 'single' && this.persistSelection) {
            this.selectedRowState = {};
        }
    };
    Selection.prototype.updateRowProps = function (startIndex) {
        this.prevRowIndex = startIndex;
        this.isRowSelected = this.selectedRowIndexes.length && true;
    };
    Selection.prototype.updatePersistCollection = function (selectedRow, chkState) {
        if (this.persistSelection && !isNullOrUndefined(selectedRow)) {
            var rowObj = this.parent.getRowObjectFromUID(selectedRow.getAttribute('data-uid'));
            var pKey = rowObj ? rowObj.data[this.primaryKey] : null;
            if (pKey === null) {
                return;
            }
            rowObj.isSelected = chkState;
            if (chkState) {
                this.selectedRowState[pKey] = chkState;
                if (this.selectionRequest && this.persistSelectedData.indexOf(rowObj.data) < 0) {
                    this.persistSelectedData.push(rowObj.data);
                }
            }
            else {
                delete (this.selectedRowState[pKey]);
                if (this.selectionRequest && this.persistSelectedData.indexOf(rowObj.data) >= 0) {
                    this.persistSelectedData.splice(this.persistSelectedData.indexOf(rowObj.data), 1);
                }
            }
        }
    };
    Selection.prototype.updateCheckBoxes = function (row, chkState) {
        if (!isNullOrUndefined(row)) {
            var chkBox = row.querySelector('.e-checkselect');
            if (!isNullOrUndefined(chkBox)) {
                removeAddCboxClasses(chkBox.nextElementSibling, chkState);
                if (isNullOrUndefined(this.checkedTarget) || (!isNullOrUndefined(this.checkedTarget)
                    && !this.checkedTarget.classList.contains('e-checkselectall'))) {
                    this.setCheckAllState();
                }
            }
        }
    };
    Selection.prototype.updateRowSelection = function (selectedRow, startIndex) {
        if (!selectedRow) {
            return;
        }
        this.selectedRowIndexes.push(startIndex);
        this.selectedRecords.push(selectedRow);
        selectedRow.setAttribute('aria-selected', 'true');
        this.updatePersistCollection(selectedRow, true);
        this.updateCheckBoxes(selectedRow, true);
        this.addRemoveClassesForRow(selectedRow, true, null, 'e-selectionbackground', 'e-active');
        if (!this.preventFocus) {
            var target = this.focus.getPrevIndexes().cellIndex ?
                selectedRow.cells[this.focus.getPrevIndexes().cellIndex] :
                selectedRow.querySelector('.e-selectionbackground:not(.e-hide)');
            if (!target) {
                return;
            }
            this.focus.onClick({ target: target }, true);
        }
    };
    /**
     * Deselects the current selected rows and cells.
     * @return {void}
     */
    Selection.prototype.clearSelection = function () {
        if (!this.persistSelection || (this.persistSelection && !this.parent.isEdit) ||
            (!isNullOrUndefined(this.checkedTarget) && this.checkedTarget.classList.contains('e-checkselectall'))) {
            var span = this.parent.element.querySelector('.e-gridpopup').querySelector('span');
            if (span.classList.contains('e-rowselect')) {
                span.classList.remove('e-spanclicked');
            }
            this.clearRowSelection();
            this.clearCellSelection();
            this.enableSelectMultiTouch = false;
        }
    };
    /**
     * Deselects the current selected rows.
     * @return {void}
     */
    Selection.prototype.clearRowSelection = function () {
        if (this.isRowSelected) {
            var rows = this.parent.getDataRows();
            var data = [];
            var row = [];
            var rowIndex = [];
            var currentViewData = this.parent.getCurrentViewRecords();
            for (var i = 0, len = this.selectedRowIndexes.length; i < len; i++) {
                data.push(currentViewData[this.selectedRowIndexes[i]]);
                row.push(this.parent.getRows()[this.selectedRowIndexes[i]]);
                rowIndex.push(this.selectedRowIndexes[i]);
            }
            this.rowDeselect(events.rowDeselecting, rowIndex, data, row);
            for (var i = 0, len = this.selectedRowIndexes.length; i < len; i++) {
                var row_1 = this.parent.getRowByIndex(this.selectedRowIndexes[i]);
                if (row_1) {
                    row_1.removeAttribute('aria-selected');
                }
                this.addRemoveClassesForRow(row_1, false, true, 'e-selectionbackground', 'e-active');
                this.updatePersistCollection(row_1, false);
                this.updateCheckBoxes(row_1);
            }
            this.selectedRowIndexes = [];
            this.selectedRecords = [];
            this.isRowSelected = false;
            this.parent.selectedRowIndex = undefined;
            this.rowDeselect(events.rowDeselected, rowIndex, data, row);
        }
    };
    Selection.prototype.rowDeselect = function (type, rowIndex, data, row) {
        this.updatePersistCollection(row[0], false);
        this.parent.trigger(type, {
            rowIndex: rowIndex, data: data, row: row
        });
        this.updateCheckBoxes(row[0]);
    };
    /**
     * Selects a cell by given index.
     * @param  {IIndex} cellIndex - Defines the row and column index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     * @return {void}
     */
    Selection.prototype.selectCell = function (cellIndex, isToggle) {
        if (!this.isCellType()) {
            return;
        }
        var gObj = this.parent;
        var selectedCell = gObj.getCellFromIndex(cellIndex.rowIndex, this.getColIndex(cellIndex.rowIndex, cellIndex.cellIndex));
        this.currentIndex = cellIndex.rowIndex;
        var selectedData = gObj.getCurrentViewRecords()[this.currentIndex];
        if (!this.isCellType() || !selectedCell || this.isEditing()) {
            return;
        }
        var isCellSelected = selectedCell.classList.contains('e-cellselectionbackground');
        isToggle = !isToggle ? isToggle : !(!isUndefined(this.prevCIdxs) &&
            cellIndex.rowIndex === this.prevCIdxs.rowIndex && cellIndex.cellIndex === this.prevCIdxs.cellIndex &&
            isCellSelected);
        if (isToggle) {
            this.onActionBegin({
                data: selectedData, cellIndex: cellIndex, currentCell: selectedCell,
                isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                previousRowCell: this.prevECIdxs ?
                    gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelecting);
        }
        this.clearCell();
        if (isToggle) {
            this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
        }
        this.updateCellProps(cellIndex, cellIndex);
        if (isToggle) {
            this.onActionComplete({
                data: selectedData, cellIndex: cellIndex, currentCell: selectedCell,
                previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
                previousRowCell: this.prevECIdxs ?
                    gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            }, events.cellSelected);
        }
    };
    /**
     * Selects a range of cells from start and end index.
     * @param  {IIndex} startIndex - Specifies the row and column index of start index.
     * @param  {IIndex} endIndex - Specifies the row and column index of end index.
     * @return {void}
     */
    Selection.prototype.selectCellsByRange = function (startIndex, endIndex) {
        if (!this.isCellType()) {
            return;
        }
        var gObj = this.parent;
        var selectedCell = gObj.getCellFromIndex(startIndex.rowIndex, startIndex.cellIndex);
        var min;
        var max;
        var stIndex = startIndex;
        var edIndex = endIndex = endIndex ? endIndex : startIndex;
        var cellIndexes;
        this.currentIndex = startIndex.rowIndex;
        var selectedData = gObj.getCurrentViewRecords()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        this.onActionBegin({
            data: selectedData, cellIndex: startIndex, currentCell: selectedCell,
            isCtrlPressed: this.isMultiCtrlRequest, isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
            previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
        }, events.cellSelecting);
        this.clearCell();
        if (startIndex.rowIndex > endIndex.rowIndex) {
            var temp = startIndex;
            startIndex = endIndex;
            endIndex = temp;
        }
        for (var i = startIndex.rowIndex; i <= endIndex.rowIndex; i++) {
            if (this.selectionSettings.cellSelectionMode !== 'box') {
                min = i === startIndex.rowIndex ? (startIndex.cellIndex) : 0;
                max = i === endIndex.rowIndex ? (endIndex.cellIndex) : this.getLastColIndex(i);
            }
            else {
                min = startIndex.cellIndex;
                max = endIndex.cellIndex;
            }
            cellIndexes = [];
            for (var j = min < max ? min : max, len = min > max ? min : max; j <= len; j++) {
                selectedCell = gObj.getCellFromIndex(i, j);
                if (!selectedCell) {
                    continue;
                }
                cellIndexes.push(j);
                this.updateCellSelection(selectedCell);
                this.addAttribute(selectedCell);
            }
            this.selectedRowCellIndexes.push({ rowIndex: i, cellIndexes: cellIndexes });
        }
        this.updateCellProps(stIndex, edIndex);
        this.onActionComplete({
            data: selectedData, cellIndex: startIndex, currentCell: selectedCell,
            previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
            previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
        }, events.cellSelected);
    };
    /**
     * Selects a collection of cells by row and column indexes.
     * @param  {{ rowIndex: number, cellIndexes: number[] }[]} rowCellIndexes - Specifies the row and column indexes.
     * @return {void}
     */
    Selection.prototype.selectCells = function (rowCellIndexes) {
        if (!this.isCellType()) {
            return;
        }
        var gObj = this.parent;
        var selectedCell = gObj.getCellFromIndex(rowCellIndexes[0].rowIndex, rowCellIndexes[0].cellIndexes[0]);
        this.currentIndex = rowCellIndexes[0].rowIndex;
        var selectedData = gObj.getCurrentViewRecords()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        this.onActionBegin({
            data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
            currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
            isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
            previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
        }, events.cellSelecting);
        for (var i = 0, len = rowCellIndexes.length; i < len; i++) {
            for (var j = 0, cellLen = rowCellIndexes[i].cellIndexes.length; j < cellLen; j++) {
                selectedCell = gObj.getCellFromIndex(rowCellIndexes[i].rowIndex, rowCellIndexes[i].cellIndexes[j]);
                if (!selectedCell) {
                    continue;
                }
                this.updateCellSelection(selectedCell);
                this.addAttribute(selectedCell);
                this.addRowCellIndex({ rowIndex: rowCellIndexes[i].rowIndex, cellIndex: rowCellIndexes[i].cellIndexes[j] });
            }
        }
        this.updateCellProps({ rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] }, { rowIndex: rowCellIndexes[0].rowIndex, cellIndex: rowCellIndexes[0].cellIndexes[0] });
        this.onActionComplete({
            data: selectedData, cellIndex: rowCellIndexes[0].cellIndexes[0],
            currentCell: selectedCell,
            previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes,
            previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
        }, events.cellSelected);
    };
    /**
     * Select cells with existing cell selection by passing row and column index.
     * @param  {IIndex} startIndex - Defines the collection of row and column index.
     * @return {void}
     * @hidden
     */
    Selection.prototype.addCellsToSelection = function (cellIndexes) {
        if (!this.isCellType()) {
            return;
        }
        var gObj = this.parent;
        var selectedCell = gObj.getCellFromIndex(cellIndexes[0].rowIndex, this.getColIndex(cellIndexes[0].rowIndex, cellIndexes[0].cellIndex));
        var index;
        this.currentIndex = cellIndexes[0].rowIndex;
        var selectedData = gObj.getCurrentViewRecords()[this.currentIndex];
        if (this.isSingleSel() || !this.isCellType() || this.isEditing()) {
            return;
        }
        for (var _i = 0, cellIndexes_1 = cellIndexes; _i < cellIndexes_1.length; _i++) {
            var cellIndex = cellIndexes_1[_i];
            for (var i = 0, len = this.selectedRowCellIndexes.length; i < len; i++) {
                if (this.selectedRowCellIndexes[i].rowIndex === cellIndex.rowIndex) {
                    index = i;
                    break;
                }
            }
            var args = {
                data: selectedData, cellIndex: cellIndexes[0],
                isShiftPressed: this.isMultiShiftRequest, previousRowCellIndex: this.prevECIdxs,
                currentCell: selectedCell, isCtrlPressed: this.isMultiCtrlRequest,
                previousRowCell: this.prevECIdxs ?
                    gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) : undefined
            };
            var isUnSelected = index > -1;
            if (isUnSelected) {
                var selectedCellIdx = this.selectedRowCellIndexes[index].cellIndexes;
                if (selectedCellIdx.indexOf(cellIndex.cellIndex) > -1) {
                    this.cellDeselect(events.cellDeselecting, [{ rowIndex: cellIndex.rowIndex, cellIndexes: [cellIndex.cellIndex] }], selectedData, [selectedCell]);
                    selectedCellIdx.splice(selectedCellIdx.indexOf(cellIndex.cellIndex), 1);
                    selectedCell.classList.remove('e-cellselectionbackground');
                    selectedCell.removeAttribute('aria-selected');
                    this.cellDeselect(events.cellDeselected, [{ rowIndex: cellIndex.rowIndex, cellIndexes: [cellIndex.cellIndex] }], selectedData, [selectedCell]);
                }
                else {
                    isUnSelected = false;
                    this.onActionBegin(args, events.cellSelecting);
                    this.addRowCellIndex({ rowIndex: cellIndex.rowIndex, cellIndex: cellIndex.cellIndex });
                    this.updateCellSelection(selectedCell);
                    this.addAttribute(selectedCell);
                }
            }
            else {
                this.onActionBegin(args, events.cellSelecting);
                this.updateCellSelection(selectedCell, cellIndex.rowIndex, cellIndex.cellIndex);
            }
            this.updateCellProps(cellIndex, cellIndex);
            if (!isUnSelected) {
                this.onActionComplete({
                    data: selectedData, cellIndex: cellIndexes[0], currentCell: selectedCell,
                    previousRowCell: this.prevECIdxs ? gObj.getCellFromIndex(this.prevECIdxs.rowIndex, this.prevECIdxs.cellIndex) :
                        undefined, previousRowCellIndex: this.prevECIdxs, selectedRowCellIndex: this.selectedRowCellIndexes
                }, events.cellSelected);
            }
        }
    };
    Selection.prototype.getColIndex = function (rowIndex, index) {
        var cells = this.parent.getDataRows()[rowIndex].querySelectorAll('td.e-rowcell');
        for (var m = 0; m < cells.length; m++) {
            var colIndex = parseInt(cells[m].getAttribute('aria-colindex'), 10);
            if (colIndex === index) {
                return m;
            }
        }
        return -1;
    };
    Selection.prototype.getLastColIndex = function (rowIndex) {
        var cells = this.parent.getDataRows()[rowIndex].querySelectorAll('td.e-rowcell');
        return parseInt(cells[cells.length - 1].getAttribute('aria-colindex'), 10);
    };
    Selection.prototype.clearCell = function () {
        this.clearCellSelection();
    };
    Selection.prototype.cellDeselect = function (type, cellIndexes, data, cells) {
        if (cells[0] && cells[0].classList.contains('e-gridchkbox')) {
            this.updateCheckBoxes(closest(cells[0], 'tr'));
        }
        this.parent.trigger(type, {
            cells: cells, data: data, cellIndexes: cellIndexes
        });
    };
    Selection.prototype.updateCellSelection = function (selectedCell, rowIndex, cellIndex) {
        if (!isNullOrUndefined(rowIndex)) {
            this.addRowCellIndex({ rowIndex: rowIndex, cellIndex: cellIndex });
        }
        selectedCell.classList.add('e-cellselectionbackground');
        if (selectedCell.classList.contains('e-gridchkbox')) {
            this.updateCheckBoxes(closest(selectedCell, 'tr'), true);
        }
        this.addAttribute(selectedCell);
    };
    Selection.prototype.addAttribute = function (cell) {
        this.target = cell;
        cell.setAttribute('aria-selected', 'true');
        if (!this.preventFocus) {
            this.focus.onClick({ target: cell }, true);
        }
    };
    Selection.prototype.updateCellProps = function (startIndex, endIndex) {
        this.prevCIdxs = startIndex;
        this.prevECIdxs = endIndex;
        this.isCellSelected = this.selectedRowCellIndexes.length && true;
    };
    Selection.prototype.addRowCellIndex = function (rowCellIndex) {
        var isRowAvail;
        var index;
        for (var i = 0, len = this.selectedRowCellIndexes.length; i < len; i++) {
            if (this.selectedRowCellIndexes[i].rowIndex === rowCellIndex.rowIndex) {
                isRowAvail = true;
                index = i;
                break;
            }
        }
        if (isRowAvail) {
            if (this.selectedRowCellIndexes[index].cellIndexes.indexOf(rowCellIndex.cellIndex) < 0) {
                this.selectedRowCellIndexes[index].cellIndexes.push(rowCellIndex.cellIndex);
            }
        }
        else {
            this.selectedRowCellIndexes.push({ rowIndex: rowCellIndex.rowIndex, cellIndexes: [rowCellIndex.cellIndex] });
        }
    };
    /**
     * Deselects the current selected cells.
     * @return {void}
     */
    Selection.prototype.clearCellSelection = function () {
        if (this.isCellSelected) {
            var gObj = this.parent;
            var selectedCells = this.getSelectedCellsElement();
            var rowCell = this.selectedRowCellIndexes;
            var data = [];
            var cells = [];
            var currentViewData = gObj.getCurrentViewRecords();
            for (var i = 0, len = rowCell.length; i < len; i++) {
                data.push(currentViewData[rowCell[i].rowIndex]);
                for (var j = 0, cLen = rowCell.length; j < cLen; j++) {
                    cells.push(this.parent.getCellFromIndex(rowCell[i].rowIndex, rowCell[i].cellIndexes[j]));
                }
            }
            this.cellDeselect(events.cellDeselecting, rowCell, data, cells);
            for (var i = 0, len = selectedCells.length; i < len; i++) {
                selectedCells[i].classList.remove('e-cellselectionbackground');
                selectedCells[i].removeAttribute('aria-selected');
            }
            this.selectedRowCellIndexes = [];
            this.isCellSelected = false;
            this.cellDeselect(events.cellDeselected, rowCell, data, cells);
        }
    };
    Selection.prototype.getSelectedCellsElement = function () {
        var rows = this.parent.getDataRows();
        var cells = [];
        for (var i = 0, len = rows.length; i < len; i++) {
            cells = cells.concat([].slice.call(rows[i].querySelectorAll('.e-cellselectionbackground')));
        }
        return cells;
    };
    Selection.prototype.mouseMoveHandler = function (e) {
        e.preventDefault();
        var gBRect = this.parent.element.getBoundingClientRect();
        var x1 = this.x;
        var y1 = this.y;
        var position = getPosition(e);
        var x2 = position.x - gBRect.left;
        var y2 = position.y - gBRect.top;
        var tmp;
        var target = closest(e.target, 'tr');
        this.isDragged = true;
        if (!target) {
            target = closest(document.elementFromPoint(this.parent.element.offsetLeft + 2, e.clientY), 'tr');
        }
        if (x1 > x2) {
            tmp = x2;
            x2 = x1;
            x1 = tmp;
        }
        if (y1 > y2) {
            tmp = y2;
            y2 = y1;
            y1 = tmp;
        }
        this.element.style.left = x1 + 'px';
        this.element.style.top = y1 + 'px';
        this.element.style.width = x2 - x1 + 'px';
        this.element.style.height = y2 - y1 + 'px';
        if (target && !e.ctrlKey && !e.shiftKey) {
            var rowIndex = parseInt(target.getAttribute('aria-rowindex'), 10);
            this.selectRowsByRange(this.startIndex, rowIndex);
        }
    };
    Selection.prototype.mouseUpHandler = function (e) {
        document.body.classList.remove('e-disableuserselect');
        remove(this.element);
        EventHandler.remove(this.parent.getContent(), 'mousemove', this.mouseMoveHandler);
        EventHandler.remove(document.body, 'mouseup', this.mouseUpHandler);
        this.isDragged = false;
    };
    Selection.prototype.mouseDownHandler = function (e) {
        var target = e.target;
        var gridElement = parentsUntil(target, 'e-grid');
        if (gridElement && gridElement.id !== this.parent.element.id) {
            return;
        }
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
        }
        if (this.parent.allowRowDragAndDrop && target.classList.contains('e-rowcell') && !e.shiftKey && !e.ctrlKey) {
            if (!this.isRowType() || this.isSingleSel() || closest(target, 'td').classList.contains('e-selectionbackground')) {
                this.isDragged = false;
                return;
            }
            document.body.classList.add('e-disableuserselect');
            var tr = closest(e.target, 'tr');
            var gBRect = this.parent.element.getBoundingClientRect();
            var postion = getPosition(e);
            this.startIndex = parseInt(tr.getAttribute('aria-rowindex'), 10);
            this.x = postion.x - gBRect.left;
            this.y = postion.y - gBRect.top;
            this.element = createElement('div', { className: 'e-griddragarea' });
            this.parent.getContent().appendChild(this.element);
            EventHandler.add(this.parent.getContent(), 'mousemove', this.mouseMoveHandler, this);
            EventHandler.add(document.body, 'mouseup', this.mouseUpHandler, this);
        }
    };
    Selection.prototype.clearSelAfterRefresh = function (e) {
        if (e.requestType !== 'virtualscroll' && !this.persistSelection) {
            this.clearSelection();
        }
    };
    /**
     * @hidden
     */
    Selection.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.initialEnd, this.initializeSelection, this);
        this.parent.on(events.rowSelectionComplete, this.onActionComplete, this);
        this.parent.on(events.cellSelectionComplete, this.onActionComplete, this);
        this.parent.on(events.inBoundModelChanged, this.onPropertyChanged, this);
        this.parent.on(events.click, this.clickHandler, this);
        this.parent.on(events.cellFocused, this.onCellFocused, this);
        this.parent.on(events.dataReady, this.dataReady, this);
        this.parent.on(events.dataReady, this.clearSelAfterRefresh, this);
        this.parent.on(events.columnPositionChanged, this.clearSelection, this);
        this.parent.on(events.contentReady, this.initialEnd, this);
        this.parent.addEventListener(events.dataBound, this.onDataBound.bind(this));
        this.parent.addEventListener(events.actionBegin, this.actionBegin.bind(this));
        this.parent.addEventListener(events.actionComplete, this.actionComplete.bind(this));
        this.parent.on(events.rowsRemoved, this.rowsRemoved, this);
    };
    /**
     * @hidden
     */
    Selection.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.initialEnd, this.initializeSelection);
        this.parent.off(events.rowSelectionComplete, this.onActionComplete);
        this.parent.off(events.cellSelectionComplete, this.onActionComplete);
        this.parent.off(events.inBoundModelChanged, this.onPropertyChanged);
        this.parent.off(events.click, this.clickHandler);
        this.parent.off(events.cellFocused, this.onCellFocused);
        this.parent.off(events.dataReady, this.dataReady);
        this.parent.off(events.dataReady, this.clearSelAfterRefresh);
        this.parent.off(events.columnPositionChanged, this.clearSelection);
        this.parent.removeEventListener(events.dataBound, this.onDataBound);
        this.parent.removeEventListener(events.actionBegin, this.actionBegin);
        this.parent.removeEventListener(events.actionComplete, this.actionComplete);
        this.parent.off(events.rowsRemoved, this.rowsRemoved);
    };
    Selection.prototype.rowsRemoved = function (e) {
        for (var i = 0; i < e.records.length; i++) {
            delete (this.selectedRowState[e.records[i][this.primaryKey]]);
            --this.totalRecordsCount;
        }
        this.setCheckAllState();
    };
    ;
    Selection.prototype.dataReady = function (e) {
        if (e.requestType !== 'virtualscroll' && !this.persistSelection) {
            this.clearSelection();
        }
    };
    ;
    Selection.prototype.onPropertyChanged = function (e) {
        if (e.module !== this.getModuleName()) {
            return;
        }
        var gObj = this.parent;
        if (!isNullOrUndefined(e.properties.type) && this.selectionSettings.type === 'single') {
            if (this.selectedRowCellIndexes.length > 1) {
                this.clearCellSelection();
            }
            if (this.selectedRowIndexes.length > 1) {
                this.clearRowSelection();
            }
            this.enableSelectMultiTouch = false;
            this.hidePopUp();
        }
        if (!isNullOrUndefined(e.properties.mode) ||
            !isNullOrUndefined(e.properties.cellSelectionMode)) {
            this.clearSelection();
        }
        this.checkBoxSelectionChanged();
    };
    Selection.prototype.hidePopUp = function () {
        if (this.parent.element.querySelector('.e-gridpopup').querySelectorAll('.e-rowselect').length) {
            this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
        }
    };
    Selection.prototype.initialEnd = function () {
        this.parent.off(events.contentReady, this.initialEnd);
        this.selectRow(this.parent.selectedRowIndex);
        this.checkBoxSelectionChanged();
    };
    Selection.prototype.checkBoxSelectionChanged = function () {
        var isCheckColumn = false;
        for (var _i = 0, _a = this.parent.columns; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.type === 'checkbox') {
                this.isChkSelection = true;
                this.parent.selectionSettings.type = 'multiple';
                this.chkField = col.field;
                this.totalRecordsCount = this.parent.pageSettings.totalRecordsCount;
                if (isNullOrUndefined(this.totalRecordsCount)) {
                    this.totalRecordsCount = this.parent.getCurrentViewRecords().length;
                }
                this.chkAllBox = this.parent.element.querySelector('.e-checkselectall');
                this.chkAllObj = this.chkAllBox;
                isCheckColumn = true;
                this.parent.element.classList.add('e-checkboxselection');
                break;
            }
        }
        if (!isCheckColumn) {
            this.isChkSelection = false;
            this.chkField = '';
            this.chkAllBox = this.chkAllObj = null;
            this.parent.element.classList.remove('e-checkboxselection');
        }
        if (this.parent.selectionSettings.persistSelection && this.parent.getPrimaryKeyFieldNames().length > 0) {
            this.persistSelection = true;
            this.parent.element.classList.add('e-persistselection');
            this.primaryKey = this.parent.getPrimaryKeyFieldNames()[0];
            if (!this.parent.enableVirtualization && this.chkField && Object.keys(this.selectedRowState).length === 0) {
                var data = this.parent.getDataModule();
                var query = new Query().where(this.chkField, 'equal', true);
                var dataManager = data.getData({}, query);
                var proxy_1 = this;
                this.parent.showSpinner();
                dataManager.then(function (e) {
                    proxy_1.dataSuccess(e.result);
                    proxy_1.refreshPersistSelection();
                    proxy_1.parent.hideSpinner();
                });
            }
        }
        else {
            this.persistSelection = false;
            this.parent.element.classList.remove('e-persistselection');
            this.selectedRowState = {};
        }
    };
    Selection.prototype.dataSuccess = function (res) {
        for (var i = 0; i < res.length; i++) {
            if (isNullOrUndefined(this.selectedRowState[res[i][this.primaryKey]]) && res[i][this.chkField]) {
                this.selectedRowState[res[i][this.primaryKey]] = res[i][this.chkField];
            }
        }
        this.persistSelectedData = res;
    };
    Selection.prototype.refreshPersistSelection = function () {
        this.chkAllBox = this.parent.element.querySelector('.e-checkselectall');
        this.chkAllObj = this.chkAllBox;
        var rows = this.parent.getRows();
        if (rows.length > 0 && (this.persistSelection || this.chkField)) {
            var indexes = [];
            for (var j = 0; j < rows.length; j++) {
                var rowObj = this.parent.getRowObjectFromUID(rows[j].getAttribute('data-uid'));
                var pKey = rowObj ? rowObj.data[this.primaryKey] : null;
                if (pKey === null) {
                    return;
                }
                var checkState = void 0;
                var chkBox = rows[j].querySelector('.e-checkselect');
                if (this.selectedRowState[pKey] || (this.isChkAll && this.chkAllCollec.indexOf(pKey) < 0)
                    || (this.isUnChkAll && this.chkAllCollec.indexOf(pKey) > 0)
                    || (!this.isChkAll && !this.isUnChkAll && this.chkField && rowObj.data[this.chkField]
                        && chkBox.checked)) {
                    indexes.push(parseInt(rows[j].getAttribute('aria-rowindex'), 10));
                    checkState = true;
                }
                else {
                    checkState = false;
                    if (this.checkedTarget !== chkBox && this.isChkSelection) {
                        removeAddCboxClasses(chkBox.nextElementSibling, checkState);
                    }
                }
                this.updatePersistCollection(rows[j], checkState);
            }
            if (this.selectionSettings.type === 'multiple') {
                this.selectRows(indexes);
            }
            else {
                this.clearSelection();
                if (indexes.length > 0) {
                    this.selectRow(indexes[0], true);
                }
            }
        }
        if (this.isChkSelection) {
            this.setCheckAllState();
        }
    };
    Selection.prototype.actionBegin = function (e) {
        if (e.requestType === 'save' && this.persistSelection) {
            var editChkBox = this.parent.element.querySelector('.e-edit-checkselect');
            if (!isNullOrUndefined(editChkBox)) {
                var row = closest(editChkBox, '.e-editedrow');
                if (row) {
                    if (this.parent.editSettings.mode === 'dialog') {
                        row = this.parent.element.querySelector('.e-dlgeditrow');
                    }
                    var rowObj = this.parent.getRowObjectFromUID(row.getAttribute('data-uid'));
                    if (!rowObj) {
                        return;
                    }
                    this.selectedRowState[rowObj.data[this.primaryKey]] = rowObj.isSelected = editChkBox.checked;
                }
                else {
                    this.isCheckedOnAdd = editChkBox.checked;
                }
            }
        }
    };
    Selection.prototype.actionComplete = function (e) {
        if (e.requestType === 'save' && this.persistSelection) {
            if (e.action === 'add' && this.isCheckedOnAdd) {
                var rowObj = this.parent.getRowObjectFromUID(this.parent.getRows()[e.selectedRow].getAttribute('data-uid'));
                this.selectedRowState[rowObj.data[this.primaryKey]] = rowObj.isSelected = this.isCheckedOnAdd;
            }
            this.refreshPersistSelection();
        }
    };
    Selection.prototype.onDataBound = function () {
        if (this.persistSelection || this.chkField) {
            if (this.parent.enableVirtualization) {
                var records = this.parent.getCurrentViewRecords();
                this.dataSuccess(records);
            }
            this.refreshPersistSelection();
        }
    };
    Selection.prototype.checkSelectAllAction = function (checkState) {
        var editForm = this.parent.element.querySelector('.e-gridform');
        this.checkedTarget = this.chkAllBox;
        if (checkState) {
            this.selectRowsByRange(0, this.parent.getCurrentViewRecords().length);
            this.isChkAll = true;
            this.isUnChkAll = false;
        }
        else {
            this.clearSelection();
            this.isUnChkAll = true;
            this.isChkAll = false;
        }
        this.chkAllCollec = [];
        if (this.persistSelection) {
            var rows = this.parent.getRows();
            for (var i = 0; i < rows.length; i++) {
                this.updatePersistCollection(rows[i], checkState);
            }
            if (this.isUnChkAll) {
                this.selectedRowState = {};
                this.persistSelectedData = [];
            }
        }
        if (!isNullOrUndefined(editForm)) {
            var editChkBox = editForm.querySelector('.e-edit-checkselect');
            removeAddCboxClasses(editChkBox.nextElementSibling, checkState);
        }
    };
    Selection.prototype.checkSelectAll = function (checkBox) {
        var checkObj = checkBox;
        var state = checkBox.nextElementSibling.classList.contains('e-check');
        this.checkSelectAllAction(!state);
        this.target = null;
        this.setCheckAllState();
        this.triggerChkChangeEvent(checkBox, !state);
    };
    Selection.prototype.checkSelect = function (checkBox) {
        var target = closest(this.checkedTarget, '.e-rowcell');
        var checkObj = checkBox;
        this.isMultiCtrlRequest = true;
        var rIndex = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
        if (this.persistSelection && this.parent.element.querySelectorAll('.e-addedrow').length > 0) {
            ++rIndex;
        }
        this.rowCellSelectionHandler(rIndex, parseInt(target.getAttribute('aria-colindex'), 10));
        this.moveIntoUncheckCollection(closest(target, '.e-row'));
        this.setCheckAllState();
        this.isMultiCtrlRequest = false;
        this.triggerChkChangeEvent(checkBox, checkBox.nextElementSibling.classList.contains('e-check'));
    };
    Selection.prototype.moveIntoUncheckCollection = function (row) {
        if (this.isChkAll || this.isUnChkAll) {
            var rowObj = this.parent.getRowObjectFromUID(row.getAttribute('data-uid'));
            var pKey = rowObj ? rowObj.data[this.primaryKey] : null;
            if (!pKey) {
                return;
            }
            if (this.chkAllCollec.indexOf(pKey) < 0) {
                this.chkAllCollec.push(pKey);
            }
            else {
                this.chkAllCollec.splice(this.chkAllCollec.indexOf(pKey), 1);
            }
        }
    };
    Selection.prototype.triggerChkChangeEvent = function (checkBox, checkState) {
        this.parent.trigger(events.checkBoxChange, {
            checked: checkState, selectedRowIndexes: this.parent.getSelectedRowIndexes(),
            target: checkBox
        });
        if (!this.parent.isEdit) {
            this.checkedTarget = null;
        }
    };
    Selection.prototype.setCheckAllState = function () {
        if (this.isChkSelection) {
            var checkedLen = Object.keys(this.selectedRowState).length;
            if (!this.persistSelection) {
                checkedLen = this.selectedRecords.length;
                this.totalRecordsCount = this.parent.getCurrentViewRecords().length;
            }
            var spanEle = this.chkAllBox.nextElementSibling;
            removeClass([spanEle], ['e-check', 'e-stop', 'e-uncheck']);
            if (checkedLen === this.totalRecordsCount || (this.persistSelection && this.parent.allowPaging
                && this.isChkAll && this.chkAllCollec.length === 0)) {
                addClass([spanEle], ['e-check']);
            }
            else if (checkedLen === 0 || this.parent.getCurrentViewRecords().length === 0) {
                addClass([spanEle], ['e-uncheck']);
            }
            else {
                addClass([spanEle], ['e-stop']);
            }
        }
    };
    Selection.prototype.clickHandler = function (e) {
        var target = e.target;
        this.isMultiCtrlRequest = e.ctrlKey || this.enableSelectMultiTouch;
        this.isMultiShiftRequest = e.shiftKey;
        this.popUpClickHandler(e);
        var chkSelect = false;
        this.preventFocus = true;
        var checkBox;
        this.selectionRequest = true;
        var checkWrap = parentsUntil(target, 'e-checkbox-wrapper');
        if (checkWrap && checkWrap.querySelectorAll('.e-checkselect,.e-checkselectall').length > 0) {
            target = checkWrap.querySelector('input[type="checkbox"]');
            checkBox = target;
            chkSelect = true;
        }
        if (target && (target.classList.contains('e-rowcell') && !this.parent.selectionSettings.checkboxOnly) || chkSelect) {
            if (this.isChkSelection) {
                this.isMultiCtrlRequest = true;
            }
            this.target = target;
            if (!isNullOrUndefined(checkBox)) {
                this.checkedTarget = checkBox;
                if (checkBox.classList.contains('e-checkselectall')) {
                    this.checkSelectAll(checkBox);
                }
                else {
                    this.checkSelect(checkBox);
                    this.target = closest(target, '.e-rowcell');
                }
            }
            else {
                var rIndex = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
                if (this.persistSelection && this.parent.element.querySelectorAll('.e-addedrow').length > 0) {
                    ++rIndex;
                }
                this.rowCellSelectionHandler(rIndex, parseInt(target.getAttribute('aria-colindex'), 10));
                if (this.isChkSelection) {
                    this.moveIntoUncheckCollection(closest(target, '.e-row'));
                    this.setCheckAllState();
                }
            }
            if (!this.isChkSelection && Browser.isDevice && this.parent.selectionSettings.type === 'multiple') {
                this.showPopup(e);
            }
        }
        this.isMultiCtrlRequest = false;
        this.isMultiShiftRequest = false;
        this.selectionRequest = false;
        this.preventFocus = false;
    };
    Selection.prototype.popUpClickHandler = function (e) {
        var target = e.target;
        if (closest(target, '.e-headercell') || e.target.classList.contains('e-rowcell') ||
            closest(target, '.e-gridpopup')) {
            if (target.classList.contains('e-rowselect')) {
                if (!target.classList.contains('e-spanclicked')) {
                    target.classList.add('e-spanclicked');
                    this.enableSelectMultiTouch = true;
                }
                else {
                    target.classList.remove('e-spanclicked');
                    this.enableSelectMultiTouch = false;
                    this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
                }
            }
        }
        else {
            this.parent.element.querySelector('.e-gridpopup').style.display = 'none';
        }
    };
    Selection.prototype.showPopup = function (e) {
        setCssInGridPopUp(this.parent.element.querySelector('.e-gridpopup'), e, 'e-rowselect e-icons e-icon-rowselect' +
            (this.selectionSettings.type === 'multiple' &&
                (this.selectedRecords.length > 1 || this.selectedRowCellIndexes.length > 1) ? ' e-spanclicked' : ''));
    };
    Selection.prototype.rowCellSelectionHandler = function (rowIndex, cellIndex) {
        if (!this.isMultiCtrlRequest && !this.isMultiShiftRequest) {
            if (!this.isDragged) {
                this.selectRow(rowIndex, true);
            }
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
        }
        else if (this.isMultiShiftRequest) {
            this.selectRowsByRange(isUndefined(this.prevRowIndex) ? rowIndex : this.prevRowIndex, rowIndex);
            this.selectCellsByRange(isUndefined(this.prevCIdxs) ? { rowIndex: rowIndex, cellIndex: cellIndex } : this.prevCIdxs, { rowIndex: rowIndex, cellIndex: cellIndex });
        }
        else {
            this.addRowsToSelection([rowIndex]);
            this.addCellsToSelection([{ rowIndex: rowIndex, cellIndex: cellIndex }]);
        }
        this.isDragged = false;
    };
    Selection.prototype.onCellFocused = function (e) {
        var clear = ((e.container.isHeader && e.isJump) || (e.container.isContent && !e.container.isSelectable)) &&
            !(e.byKey && e.keyArgs.action === 'space');
        var headerAction = e.container.isHeader && !(e.byKey && e.keyArgs.action === 'space');
        if (!e.byKey || clear) {
            if (clear) {
                this.clearSelection();
            }
            return;
        }
        var _a = e.container.isContent ? e.container.indexes : e.indexes, rowIndex = _a[0], cellIndex = _a[1];
        var prev = this.focus.getPrevIndexes();
        if (headerAction || (['ctrlPlusA', 'escape'].indexOf(e.keyArgs.action) === -1 && e.keyArgs.action !== 'space' &&
            rowIndex === prev.rowIndex && cellIndex === prev.cellIndex)) {
            return;
        }
        this.preventFocus = true;
        switch (e.keyArgs.action) {
            case 'downArrow':
            case 'upArrow':
            case 'enter':
            case 'shiftEnter':
                this.applyDownUpKey(rowIndex, cellIndex);
                break;
            case 'rightArrow':
            case 'leftArrow':
                this.applyRightLeftKey(rowIndex, cellIndex);
                break;
            case 'shiftDown':
            case 'shiftUp':
                this.shiftDownKey(rowIndex, cellIndex);
                break;
            case 'shiftLeft':
            case 'shiftRight':
                this.applyShiftLeftRightKey(rowIndex, cellIndex);
                break;
            case 'home':
            case 'end':
                this.applyHomeEndKey(rowIndex, cellIndex);
                break;
            case 'ctrlHome':
            case 'ctrlEnd':
                this.applyCtrlHomeEndKey(rowIndex, cellIndex);
                break;
            case 'escape':
                this.clearSelection();
                break;
            case 'ctrlPlusA':
                this.ctrlPlusA();
                break;
            case 'space':
                this.selectionRequest = true;
                var target = e.element;
                if (target.classList.contains('e-checkselectall')) {
                    this.checkedTarget = target;
                    this.checkSelectAll(this.checkedTarget);
                }
                else {
                    if (target.classList.contains('e-checkselect')) {
                        this.checkedTarget = target;
                        this.checkSelect(this.checkedTarget);
                    }
                }
                this.selectionRequest = false;
                break;
        }
        this.preventFocus = false;
    };
    /**
     * Apply ctrl + A key selection
     * @return {void}
     * @hidden
     */
    Selection.prototype.ctrlPlusA = function () {
        if (this.isRowType() && !this.isSingleSel()) {
            this.selectRowsByRange(0, this.parent.getRows().length - 1);
        }
        if (this.isCellType() && !this.isSingleSel()) {
            this.selectCellsByRange({ rowIndex: 0, cellIndex: 0 }, { rowIndex: this.parent.getRows().length - 1, cellIndex: this.parent.getColumns().length - 1 });
        }
    };
    Selection.prototype.applyDownUpKey = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        if (this.isChkSelection && this.isChkAll) {
            this.checkSelectAllAction(false);
            this.checkedTarget = null;
        }
        if (this.isRowType()) {
            this.selectRow(rowIndex, true);
            this.applyUpDown(gObj.selectedRowIndex);
        }
        if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
        }
    };
    Selection.prototype.applyUpDown = function (rowIndex) {
        if (rowIndex < 0) {
            return;
        }
        if (!this.target) {
            this.target = this.parent.getRows()[0].children[this.parent.groupSettings.columns.length || 0];
        }
        var cIndex = parseInt(this.target.getAttribute('aria-colindex'), 10);
        this.target = this.contentRenderer.getRowByIndex(rowIndex).querySelectorAll('.e-rowcell')[cIndex];
        this.addAttribute(this.target);
    };
    Selection.prototype.applyRightLeftKey = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
            this.addAttribute(this.target);
        }
    };
    Selection.prototype.applyHomeEndKey = function (rowIndex, cellIndex) {
        if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
        }
        else {
            this.addAttribute(this.parent.getCellFromIndex(rowIndex, cellIndex));
        }
    };
    /**
     * Apply shift+down key selection
     * @return {void}
     * @hidden
     */
    Selection.prototype.shiftDownKey = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        this.isMultiShiftRequest = true;
        if (this.isRowType() && !this.isSingleSel()) {
            if (!isUndefined(this.prevRowIndex)) {
                this.selectRowsByRange(this.prevRowIndex, rowIndex);
                this.applyUpDown(rowIndex);
            }
            else {
                this.selectRow(0, true);
            }
        }
        if (this.isCellType() && !this.isSingleSel()) {
            this.selectCellsByRange(this.prevCIdxs || { rowIndex: 0, cellIndex: 0 }, { rowIndex: rowIndex, cellIndex: cellIndex });
        }
        this.isMultiShiftRequest = false;
    };
    Selection.prototype.applyShiftLeftRightKey = function (rowIndex, cellIndex) {
        var gObj = this.parent;
        this.isMultiShiftRequest = true;
        this.selectCellsByRange(this.prevCIdxs, { rowIndex: rowIndex, cellIndex: cellIndex });
        this.isMultiShiftRequest = false;
    };
    Selection.prototype.applyCtrlHomeEndKey = function (rowIndex, cellIndex) {
        if (this.isRowType()) {
            this.selectRow(rowIndex, true);
            this.addAttribute(this.parent.getCellFromIndex(rowIndex, cellIndex));
        }
        if (this.isCellType()) {
            this.selectCell({ rowIndex: rowIndex, cellIndex: cellIndex }, true);
        }
    };
    Selection.prototype.addRemoveClassesForRow = function (row, isAdd, clearAll) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        if (row) {
            var cells = [].slice.call(row.querySelectorAll('.e-rowcell'));
            var cell = row.querySelector('.e-detailrowcollapse') || row.querySelector('.e-detailrowexpand');
            if (cell) {
                cells.push(cell);
            }
            addRemoveActiveClasses.apply(void 0, [cells, isAdd].concat(args));
        }
        this.getRenderer().setSelection(row ? row.getAttribute('data-uid') : null, isAdd, clearAll);
    };
    Selection.prototype.isRowType = function () {
        return this.selectionSettings.mode === 'row' || this.selectionSettings.mode === 'both';
    };
    Selection.prototype.isCellType = function () {
        return this.selectionSettings.mode === 'cell' || this.selectionSettings.mode === 'both';
    };
    Selection.prototype.isSingleSel = function () {
        return this.selectionSettings.type === 'single';
    };
    Selection.prototype.getRenderer = function () {
        if (isNullOrUndefined(this.contentRenderer)) {
            this.contentRenderer = this.factory.getRenderer(RenderType.Content);
        }
        return this.contentRenderer;
    };
    /**
     * Gets the collection of selected records.
     * @return {Object[]}
     */
    Selection.prototype.getSelectedRecords = function () {
        var selectedData = [];
        if (!this.selectionSettings.persistSelection) {
            selectedData = this.parent.getRowsObject().filter(function (row) { return row.isSelected; })
                .map(function (m) { return m.data; });
        }
        else {
            selectedData = this.persistSelectedData;
        }
        return selectedData;
    };
    return Selection;
}());
export { Selection };
